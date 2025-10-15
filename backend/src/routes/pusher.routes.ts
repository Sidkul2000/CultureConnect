import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { getPusher } from '../services/pusher.service';

const router = express.Router();

// Pusher authentication endpoint for private channels
router.post('/auth', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { socket_id, channel_name } = req.body;

    if (!socket_id || !channel_name) {
      return res.status(400).json({ error: 'socket_id and channel_name are required' });
    }

    // Verify that the user is authorized to access this channel
    const userId = req.userId!;

    // Private user channels: private-user-{userId}
    if (channel_name.startsWith('private-user-')) {
      const channelUserId = channel_name.replace('private-user-', '');

      // User can only subscribe to their own channel
      if (channelUserId !== userId) {
        return res.status(403).json({ error: 'Not authorized for this channel' });
      }
    }

    // Private conversation channels: private-conversation-{conversationId}
    if (channel_name.startsWith('private-conversation-')) {
      // TODO: Add validation to check if user is participant in the conversation
      // For now, we'll allow if user is authenticated
    }

    // Authenticate the user for the private channel
    const pusher = getPusher();
    const authResponse = pusher.authorizeChannel(socket_id, channel_name);

    res.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Pusher' });
  }
});

export default router;
