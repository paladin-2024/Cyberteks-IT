import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// GET /api/profile — return the authenticated user's full profile (no password)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error('[profile GET /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/profile — update name, phone, bio, image
router.patch('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, phone, bio, image } = req.body;

    if (name !== undefined && name.trim().length < 2) {
      res.status(400).json({ error: 'name must be at least 2 characters' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name  !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone }),
        ...(bio   !== undefined && { bio }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        phone: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (err) {
    console.error('[profile PATCH /]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/profile/password — change password
router.patch('/password', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'currentPassword and newPassword are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'newPassword must be at least 8 characters' });
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      res.status(400).json({ error: 'newPassword must contain at least one uppercase letter' });
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      res.status(400).json({ error: 'newPassword must contain at least one digit' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.password) {
      res.status(400).json({ error: 'No password set for this account' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'currentPassword is incorrect' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[profile PATCH /password]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
