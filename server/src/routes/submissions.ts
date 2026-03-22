import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// ── STUDENT: submit assignment ───────────────────────────────────────────────
router.post('/', requireRole('STUDENT'), async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId, content, fileUrl, fileName, fileSize } = req.body as {
      assignmentId: string; content?: string;
      fileUrl?: string; fileName?: string; fileSize?: number;
    };
    const studentId = req.user!.id as string;

    if (!assignmentId) { res.status(400).json({ error: 'assignmentId is required' }); return; }

    // Verify assignment exists and is active
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, status: 'ACTIVE' },
      include: { course: { select: { id: true } } },
    });
    if (!assignment) { res.status(404).json({ error: 'Assignment not found or not active' }); return; }

    // Verify student is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: studentId, courseId: assignment.courseId, status: 'ACTIVE' },
    });
    if (!enrollment) { res.status(403).json({ error: 'Not enrolled in this course' }); return; }

    // Check if already submitted
    const existing = await prisma.submission.findFirst({
      where: { assignmentId, studentId },
    });
    if (existing) {
      // Update existing submission
      const updated = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          content: content?.trim() || null,
          fileUrl: fileUrl ?? null,
          fileName: fileName ?? null,
          fileSize: fileSize ?? null,
          status: new Date() > assignment.dueDate ? 'LATE' : 'SUBMITTED',
          submittedAt: new Date(),
          score: null,
          feedback: null,
          gradedAt: null,
        },
      });
      res.json({ submission: updated });
      return;
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        content: content?.trim() || null,
        fileUrl: fileUrl ?? null,
        fileName: fileName ?? null,
        fileSize: fileSize ?? null,
        status: new Date() > assignment.dueDate ? 'LATE' : 'SUBMITTED',
      },
    });

    res.json({ submission });
  } catch (err) {
    console.error('[submissions POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── STUDENT: get my submission for an assignment ─────────────────────────────
router.get('/mine', requireRole('STUDENT'), async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.query as { assignmentId?: string };
    const studentId = req.user!.id as string;

    if (!assignmentId) { res.status(400).json({ error: 'assignmentId is required' }); return; }

    const submission = await prisma.submission.findFirst({
      where: { assignmentId: assignmentId as string, studentId },
    });

    res.json({ submission: submission ?? null });
  } catch (err) {
    console.error('[submissions GET /mine]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER: list submissions for an assignment ──────────────────────────────
router.get('/', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.query as { assignmentId?: string };
    const teacherId = req.user!.id as string;

    if (!assignmentId) { res.status(400).json({ error: 'assignmentId is required' }); return; }

    // Verify teacher owns this assignment
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId as string, teacherId },
    });
    if (!assignment) { res.status(403).json({ error: 'Assignment not found' }); return; }

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: assignmentId as string },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const result = submissions.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      studentName: s.student.name,
      studentEmail: s.student.email,
      studentImage: s.student.image,
      content: s.content,
      fileUrl: s.fileUrl,
      fileName: s.fileName,
      fileSize: s.fileSize,
      score: s.score,
      feedback: s.feedback,
      status: s.status,
      submittedAt: s.submittedAt.toISOString(),
      gradedAt: s.gradedAt?.toISOString() ?? null,
      maxScore: assignment.maxScore,
    }));

    res.json({ submissions: result, maxScore: assignment.maxScore, assignmentTitle: assignment.title });
  } catch (err) {
    console.error('[submissions GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER: grade a submission ──────────────────────────────────────────────
router.patch('/:id/grade', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const teacherId = req.user!.id as string;
    const { score, feedback } = req.body as { score?: number; feedback?: string };

    // Verify teacher owns the assignment for this submission
    const submission = await prisma.submission.findFirst({
      where: { id },
      include: { assignment: { select: { teacherId: true, maxScore: true } } },
    });
    if (!submission) { res.status(404).json({ error: 'Submission not found' }); return; }
    if (submission.assignment.teacherId !== teacherId) {
      res.status(403).json({ error: 'Not authorized' }); return;
    }
    if (score !== undefined && (score < 0 || score > submission.assignment.maxScore)) {
      res.status(400).json({ error: `Score must be between 0 and ${submission.assignment.maxScore}` }); return;
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        score: score ?? null,
        feedback: feedback?.trim() || null,
        status: 'GRADED',
        gradedAt: new Date(),
      },
    });

    res.json({ submission: updated });
  } catch (err) {
    console.error('[submissions PATCH /:id/grade]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
