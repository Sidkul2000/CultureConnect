import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || '62b7fbd2cf90d674ebaa';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'us2';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let pusherInstance: Pusher | null = null;

export const usePusher = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const token = user.token;
    const userId = user.id;

    if (!token || !userId) return;

    // Initialize Pusher connection
    if (!pusherInstance) {
      pusherInstance = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        authEndpoint: `${API_URL}/api/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      pusherInstance.connection.bind('connected', () => {
        console.log('Pusher connected');
        setIsConnected(true);
      });

      pusherInstance.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
        setIsConnected(false);
      });

      pusherInstance.connection.bind('error', (error: any) => {
        console.error('Pusher connection error:', error);
        setIsConnected(false);
      });
    }

    setPusher(pusherInstance);

    return () => {
      // Don't disconnect on component unmount, keep connection alive
    };
  }, []);

  return { pusher, isConnected };
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

// Legacy export for backwards compatibility during migration
export const useSocket = usePusher;
export const disconnectSocket = disconnectPusher;
