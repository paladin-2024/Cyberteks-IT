import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/mentorship/join — public: record a mentorship hub payment, pending admin review
router.post('/join', async (req: Request, res: Response) => {
  try {
    const { name, email, paymentProofUrl } = req.body as {
      name?: string;
      email?: string;
      paymentProofUrl?: string;
    };

    if (!name?.trim()) {
      res.status(400).json({ error: 'Full name is required' });
      return;
    }
    if (!email?.trim()) {
      res.status(400).json({ error: 'Email address is required' });
      return;
    }
    if (!paymentProofUrl) {
      res.status(400).json({ error: 'Payment proof is required' });
      return;
    }

    const invoiceNo = `MH-${Date.now().toString().slice(-8)}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        amount:             30000,
        currency:           'UGX',
        status:             'PENDING_REVIEW',
        type:               'MENTORSHIP_HUB',
        notes:              'Mentorship Hub membership — 3 months',
        guestName:          name.trim(),
        guestEmail:         email.trim().toLowerCase(),
        paymentProofUrl,
        accessDurationDays: 90,
      },
    });

    // Notify admins in-app
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin: { id: string }) => ({
          userId: admin.id,
          title:  `New Mentorship Payment — ${invoice.guestName}`,
          body:   `${invoice.guestName} (${invoice.guestEmail}) submitted payment proof for Mentorship Hub. Review required.`,
          type:   'INFO' as const,
          isRead: false,
          link:   '/admin/invoices',
        })),
      });
    }

    res.json({ success: true, invoiceNo: invoice.invoiceNo, status: 'pending_review' });
  } catch (err) {
    console.error('[mentorship POST /join]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
