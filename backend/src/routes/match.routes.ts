import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma';
import { Prisma } from '@prisma/client';
import { getIO } from '../services/socket.service';

const router = express.Router();

// Calculate age from birthday
function calculateAge(birthday: Date): number {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Get potential matches for swiping
router.get('/discover', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        sentSwipes: true,
        receivedSwipes: true
      }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get IDs of users already swiped on
    const swipedUserIds = currentUser.sentSwipes.map(swipe => swipe.toUserId);

    // Build matching criteria based on user preferences
    const whereConditions: Prisma.UserWhereInput = {
      id: { not: req.userId },
      NOT: {
        id: { in: swipedUserIds }
      },
      profileCompleted: true
    };

    // Gender and orientation matching logic
    // Build conditions for mutual compatibility
    const genderOrientationConditions: Prisma.UserWhereInput[] = [];

    // Case 1: Current user wants to see MEN
    if (currentUser.orientation === 'MEN') {
      if (currentUser.gender === 'MALE') {
        // Gay male: show males who like men
        genderOrientationConditions.push({
          gender: 'MALE',
          orientation: { in: ['MEN', 'EVERYONE'] }
        });
      } else if (currentUser.gender === 'FEMALE') {
        // Straight female: show males who like women
        genderOrientationConditions.push({
          gender: 'MALE',
          orientation: { in: ['WOMEN', 'EVERYONE'] }
        });
      } else {
        // Non-binary seeking men: show males open to everyone
        genderOrientationConditions.push({
          gender: 'MALE',
          orientation: 'EVERYONE'
        });
      }
    }

    // Case 2: Current user wants to see WOMEN
    if (currentUser.orientation === 'WOMEN') {
      if (currentUser.gender === 'MALE') {
        // Straight male: show females who like men
        genderOrientationConditions.push({
          gender: 'FEMALE',
          orientation: { in: ['MEN', 'EVERYONE'] }
        });
      } else if (currentUser.gender === 'FEMALE') {
        // Gay female: show females who like women
        genderOrientationConditions.push({
          gender: 'FEMALE',
          orientation: { in: ['WOMEN', 'EVERYONE'] }
        });
      } else {
        // Non-binary seeking women: show females open to everyone
        genderOrientationConditions.push({
          gender: 'FEMALE',
          orientation: 'EVERYONE'
        });
      }
    }

    // Case 3: Current user wants to see EVERYONE
    if (currentUser.orientation === 'EVERYONE') {
      if (currentUser.gender === 'MALE') {
        // Show anyone who likes men
        genderOrientationConditions.push(
          { gender: 'MALE', orientation: { in: ['MEN', 'EVERYONE'] } },
          { gender: 'FEMALE', orientation: { in: ['MEN', 'EVERYONE'] } },
          { gender: 'NON_BINARY', orientation: 'EVERYONE' }
        );
      } else if (currentUser.gender === 'FEMALE') {
        // Show anyone who likes women
        genderOrientationConditions.push(
          { gender: 'MALE', orientation: { in: ['WOMEN', 'EVERYONE'] } },
          { gender: 'FEMALE', orientation: { in: ['WOMEN', 'EVERYONE'] } },
          { gender: 'NON_BINARY', orientation: 'EVERYONE' }
        );
      } else {
        // Non-binary seeking everyone: show people open to everyone
        genderOrientationConditions.push({
          orientation: 'EVERYONE'
        });
      }
    }

    // Apply the gender/orientation conditions
    if (genderOrientationConditions.length > 0) {
      whereConditions.OR = genderOrientationConditions;
    }

    const potentialMatches = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthday: true,
        gender: true,
        nationality: true,
        location: true,
        photos: true,
        bio: true,
        culturalJourney: true,
        interests: true,
        languages: true,
        isOnline: true
      },
      take: 50 // Get 50 potential matches
    });

    // Filter by age preferences and calculate additional data
    const filteredMatches = potentialMatches
      .filter(user => {
        const age = calculateAge(user.birthday);
        return age >= currentUser.minAge && age <= currentUser.maxAge;
      })
      .map(user => {
        const age = calculateAge(user.birthday);

        // Calculate compatibility score (simplified)
        let compatibility = 70; // Base score

        // Add points for shared interests
        const sharedInterests = user.interests.filter(interest =>
          currentUser.interests.includes(interest)
        );
        compatibility += Math.min(sharedInterests.length * 2, 20);

        // Add points for shared languages
        const sharedLanguages = user.languages.filter(lang =>
          currentUser.languages.includes(lang)
        );
        compatibility += Math.min(sharedLanguages.length * 3, 10);

        compatibility = Math.min(compatibility, 99);

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          age,
          nationality: user.nationality || 'American',
          location: user.location,
          photos: user.photos,
          bio: user.bio,
          culturalJourney: user.culturalJourney || '',
          interests: user.interests,
          languages: user.languages,
          compatibility,
          vibe: age < 25 ? 'Energetic & Fun' : age < 35 ? 'Adventurous & Open' : 'Thoughtful & Mature',
          distance: '2 miles away', // TODO: Implement real distance calculation
          isOnline: user.isOnline
        };
      });

    // Shuffle for variety
    const shuffled = filteredMatches.sort(() => Math.random() - 0.5);

    res.json(shuffled);
  } catch (error) {
    console.error('Discover matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Swipe on a user (like, pass, or super_like)
router.post('/swipe', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { toUserId, action } = req.body; // action: LIKE, PASS, SUPER_LIKE

    if (!['LIKE', 'PASS', 'SUPER_LIKE'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: req.userId!,
          toUserId
        }
      }
    });

    if (existingSwipe) {
      return res.status(400).json({ error: 'Already swiped on this user' });
    }

    // Create swipe
    const swipe = await prisma.swipe.create({
      data: {
        fromUserId: req.userId!,
        toUserId,
        action
      }
    });

    // Check for mutual like (match)
    let isMatch = false;
    let matchId = null;

    if (action === 'LIKE' || action === 'SUPER_LIKE') {
      const reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          fromUserId: toUserId,
          toUserId: req.userId!,
          action: { in: ['LIKE', 'SUPER_LIKE'] }
        }
      });

      if (reciprocalSwipe) {
        // Create match
        const match = await prisma.match.create({
          data: {
            user1Id: req.userId!,
            user2Id: toUserId
          }
        });

        // Create conversation
        const conversation = await prisma.conversation.create({
          data: {
            matchId: match.id,
            participants: {
              create: [
                { userId: req.userId! },
                { userId: toUserId }
              ]
            }
          }
        });

        isMatch = true;
        matchId = match.id;

        // Send real-time notification to both users
        try {
          const io = getIO();

          // Get both users' data for the notification
          const [currentUserData, matchedUserData] = await Promise.all([
            prisma.user.findUnique({
              where: { id: req.userId! },
              select: { id: true, firstName: true, lastName: true, photos: true, bio: true }
            }),
            prisma.user.findUnique({
              where: { id: toUserId },
              select: { id: true, firstName: true, lastName: true, photos: true, bio: true }
            })
          ]);

          if (currentUserData && matchedUserData) {
            // Notify the other user about the match
            io.to(toUserId).emit('new_match', {
              matchId: match.id,
              user: {
                id: currentUserData.id,
                name: `${currentUserData.firstName} ${currentUserData.lastName}`,
                photo: currentUserData.photos[0] || '',
                bio: currentUserData.bio || ''
              }
            });
          }
        } catch (socketError) {
          console.error('Socket notification error:', socketError);
          // Don't fail the request if socket notification fails
        }
      }
    }

    res.json({
      success: true,
      isMatch,
      matchId,
      action: swipe.action
    });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ error: 'Failed to process swipe' });
  }
});

