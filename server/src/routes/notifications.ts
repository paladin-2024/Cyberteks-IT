import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/notifications
// Returns notifications for the current user: unread OR created within last 2 days
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) ?? '50', 10) || 50, 50);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user!.id,
        OR: [
          { isRead: false },
          { createdAt: { gte: twoDaysAgo } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('[notifications/get]', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications
// Body: { ids: string[] } to mark specific notifications as read
//       { all: true }    to mark all unread notifications as read
router.patch('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body as { ids?: string[]; all?: boolean };

    if (body.all) {
      await prisma.notification.updateMany({
        where: { userId: req.user!.id, isRead: false },
        data: { isRead: true },
      });
      res.json({ success: true });
      return;
    }

    if (body.ids && body.ids.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: body.ids }, userId: req.user!.id },
        data: { isRead: true },
      });
      res.json({ success: true });
      return;
    }

    res.status(400).json({ error: 'Provide ids or all:true' });
  } catch (err) {
    console.error('[notifications/patch]', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// POST /api/notifications/broadcast (admin only)
// Body: { title, body, type, target: 'ALL'|'STUDENTS'|'TEACHERS'|userId }
router.post('/broadcast', requireAuth, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, type, target } = req.body as {
      title: string;
      body: string;
      type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
      target: string;
    };

    if (!title?.trim() || !body?.trim()) {
      res.status(400).json({ error: 'Title and body are required' });
      return;
    }

    const validTypes = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid notification type' });
      return;
    }

    // Resolve target users
    let userIds: string[] = [];
    if (target === 'ALL') {
      const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
      userIds = users.map((u: { id: string }) => u.id);
    } else if (target === 'STUDENTS') {
      const users = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true }, select: { id: true } });
      userIds = users.map((u: { id: string }) => u.id);
    } else if (target === 'TEACHERS') {
      const users = await prisma.user.findMany({ where: { role: 'TEACHER', isActive: true }, select: { id: true } });
      userIds = users.map((u: { id: string }) => u.id);
    } else {
      // specific user id
      const user = await prisma.user.findUnique({ where: { id: target }, select: { id: true } });
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      userIds = [user.id];
    }

    if (userIds.length === 0) {
      res.status(400).json({ error: 'No active users found for the selected target' });
      return;
    }

    await prisma.notification.createMany({
      data: userIds.map((userId: string) => ({
        userId,
        title: title.trim(),
        body: body.trim(),
        type,
        isRead: false,
        link: null,
      })),
    });

    res.json({ success: true, sent: userIds.length });
  } catch (err) {
    console.error('[notifications/broadcast]', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

export default router;
