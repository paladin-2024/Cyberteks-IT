import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET /api/courses — list all courses with teacher info
router.get('/', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true, title: true, slug: true, description: true, coverImage: true,
        price: true, currency: true, status: true, duration: true, level: true,
        category: true, tags: true, teacherId: true, createdAt: true, updatedAt: true,
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch teachers separately to avoid crash on orphaned teacherId references
    const teacherIds = [...new Set(courses.map((c) => c.teacherId))];
    const teachers = await prisma.user.findMany({
      where: { id: { in: teacherIds } },
      select: { id: true, name: true, email: true, image: true },
    });
    const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t]));

    const result = courses.map((c) => ({
      ...c,
      teacher: teacherMap[c.teacherId] ?? { id: c.teacherId, name: 'Unknown', email: '', image: null },
    }));

    res.json({ courses: result });
  } catch (err) {
    console.error('[courses GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/courses — create a course
router.post('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      coverImage,
      price,
      currency,
      status,
      duration,
      level,
      category,
      tags,
      teacherId,
    } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: 'title is required' });
      return;
    }
    if (!description?.trim()) {
      res.status(400).json({ error: 'description is required' });
      return;
    }
    if (!teacherId) {
      res.status(400).json({ error: 'teacherId is required' });
      return;
    }

    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.role !== 'TEACHER') {
      res.status(400).json({ error: 'teacherId must reference an existing TEACHER user' });
      return;
    }

    // Ensure slug uniqueness
    let slug = toSlug(title);
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        coverImage: coverImage ?? null,
        price: price ?? 0,
        currency: currency ?? 'UGX',
        status: status ?? 'DRAFT',
        duration: duration ?? null,
        level: level ?? null,
        category: category ?? null,
        tags: tags ?? [],
        teacherId,
      },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    res.status(201).json({ course });
  } catch (err) {
    console.error('[courses POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/courses/:id — update a course
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const {
      title,
      description,
      coverImage,
      price,
      currency,
      status,
      duration,
      level,
      category,
      tags,
    } = req.body;

    // Re-generate slug only when title changes
    let slug: string | undefined;
    if (title && title.trim() !== existing.title) {
      slug = toSlug(title.trim());
      const conflict = await prisma.course.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined      && { title: title.trim() }),
        ...(slug !== undefined       && { slug }),
        ...(description !== undefined && { description: description.trim() }),
        ...(coverImage !== undefined  && { coverImage }),
        ...(price !== undefined       && { price }),
        ...(currency !== undefined    && { currency }),
        ...(status !== undefined      && { status }),
        ...(duration !== undefined    && { duration }),
        ...(level !== undefined       && { level }),
        ...(category !== undefined    && { category }),
        ...(tags !== undefined        && { tags }),
      },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    res.json({ course });
  } catch (err) {
    console.error('[courses PATCH /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/courses/:id — delete a course
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    await prisma.course.delete({ where: { id } });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('[courses DELETE /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/courses/:id/assign — assign a teacher to a course
router.patch(
  '/:id/assign',
  requireAuth,
  requireRole('ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const { teacherId } = req.body;

      if (!teacherId) {
        res.status(400).json({ error: 'teacherId is required' });
        return;
      }

      const course = await prisma.course.findUnique({ where: { id } });
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
      if (!teacher || teacher.role !== 'TEACHER') {
        res.status(400).json({ error: 'teacherId must reference an existing TEACHER user' });
        return;
      }

      const updated = await prisma.course.update({
        where: { id },
        data: { teacherId },
        include: {
          teacher: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
      });

      res.json({ course: updated });
    } catch (err) {
      console.error('[courses PATCH /:id/assign]', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ── Teacher routes ────────────────────────────────────────────────────────────

// GET /api/courses/my — teacher: list their assigned courses
// IMPORTANT: /my must come BEFORE /:id so Express doesn't treat "my" as an id
router.get('/my', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ courses });
  } catch (err) {
    console.error('[courses GET /my]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/courses/:id — full course detail with sections + lessons
// Teachers see their own courses, students see enrolled courses, admins see all
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Role-based access check
    if (user.role === 'TEACHER' && course.teacherId !== user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (user.role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: id } },
      });
      if (!enrollment) {
        res.status(403).json({ error: 'Not enrolled in this course' });
        return;
      }
      // Attach enrollment info for student
      const progressRecords = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
        select: { lessonId: true, completed: true, watchedSecs: true },
      });
      const progressMap = Object.fromEntries(progressRecords.map((p) => [p.lessonId, p]));

      // Also fetch curriculum weeks/topics so students see teacher-added content
      const curriculumWeeks = await prisma.curriculumWeek.findMany({
        where: { courseId: id },
        include: { topics: { orderBy: { order: 'asc' } } },
        orderBy: { weekNumber: 'asc' },
      });

      res.json({ course, enrollment, progressMap, curriculumWeeks });
      return;
    }

    res.json({ course });
  } catch (err) {
    console.error('[courses GET /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
