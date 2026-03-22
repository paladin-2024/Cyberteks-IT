import { Router, Request, Response } from 'express';
import { prisma, withRetry } from '../lib/prisma';

const router = Router();

// POST /api/newsletter
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const normalised = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await withRetry(() =>
      prisma.newsletterSubscriber.findUnique({ where: { email: normalised } })
    );

    if (existing) {
      // Return success silently — no need to tell them they're already subscribed
      res.json({ success: true });
      return;
    }

    await withRetry(() =>
      prisma.newsletterSubscriber.create({ data: { email: normalised } })
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[newsletter/subscribe]', err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

export default router;
