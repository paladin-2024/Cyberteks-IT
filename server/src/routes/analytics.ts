import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { generateAnalyticsReport } from '../lib/analytics-pdf';

const router = Router();
router.use(requireAuth);

function lastNMonths(n: number) {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    });
  }
  return months;
}

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalStudents,
      totalRevenue,
      allEnrollments,
      allPaidInvoices,
      courses,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.enrollment.findMany({
        select: { startedAt: true, status: true, progressPercent: true, courseId: true },
      }),
      prisma.invoice.findMany({
        where: { status: 'PAID' },
        select: { amount: true, paidAt: true },
      }),
      prisma.course.findMany({
        select: {
          id: true, title: true, category: true, status: true,
          enrollments: { select: { status: true, progressPercent: true } },
        },
      }),
    ]);

    const months = lastNMonths(12);

    const enrollmentChart = months.map(({ label, start, end }) => ({
      month: label,
      students: allEnrollments.filter(
        (e) => new Date(e.startedAt) >= start && new Date(e.startedAt) <= end
      ).length,
    }));

    const revenueChart = months.map(({ label, start, end }) => ({
      month: label,
      revenue: allPaidInvoices
        .filter((i) => i.paidAt && new Date(i.paidAt) >= start && new Date(i.paidAt) <= end)
        .reduce((sum, i) => sum + i.amount, 0),
    }));

    // Program distribution from course categories
    const categoryMap: Record<string, number> = {};
    courses.forEach((c) => {
      const cat = c.category ?? 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + c.enrollments.length;
    });
    const programShare = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Completion by course (published courses only)
    const completionByProgram = courses
      .filter((c) => c.status === 'PUBLISHED' && c.enrollments.length > 0)
      .map((c) => {
        const completed = c.enrollments.filter((e) => e.status === 'COMPLETED').length;
        const rate = Math.round((completed / c.enrollments.length) * 100);
        return { program: c.title.length > 20 ? c.title.substring(0, 20) + '\u2026' : c.title, rate };
      });

    // Avg completion rate
    const avgCompletion = allEnrollments.length
      ? Math.round(allEnrollments.reduce((sum, e) => sum + e.progressPercent, 0) / allEnrollments.length)
      : 0;

    // Retention: % students still ACTIVE (not dropped/suspended)
    const retentionRate = allEnrollments.length
      ? Math.round(
          (allEnrollments.filter((e) => e.status !== 'DROPPED' && e.status !== 'SUSPENDED').length /
            allEnrollments.length) *
            100
        )
      : 0;

    res.json({
      kpis: {
        totalStudents,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        avgCompletion,
        retentionRate,
      },
      enrollmentChart,
      revenueChart,
      programShare,
      completionByProgram,
    });
  } catch (err) {
    console.error('[analytics]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── MONTHLY REPORT PDF ────────────────────────────────────────────────────────
// GET /api/analytics/report?year=2026&month=3  (admin only)
router.get('/report', requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const now   = new Date();
    const year  = parseInt((req.query.year  as string) ?? String(now.getFullYear()),  10);
    const month = parseInt((req.query.month as string) ?? String(now.getMonth() + 1), 10);

    // Month range for "this month" snapshot
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd   = new Date(year, month, 0, 23, 59, 59);

    const [
      totalStudents,
      totalRevenue,
      allEnrollments,
      allPaidInvoices,
      courses,
      newEnrollmentsThisMonth,
      revenueThisMonth,
      newApplicationsThisMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      prisma.enrollment.findMany({
        select: { startedAt: true, status: true, progressPercent: true },
      }),
      prisma.invoice.findMany({
        where: { status: 'PAID' },
        select: { amount: true, paidAt: true },
      }),
      prisma.course.findMany({
        select: {
          id: true, title: true, category: true, status: true,
          enrollments: { select: { status: true, progressPercent: true } },
        },
      }),
      prisma.enrollment.count({
        where: { startedAt: { gte: monthStart, lte: monthEnd } },
      }),
      prisma.invoice.aggregate({
        where: { status: 'PAID', paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      prisma.application.count({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
    ]);

    const months12 = lastNMonths(12);

    const enrollmentChart = months12.map(({ label, start, end }) => ({
      month: label,
      students: allEnrollments.filter(
        (e) => new Date(e.startedAt) >= start && new Date(e.startedAt) <= end,
      ).length,
    }));

    const revenueChart = months12.map(({ label, start, end }) => ({
      month: label,
      revenue: allPaidInvoices
        .filter((i) => i.paidAt && new Date(i.paidAt) >= start && new Date(i.paidAt) <= end)
        .reduce((sum, i) => sum + i.amount, 0),
    }));

    const categoryMap: Record<string, number> = {};
    courses.forEach((c) => {
      const cat = c.category ?? 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + c.enrollments.length;
    });
    const programShare = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const completionByProgram = courses
      .filter((c) => c.status === 'PUBLISHED' && c.enrollments.length > 0)
      .map((c) => {
        const completed = c.enrollments.filter((e) => e.status === 'COMPLETED').length;
        const rate = Math.round((completed / c.enrollments.length) * 100);
        return { program: c.title.length > 28 ? c.title.substring(0, 28) + '…' : c.title, rate };
      });

    const avgCompletion = allEnrollments.length
      ? Math.round(allEnrollments.reduce((s, e) => s + e.progressPercent, 0) / allEnrollments.length)
      : 0;

    const retentionRate = allEnrollments.length
      ? Math.round(
          (allEnrollments.filter((e) => e.status !== 'DROPPED' && e.status !== 'SUSPENDED').length /
            allEnrollments.length) * 100,
        )
      : 0;

    const pdfBuffer = await generateAnalyticsReport({
      month,
      year,
      kpis: {
        totalStudents,
        totalRevenue:              totalRevenue._sum.amount ?? 0,
        avgCompletion,
        retentionRate,
        newEnrollmentsThisMonth,
        revenueThisMonth:          revenueThisMonth._sum.amount ?? 0,
        newApplicationsThisMonth,
      },
      enrollmentChart,
      revenueChart,
      programShare,
      completionByProgram,
    });

    const label = new Date(year, month - 1, 1)
      .toLocaleString('en-US', { month: 'short', year: 'numeric' })
      .replace(' ', '-')
      .toLowerCase();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cyberteks-report-${label}.pdf"`);
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.send(pdfBuffer);
  } catch (err) {
    console.error('[analytics/report]', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ── TEACHER ANALYTICS ─────────────────────────────────────────────────────────

router.get('/teacher', requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;

    const myCourses = await prisma.course.findMany({
      where: { teacherId },
      select: {
        id: true, title: true, status: true, category: true,
        enrollments: {
          select: { status: true, progressPercent: true, startedAt: true },
        },
      },
    });

    const allEnrollments = myCourses.flatMap((c) => c.enrollments);
    const totalStudents = allEnrollments.length;

    const months = lastNMonths(6);

    const enrollmentChart = months.map(({ label, start, end }) => ({
      month: label,
      students: allEnrollments.filter(
        (e) => new Date(e.startedAt) >= start && new Date(e.startedAt) <= end
      ).length,
    }));

    const completionByProgram = myCourses
      .filter((c) => c.enrollments.length > 0)
      .map((c) => {
        const completed = c.enrollments.filter((e) => e.status === 'COMPLETED').length;
        const rate = Math.round((completed / c.enrollments.length) * 100);
        return {
          program: c.title.length > 22 ? c.title.substring(0, 22) + '\u2026' : c.title,
          rate,
        };
      });

    const avgProgress = totalStudents
      ? Math.round(allEnrollments.reduce((s, e) => s + e.progressPercent, 0) / totalStudents)
      : 0;

    const completedCount = allEnrollments.filter((e) => e.status === 'COMPLETED').length;
    const completionRate = totalStudents ? Math.round((completedCount / totalStudents) * 100) : 0;

    const retentionRate = totalStudents
      ? Math.round(
          (allEnrollments.filter((e) => e.status !== 'DROPPED' && e.status !== 'SUSPENDED').length /
            totalStudents) * 100
        )
      : 0;

    res.json({
      kpis: {
        totalCourses: myCourses.length,
        totalStudents,
        avgProgress,
        completionRate,
        retentionRate,
      },
      enrollmentChart,
      completionByProgram,
    });
  } catch (err) {
    console.error('[analytics/teacher]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
