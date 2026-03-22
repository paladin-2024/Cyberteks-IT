import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../lib/email';

const router = Router();

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] ?? c));

// ── Public: submit a support request ─────────────────────────────────────────

// POST /api/get-started
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      fullName, email, phone, company, location,
      deviceType, os, osOther, problemCategory, problemDescription,
      errorMessages, urgency, remoteTool, remoteId, availableTime,
    } = req.body as Record<string, string>;

    if (!fullName?.trim() || !email?.trim() || !problemDescription?.trim()) {
      res.status(400).json({ error: 'fullName, email and problemDescription are required' });
      return;
    }

    const resolvedOs = os === 'Other' && osOther ? osOther : os;

    const request = await prisma.supportRequest.create({
      data: {
        fullName:           fullName.trim(),
        email:              email.trim().toLowerCase(),
        phone:              phone?.trim() || null,
        company:            company?.trim() || null,
        location:           location?.trim() || null,
        deviceType:         deviceType || null,
        os:                 resolvedOs || null,
        problemCategory:    problemCategory || null,
        problemDescription: problemDescription.trim(),
        errorMessages:      errorMessages?.trim() || null,
        urgency:            urgency || 'Medium',
        remoteTool:         remoteTool || null,
        remoteId:           remoteId?.trim() || null,
        availableTime:      availableTime?.trim() || null,
      },
    });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL ?? 'info@cyberteks-it.com',
      subject: `[IT Support] New Request — ${esc(fullName)} (${esc(urgency || 'Medium')})`,
      html: `
        <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
          <div style="background: #023064; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Remote IT Support Request</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p><b>Name:</b> ${esc(fullName)}</p>
            <p><b>Email:</b> ${esc(email)}</p>
            ${phone    ? `<p><b>Phone:</b> ${esc(phone)}</p>` : ''}
            ${company  ? `<p><b>Company:</b> ${esc(company)}</p>` : ''}
            ${location ? `<p><b>Location:</b> ${esc(location)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p><b>Device:</b> ${esc(deviceType || '—')}</p>
            <p><b>OS:</b> ${esc(resolvedOs || '—')}</p>
            <p><b>Problem Category:</b> ${esc(problemCategory || '—')}</p>
            <p><b>Urgency:</b> ${esc(urgency || 'Medium')}</p>
            <p><b>Remote Tool:</b> ${esc(remoteTool || '—')} ${remoteId ? `(ID: ${esc(remoteId)})` : ''}</p>
            ${availableTime ? `<p><b>Available Time:</b> ${esc(availableTime)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p><b>Problem Description:</b></p>
            <p style="white-space: pre-wrap;">${esc(problemDescription)}</p>
            ${errorMessages ? `<p><b>Error Messages:</b></p><p style="white-space: pre-wrap;">${esc(errorMessages)}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="font-size: 12px; color: #64748b;">Request ID: ${request.id}</p>
          </div>
        </div>
      `,
    }).catch(console.error);

    // Auto-confirm to client
    await sendEmail({
      to: email,
      subject: 'We received your IT support request — CyberteksIT',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023064; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Support Request Received</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hi ${esc(fullName)},</p>
            <p>We've received your remote IT support request and our team will reach out to you shortly.</p>
            <p><b>Your issue:</b> ${esc(problemCategory || problemDescription)}</p>
            <p><b>Urgency:</b> ${esc(urgency || 'Medium')}</p>
            <p>If your matter is very urgent, contact us directly:</p>
            <p><strong>+256 779 367 005</strong> (MTN) &nbsp;|&nbsp; <strong>+256 706 911 732</strong> (Airtel)</p>
            <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Team</strong></p>
          </div>
        </div>
      `,
    }).catch(console.error);

    res.status(201).json({ success: true, id: request.id });
  } catch (err) {
    console.error('[get-started POST /]', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET /api/get-started — list all requests
router.get('/', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.supportRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ requests });
  } catch (err) {
    console.error('[get-started GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/get-started/:id — single request
router.get('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const request = await prisma.supportRequest.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    res.json({ request });
  } catch (err) {
    console.error('[get-started GET /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/get-started/:id — update status / admin notes
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };

    const existing = await prisma.supportRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const updated = await prisma.supportRequest.update({
      where: { id },
      data: {
        ...(status     !== undefined && { status: status as any }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    res.json({ request: updated });
  } catch (err) {
    console.error('[get-started PATCH /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/get-started/:id/reply — send email reply to client
router.post('/:id/reply', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { subject, message } = req.body as { subject?: string; message: string };

    if (!message?.trim()) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const request = await prisma.supportRequest.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    // Always mark as replied in DB first
    const updated = await prisma.supportRequest.update({
      where: { id },
      data: {
        repliedAt: new Date(),
        status: request.status === 'OPEN' ? 'IN_PROGRESS' : request.status,
      },
    });

    // Attempt email — failure is non-fatal, return a warning instead
    let emailSent = true;
    let emailError: string | null = null;

    try {
      await sendEmail({
        to: request.email,
        subject: subject?.trim() || `Re: Your IT Support Request — CyberteksIT`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #023064; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">Response from CyberteksIT Support</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Hi ${esc(request.fullName)},</p>
              <div style="white-space: pre-wrap;">${esc(message.trim())}</div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 13px; color: #64748b;">
                This is a reply regarding your IT support request:<br/>
                <em>${esc(request.problemCategory || request.problemDescription.slice(0, 80))}</em>
              </p>
              <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Support Team</strong></p>
              <p style="font-size: 12px; color: #94a3b8;">+256 779 367 005 | +256 706 911 732 | info@cyberteks-it.com</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr: unknown) {
      emailSent = false;
      emailError = emailErr instanceof Error ? emailErr.message : 'Email delivery failed';
      console.error('[get-started reply email]', emailErr);
    }

    res.json({ success: true, emailSent, emailError, request: updated });
  } catch (err) {
    console.error('[get-started POST /:id/reply]', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

export default router;
