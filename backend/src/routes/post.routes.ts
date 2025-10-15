import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma';

const router = express.Router();

// Get feed posts
router.get('/feed', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get user's connections (matches)
    const userMatches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: req.userId },
          { user2Id: req.userId }
        ]
      }
    });

    const connectionIds = userMatches.map(match =>
      match.user1Id === req.userId ? match.user2Id : match.user1Id
    );

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { visibility: 'GLOBAL' },
          {
            AND: [
              { visibility: 'CONNECTIONS' },
              { authorId: { in: [...connectionIds, req.userId!] } }
            ]
          }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        },
        likes: {
          where: { userId: req.userId },
          select: { id: true }
        },
        eventDetails: {
          include: {
            attendees: {
              where: { userId: req.userId }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const formattedPosts = posts.map(post => ({
      id: post.id,
      type: post.type.toLowerCase(),
      title: post.title,
      content: post.content,
      image: post.image,
      author: `${post.author.firstName} ${post.author.lastName}`,
      authorId: post.author.id,
      authorPhoto: post.author.photos[0] || '',
      timestamp: post.createdAt,
      location: post.location,
      culturalTheme: post.culturalTheme,
      likes: post._count.likes,
      comments: post._count.comments,
      userHasLiked: post.likes.length > 0,
      ...(post.eventDetails && {
        attendees: post.eventDetails.attendees.length,
        price: post.eventDetails.price,
        date: post.eventDetails.date,
        time: post.eventDetails.time,
        address: post.eventDetails.address,
        maxAttendees: post.eventDetails.maxAttendees
      })
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Create post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, title, content, image, location, culturalTheme, eventDetails, visibility } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const validTypes = ['EVENT', 'NEWS', 'USER_POST', 'STORY'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid post type' });
    }

    const postData: any = {
      type,
      title,
      content,
      image,
      location,
      culturalTheme,
      visibility: visibility || 'GLOBAL',
      authorId: req.userId!
    };

    // Handle event-specific data
    if (type === 'EVENT' && eventDetails) {
      postData.eventDetails = {
        create: {
          date: new Date(eventDetails.date),
          time: eventDetails.time,
          address: eventDetails.address,
          price: eventDetails.price || 0,
          maxAttendees: eventDetails.maxAttendees || 50
        }
      };
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        },
        eventDetails: true
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like/unlike post
router.post('/:postId/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.params;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: req.userId!
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId,
          userId: req.userId!
        }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Comment on post
router.post('/:postId/comments', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Comment content required' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: req.userId!,
        content: content.trim()
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

    res.status(201).json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for post
router.get('/:postId/comments', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// RSVP to event
router.post('/:postId/rsvp', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.params;
    const { status } = req.body; // confirmed, declined

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { eventDetails: true }
    });

    if (!post || post.type !== 'EVENT' || !post.eventDetails) {
      return res.status(400).json({ error: 'Invalid event' });
    }

    const existingRsvp = await prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: post.eventDetails.id,
          userId: req.userId!
        }
      }
    });

    if (existingRsvp) {
      // Update RSVP
      await prisma.eventAttendee.update({
        where: { id: existingRsvp.id },
        data: { status }
      });
    } else {
      // Create RSVP
      await prisma.eventAttendee.create({
        data: {
          eventId: post.eventDetails.id,
          userId: req.userId!,
          status
        }
      });
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ error: 'Failed to RSVP' });
  }
});

// Delete post
router.delete('/:postId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists and user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete post (cascade will handle related records)
    await prisma.post.delete({
      where: { id: postId }
    });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
