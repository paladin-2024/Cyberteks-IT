import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/users — list all users (admin only)
// Supports ?search=string and ?role=ADMIN|TEACHER|STUDENT|ALL
router.get('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { search, role } = req.query as { search?: string; role?: string };

    const where: Record<string, unknown> = {};
    if (role && role !== 'ALL') where.role = role;
    if (search?.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const raw = await prisma.user.findMany({
      where,
      include: {
        _count: { select: { enrollments: true, teacherCourses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Strip password before sending
    const users = raw.map(({ password: _pw, ...u }) => u);

    res.json({ users });
  } catch (err) {
    console.error('[users GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users — create a user (admin only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body as {
      name: string; email: string; password: string;
      role?: string; phone?: string;
    };

    if (!name?.trim())     { res.status(400).json({ error: 'name is required' });     return; }
    if (!email?.trim())    { res.status(400).json({ error: 'email is required' });    return; }
    if (!password?.trim()) { res.status(400).json({ error: 'password is required' }); return; }
    if (password.length < 6) { res.status(400).json({ error: 'password must be at least 6 characters' }); return; }

    const allowedRoles = ['ADMIN', 'TEACHER', 'STUDENT'];
    const userRole = (role && allowedRoles.includes(role)) ? role : 'STUDENT';

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      res.status(409).json({ error: 'A user with that email already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name:          name.trim(),
        email:         email.trim().toLowerCase(),
        password:      hashed,
        role:          userRole as any,
        phone:         phone?.trim() || null,
        isActive:      true,
        emailVerified: new Date(),
      },
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, phone: true, image: true, createdAt: true,
        _count: { select: { enrollments: true, teacherCourses: true } },
      },
    });

    res.status(201).json({ user });
  } catch (err) {
    console.error('[users POST /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/:id/status — toggle isActive (admin only)
router.patch('/:id/status', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body as { isActive: boolean };

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    });

    res.json({ user: updated });
  } catch (err) {
    console.error('[users PATCH /:id/status]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
