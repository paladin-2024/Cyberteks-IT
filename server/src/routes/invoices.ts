import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { generateInvoicePDF } from '../lib/invoice-pdf';
import { sendEmail } from '../lib/email';

const router = Router();

// ── Parse course duration string to days ─────────────────────────────────────
function parseDurationDays(duration: string | null | undefined): number {
  if (!duration) return 90; // default 3 months
  const s = duration.toLowerCase().trim();
  const n = parseFloat(s);
  if (isNaN(n)) return 90;
  if (s.includes('year'))  return Math.round(n * 365);
  if (s.includes('month')) return Math.round(n * 30);
  if (s.includes('week'))  return Math.round(n * 7);
  if (s.includes('day'))   return Math.round(n);
  return 90;
}

// ── GET /api/invoices ─────────────────────────────────────────────────────────
router.get('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (search?.trim()) {
      where.OR = [
        { invoiceNo:  { contains: search.trim(), mode: 'insensitive' } },
        { guestName:  { contains: search.trim(), mode: 'insensitive' } },
        { guestEmail: { contains: search.trim(), mode: 'insensitive' } },
        { user: { name:  { contains: search.trim(), mode: 'insensitive' } } },
        { user: { email: { contains: search.trim(), mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        user:   { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, duration: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const all = await prisma.invoice.findMany({ select: { amount: true, status: true } });
    const totalRevenue       = all.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
    const totalPending       = all.filter(i => i.status === 'SENT').reduce((s, i) => s + i.amount, 0);
    const totalOverdue       = all.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.amount, 0);
    const totalPendingReview = all.filter(i => i.status === 'PENDING_REVIEW').length;

    res.json({ invoices, totalRevenue, totalPending, totalOverdue, totalPendingReview });
  } catch (err) {
    console.error('[invoices GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /api/invoices/:id/approve (admin) ───────────────────────────────────
router.patch('/:id/approve', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user:   { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, duration: true } },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    if (invoice.status !== 'PENDING_REVIEW') {
      res.status(400).json({ error: 'Invoice is not pending review' });
      return;
    }

    // Determine access duration in days
    const durationDays = invoice.accessDurationDays
      ?? (invoice.type === 'MENTORSHIP_HUB' ? 90 : parseDurationDays(invoice.course?.duration));

    const now            = new Date();
    const accessExpiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Update invoice to PAID
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status:            'PAID',
        paidAt:            now,
        reviewedAt:        now,
        reviewedById:      req.user!.id,
        accessDurationDays: durationDays,
      },
    });

    // Set accessExpiresAt on the matching enrollment (if registered user + course)
    if (invoice.userId && invoice.courseId) {
      await prisma.enrollment.updateMany({
        where:  { userId: invoice.userId, courseId: invoice.courseId },
        data:   { accessExpiresAt, status: 'ACTIVE' },
      });
    }

    // For mentorship hub or course enrollments where courseId isn't set but userId is,
    // update all ACTIVE enrollments with expiry if none already set
    if (invoice.userId && !invoice.courseId && invoice.type === 'COURSE_PAYMENT') {
      await prisma.enrollment.updateMany({
        where:  { userId: invoice.userId, accessExpiresAt: null },
        data:   { accessExpiresAt },
      });
    }

    // Build receipt email content
    const recipientName  = invoice.user?.name  ?? invoice.guestName  ?? 'Student';
    const recipientEmail = invoice.user?.email ?? invoice.guestEmail ?? '';

    if (recipientEmail) {
      const isMentorship = invoice.type === 'MENTORSHIP_HUB';
      const description  = isMentorship
        ? 'Mentorship Hub Membership — 3 months'
        : invoice.notes ?? 'Skills Development Programme';

      const expiryStr = accessExpiresAt.toLocaleDateString('en-UG', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      // Build PDF
      generateInvoicePDF({
        invoiceNo: updated.invoiceNo,
        date:      now,
        name:      recipientName,
        email:     recipientEmail,
        currency:  'UGX',
        total:     updated.amount,
        items:     [{ description, amount: updated.amount }],
        notes:     `Access valid until ${expiryStr}`,
      }).then(pdfBuffer =>
        sendEmail({
          to:      recipientEmail,
          subject: `Payment Confirmed — ${updated.invoiceNo} | Cyberteks-IT`,
          html: `
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;">
              <div style="background:#102a83;color:white;padding:22px 28px;border-radius:12px 12px 0 0;">
                <p style="margin:0 0 2px;font-size:12px;opacity:0.75;text-transform:uppercase;letter-spacing:1px;">Payment Confirmed</p>
                <h2 style="margin:0;font-size:20px;font-weight:700;">${isMentorship ? 'Mentorship Hub' : 'Skills Development Programme'}</h2>
              </div>
              <div style="background:white;padding:28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                <p style="margin:0 0 20px;color:#374151;font-size:15px;">
                  Hi <strong>${recipientName}</strong>,<br><br>
                  Great news! Your payment has been <strong>verified and confirmed</strong> by our team.
                  ${isMentorship ? 'Your 3-month Mentorship Hub membership is now active.' : 'Your course access is now active.'}
                </p>
                <div style="background:#f1f5f9;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
                  <h3 style="margin:0 0 14px;font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#64748b;">Receipt Summary</h3>
                  <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;">Invoice No.</td>
                      <td style="padding:6px 0;color:#111827;font-weight:600;text-align:right;">${updated.invoiceNo}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;">Description</td>
                      <td style="padding:6px 0;color:#111827;font-weight:600;text-align:right;">${description}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;">Access Until</td>
                      <td style="padding:6px 0;color:#111827;font-weight:600;text-align:right;">${expiryStr}</td>
                    </tr>
                    <tr style="border-top:1px solid #cbd5e1;">
                      <td style="padding:10px 0 6px;color:#111827;font-weight:700;font-size:15px;">Total Paid</td>
                      <td style="padding:10px 0 6px;color:#102a83;font-weight:800;font-size:18px;text-align:right;">
                        ${updated.amount > 0 ? `UGX ${updated.amount.toLocaleString('en-UG')}` : 'FREE'}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:4px 0;">
                        <span style="display:inline-block;background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">✓ Payment Verified</span>
                      </td>
                    </tr>
                  </table>
                </div>
                ${isMentorship ? `
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:16px;font-weight:700;">You're in!</p>
                    <p style="margin:0 0 16px;color:#374151;font-size:14px;">Join the Mentorship Hub WhatsApp group to connect with your peers and mentors.</p>
                    <a href="https://chat.whatsapp.com/DJ3zRjjc5QO4QiMr6RLiWR?mode=gi_t"
                      style="display:inline-block;background:#25D366;color:white;font-weight:700;font-size:15px;text-decoration:none;padding:13px 32px;border-radius:10px;">
                      Join WhatsApp Group
                    </a>
                  </div>
                ` : ''}
                <p style="margin:0;font-size:13px;color:#64748b;">Your invoice PDF is attached. Questions? Email <a href="mailto:info@cyberteks-it.com" style="color:#102a83;">info@cyberteks-it.com</a>.</p>
              </div>
              <div style="padding:16px 28px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#94a3b8;">Cyberteks-IT Ltd · Kampala, Uganda · <a href="https://cyberteks-it.com" style="color:#94a3b8;">cyberteks-it.com</a></p>
              </div>
            </div>
          `,
          attachments: [{ filename: `invoice-${updated.invoiceNo}.pdf`, content: pdfBuffer }],
        })
      ).catch(err => console.error('[invoices/approve] receipt email failed:', err));
    }

    // In-app notification to student
    if (invoice.userId) {
      await prisma.notification.create({
        data: {
          userId: invoice.userId,
          title:  'Payment Confirmed!',
          body:   `Your payment (${updated.invoiceNo}) has been verified. Your access is now active.`,
          type:   'SUCCESS',
          isRead: false,
          link:   '/student/dashboard',
        },
      });
    }

    res.json({ success: true, invoice: updated });
  } catch (err) {
    console.error('[invoices PATCH /approve]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /api/invoices/:id/reject (admin) ────────────────────────────────────
router.patch('/:id/reject', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { reason } = req.body as { reason?: string };

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    if (invoice.status !== 'PENDING_REVIEW') {
      res.status(400).json({ error: 'Invoice is not pending review' });
      return;
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status:          'CANCELLED',
        reviewedAt:      new Date(),
        reviewedById:    req.user!.id,
        rejectionReason: reason?.trim() || 'Payment could not be verified.',
      },
    });

    const recipientName  = invoice.user?.name  ?? invoice.guestName  ?? 'Student';
    const recipientEmail = invoice.user?.email ?? invoice.guestEmail ?? '';

    if (recipientEmail) {
      sendEmail({
        to:      recipientEmail,
        subject: `Payment Not Verified — ${updated.invoiceNo} | Cyberteks-IT`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;">
            <div style="background:#102a83;color:white;padding:22px 28px;border-radius:12px 12px 0 0;">
              <p style="margin:0 0 2px;font-size:12px;opacity:0.75;text-transform:uppercase;letter-spacing:1px;">Payment Review</p>
              <h2 style="margin:0;font-size:20px;font-weight:700;">Action Required</h2>
            </div>
            <div style="background:white;padding:28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;">Hi <strong>${recipientName}</strong>,</p>
              <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
                We were unable to verify your payment for reference <strong>${updated.invoiceNo}</strong>.
              </p>
              ${reason ? `
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                  <p style="margin:0;font-size:13px;color:#991b1b;"><strong>Reason:</strong> ${reason}</p>
                </div>
              ` : ''}
              <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
                Please re-submit a clear proof of payment (screenshot or photo of the transaction) by replying to this email or contacting us directly.
              </p>
              <p style="margin:0;font-size:13px;color:#64748b;">Contact: <a href="mailto:info@cyberteks-it.com" style="color:#102a83;">info@cyberteks-it.com</a></p>
            </div>
            <div style="padding:16px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">Cyberteks-IT Ltd · Kampala, Uganda</p>
            </div>
          </div>
        `,
      }).catch(err => console.error('[invoices/reject] email failed:', err));
    }

    if (invoice.userId) {
      await prisma.notification.create({
        data: {
          userId: invoice.userId,
          title:  'Payment Not Verified',
          body:   `Your payment (${updated.invoiceNo}) could not be verified. Please contact support.`,
          type:   'WARNING',
          isRead: false,
          link:   '/student/dashboard',
        },
      });
    }

    res.json({ success: true, invoice: updated });
  } catch (err) {
    console.error('[invoices PATCH /reject]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/invoices/:id/pdf (admin) — download invoice PDF ──────────────────
router.get('/:id/pdf', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user:   { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const name  = invoice.user?.name  ?? invoice.guestName  ?? 'Unknown';
    const email = invoice.user?.email ?? invoice.guestEmail ?? '';
    const description = invoice.type === 'MENTORSHIP_HUB'
      ? 'Mentorship Hub Membership — 3 months'
      : invoice.course?.title ?? invoice.notes ?? 'Skills Development Programme';

    const pdfBuffer = await generateInvoicePDF({
      invoiceNo: invoice.invoiceNo,
      date:      invoice.paidAt ?? invoice.createdAt,
      name,
      email,
      currency:  invoice.currency,
      total:     invoice.amount,
      items:     [{ description, amount: invoice.amount }],
      notes:     invoice.notes ?? undefined,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNo}.pdf"`);
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.send(pdfBuffer);
  } catch (err) {
    console.error('[invoices GET /:id/pdf]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