// Get all matches
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: req.userId },
          { user2Id: req.userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true,
            nationality: true,
            isOnline: true,
            lastSeen: true
          }
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photos: true,
            nationality: true,
            isOnline: true,
            lastSeen: true
          }
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            },
            participants: {
              where: { userId: req.userId }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedMatches = matches.map(match => {
      const otherUser = match.user1Id === req.userId ? match.user2 : match.user1;
      const lastMessage = match.conversation?.messages[0];
      const participant = match.conversation?.participants[0];

      return {
        id: match.id,
        matchId: match.id, // Fixed: use match.id instead of otherUser.id
        otherUserId: otherUser.id,
        name: `${otherUser.firstName} ${otherUser.lastName}`,
        photo: otherUser.photos[0] || '',
        nationality: otherUser.nationality || 'American',
        lastMessage: lastMessage?.content || 'Say hi! 👋',
        lastMessageTime: lastMessage?.createdAt || match.createdAt,
        unreadCount: participant?.unreadCount || 0,
        isOnline: otherUser.isOnline,
        conversationId: match.conversation?.id
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Unmatch
router.delete('/:matchId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.matchId }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user1Id !== req.userId && match.user2Id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete the match and associated swipes so users can see each other again
    await prisma.$transaction([
      // Delete the match
      prisma.match.delete({
        where: { id: req.params.matchId }
      }),
      // Delete swipes in both directions so they appear in discover again
      prisma.swipe.deleteMany({
        where: {
          OR: [
            { fromUserId: match.user1Id, toUserId: match.user2Id },
            { fromUserId: match.user2Id, toUserId: match.user1Id }
          ]
        }
      })
    ]);

    res.json({ success: true, message: 'Unmatched successfully. You may see this person again in discover.' });
  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ error: 'Failed to unmatch' });
  }
});

export default router;

