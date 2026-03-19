import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';

const router = Router();

const applySchema = z.object({
  fullName:            z.string().min(2),
  dateOfBirth:         z.string().min(1),
  gender:              z.enum(['male', 'female', 'prefer_not_to_say']),
  phoneNumber:         z.string().min(10),
  email:               z.string().email(),
  cityCountry:         z.string().min(2),
  educationLevel:      z.enum(['high_school', 'diploma_certificate', 'undergraduate', 'graduate', 'other']),
  educationOther:      z.string().optional(),
  currentOccupation:   z.string().optional(),
  programs:            z.array(z.string()).min(1),
  programOther:        z.string().optional(),
  motivation:          z.string().min(30),
  careerGoals:         z.string().min(30),
  hoursPerWeek:        z.enum(['2_4', '5_10', '10_plus']),
  hasComputer:         z.enum(['yes', 'no']),
  deviceTypes:         z.array(z.string()).optional(),
  hasInternet:         z.enum(['yes', 'no']),
  referralSource:      z.string().optional(),
  socialHandle:        z.string().optional(),
  declarationAccepted: z.literal(true),
  password:            z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword:     z.string().min(1),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] ?? c));

const educationLabels: Record<string, string> = {
  high_school: 'High School', diploma_certificate: 'Diploma / Certificate',
  undergraduate: 'Undergraduate Degree', graduate: 'Graduate Degree', other: 'Other',
};
const hoursLabels: Record<string, string> = {
  '2_4': '2–4 Hours/week', '5_10': '5–10 Hours/week', '10_plus': '10+ Hours/week',
};

// POST /api/apply
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = applySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid form data', details: result.error.flatten() });
      return;
    }

    const data = result.data;

    // Email admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL ?? 'info@cyberteks-it.com',
      subject: `New Training Application — ${data.fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
          <div style="background: #102a83; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Skills Development Application</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: #102a83;">Personal Information</h3>
            <p><b>Name:</b> ${esc(data.fullName)}</p>
            <p><b>Email:</b> ${esc(data.email)}</p>
            <p><b>Phone:</b> ${esc(data.phoneNumber)}</p>
            <p><b>Location:</b> ${esc(data.cityCountry)}</p>
            <p><b>Education:</b> ${esc(educationLabels[data.educationLevel] ?? data.educationLevel)}</p>
            <h3 style="color: #102a83;">Programs Selected</h3>
            <ul>${data.programs.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
            <h3 style="color: #102a83;">Motivation</h3>
            <p>${esc(data.motivation).replace(/\n/g, '<br/>')}</p>
            <p><b>Career goals:</b> ${esc(data.careerGoals).replace(/\n/g, '<br/>')}</p>
            <p><b>Hours/week:</b> ${esc(hoursLabels[data.hoursPerWeek] ?? data.hoursPerWeek)}</p>
          </div>
        </div>
      `,
    });

    // Confirmation email to applicant
    await sendEmail({
      to:      data.email,
      subject: 'Application Received — CyberteksIT Skills Development Program',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #102a83; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Application Received!</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${esc(data.fullName)},</p>
            <p>Thank you for applying to the CyberteksIT Skills Development Program. Our team will review it within <strong>2–3 business days</strong>.</p>
            <p>We will contact you at <strong>${esc(data.email)}</strong> with next steps.</p>
            <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Team</strong></p>
          </div>
        </div>
      `,
    });

    // Create student account (inactive until accepted)
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      await prisma.user.create({
        data: { name: data.fullName, email: data.email, password: hashedPassword, role: 'STUDENT', isActive: false },
      });
    }

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN', isActive: true }, select: { id: true } });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin: { id: string }) => ({
          userId: admin.id,
          title:  `New Application — ${data.fullName}`,
          body:   `${data.fullName} (${data.email}) applied for: ${data.programs.join(', ')}.`,
          type:   'INFO' as const,
          isRead: false,
          link:   '/admin/applications',
        })),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[apply]', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;
