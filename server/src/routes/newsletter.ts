import { Router, Request, Response } from 'express';
import { prisma, withRetry } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

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

// GET /api/newsletter/subscribers — admin only
router.get('/subscribers', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await withRetry(() =>
      prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
    );
    res.json({ subscribers, total: subscribers.length });
  } catch (err) {
    console.error('[newsletter/subscribers]', err);
    res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});

// POST /api/newsletter/broadcast — admin only
router.post('/broadcast', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message } = req.body as { subject?: string; message?: string };

    if (!subject?.trim()) { res.status(400).json({ error: 'Subject is required.' }); return; }
    if (!message?.trim())  { res.status(400).json({ error: 'Message is required.' }); return; }

    const subscribers = await withRetry(() =>
      prisma.newsletterSubscriber.findMany({ select: { email: true } })
    );

    if (subscribers.length === 0) {
      res.status(400).json({ error: 'No subscribers found.' });
      return;
    }

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#102a83;padding:32px 40px;">
          <img src="https://cyberteks-it.com/assets/cyberteks-it-footer-logo.png" alt="CyberteksIT" style="height:40px;" />
        </div>
        <div style="padding:40px;">
          <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">${subject}</h2>
          <div style="color:#4b5563;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            You're receiving this because you subscribed to CyberteksIT newsletter.<br/>
            CyberteksIT — Kampala, Uganda &nbsp;|&nbsp; <a href="https://cyberteks-it.com" style="color:#E11D48;">cyberteks-it.com</a>
          </p>
        </div>
      </div>`;

    let sent = 0;
    let failed = 0;

    for (const { email } of subscribers) {
      try {
        await sendEmail({ to: email, subject, html });
        sent++;
      } catch {
        failed++;
      }
    }

    res.json({ success: true, sent, failed, total: subscribers.length });
  } catch (err) {
    console.error('[newsletter/broadcast]', err);
    res.status(500).json({ error: 'Failed to send broadcast.' });
  }
});

// DELETE /api/newsletter/subscribers/:email — admin only
router.delete('/subscribers/:email', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    await withRetry(() => prisma.newsletterSubscriber.delete({ where: { email } }));
    res.json({ success: true });
  } catch (err) {
    console.error('[newsletter/delete]', err);
    res.status(500).json({ error: 'Failed to remove subscriber.' });
  }
});

export default router;
