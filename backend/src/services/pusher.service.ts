import Pusher from 'pusher';

let pusherInstance: Pusher | null = null;

export const initializePusher = () => {
  if (pusherInstance) {
    return pusherInstance;
  }

  pusherInstance = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true
  });

  console.log('Pusher initialized successfully');
  return pusherInstance;
};

export const getPusher = (): Pusher => {
  if (!pusherInstance) {
    throw new Error('Pusher not initialized. Call initializePusher() first.');
  }
  return pusherInstance;
};

// Helper function to trigger match notification
export const triggerMatchNotification = async (
  userId: string,
  matchData: {
    matchId: string;
    user: {
      name: string;
      photo: string;
      bio: string;
    };
  }
) => {
  const pusher = getPusher();

  try {
    await pusher.trigger(`private-user-${userId}`, 'new_match', matchData);
    console.log(`Match notification sent to user ${userId}`);
  } catch (error) {
    console.error('Failed to send match notification:', error);
    throw error;
  }
};

// Helper function to trigger typing indicator
export const triggerTypingIndicator = async (
  conversationId: string,
  userId: string,
  isTyping: boolean
) => {
  const pusher = getPusher();

  try {
    const event = isTyping ? 'user_typing' : 'user_stop_typing';
    await pusher.trigger(`private-conversation-${conversationId}`, event, {
      userId,
      conversationId
    });
  } catch (error) {
    console.error('Failed to send typing indicator:', error);
    throw error;
  }
};

// Helper function to trigger new message notification
export const triggerNewMessage = async (
  conversationId: string,
  messageData: any
) => {
  const pusher = getPusher();

  try {
    await pusher.trigger(`private-conversation-${conversationId}`, 'new_message', messageData);
    console.log(`New message notification sent to conversation ${conversationId}`);
  } catch (error) {
    console.error('Failed to send new message notification:', error);
    throw error;
  }
};
