import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma';

const router = express.Router();

// Get all active stories
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const now = new Date();

    // Get stories that haven't expired
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: { gt: now }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true,
            nationality: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group stories by user
    const groupedStories = stories.reduce((acc: any, story) => {
      const userId = story.user.id;

      if (!acc[userId]) {
        acc[userId] = {
          userId: story.user.id,
          userName: `${story.user.firstName} ${story.user.lastName}`,
          userPhoto: story.user.photos[0] || '',
          nationality: story.user.nationality || 'American',
          stories: []
        };
      }

      acc[userId].stories.push({
        id: story.id,
        image: story.image,
        caption: story.caption,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt
      });

      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Create story
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { image, caption } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image required for story' });
    }

    // Stories expire after 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await prisma.story.create({
      data: {
        userId: req.userId!,
        image,
        caption: caption || '',
        expiresAt
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        }
      }
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Delete story
router.delete('/:storyId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: req.params.storyId }
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.story.delete({
      where: { id: req.params.storyId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Cleanup expired stories (can be called by a cron job)
router.post('/cleanup', async (req, res) => {
  try {
    const now = new Date();

    const result = await prisma.story.deleteMany({
      where: {
        expiresAt: { lte: now }
      }
    });

    res.json({ deleted: result.count });
  } catch (error) {
    console.error('Cleanup stories error:', error);
    res.status(500).json({ error: 'Failed to cleanup stories' });
  }
});

export default router;
