import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '../backend/src/routes/auth.routes';
import userRoutes from '../backend/src/routes/user.routes';
import matchRoutes from '../backend/src/routes/match.routes';
import messageRoutes from '../backend/src/routes/message.routes';
import postRoutes from '../backend/src/routes/post.routes';
import storyRoutes from '../backend/src/routes/story.routes';
import uploadRoutes from '../backend/src/routes/upload.routes';
import pusherRoutes from '../backend/src/routes/pusher.routes';
import { initializePusher } from '../backend/src/services/pusher.service';

const app = express();

// Initialize Pusher
initializePusher();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://h1bee.us',
    'https://*.h1bee.us'
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check and root endpoint (before other routes to avoid middleware conflicts)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'H1bee API is running on Vercel!' });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'H1bee API - Use /api/* endpoints' });
});

// Protected Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pusher', pusherRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export the Express app as a serverless function
export default app;
