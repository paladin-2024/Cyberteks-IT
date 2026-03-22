import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Sections ──────────────────────────────────────────────────────────────────

// POST /api/sections — teacher creates a section for a course
router.post('/', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, order } = req.body;
    if (!courseId || !title?.trim()) {
      res.status(400).json({ error: 'courseId and title are required' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const section = await prisma.section.create({
      data: {
        title: title.trim(),
        order: order ?? 0,
        courseId,
      },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });

    res.status(201).json({ section });
  } catch (err) {
    console.error('[sections POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/sections/:id — teacher updates a section title/order
router.patch('/:id', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title, order } = req.body;

    const section = await prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!section || section.course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(order !== undefined && { order }),
      },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });

    res.json({ section: updated });
  } catch (err) {
    console.error('[sections PATCH /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sections/:id — teacher deletes a section (cascades to lessons)
router.delete('/:id', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const section = await prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!section || section.course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.section.delete({ where: { id } });
    res.json({ message: 'Section deleted' });
  } catch (err) {
    console.error('[sections DELETE /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Lessons ───────────────────────────────────────────────────────────────────

// POST /api/sections/:id/lessons — teacher adds a lesson to a section
router.post('/:id/lessons', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { id: sectionId } = req.params as { id: string };
    const { title, description, type, content, duration, order, isFree } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: 'title is required' });
      return;
    }

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });
    if (!section || section.course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description?.trim() ?? null,
        type: type ?? 'VIDEO',
        content: content?.trim() ?? null,
        duration: duration ?? null,
        order: order ?? 0,
        isFree: isFree ?? false,
        sectionId,
      },
    });

    res.status(201).json({ lesson });
  } catch (err) {
    console.error('[sections/:id/lessons POST]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/sections/lessons/:lessonId — teacher updates a lesson
router.patch('/lessons/:lessonId', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params as { lessonId: string };
    const { title, description, type, content, duration, order, isFree } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson || lesson.section.course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title !== undefined      && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() ?? null }),
        ...(type !== undefined        && { type }),
        ...(content !== undefined     && { content: content?.trim() ?? null }),
        ...(duration !== undefined    && { duration }),
        ...(order !== undefined       && { order }),
        ...(isFree !== undefined      && { isFree }),
      },
    });

    res.json({ lesson: updated });
  } catch (err) {
    console.error('[sections/lessons PATCH /:lessonId]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sections/lessons/:lessonId — teacher deletes a lesson
router.delete('/lessons/:lessonId', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params as { lessonId: string };

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson || lesson.section.course.teacherId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    console.error('[sections/lessons DELETE /:lessonId]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Lesson Progress (student) ─────────────────────────────────────────────────

// POST /api/sections/lessons/:lessonId/progress — student marks lesson complete
router.post(
  '/lessons/:lessonId/progress',
  requireAuth,
  requireRole('STUDENT'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { lessonId } = req.params as { lessonId: string };
      const userId = req.user!.id;
      const { completed, watchedSecs } = req.body;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { section: true },
      });
      if (!lesson) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }

      // Verify student is enrolled
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
      });
      if (!enrollment) {
        res.status(403).json({ error: 'Not enrolled in this course' });
        return;
      }

      const progress = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: {
          userId,
          lessonId,
          completed: completed ?? false,
          completedAt: completed ? new Date() : null,
          watchedSecs: watchedSecs ?? 0,
        },
        update: {
          ...(completed !== undefined  && { completed, completedAt: completed ? new Date() : null }),
          ...(watchedSecs !== undefined && { watchedSecs }),
        },
      });

      // Recalculate overall enrollment progress
      const courseId = lesson.section.courseId;
      const allLessons = await prisma.lesson.findMany({
        where: { section: { courseId } },
        select: { id: true },
      });
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: { in: allLessons.map((l) => l.id) },
          completed: true,
        },
      });
      const progressPercent = allLessons.length > 0
        ? (completedCount / allLessons.length) * 100
        : 0;

      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: {
          progressPercent,
          ...(progressPercent >= 100 && { status: 'COMPLETED', completedAt: new Date() }),
        },
      });

      res.json({ progress, progressPercent });
    } catch (err) {
      console.error('[sections/lessons/:lessonId/progress POST]', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
