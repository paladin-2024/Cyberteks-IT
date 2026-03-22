import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// GET /api/messages/conversations — list current user's conversations
router.get('/conversations', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const participants = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { conversation: false },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    // For each conversation, fetch the other participant's user info
    const conversations = await Promise.all(
      participants.map(async (p) => {
        const otherParticipantId = p.conversation.participants
          .find((cp) => cp.userId !== userId)?.userId;

        const otherUser = otherParticipantId
          ? await prisma.user.findUnique({
              where: { id: otherParticipantId },
              select: { id: true, name: true, image: true, role: true },
            })
          : null;

        const lastMessage = p.conversation.messages[0] ?? null;

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: p.conversationId,
            receiverId: userId,
            status: { in: ['SENT', 'DELIVERED'] },
          },
        });

        return {
          id: p.conversationId,
          otherUser,
          lastMessage: lastMessage
            ? { content: lastMessage.content, createdAt: lastMessage.createdAt }
            : null,
          unreadCount,
          updatedAt: p.conversation.updatedAt,
        };
      })
    );

    res.json({ conversations });
  } catch (err) {
    console.error('[messages/conversations]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/conversations/:id — get messages in a conversation
router.get('/conversations/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId },
    });
    if (!participant) {
      res.status(403).json({ error: 'Not a participant' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark received messages as READ
    await prisma.message.updateMany({
      where: { conversationId: id, receiverId: userId, status: { in: ['SENT', 'DELIVERED'] } },
      data: { status: 'READ' },
    });

    res.json({ messages });
  } catch (err) {
    console.error('[messages/conversations/:id]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages/conversations — start a new conversation
router.post('/conversations', async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      res.status(400).json({ error: 'receiverId is required' });
      return;
    }
    if (receiverId === senderId) {
      res.status(400).json({ error: 'Cannot message yourself' });
      return;
    }

    // Check if conversation already exists between the two users
    const existing = await prisma.conversationParticipant.findFirst({
      where: {
        userId: senderId,
        conversation: {
          participants: { some: { userId: receiverId } },
        },
      },
    });

    if (existing) {
      res.json({ conversationId: existing.conversationId });
      return;
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: senderId }, { userId: receiverId }],
        },
      },
    });

    res.status(201).json({ conversationId: conversation.id });
  } catch (err) {
    console.error('[messages/conversations POST]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages/conversations/:id/messages — send a message
router.post('/conversations/:id/messages', async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.id;
    const conversationId = req.params.id as string;
    const { content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    // Verify sender is a participant
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId },
    });
    const isParticipant = participants.some((p) => p.userId === senderId);
    if (!isParticipant) {
      res.status(403).json({ error: 'Not a participant' });
      return;
    }

    const receiverId = participants.find((p) => p.userId !== senderId)!.userId;

    const message = await prisma.message.create({
      data: { content: content.trim(), senderId, receiverId, conversationId },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error('[messages/send]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/users — list users you can message
// STUDENT  → sees only TEACHERs
// TEACHER  → sees only STUDENTs
// ADMIN    → sees all other active users (teachers + students)
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { role, id } = req.user!;

    const targetRole =
      role === 'STUDENT' ? 'TEACHER' : role === 'TEACHER' ? 'STUDENT' : undefined;

    const users = await prisma.user.findMany({
      where: {
        id: { not: id },
        isActive: true,
        ...(targetRole ? { role: targetRole as any } : {}),
      },
      select: { id: true, name: true, image: true, role: true },
      orderBy: { name: 'asc' },
    });

    res.json({ users });
  } catch (err) {
    console.error('[messages/users]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/unread-count — total unread messages for the current user
router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const unreadMessages = await prisma.message.count({
      where: {
        receiverId: userId,
        status: { in: ['SENT', 'DELIVERED'] },
      },
    });

    res.json({ unreadMessages });
  } catch (err) {
    console.error('[messages/unread-count]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
