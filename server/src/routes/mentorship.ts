import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import { generateInvoicePDF } from '../lib/invoice-pdf';

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

    // Generate PDF invoice + send receipt email (fire-and-forget)
    const paidDate = new Date().toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' });
    generateInvoicePDF({
      invoiceNo: invoice.invoiceNo,
      date:      new Date(),
      name:      invoice.guestName!,
      email:     invoice.guestEmail!,
      currency:  'UGX',
      total:     30000,
      items: [{ description: 'Mentorship Hub Membership — 3 months', amount: 30000 }],
    }).then(pdfBuffer =>
    sendEmail({
      to: invoice.guestEmail!,
      subject: `Payment Receipt — Mentorship Hub (${invoice.invoiceNo})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <!-- Header -->
          <div style="background: #102a83; color: white; padding: 22px 28px; border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <p style="margin: 0 0 2px; font-size: 12px; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px;">Payment Receipt</p>
              <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Mentorship Hub</h2>
            </div>
            <img src="https://cyberteks-it.com/logo.jpg" alt="Cyberteks-IT" width="48" height="48"
              style="border-radius: 50%; border: 2px solid rgba(255,255,255,0.35);" />
          </div>

          <!-- Body -->
          <div style="background: white; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 20px; color: #374151; font-size: 15px;">
              Hi <strong>${invoice.guestName}</strong>,<br><br>
              Thank you for joining the <strong>Cyberteks-IT Mentorship Hub</strong>! Your payment has been received and your 3-month membership is now active.
            </p>

            <!-- Receipt box -->
            <div style="background: #f1f5f9; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b;">Receipt Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Invoice No.</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 600; text-align: right;">${invoice.invoiceNo}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Name</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 600; text-align: right;">${invoice.guestName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Membership</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 600; text-align: right;">Mentorship Hub — 3 months</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Date Paid</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 600; text-align: right;">${paidDate}</td>
                </tr>
                <tr style="border-top: 1px solid #cbd5e1;">
                  <td style="padding: 10px 0 6px; color: #111827; font-weight: 700; font-size: 15px;">Total Paid</td>
                  <td style="padding: 10px 0 6px; color: #102a83; font-weight: 800; font-size: 18px; text-align: right;">UGX 30,000</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 4px 0;">
                    <span style="display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">✓ Paid</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- WhatsApp CTA -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 16px;">🎉 You're in!</p>
              <p style="margin: 0 0 16px; color: #374151; font-size: 14px; line-height: 1.6;">
                Click the button below to join the <strong>Cyberteks-IT Mentorship Hub WhatsApp group</strong> and connect with your peers and mentors right away.
              </p>
              <a href="https://chat.whatsapp.com/DJ3zRjjc5QO4QiMr6RLiWR?mode=gi_t"
                style="display: inline-block; background: #25D366; color: white; font-weight: 700; font-size: 15px; text-decoration: none; padding: 13px 32px; border-radius: 10px;">
                📲 Join the WhatsApp Group
              </a>
            </div>

            <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; line-height: 1.6;">
              Questions? Reply to this email or reach us at
              <a href="mailto:info@cyberteks-it.com" style="color: #102a83;">info@cyberteks-it.com</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 16px 28px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
              Cyberteks-IT Ltd · Kampala, Uganda · <a href="https://cyberteks-it.com" style="color: #94a3b8;">cyberteks-it.com</a>
            </p>
          </div>
        </div>
      `,
      attachments: [{ filename: `invoice-${invoice.invoiceNo}.pdf`, content: pdfBuffer }],
    })).catch(err => console.error('[mentorship] receipt email failed:', err));

    res.json({ success: true, invoiceNo: invoice.invoiceNo });
  } catch (err) {
    console.error('[mentorship POST /join]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
