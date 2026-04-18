import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import {
  adminNewApplicationEmail,
  applicantConfirmationEmail,
  applicantAcceptedEmail,
  applicantRejectedEmail,
} from '../lib/emailTemplates';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── In-memory OTP store ───────────────────────────────────────────────────────
interface OtpEntry { otp: string; expiresAt: number; verified: boolean }
const otpStore = new Map<string, OtpEntry>();

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpEmailHtml(email: string, otp: string): string {
  const CLIENT_URL = process.env.CLIENT_URL ?? 'https://cyberteks-it.com';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr>
        <td style="background:linear-gradient(135deg,#102a83,#1e3fa8);border-radius:16px 16px 0 0;padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Email Verification</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">Verify Your Email</h1>
            </td>
            <td align="right" valign="middle" style="padding-left:16px;">
              <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 16px;display:inline-block;">
                <span style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Cyber<span style="color:#f87171;">teks</span>IT</span>
              </div>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:36px 40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 20px;font-size:15px;color:#475569;">You're applying to the <strong style="color:#1e293b;">CyberteksIT Skills Development Program</strong>.</p>
          <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.7;">Use the verification code below to confirm your email address <strong>${email}</strong>. The code expires in <strong>10 minutes</strong>.</p>
          <div style="background:#f0f4ff;border:2px dashed #c7d2fe;border-radius:16px;padding:28px 40px;text-align:center;margin-bottom:28px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6366f1;">Your verification code</p>
            <p style="margin:0;font-size:42px;font-weight:900;color:#102a83;letter-spacing:0.25em;">${otp}</p>
          </div>
          <p style="margin:0;font-size:13px;color:#94a3b8;">If you did not request this, please ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;">
          <p style="margin:0;font-size:13px;color:#64748b;">© ${new Date().getFullYear()} CyberteksIT · Plot 722 Namuli Rd, Bukoto, Kampala — Uganda</p>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;"><a href="${CLIENT_URL}" style="color:#102a83;text-decoration:none;">cyberteks-it.com</a></p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── POST /api/apply/send-otp (public) ────────────────────────────────────────
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email || !z.string().email().safeParse(email).success) {
      res.status(400).json({ error: 'Valid email is required' });
      return;
    }

    // Rate-limit: block if a valid (non-expired) OTP already exists
    const existing = otpStore.get(email.toLowerCase());
    if (existing && existing.expiresAt > Date.now()) {
      const secsLeft = Math.ceil((existing.expiresAt - Date.now()) / 1000);
      res.status(429).json({ error: `Please wait ${secsLeft}s before requesting a new code.` });
      return;
    }

    const otp = generateOtp();
    otpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000, verified: false });

    await sendEmail({
      to:      email,
      subject: `${otp} is your CyberteksIT verification code`,
      html:    otpEmailHtml(email, otp),
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[apply/send-otp]', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// ── POST /api/apply/verify-otp (public) ──────────────────────────────────────
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string };
    if (!email || !otp) {
      res.status(400).json({ error: 'Email and code are required' });
      return;
    }

    const entry = otpStore.get(email.toLowerCase());
    if (!entry) {
      res.status(400).json({ error: 'No verification code found. Please request a new one.' });
      return;
    }
    if (entry.expiresAt < Date.now()) {
      otpStore.delete(email.toLowerCase());
      res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      return;
    }
    if (entry.otp !== otp.trim()) {
      res.status(400).json({ error: 'Invalid verification code.' });
      return;
    }

    entry.verified = true;
    res.json({ success: true });
  } catch (err) {
    console.error('[apply/verify-otp]', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

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
  paymentProofUrl:     z.string().url().optional(),
  paymentProofName:    z.string().optional(),
  totalAmountUGX:      z.number().int().min(0).optional(),
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

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pwd = '';
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  // ensure at least one upper, one digit
  pwd = 'Cy' + pwd + Math.floor(10 + Math.random() * 90);
  return pwd;
}

// ── POST /api/apply (public) ─────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = applySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid form data', details: result.error.flatten() });
      return;
    }

    const data = result.data;

    // Require verified OTP for this email
    const otpEntry = otpStore.get(data.email.toLowerCase());
    if (!otpEntry || !otpEntry.verified) {
      res.status(400).json({ error: 'Email not verified. Please verify your email before submitting.' });
      return;
    }
    otpStore.delete(data.email.toLowerCase());

    // Generate default password at application time so admin can see it
    const tempPassword = generateTempPassword();

    // Save application to DB
    const application = await prisma.application.create({
      data: {
        fullName:          data.fullName,
        email:             data.email,
        phone:             data.phoneNumber,
        dateOfBirth:       data.dateOfBirth,
        gender:            data.gender,
        cityCountry:       data.cityCountry,
        educationLevel:    data.educationLevel,
        educationOther:    data.educationOther,
        currentOccupation: data.currentOccupation,
        programs:          data.programs,
        programOther:      data.programOther,
        motivation:        data.motivation,
        careerGoals:       data.careerGoals,
        hoursPerWeek:      data.hoursPerWeek,
        hasComputer:       data.hasComputer,
        deviceTypes:       data.deviceTypes ?? [],
        hasInternet:       data.hasInternet,
        referralSource:    data.referralSource,
        socialHandle:      data.socialHandle,
        tempPassword:      tempPassword,
        paymentProofUrl:   data.paymentProofUrl,
        paymentProofName:  data.paymentProofName,
        totalAmountUGX:    data.totalAmountUGX,
        status:            'PENDING',
      },
    });

    // Email admin (non-blocking)
    sendEmail({
      to:      process.env.ADMIN_EMAIL ?? 'info@cyberteks-it.com',
      subject: `New Application — ${data.fullName}`,
      html:    adminNewApplicationEmail({ ...data, paymentProofUrl: data.paymentProofUrl, totalAmountUGX: data.totalAmountUGX }),
    }).catch(err => console.error('[apply] admin email failed:', err));

    // Confirmation email to applicant (non-blocking)
    sendEmail({
      to:      data.email,
      subject: 'Application Received — CyberteksIT Skills Development Program',
      html:    applicantConfirmationEmail({ fullName: data.fullName, email: data.email, programs: data.programs }),
    }).catch(err => console.error('[apply] applicant email failed:', err));

    // Notify admins in-app
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

    res.json({ success: true, applicationId: application.id });
  } catch (err) {
    console.error('[apply POST]', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// ── GET /api/apply (admin only) ───────────────────────────────────────────────
router.get('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (search?.trim()) {
      where.OR = [
        { fullName: { contains: search.trim(), mode: 'insensitive' } },
        { email:    { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        programs: true,
        educationLevel: true,
        hoursPerWeek: true,
        status: true,
        motivation: true,
        careerGoals: true,
        cityCountry: true,
        gender: true,
        dateOfBirth: true,
        currentOccupation: true,
        hasComputer: true,
        hasInternet: true,
        reviewNotes: true,
        reviewedAt: true,
        createdAt: true,
        userId: true,
        tempPassword: true,
        paymentProofUrl: true,
        paymentProofName: true,
        totalAmountUGX: true,
      },
    });

    // Status counts
    const counts = await prisma.application.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const statusCounts: Record<string, number> = {};
    for (const c of counts) statusCounts[c.status] = c._count.status;

    res.json({ applications, statusCounts });
  } catch (err) {
    console.error('[apply GET]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /api/apply/:id/status (admin only) ─────────────────────────────────
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, reviewNotes } = req.body as { status: string; reviewNotes?: string };

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    let userId = application.userId;

    if (status === 'ACCEPTED' && !application.userId) {
      // Create or reactivate student account
      const existing = await prisma.user.findUnique({ where: { email: application.email } });

      let tempPassword: string | null = null;

      if (existing) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { isActive: true, role: 'STUDENT' },
        });
        userId = existing.id;
      } else {
        const rawPassword: string = (application as any).tempPassword ?? generateTempPassword();
        tempPassword = rawPassword;
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        const newUser = await prisma.user.create({
          data: {
            name:          application.fullName,
            email:         application.email,
            phone:         application.phone,
            password:      hashedPassword,
            role:          'STUDENT',
            isActive:      true,
            emailVerified: new Date(),
          },
        });
        userId = newUser.id;

        // Send welcome email with credentials (non-blocking)
        sendEmail({
          to:      application.email,
          subject: '🎉 You\'re In — Welcome to Cyberteks-IT LMS!',
          html:    applicantAcceptedEmail({
            fullName:        application.fullName,
            email:           application.email,
            tempPassword:    tempPassword!,
            programs:        application.programs,
            reviewNotes:     reviewNotes,
            paymentProofUrl: (application as any).paymentProofUrl ?? undefined,
            totalAmountUGX:  (application as any).totalAmountUGX ?? undefined,
          }),
        }).catch(err => console.error('[apply] welcome email failed:', err));
      }

      // ── Auto-enroll in courses (runs for both new AND existing users) ────────
      const programToCategoryKeywords: Record<string, string[]> = {
        'Web Development':                           ['development', 'web'],
        'Cybersecurity':                             ['security', 'cyber'],
        'IT Support & Networking':                   ['networking', 'network', 'it support'],
        'Data Analysis':                             ['data'],
        'Artificial Intelligence & Machine Learning': ['ai', 'machine learning', 'artificial'],
        'Graphic Design':                            ['design', 'graphic'],
        'Digital Marketing':                         ['marketing', 'digital'],
        'Free Bootcamp: Python Programming':         ['python'],
        // new programs
        'Software Development (Full Stack)':         ['development', 'web', 'full stack'],
        'Programming (Any Language)':                ['python', 'programming'],
        'Cloud & DevOps':                            ['cloud', 'devops'],
        'Cloud with Azure / AWS (Enterprise)':       ['cloud', 'azure', 'aws'],
        'Business & Digital Skills':                 ['marketing', 'digital', 'business'],
        'Automation & No-Code':                      ['automation'],
        'Freelancing & Online Income':               ['freelancing'],
        'Web Design':                                ['development', 'web'],
        'Cyber Security':                            ['security', 'cyber'],
        'Data Analytics':                            ['data'],
        'Computer Networking':                       ['networking', 'network'],
        'AI & Robotics':                             ['ai', 'machine learning'],
      };

      const keywords = application.programs.flatMap(
        (p: string) => programToCategoryKeywords[p] ?? [p.toLowerCase()]
      );

      const courseIdsToEnroll = new Set<string>();

      if (keywords.length > 0) {
        const allCourses = await prisma.course.findMany({
          where: { status: 'PUBLISHED' },
          select: { id: true, category: true, title: true },
        });
        allCourses
          .filter((c: { id: string; category: string | null; title: string }) => {
            const hay = `${c.category ?? ''} ${c.title}`.toLowerCase();
            return keywords.some((kw: string) => hay.includes(kw));
          })
          .forEach((c: { id: string }) => courseIdsToEnroll.add(c.id));
      }

      // Direct lookup for free bootcamp
      const hasBootcamp = application.programs.some(
        (p: string) => p.includes('Free Bootcamp') || p.toLowerCase().includes('python')
      );
      if (hasBootcamp) {
        const pythonCourse = await prisma.course.findFirst({
          where: { title: { contains: 'Python', mode: 'insensitive' }, status: 'PUBLISHED' },
          select: { id: true },
        });
        if (pythonCourse) courseIdsToEnroll.add(pythonCourse.id);
      }

      if (courseIdsToEnroll.size > 0 && userId) {
        const existing = await prisma.enrollment.findMany({
          where: { userId: userId as string, courseId: { in: [...courseIdsToEnroll] } },
          select: { courseId: true },
        });
        const existingSet = new Set(existing.map((e: { courseId: string }) => e.courseId));
        const newEnrollments = [...courseIdsToEnroll].filter(id => !existingSet.has(id));
        if (newEnrollments.length > 0) {
          await prisma.enrollment.createMany({
            data: newEnrollments.map((courseId: string) => ({
              userId:  userId as string,
              courseId,
              status:  'ACTIVE',
            })),
          });
        }
      }

      // In-app notification
      if (userId) {
        await prisma.notification.create({
          data: {
            userId:  userId as string,
            title:   'Welcome to CyberteksIT LMS!',
            body:    'Your application has been accepted. Your courses are ready — check your dashboard.',
            type:    'SUCCESS',
            isRead:  false,
            link:    '/student/dashboard',
          },
        });
      }

      // ── Create invoice as PENDING_REVIEW — admin will approve after verifying payment ──
      const amountPaid: number = Number((application as any).totalAmountUGX ?? 0);
      const invoiceNo = `CT-${Date.now().toString().slice(-8)}`;

      await prisma.invoice.create({
        data: {
          invoiceNo,
          amount:          amountPaid,
          currency:        'UGX',
          status:          'PENDING_REVIEW',
          type:            'COURSE_PAYMENT',
          notes:           `Skills Development Programme: ${application.programs.join(', ')}`,
          userId:          userId as string | undefined,
          paymentProofUrl: (application as any).paymentProofUrl || null,
        },
      });

      // Notify admins to review the payment proof
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN', isActive: true },
        select: { id: true },
      });
      if (adminUsers.length > 0) {
        await prisma.notification.createMany({
          data: adminUsers.map((admin: { id: string }) => ({
            userId: admin.id,
            title:  `Payment Pending Review — ${application.fullName}`,
            body:   `Application accepted. Please verify the payment proof for ${application.fullName} on the Invoices page.`,
            type:   'INFO' as const,
            isRead: false,
            link:   '/admin/invoices',
          })),
        });
      }
    }

    if (status === 'REJECTED' && application.email) {
      sendEmail({
        to:      application.email,
        subject: 'Update on Your CyberteksIT Application',
        html:    applicantRejectedEmail({ fullName: application.fullName, reviewNotes }),
      }).catch(err => console.error('[apply] rejection email failed:', err));
    }

    // Update application
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: status as any,
        reviewNotes: reviewNotes ?? application.reviewNotes,
        reviewedById: req.user!.id,
        reviewedAt:   new Date(),
        ...(userId ? { userId } : {}),
      },
    });

    res.json({ application: updated });
  } catch (err) {
    console.error('[apply PATCH status]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/apply/backfill-bootcamp (admin only) ───────────────────────────
// Enrolls all existing accepted free-bootcamp applicants in the Python course.
router.post('/backfill-bootcamp', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const pythonCourse = await prisma.course.findFirst({
      where: { title: { contains: 'Python', mode: 'insensitive' }, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!pythonCourse) {
      res.status(404).json({ error: 'Python Programming course not found or not published.' });
      return;
    }

    // All accepted applications that selected a free bootcamp program and have a linked user
    const applications = await prisma.application.findMany({
      where: {
        status: 'ACCEPTED',
        userId: { not: null },
      },
      select: { userId: true, programs: true },
    });

    const bootcampUserIds = applications
      .filter((a: { userId: string | null; programs: string[] }) =>
        a.programs.some((p: string) => p.includes('Free Bootcamp') || p.toLowerCase().includes('python'))
      )
      .map((a: { userId: string | null }) => a.userId as string);

    if (bootcampUserIds.length === 0) {
      res.json({ enrolled: 0, message: 'No matching accepted applications found.' });
      return;
    }

    // Filter out users already enrolled (MongoDB doesn't support skipDuplicates)
    const alreadyEnrolled = await prisma.enrollment.findMany({
      where: { courseId: pythonCourse.id, userId: { in: bootcampUserIds } },
      select: { userId: true },
    });
    const alreadySet = new Set(alreadyEnrolled.map((e: { userId: string }) => e.userId));
    const toEnroll = bootcampUserIds.filter((id: string) => !alreadySet.has(id));

    if (toEnroll.length === 0) {
      res.json({ enrolled: 0, message: 'All matching students are already enrolled.' });
      return;
    }

    const result = await prisma.enrollment.createMany({
      data: toEnroll.map((userId: string) => ({
        userId,
        courseId: pythonCourse.id,
        status:   'ACTIVE',
      })),
    });

    res.json({ enrolled: result.count, message: `Enrolled ${result.count} student(s) in Python Programming.` });
  } catch (err) {
    console.error('[apply backfill-bootcamp]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
