import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { sendEmail } from '../lib/email';

const router = Router();

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  topic:   z.string().optional(),
  message: z.string().min(10),
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] ?? c));

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid form data', details: result.error.flatten() });
      return;
    }

    const { name, email, phone, topic, message } = result.data;

    await sendEmail({
      to: process.env.ADMIN_EMAIL ?? 'info@cyberteks-it.com',
      subject: `Contact Form — ${esc(name)}${topic ? ` (${esc(topic)})` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
          <div style="background: #023064; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Contact Message</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p><b>Name:</b> ${esc(name)}</p>
            <p><b>Email:</b> ${esc(email)}</p>
            ${phone   ? `<p><b>Phone:</b> ${esc(phone)}</p>` : ''}
            ${topic   ? `<p><b>Topic:</b> ${esc(topic)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p><b>Message:</b></p>
            <p style="white-space: pre-wrap;">${esc(message)}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await sendEmail({
      to: email,
      subject: 'We received your message — CyberteksIT',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023064; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Thanks for reaching out!</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hi ${esc(name)},</p>
            <p>We've received your message and will get back to you within <strong>2 business hours</strong>.</p>
            <p>If your matter is urgent, call us directly:</p>
            <p><strong>+256 779 367 005</strong> (MTN) &nbsp;|&nbsp; <strong>+256 706 911 732</strong> (Airtel)</p>
            <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Team</strong></p>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[contact]', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
