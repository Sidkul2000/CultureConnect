# H1bee Backend API

Backend API for the H1bee dating application.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (optional, for image uploads)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `CLOUDINARY_*`: Your Cloudinary credentials (optional)

### 3. Set up database

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to database:

```bash
npm run db:push
```

Seed the database with test data:

```bash
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Test Accounts

After seeding, you can use these test accounts:

- **john@example.com** (Male, American)
- **sofia@example.com** (Female, Brazilian)
- **priya@example.com** (Female, Indian)
- **kenji@example.com** (Male, Japanese)
- **maria@example.com** (Female, Mexican)

Password for all: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users/status` - Update online status

### Matching
- `GET /api/matches/discover` - Get potential matches
- `POST /api/matches/swipe` - Swipe on a user
- `GET /api/matches` - Get all matches
- `DELETE /api/matches/:matchId` - Unmatch

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:id` - Get messages in conversation
- `POST /api/messages/conversations/:id` - Send message
- `POST /api/messages/conversations/:id/read` - Mark as read

### Posts
- `GET /api/posts/feed` - Get feed posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Comment on post
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/rsvp` - RSVP to event

### Stories
- `GET /api/stories` - Get active stories
- `POST /api/stories` - Create story
- `DELETE /api/stories/:id` - Delete story

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Set up PostgreSQL database (recommended: Vercel Postgres or Supabase)

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard

5. Run database migrations:
```bash
vercel env pull
npm run db:push
```

## Database Management

- **View database**: `npm run db:studio`
- **Generate Prisma client**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Seed database**: `npm run db:seed`

## Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO for messaging
- **File Upload**: Cloudinary (with fallback to placeholder images)

## Features

✅ User authentication and authorization
✅ Profile management with preferences
✅ Smart matching algorithm (gender, orientation, age, interests)
✅ Swipe functionality (like, pass, super like)
✅ Real-time messaging with Socket.IO
✅ Posts and feed (events, stories, news)
✅ Stories with 24-hour expiration
✅ Event RSVP system
✅ Image upload support
✅ Like and comment functionality
