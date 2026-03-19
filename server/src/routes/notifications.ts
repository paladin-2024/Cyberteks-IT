import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

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

export default router;
