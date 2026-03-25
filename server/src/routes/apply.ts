import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

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
        status:            'PENDING',
      },
    });

    // Email admin (non-blocking — don't fail the submission if email fails)
    sendEmail({
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
            <p style="margin-top: 16px;"><a href="${process.env.CLIENT_URL ?? 'http://localhost:5173'}/lms/admin/applications" style="background:#102a83;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Review Application</a></p>
          </div>
        </div>
      `,
    }).catch(err => console.error('[apply] admin email failed:', err));

    // Confirmation email to applicant (non-blocking)
    sendEmail({
      to:      data.email,
      subject: 'Application Received — CyberteksIT Skills Development Program',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #102a83; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Application Received!</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${esc(data.fullName)},</p>
            <p>Thank you for applying to the CyberteksIT Skills Development Program. Our team will review your application within <strong>2–3 business days</strong>.</p>
            <p>We will contact you at <strong>${esc(data.email)}</strong> with next steps.</p>
            <p>Your programs: <strong>${data.programs.map(p => esc(p)).join(', ')}</strong></p>
            <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Team</strong></p>
          </div>
        </div>
      `,
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
          subject: 'Welcome to CyberteksIT LMS — Your Account is Ready!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #102a83; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Congratulations, ${esc(application.fullName)}!</h2>
              </div>
              <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <p>Your application to the <strong>CyberteksIT Skills Development Program</strong> has been <strong style="color: #16a34a;">accepted</strong>!</p>
                <p>Your student account has been created. Use the credentials below to log in:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><b>Login URL:</b> <a href="${process.env.CLIENT_URL ?? 'http://localhost:5173'}/login">${process.env.CLIENT_URL ?? 'http://localhost:5173'}/login</a></p>
                  <p style="margin: 4px 0;"><b>Email:</b> ${esc(application.email)}</p>
                  <p style="margin: 4px 0;"><b>Temporary Password:</b> <code style="background:#e2e8f0;padding:2px 6px;border-radius:4px;">${tempPassword}</code></p>
                </div>
                <p style="color: #dc2626;"><strong>Please change your password immediately after your first login.</strong></p>
                ${reviewNotes ? `<p><b>Note from the team:</b> ${esc(reviewNotes)}</p>` : ''}
                <p>Programs enrolled: <strong>${application.programs.map((p: string) => esc(p)).join(', ')}</strong></p>
                <p style="margin-top: 24px;">
                  <a href="${process.env.CLIENT_URL ?? 'http://localhost:5173'}/login" style="background:#102a83;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Login to LMS</a>
                </p>
                <p style="margin-top: 24px;">Welcome aboard!<br/><strong>The CyberteksIT Team</strong></p>
              </div>
            </div>
          `,
        }).catch(err => console.error('[apply] welcome email failed:', err));
      }

      // ── Auto-enroll in courses (runs for both new AND existing users) ────────
      const programToCategoryKeywords: Record<string, string[]> = {
        'Web Development':                          ['development', 'web'],
        'Cybersecurity':                            ['security', 'cyber'],
        'IT Support & Networking':                  ['networking', 'network', 'it support'],
        'Data Analysis':                            ['data'],
        'Artificial Intelligence & Machine Learning': ['ai', 'machine learning', 'artificial'],
        'Graphic Design':                           ['design', 'graphic'],
        'Digital Marketing':                        ['marketing', 'digital'],
        'Free Bootcamp: Python Programming':        ['python'],
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
    }

    if (status === 'REJECTED' && application.email) {
      sendEmail({
        to:      application.email,
        subject: 'Update on Your CyberteksIT Application',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #102a83; color: white; padding: 20px 24px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">Application Update</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${esc(application.fullName)},</p>
              <p>Thank you for your interest in the CyberteksIT Skills Development Program. After careful review, we are unable to accept your application at this time.</p>
              ${reviewNotes ? `<p><b>Feedback:</b> ${esc(reviewNotes)}</p>` : ''}
              <p>We encourage you to apply again in the future as we open new cohorts.</p>
              <p style="margin-top: 24px;">Best regards,<br/><strong>The CyberteksIT Team</strong></p>
            </div>
          </div>
        `,
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
