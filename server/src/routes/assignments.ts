import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// ── TEACHER: list my assignments ─────────────────────────────────────────────
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.role === 'TEACHER') {
      const assignments = await prisma.assignment.findMany({
        where: { teacherId: user.id },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const result = await Promise.all(assignments.map(async (a) => {
        const totalStudents = await prisma.enrollment.count({
          where: { courseId: a.courseId, status: 'ACTIVE' },
        });
        const now = new Date();
        const status = a.dueDate < now && a.status === 'ACTIVE' ? 'PAST_DUE' : a.status;
        return {
          id: a.id,
          title: a.title,
          description: a.description ?? '',
          instructions: a.instructions ?? '',
          course: a.course.title,
          courseId: a.courseId,
          dueDate: a.dueDate.toISOString(),
          maxScore: a.maxScore,
          status,
          submissions: 0,
          totalStudents,
          attachmentUrl: a.attachmentUrl ?? null,
          attachmentName: a.attachmentName ?? null,
        };
      }));

      res.json({ assignments: result });
      return;
    }

    // STUDENT: list assignments for enrolled courses
    if (user.role === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
        select: { courseId: true, course: { select: { title: true } } },
      });
      const courseIds = enrollments.map((e) => e.courseId);

      const assignments = await prisma.assignment.findMany({
        where: { courseId: { in: courseIds }, status: 'ACTIVE' },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { dueDate: 'asc' },
      });

      const now = new Date();
      const result = assignments.map((a) => {
        const overdue = a.dueDate < now;
        return {
          id: a.id,
          title: a.title,
          description: a.description ?? '',
          instructions: a.instructions ?? '',
          course: a.course.title,
          courseId: a.courseId,
          dueDate: a.dueDate.toISOString(),
          maxScore: a.maxScore,
          status: overdue ? 'PAST_DUE' : 'ACTIVE',
          attachmentUrl: a.attachmentUrl ?? null,
          attachmentName: a.attachmentName ?? null,
        };
      });

      res.json({ assignments: result });
      return;
    }

    res.json({ assignments: [] });
  } catch (err) {
    console.error('[assignments GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER: create assignment ───────────────────────────────────────────────
router.post('/', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, instructions, courseId, dueDate, maxScore, status, attachmentUrl, attachmentName } = req.body as {
      title: string; description?: string; instructions?: string; courseId: string;
      dueDate: string; maxScore?: number; status?: string;
      attachmentUrl?: string; attachmentName?: string;
    };
    const teacherId = req.user!.id;

    if (!title?.trim()) { res.status(400).json({ error: 'title is required' }); return; }
    if (!courseId)       { res.status(400).json({ error: 'courseId is required' }); return; }
    if (!dueDate)        { res.status(400).json({ error: 'dueDate is required' }); return; }

    const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
    if (!course) { res.status(403).json({ error: 'Course not found' }); return; }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        instructions: instructions?.trim() || null,
        courseId,
        teacherId,
        dueDate: new Date(dueDate),
        maxScore: maxScore ?? 100,
        status: status ?? 'DRAFT',
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
      },
      include: { course: { select: { id: true, title: true } } },
    });

    res.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description ?? '',
        instructions: assignment.instructions ?? '',
        course: assignment.course.title,
        courseId: assignment.courseId,
        dueDate: assignment.dueDate.toISOString(),
        maxScore: assignment.maxScore,
        status: assignment.status,
        submissions: 0,
        totalStudents: 0,
        attachmentUrl: assignment.attachmentUrl ?? null,
        attachmentName: assignment.attachmentName ?? null,
      },
    });
  } catch (err) {
    console.error('[assignments POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER: update assignment ───────────────────────────────────────────────
router.patch('/:id', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const teacherId = req.user!.id as string;
    const { title, description, instructions, dueDate, maxScore, status, attachmentUrl, attachmentName } = req.body;

    const existing = await prisma.assignment.findFirst({ where: { id, teacherId } });
    if (!existing) { res.status(404).json({ error: 'Assignment not found' }); return; }

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title?.trim() && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(instructions !== undefined && { instructions: instructions?.trim() || null }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(maxScore !== undefined && { maxScore }),
        ...(status && { status }),
        ...(attachmentUrl !== undefined && { attachmentUrl: attachmentUrl || null }),
        ...(attachmentName !== undefined && { attachmentName: attachmentName || null }),
      },
    });

    res.json({ assignment: updated });
  } catch (err) {
    console.error('[assignments PATCH /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER: delete assignment ───────────────────────────────────────────────
router.delete('/:id', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const teacherId = req.user!.id as string;

    const existing = await prisma.assignment.findFirst({ where: { id, teacherId } });
    if (!existing) { res.status(404).json({ error: 'Assignment not found' }); return; }

    await prisma.assignment.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[assignments DELETE /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
