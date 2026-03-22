import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// Helper: last N months labels + date range
function lastNMonths(n: number) {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    });
  }
  return months;
}

// ── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
router.get('/admin', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      totalCourses,
      pendingApplications,
      recentApplications,
      allEnrollments,
      paidInvoicesThisMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, fullName: true, email: true,
          programs: true, status: true, createdAt: true,
        },
      }),
      prisma.enrollment.findMany({
        select: { startedAt: true },
        orderBy: { startedAt: 'asc' },
      }),
      prisma.invoice.aggregate({
        where: { status: 'PAID', paidAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
    ]);

    // Build 6-month enrollment chart
    const months = lastNMonths(6);
    const enrollmentChart = months.map(({ label, start, end }) => ({
      month: label,
      enrollments: allEnrollments.filter(
        (e) => e.startedAt >= start && e.startedAt <= end
      ).length,
    }));

    res.json({
      totalStudents,
      totalCourses,
      pendingApplications,
      monthlyRevenue: paidInvoicesThisMonth._sum.amount ?? 0,
      recentApplications,
      enrollmentChart,
    });
  } catch (err) {
    console.error('[dashboard/admin]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── TEACHER DASHBOARD ────────────────────────────────────────────────────────
router.get('/teacher', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;

    const myCourses = await prisma.course.findMany({
      where: { teacherId },
      select: {
        id: true, title: true, slug: true, status: true,
        enrollments: {
          select: { id: true, status: true, progressPercent: true, startedAt: true, userId: true },
        },
      },
    });

    const allEnrollments = myCourses.flatMap((c) => c.enrollments);
    const uniqueStudentIds = [...new Set(allEnrollments.map((e) => e.userId))];
    const totalStudents = uniqueStudentIds.length;

    // Fetch student details separately to avoid null-user crash
    const studentUsers = await prisma.user.findMany({
      where: { id: { in: uniqueStudentIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = Object.fromEntries(studentUsers.map((u) => [u.id, u]));

    // Recent 5 students enrolled
    const sortedEnrollments = [...allEnrollments].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    const recentStudents = sortedEnrollments.slice(0, 5).map((e) => {
      const course = myCourses.find((c) => c.enrollments.some((en) => en.id === e.id));
      const u = userMap[e.userId];
      return {
        name: u?.name ?? 'Unknown Student',
        email: u?.email ?? '',
        course: course?.title ?? '',
        enrolled: e.startedAt,
        progress: e.progressPercent,
      };
    });

    // Completion breakdown
    const completed = allEnrollments.filter((e) => e.status === 'COMPLETED').length;
    const inProgress = allEnrollments.filter((e) => e.status === 'ACTIVE' && e.progressPercent > 0).length;
    const notStarted = allEnrollments.filter((e) => e.progressPercent === 0).length;
    const total = allEnrollments.length || 1;

    // Weekly enrollments chart (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activityChart = days.map((day, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - ((d.getDay() - idx + 7) % 7));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      return {
        day,
        students: allEnrollments.filter(
          (e) => new Date(e.startedAt) >= dayStart && new Date(e.startedAt) <= dayEnd
        ).length,
      };
    });

    res.json({
      myCourses: myCourses.length,
      totalStudents,
      recentStudents,
      coursesList: myCourses.map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        enrollmentCount: c.enrollments.length,
        completedCount: c.enrollments.filter((e) => e.status === 'COMPLETED').length,
        avgProgress: c.enrollments.length
          ? Math.round(c.enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / c.enrollments.length)
          : 0,
      })),
      completionBreakdown: {
        completed: Math.round((completed / total) * 100),
        inProgress: Math.round((inProgress / total) * 100),
        notStarted: Math.round((notStarted / total) * 100),
      },
      activityChart,
    });
  } catch (err) {
    console.error('[dashboard/teacher]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── STUDENT DASHBOARD ────────────────────────────────────────────────────────
router.get('/student', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true, title: true, slug: true,
            teacher: { select: { name: true } },
            createdAt: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const activeCount = enrollments.filter((e) => e.status === 'ACTIVE').length;

    // Study hours per day of week from LessonProgress
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId, completedAt: { not: null } },
      select: { watchedSecs: true, completedAt: true },
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const studyChart = days.map((day, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - ((d.getDay() - idx + 7) % 7));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      const secs = lessonProgress
        .filter((p) => p.completedAt && new Date(p.completedAt) >= dayStart && new Date(p.completedAt) <= dayEnd)
        .reduce((sum, p) => sum + p.watchedSecs, 0);
      return { day, hours: parseFloat((secs / 3600).toFixed(1)) };
    });

    res.json({
      enrolledCount: activeCount,
      completedCount,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        courseId: e.course.id,
        title: e.course.title,
        instructor: e.course.teacher?.name ?? 'Instructor',
        startedAt: e.startedAt,
        progress: e.progressPercent,
        status: e.status,
      })),
      studyChart,
    });
  } catch (err) {
    console.error('[dashboard/student]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
