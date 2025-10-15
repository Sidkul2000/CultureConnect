import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma';
import { getIO } from '../services/socket.service';

const router = express.Router();

// Get all conversations
router.get('/conversations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId: req.userId },
      include: {
        conversation: {
          include: {
            match: {
              include: {
                user1: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photos: true,
                    nationality: true,
                    isOnline: true
                  }
                },
                user2: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photos: true,
                    nationality: true,
                    isOnline: true
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc'
        }
      }
    });

    const formattedConversations = conversations.map(participant => {
      const conv = participant.conversation;
      const otherUser = conv.match.user1Id === req.userId ? conv.match.user2 : conv.match.user1;
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        matchId: otherUser.id,
        name: `${otherUser.firstName} ${otherUser.lastName}`,
        photo: otherUser.photos[0] || '',
        nationality: otherUser.nationality || 'American',
        lastMessage: lastMessage?.content || 'Start chatting!',
        lastMessageTime: lastMessage?.createdAt || conv.createdAt,
        unreadCount: participant.unreadCount,
        isOnline: otherUser.isOnline
      };
    });

    res.json(formattedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: req.userId
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: {
        unreadCount: 0,
        lastReadAt: new Date()
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/conversations/:conversationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content required' });
    }

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: req.userId
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.userId!,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Increment unread count for other participant
    const otherParticipant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: { not: req.userId }
      }
    });

    if (otherParticipant) {
      await prisma.conversationParticipant.update({
        where: { id: otherParticipant.id },
        data: {
          unreadCount: { increment: 1 }
        }
      });

      // Emit socket event to other user
      const io = getIO();
      io.to(otherParticipant.userId).emit('new_message', {
        conversationId,
        message
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark conversation as read
router.post('/conversations/:conversationId/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;

    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: req.userId
      },
      data: {
        unreadCount: 0,
        lastReadAt: new Date()
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;
