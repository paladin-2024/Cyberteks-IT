import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/mentorship/join — public: record a mentorship hub payment
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
        amount:         30000,
        currency:       'UGX',
        status:         'PAID',
        type:           'MENTORSHIP_HUB',
        notes:          'Mentorship Hub membership — 3 months',
        guestName:      name.trim(),
        guestEmail:     email.trim().toLowerCase(),
        paymentProofUrl,
        paidAt:         new Date(),
      },
    });

    res.json({ success: true, invoiceNo: invoice.invoiceNo });
  } catch (err) {
    console.error('[mentorship POST /join]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
