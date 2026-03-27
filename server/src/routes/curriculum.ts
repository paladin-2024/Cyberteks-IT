import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth, requireRole('TEACHER'));

// GET /api/curriculum?courseId=xxx
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query as { courseId?: string };
    const teacherId = req.user!.id;

    const where: Record<string, unknown> = { teacherId };
    if (courseId) where.courseId = courseId;

    const weeks = await prisma.curriculumWeek.findMany({
      where,
      include: { topics: { orderBy: { order: 'asc' } } },
      orderBy: { weekNumber: 'asc' },
    });

    res.json({ weeks });
  } catch (err) {
    console.error('[curriculum GET]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/curriculum/weeks
router.post('/weeks', async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, weekNumber, title } = req.body as { courseId: string; weekNumber: number; title: string };
    const teacherId = req.user!.id;

    if (!courseId || !title?.trim()) {
      res.status(400).json({ error: 'courseId and title are required' });
      return;
    }

    const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
    if (!course) { res.status(403).json({ error: 'Course not found' }); return; }

    const week = await prisma.curriculumWeek.create({
      data: { courseId, teacherId, weekNumber: weekNumber || 1, title: title.trim() },
      include: { topics: true },
    });

    res.json({ week });
  } catch (err) {
    console.error('[curriculum POST /weeks]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/curriculum/weeks/:id
router.patch('/weeks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, weekNumber } = req.body as { title?: string; weekNumber?: number };
    const teacherId = req.user!.id;

    const week = await prisma.curriculumWeek.findFirst({ where: { id, teacherId } });
    if (!week) { res.status(404).json({ error: 'Week not found' }); return; }

    const updated = await prisma.curriculumWeek.update({
      where: { id },
      data: {
        ...(title?.trim() ? { title: title.trim() } : {}),
        ...(weekNumber !== undefined ? { weekNumber } : {}),
      },
      include: { topics: { orderBy: { order: 'asc' } } },
    });

    res.json({ week: updated });
  } catch (err) {
    console.error('[curriculum PATCH /weeks/:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/curriculum/weeks/:id
router.delete('/weeks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const teacherId = req.user!.id;

    const week = await prisma.curriculumWeek.findFirst({ where: { id, teacherId } });
    if (!week) { res.status(404).json({ error: 'Week not found' }); return; }

    await prisma.curriculumWeek.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[curriculum DELETE /weeks/:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/curriculum/topics
router.post('/topics', async (req: AuthRequest, res: Response) => {
  try {
    const {
      weekId, title, description, duration, type,
      attachmentUrl, attachmentName, dueDate, maxScore,
    } = req.body as {
      weekId: string; title: string; description?: string; duration?: string; type?: string;
      attachmentUrl?: string; attachmentName?: string; dueDate?: string; maxScore?: number;
    };
    const teacherId = req.user!.id;

    if (!weekId || !title?.trim()) {
      res.status(400).json({ error: 'weekId and title are required' });
      return;
    }

    const week = await prisma.curriculumWeek.findFirst({ where: { id: weekId, teacherId } });
    if (!week) { res.status(403).json({ error: 'Week not found' }); return; }

    const lastTopic = await prisma.curriculumTopic.findFirst({
      where: { weekId }, orderBy: { order: 'desc' },
    });

    const topicType = type || 'lecture';

    // If assignment type + dueDate, create an Assignment record first
    let assignmentId: string | null = null;
    if (topicType === 'assignment' && dueDate) {
      const assignment = await prisma.assignment.create({
        data: {
          title: title.trim(),
          courseId: week.courseId,
          teacherId,
          dueDate: new Date(dueDate),
          maxScore: maxScore ?? 100,
          status: 'DRAFT',
        },
      });
      assignmentId = assignment.id;
    }

    const topic = await prisma.curriculumTopic.create({
      data: {
        weekId,
        title: title.trim(),
        description: description?.trim() || null,
        duration: duration?.trim() || null,
        type: topicType,
        order: (lastTopic?.order ?? -1) + 1,
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxScore: maxScore ?? null,
        assignmentId,
      },
    });

    res.json({ topic });
  } catch (err) {
    console.error('[curriculum POST /topics]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/curriculum/topics/:id
router.patch('/topics/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      title, description, duration, type, order,
      meetLink, meetScheduledAt,
      attachmentUrl, attachmentName, dueDate, maxScore,
    } = req.body as {
      title?: string; description?: string; duration?: string; type?: string; order?: number;
      meetLink?: string; meetScheduledAt?: string;
      attachmentUrl?: string; attachmentName?: string; dueDate?: string; maxScore?: number;
    };
    const teacherId = req.user!.id;

    const topic = await prisma.curriculumTopic.findFirst({
      where: { id, week: { teacherId } },
    });
    if (!topic) { res.status(404).json({ error: 'Topic not found' }); return; }

    // If it has a linked assignment, sync the changes
    if (topic.assignmentId) {
      await prisma.assignment.updateMany({
        where: { id: topic.assignmentId, teacherId },
        data: {
          ...(title?.trim() ? { title: title.trim() } : {}),
          ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : undefined } : {}),
          ...(maxScore !== undefined ? { maxScore } : {}),
        },
      });
    }

    const updated = await prisma.curriculumTopic.update({
      where: { id },
      data: {
        ...(title?.trim() ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() || null } : {}),
        ...(duration !== undefined ? { duration: duration.trim() || null } : {}),
        ...(type ? { type } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(meetLink !== undefined ? { meetLink: meetLink.trim() || null } : {}),
        ...(meetScheduledAt !== undefined ? { meetScheduledAt: meetScheduledAt ? new Date(meetScheduledAt) : null } : {}),
        ...(attachmentUrl !== undefined ? { attachmentUrl: attachmentUrl || null } : {}),
        ...(attachmentName !== undefined ? { attachmentName: attachmentName || null } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(maxScore !== undefined ? { maxScore } : {}),
      },
    });

    res.json({ topic: updated });
  } catch (err) {
    console.error('[curriculum PATCH /topics/:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/curriculum/topics/:id
router.delete('/topics/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const teacherId = req.user!.id;

    const topic = await prisma.curriculumTopic.findFirst({
      where: { id, week: { teacherId } },
    });
    if (!topic) { res.status(404).json({ error: 'Topic not found' }); return; }

    // Delete linked assignment if exists
    if (topic.assignmentId) {
      await prisma.assignment.deleteMany({ where: { id: topic.assignmentId, teacherId } });
    }

    await prisma.curriculumTopic.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[curriculum DELETE /topics/:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
