import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET /api/courses — list all courses with teacher info
router.get('/', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true, title: true, slug: true, description: true, coverImage: true,
        price: true, currency: true, status: true, duration: true, level: true,
        category: true, tags: true, teacherId: true, createdAt: true, updatedAt: true,
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch teachers separately to avoid crash on orphaned teacherId references
    const teacherIds = [...new Set(courses.map((c) => c.teacherId))];
    const teachers = await prisma.user.findMany({
      where: { id: { in: teacherIds } },
      select: { id: true, name: true, email: true, image: true },
    });
    const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t]));

    const result = courses.map((c) => ({
      ...c,
      teacher: teacherMap[c.teacherId] ?? { id: c.teacherId, name: 'Unknown', email: '', image: null },
    }));

    res.json({ courses: result });
  } catch (err) {
    console.error('[courses GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/courses — create a course
router.post('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      coverImage,
      price,
      currency,
      status,
      duration,
      level,
      category,
      tags,
      teacherId,
    } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: 'title is required' });
      return;
    }
    if (!description?.trim()) {
      res.status(400).json({ error: 'description is required' });
      return;
    }
    if (!teacherId) {
      res.status(400).json({ error: 'teacherId is required' });
      return;
    }

    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.role !== 'TEACHER') {
      res.status(400).json({ error: 'teacherId must reference an existing TEACHER user' });
      return;
    }

    // Ensure slug uniqueness
    let slug = toSlug(title);
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        coverImage: coverImage ?? null,
        price: price ?? 0,
        currency: currency ?? 'UGX',
        status: status ?? 'DRAFT',
        duration: duration ?? null,
        level: level ?? null,
        category: category ?? null,
        tags: tags ?? [],
        teacherId,
      },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    res.status(201).json({ course });
  } catch (err) {
    console.error('[courses POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/courses/:id — update a course
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const {
      title,
      description,
      coverImage,
      price,
      currency,
      status,
      duration,
      level,
      category,
      tags,
    } = req.body;

    // Re-generate slug only when title changes
    let slug: string | undefined;
    if (title && title.trim() !== existing.title) {
      slug = toSlug(title.trim());
      const conflict = await prisma.course.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const isBeingPublished = status === 'PUBLISHED' && existing.status !== 'PUBLISHED';

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined       && { title: title.trim() }),
        ...(slug !== undefined        && { slug }),
        ...(description !== undefined && { description: description.trim() }),
        ...(coverImage !== undefined  && { coverImage }),
        ...(price !== undefined       && { price }),
        ...(currency !== undefined    && { currency }),
        ...(status !== undefined      && { status }),
        ...(duration !== undefined    && { duration }),
        ...(level !== undefined       && { level }),
        ...(category !== undefined    && { category }),
        ...(tags !== undefined        && { tags }),
      },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    // ── Auto-newsletter on publish ────────────────────────────────────────────
    // When a course transitions to PUBLISHED, notify all newsletter subscribers.
    if (isBeingPublished) {
      (async () => {
        const subscribers = await prisma.newsletterSubscriber.findMany({ select: { email: true } });
        if (subscribers.length === 0) return;

        const CLIENT_URL = process.env.CLIENT_URL ?? 'https://cyberteks-it.com';
        const fmtPrice   = (n: number) => `UGX ${n.toLocaleString('en-UG')}`;
        const coursePrice = course.price > 0 ? fmtPrice(course.price) : 'FREE';
        const courseDuration = course.duration ?? '';

        const html = `<!DOCTYPE html>
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
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);">New Course Available</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">${course.title}</h1>
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
        <td style="background:#E11D48;padding:8px 40px;">
          <span style="color:#fff;font-size:13px;font-weight:700;">
            ${coursePrice}${courseDuration ? ` &nbsp;·&nbsp; ${courseDuration}` : ''}${course.level ? ` &nbsp;·&nbsp; ${course.level}` : ''}
          </span>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:36px 40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 20px;font-size:15px;color:#475569;">
            A new course has just launched at <strong style="color:#1e293b;">CyberteksIT</strong> — and it's now open for enrolment.
          </p>
          ${course.description ? `
          <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.7;background:#f8fafc;border-left:3px solid #102a83;padding:16px 20px;border-radius:0 8px 8px 0;">
            ${course.description}
          </p>` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              ${coursePrice !== 'FREE' ? `<td style="background:#f0f4ff;border-radius:10px;padding:16px 20px;text-align:center;width:48%;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6366f1;">Course Fee</p>
                <p style="margin:0;font-size:20px;font-weight:900;color:#102a83;">${coursePrice}</p>
              </td>` : '<td style="background:#f0fdf4;border-radius:10px;padding:16px 20px;text-align:center;width:48%;"><p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#16a34a;">Course Fee</p><p style="margin:0;font-size:20px;font-weight:900;color:#15803d;">FREE</p></td>'}
              ${courseDuration ? `<td style="width:4%;"></td><td style="background:#fef9f0;border-radius:10px;padding:16px 20px;text-align:center;width:48%;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#d97706;">Duration</p>
                <p style="margin:0;font-size:20px;font-weight:900;color:#92400e;">${courseDuration}</p>
              </td>` : ''}
            </tr>
          </table>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${CLIENT_URL}/services/ict-skilling" style="display:inline-block;background:#E11D48;color:#ffffff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;text-decoration:none;">
              View Course &amp; Enrol Now
            </a>
          </div>
          <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
            Questions? Reply to this email or contact us at <a href="mailto:info@cyberteks-it.com" style="color:#102a83;text-decoration:none;">info@cyberteks-it.com</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            You're receiving this because you subscribed to CyberteksIT updates.<br/>
            © ${new Date().getFullYear()} CyberteksIT · Kampala, Uganda &nbsp;|&nbsp;
            <a href="${CLIENT_URL}" style="color:#102a83;text-decoration:none;">cyberteks-it.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

        for (const { email } of subscribers) {
          sendEmail({
            to:      email,
            subject: `New Course: ${course.title} — Now Open for Enrolment`,
            html,
          }).catch(() => {});
        }

        console.log(`[courses] Published "${course.title}" — newsletter sent to ${subscribers.length} subscribers`);
      })().catch(err => console.error('[courses] newsletter broadcast failed:', err));
    }

    res.json({ course });
  } catch (err) {
    console.error('[courses PATCH /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/courses/:id — delete a course
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    await prisma.course.delete({ where: { id } });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('[courses DELETE /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/courses/:id/assign — assign a teacher to a course
router.patch(
  '/:id/assign',
  requireAuth,
  requireRole('ADMIN'),
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const { teacherId } = req.body;

      if (!teacherId) {
        res.status(400).json({ error: 'teacherId is required' });
        return;
      }

      const course = await prisma.course.findUnique({ where: { id } });
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
      if (!teacher || teacher.role !== 'TEACHER') {
        res.status(400).json({ error: 'teacherId must reference an existing TEACHER user' });
        return;
      }

      const updated = await prisma.course.update({
        where: { id },
        data: { teacherId },
        include: {
          teacher: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { enrollments: true, sections: true } },
        },
      });

      res.json({ course: updated });
    } catch (err) {
      console.error('[courses PATCH /:id/assign]', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ── Teacher routes ────────────────────────────────────────────────────────────

// GET /api/courses/my — teacher: list their assigned courses
// IMPORTANT: /my must come BEFORE /:id so Express doesn't treat "my" as an id
router.get('/my', requireAuth, requireRole('TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.id;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ courses });
  } catch (err) {
    console.error('[courses GET /my]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/courses/:id — full course detail with sections + lessons
// Teachers see their own courses, students see enrolled courses, admins see all
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: { select: { enrollments: true, sections: true } },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Role-based access check
    if (user.role === 'TEACHER' && course.teacherId !== user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (user.role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: id } },
      });
      if (!enrollment) {
        res.status(403).json({ error: 'Not enrolled in this course' });
        return;
      }
      // Attach enrollment info for student
      const progressRecords = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
        select: { lessonId: true, completed: true, watchedSecs: true },
      });
      const progressMap = Object.fromEntries(progressRecords.map((p) => [p.lessonId, p]));

      // Fetch curriculum weeks/topics so students see teacher-added content.
      // Isolated try/catch so a failure here doesn't break the whole course load.
      let curriculumWeeks: object[] = [];
      try {
        curriculumWeeks = await prisma.curriculumWeek.findMany({
          where: { courseId: id },
          include: { topics: { orderBy: { order: 'asc' } } },
          orderBy: { weekNumber: 'asc' },
        });
      } catch (cwErr) {
        console.error('[courses GET /:id] curriculum weeks fetch failed:', cwErr);
      }

      res.json({ course, enrollment, progressMap, curriculumWeeks });
      return;
    }

    res.json({ course });
  } catch (err) {
    console.error('[courses GET /:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
