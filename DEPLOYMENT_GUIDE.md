# H1bee Deployment Guide

Complete guide to deploy your H1bee dating application to production.

## Overview

The application consists of:
- **Frontend**: React + Vite (in `shadcn-ui/` folder)
- **Backend**: Node.js + Express + Prisma (in `backend/` folder)
- **Database**: PostgreSQL
- **File Storage**: Cloudinary (optional)

## Prerequisites

1. **Node.js 18+** installed
2. **PostgreSQL database** (Vercel Postgres, Supabase, or any PostgreSQL provider)
3. **Vercel account** (free tier works)
4. **Cloudinary account** (optional, for image uploads)

---

## Part 1: Backend Deployment

### Step 1: Set up PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the connection string (it starts with `postgres://`)

#### Option B: Supabase (Free alternative)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (Connection pooling recommended)

### Step 2: Deploy Backend to Vercel

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 3: Configure Backend Environment Variables

In Vercel dashboard for your backend project:

1. Go to **Settings** → **Environment Variables**
2. Add the following:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Optional (for image uploads):
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Set up Database Schema

```bash
# Pull environment variables locally
vercel env pull

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with test data
npm run db:seed
```

### Step 5: Verify Backend Deployment

Visit your backend URL: `https://your-backend.vercel.app/api/health`

You should see: `{"status":"ok","message":"H1bee API is running!"}`

---

## Part 2: Frontend Deployment

### Step 1: Configure Frontend Environment

```bash
# Navigate to frontend folder
cd ../shadcn-ui

# Create .env file
cp .env.example .env
```

Edit `.env` and add your backend URL:

```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_SOCKET_URL=https://your-backend.vercel.app
```

### Step 2: Deploy Frontend to Vercel

```bash
# Install dependencies
npm install

# Build to verify everything works
npm run build

# Deploy
vercel
```

### Step 3: Update Backend CORS

Go back to your backend Vercel project:
1. Settings → Environment Variables
2. Update `FRONTEND_URL` to your deployed frontend URL
3. Redeploy backend

---

## Part 3: Testing the Deployment

### Test Accounts (after seeding)

- **john@example.com** - Male, American
- **sofia@example.com** - Female, Brazilian
- **priya@example.com** - Female, Indian
- **kenji@example.com** - Male, Japanese
- **maria@example.com** - Female, Mexican

Password for all: `password123`

### Test Checklist

1. ✅ **Authentication**
   - Sign up with a new account
   - Login with existing account
   - Logout

2. ✅ **Profile**
   - View profile
   - Edit profile information
   - Upload photos (if Cloudinary configured)

3. ✅ **Matching**
   - View potential matches
   - Swipe left/right
   - Get match notification
   - View matches list

4. ✅ **Messaging**
   - Open conversation with a match
   - Send messages
   - See real-time delivery
   - Unread count updates

5. ✅ **Feed**
   - View posts
   - Create post/event
   - Like posts
   - Comment on posts
   - RSVP to events

6. ✅ **Stories**
   - View stories
   - Create story
   - Stories expire after 24h

---

## Part 4: Local Development Setup

### Backend

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env

# Edit .env with your local PostgreSQL connection
# DATABASE_URL="postgresql://user:pass@localhost:5432/h1bee_db"

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start dev server
npm run dev
```

Backend runs on: `http://localhost:3001`

### Frontend

```bash
cd shadcn-ui
npm install

# Create .env
echo "VITE_API_URL=http://localhost:3001/api" > .env
echo "VITE_SOCKET_URL=http://localhost:3001" >> .env

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Part 5: Inviting Users

### For 10 Test Users

1. **Share the app URL**: `https://your-frontend.vercel.app`

2. **Provide instructions**:
   ```
   Welcome to H1bee! 🐝

   To get started:
   1. Click "Sign Up"
   2. Complete all 8 steps of registration
   3. Upload at least one photo
   4. Add minimum 3 interests
   5. Write a bio (at least 50 characters)

   After signup, you can:
   - Swipe to discover matches
   - Message your matches
   - Create posts and events
   - Share stories
   ```

3. **Encourage diversity**: Ask users to choose different:
   - Genders
   - Orientations (Men/Women/Everyone)
   - Nationalities
   - Locations

### Monitoring

1. **Check backend logs**: Vercel dashboard → Your Backend Project → Deployments → View Function Logs

2. **Database inspection**:
   ```bash
   cd backend
   npm run db:studio
   ```

3. **Check user signups**:
   ```sql
   SELECT email, "firstName", "lastName", "createdAt"
   FROM "User"
   ORDER BY "createdAt" DESC;
   ```

---

## Troubleshooting

### Backend Issues

**Error: Database connection failed**
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel IPs
- For Supabase: use connection pooling URL

**Error: JWT token invalid**
- Clear localStorage in browser
- Verify `JWT_SECRET` is set in backend env vars
- Ensure frontend and backend are using same secret

### Frontend Issues

**Error: Network request failed**
- Verify `VITE_API_URL` is correct in frontend .env
- Check CORS settings in backend (FRONTEND_URL)
- Verify backend is deployed and running

**Images not uploading**
- Cloudinary credentials in backend env vars
- Or images will use placeholders (fallback)

### Matching Issues

**No matches appearing**
- Need at least 2 users with compatible preferences
- Check gender/orientation matching:
  - Male + Straight → shows Females
  - Female + Straight → shows Males
  - Anyone + Everyone → shows all
- Verify age preferences overlap

---

## Production Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] Update `DATABASE_URL` to production database
- [ ] Configure Cloudinary for image uploads
- [ ] Set `NODE_ENV=production` in backend
- [ ] Update `FRONTEND_URL` in backend to production URL
- [ ] Update `VITE_API_URL` in frontend to production URL
- [ ] Test all features with real users
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/alerts (optional)

---

## Scaling Considerations

For production with many users:

1. **Database**: Consider upgrading to paid PostgreSQL tier
2. **File Storage**: Use Cloudinary or AWS S3
3. **Caching**: Add Redis for session management
4. **Real-time**: Socket.IO works but consider separate WebSocket server
5. **Search**: Add Elasticsearch for advanced user search
6. **Monitoring**: Set up Sentry or similar for error tracking

---

## Support

If you encounter issues:

1. Check backend logs in Vercel
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure database migrations are applied
5. Check network tab for API request/response details

---

## Summary

✅ **Backend**: Express + Prisma + PostgreSQL + Socket.IO
✅ **Frontend**: React + Vite + shadcn/ui
✅ **Features**: Auth, Profiles, Matching, Messaging, Posts, Stories, Events
✅ **Deployment**: Vercel (both frontend and backend)
✅ **Database**: PostgreSQL (Vercel Postgres or Supabase)
✅ **Ready for 10+ users**: Yes, fully functional!

**Your dating app is now live! 🎉🐝**
