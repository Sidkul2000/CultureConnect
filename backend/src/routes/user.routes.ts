import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthday: true,
        gender: true,
        orientation: true,
        userType: true,
        nationality: true,
        location: true,
        relationshipGoal: true,
        bio: true,
        culturalJourney: true,
        height: true,
        education: true,
        occupation: true,
        interests: true,
        languages: true,
        photos: true,
        minAge: true,
        maxAge: true,
        maxDistance: true,
        interestedInEvents: true,
        interestedInImmigrationNews: true,
        interestedInCulturalTrivia: true,
        profileCompleted: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.patch('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'culturalJourney', 'height',
      'education', 'occupation', 'interests', 'languages', 'photos',
      'minAge', 'maxAge', 'maxDistance', 'interestedInEvents',
      'interestedInImmigrationNews', 'interestedInCulturalTrivia', 'location'
    ];

    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        photos: true,
        interests: true,
        languages: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthday: true,
        gender: true,
        nationality: true,
        location: true,
        bio: true,
        culturalJourney: true,
        interests: true,
        languages: true,
        photos: true,
        isOnline: true,
        lastSeen: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update online status
router.post('/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { isOnline } = req.body;

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        isOnline: isOnline ?? true,
        lastSeen: new Date()
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get user profile with stats
router.get('/profile/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const targetUserId = userId === 'me' ? req.userId : userId;

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        culturalJourney: true,
        photos: true,
        interests: true,
        languages: true,
        nationality: true,
        location: true,
        isOnline: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get statistics
    const [postsCount, matchesCount, likesCount, posts] = await Promise.all([
      prisma.post.count({ where: { authorId: targetUserId } }),
      prisma.match.count({
        where: {
          OR: [
            { user1Id: targetUserId },
            { user2Id: targetUserId }
          ]
        }
      }),
      prisma.like.count({
        where: {
          post: { authorId: targetUserId }
        }
      }),
      prisma.post.findMany({
        where: { authorId: targetUserId },
        include: {
          eventDetails: true,
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    res.json({
      user,
      stats: {
        posts: postsCount,
        matches: matchesCount,
        likesReceived: likesCount
      },
      posts
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
