import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';
import userRoutes from '../src/routes/user.routes';
import matchRoutes from '../src/routes/match.routes';
import messageRoutes from '../src/routes/message.routes';
import postRoutes from '../src/routes/post.routes';
import storyRoutes from '../src/routes/story.routes';
import uploadRoutes from '../src/routes/upload.routes';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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
