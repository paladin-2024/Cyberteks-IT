import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/invoices — list all invoices with student/course info (admin only)
// Supports ?status=PAID|SENT|OVERDUE|DRAFT|CANCELLED|ALL and ?search=string
router.get('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (search?.trim()) {
      where.OR = [
        { invoiceNo:   { contains: search.trim(), mode: 'insensitive' } },
        { guestName:   { contains: search.trim(), mode: 'insensitive' } },
        { guestEmail:  { contains: search.trim(), mode: 'insensitive' } },
        { user: { name:  { contains: search.trim(), mode: 'insensitive' } } },
        { user: { email: { contains: search.trim(), mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Summary totals across ALL invoices (ignoring current filter)
    const all = await prisma.invoice.findMany({ select: { amount: true, status: true } });
    const totalRevenue = all.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
    const totalPending = all.filter(i => i.status === 'SENT').reduce((s, i) => s + i.amount, 0);
    const totalOverdue = all.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.amount, 0);

    res.json({ invoices, totalRevenue, totalPending, totalOverdue });
  } catch (err) {
    console.error('[invoices GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
