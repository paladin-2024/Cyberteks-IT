import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const bootcampSchema = z.object({
  title:         z.string().min(2),
  description:   z.string().min(10),
  bannerImage:   z.string().optional(),
  expiresAt:     z.string().min(1),
  isActive:      z.boolean().optional(),
  groupChatLink: z.string().optional(),
});

// ── GET /api/bootcamps — public, active + not expired ────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const bootcamps = await prisma.freeBootcamp.findMany({
      where: { isActive: true, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    // Attach the matching free course ID to each bootcamp (for self-enroll)
    const enriched = await Promise.all(bootcamps.map(async (bc) => {
      // Extract keywords from bootcamp title (e.g. "Python Programming Bootcamp" → "Python")
      const words = bc.title.split(/\s+/).filter(w => w.length > 3 && !['bootcamp', 'programming', 'free'].includes(w.toLowerCase()));
      if (words.length === 0) return { ...bc, courseId: null };
      const course = await prisma.course.findFirst({
        where: { status: 'PUBLISHED', price: 0, title: { contains: words[0], mode: 'insensitive' } },
        select: { id: true },
      });
      return { ...bc, courseId: course?.id ?? null };
    }));

    res.json({ bootcamps: enriched });
  } catch (err) {
    console.error('[bootcamps GET]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/bootcamps/all — admin only, all records ─────────────────────────
router.get('/all', requireAuth, requireRole('ADMIN'), async (_req: AuthRequest, res: Response) => {
  try {
    const bootcamps = await prisma.freeBootcamp.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ bootcamps });
  } catch (err) {
    console.error('[bootcamps GET all]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/bootcamps — admin only ─────────────────────────────────────────
router.post('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const result = bootcampSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid data', details: result.error.flatten() });
      return;
    }
    const d = result.data;
    const bootcamp = await prisma.freeBootcamp.create({
      data: {
        title:         d.title,
        description:   d.description,
        bannerImage:   d.bannerImage || undefined,
        expiresAt:     new Date(d.expiresAt),
        isActive:      d.isActive ?? true,
        groupChatLink: d.groupChatLink || undefined,
      },
    });
    res.json({ bootcamp });
  } catch (err) {
    console.error('[bootcamps POST]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /api/bootcamps/:id — admin only ────────────────────────────────────
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const result = bootcampSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid data' });
      return;
    }
    const d = result.data;
    const bootcamp = await prisma.freeBootcamp.update({
      where: { id: req.params.id as string },
      data: {
        ...(d.title         !== undefined && { title: d.title }),
        ...(d.description   !== undefined && { description: d.description }),
        ...(d.bannerImage   !== undefined && { bannerImage: d.bannerImage || null }),
        ...(d.expiresAt     !== undefined && { expiresAt: new Date(d.expiresAt) }),
        ...(d.isActive      !== undefined && { isActive: d.isActive }),
        ...(d.groupChatLink !== undefined && { groupChatLink: d.groupChatLink || null }),
      },
    });
    res.json({ bootcamp });
  } catch (err) {
    console.error('[bootcamps PATCH]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /api/bootcamps/:id — admin only ───────────────────────────────────
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.freeBootcamp.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (err) {
    console.error('[bootcamps DELETE]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
