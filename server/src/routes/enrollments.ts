import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// GET /api/enrollments — student: their enrolled courses with progress
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: { select: { id: true, name: true } },
            _count: { select: { sections: true } },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    res.json({ enrollments });
  } catch (err) {
    console.error('[enrollments GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/enrollments/certificates — student: their earned certificates + in-progress enrollments
router.get('/certificates', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          include: { teacher: { select: { name: true } } },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const inProgress = await prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { course: { select: { id: true, title: true, duration: true } } },
    });

    res.json({ certificates, inProgress });
  } catch (err) {
    console.error('[enrollments GET /certificates]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/enrollments/progress — student: full progress stats
router.get('/progress', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: { select: { name: true } },
            _count: { select: { sections: true } },
          },
        },
      },
      orderBy: { startedAt: 'asc' },
    });

    const certCount = await prisma.certificate.count({ where: { userId } });

    const totalEnrollments = enrollments.length;
    const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
    const avgProgress = totalEnrollments > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrollments)
      : 0;

    res.json({ enrollments, certCount, totalEnrollments, completed, avgProgress });
  } catch (err) {
    console.error('[enrollments GET /progress]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/enrollments/free-courses — student: published free courses not yet enrolled
router.get('/free-courses', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const enrolled = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true },
    });
    const enrolledIds = enrolled.map((e: { courseId: string }) => e.courseId);

    const freeCourses = await prisma.course.findMany({
      where: {
        status:  'PUBLISHED',
        price:   0,
        id:      { notIn: enrolledIds.length ? enrolledIds : ['__none__'] },
      },
      include: {
        teacher: { select: { id: true, name: true } },
        _count:  { select: { sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ freeCourses });
  } catch (err) {
    console.error('[enrollments GET /free-courses]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/enrollments/self-enroll — student: self-enroll in a free course
router.post('/self-enroll', async (req: AuthRequest, res: Response) => {
  try {
    const userId   = req.user!.id;
    const { courseId } = req.body as { courseId?: string };

    if (!courseId) {
      res.status(400).json({ error: 'courseId is required' });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, price: true, status: true },
    });

    if (!course || course.status !== 'PUBLISHED') {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    if (course.price > 0) {
      res.status(403).json({ error: 'This course requires payment to enroll' });
      return;
    }

    const enrollment = await prisma.enrollment.upsert({
      where:  { userId_courseId: { userId, courseId } },
      update: { status: 'ACTIVE' },
      create: { userId, courseId, status: 'ACTIVE' },
    });

    res.json({ enrollment });
  } catch (err) {
    console.error('[enrollments POST /self-enroll]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/enrollments/students — teacher: students enrolled in their courses
router.get('/students', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { teacherId },
        status: { not: 'DROPPED' },
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { startedAt: 'desc' },
    });

    res.json({ enrollments });
  } catch (err) {
    console.error('[enrollments GET /students]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
