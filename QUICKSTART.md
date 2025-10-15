# H1bee Quick Start Guide

Get your dating app running in 10 minutes! ⚡

## Local Development Setup

### Prerequisites Check

```bash
node --version  # Should be 18 or higher
npm --version
```

If you don't have Node.js, download from [nodejs.org](https://nodejs.org/)

---

## Step 1: Set Up PostgreSQL Database (5 minutes)

### Option A: Use Vercel Postgres (Easiest)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Sign in (or create free account)
3. Click "Create Database" → Choose "Postgres"
4. Copy the connection string

### Option B: Use Supabase (Free)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy connection pooling string

### Option C: Local PostgreSQL

```bash
# On Mac (using Homebrew)
brew install postgresql
brew services start postgresql
createdb h1bee_db

# Your connection string:
# postgresql://localhost:5432/h1bee_db
```

---

## Step 2: Set Up Backend (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="your_postgresql_connection_string_here"
JWT_SECRET="change-this-to-a-long-random-string-min-32-chars"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

### Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Add test data
npm run db:seed
```

You should see:
```
✅ Database seeded successfully!

Test accounts:
- john@example.com (Male, American)
- sofia@example.com (Female, Brazilian)
- priya@example.com (Female, Indian)
- kenji@example.com (Male, Japanese)
- maria@example.com (Female, Mexican)

Password for all accounts: password123
```

### Start Backend

```bash
npm run dev
```

You should see:
```
🐝 H1bee API server running on port 3001
🌍 Environment: development
📡 Socket.IO initialized
```

---

## Step 3: Set Up Frontend (2 minutes)

**Open a NEW terminal window:**

```bash
# Navigate to frontend folder
cd shadcn-ui

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3001/api" > .env
echo "VITE_SOCKET_URL=http://localhost:3001" >> .env
```

### Start Frontend

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## Step 4: Test the App (1 minute)

### Quick Test

1. Open browser: `http://localhost:5173`
2. Click "Sign in" button
3. Login with: `john@example.com` / `password123`
4. You should see the dashboard with matches!

### Full Test

**Open 2 browser windows** (or use incognito):

**Window 1:**
- Login as `john@example.com` (Male, straight)

**Window 2:**
- Login as `sofia@example.com` (Female, straight)

Now test:
1. **Swiping**: Go to "Discover" tab, swipe right on each other
2. **Matching**: You'll get a match notification! 🎉
3. **Messaging**: Go to "Messages", start chatting in real-time
4. **Posts**: Go to "Feed", create a post or event
5. **Stories**: Upload a story (expires in 24h)

---

## Test Accounts

| Email | Gender | Orientation | Nationality |
|-------|--------|-------------|-------------|
| john@example.com | Male | Straight | American |
| sofia@example.com | Female | Straight | Brazilian |
| priya@example.com | Female | Straight | Indian |
| kenji@example.com | Male | Straight | Japanese |
| maria@example.com | Female | Straight | Mexican |

**All passwords:** `password123`

---

## Create Your Own Account

1. Click "Sign Up"
2. Follow 8-step registration:
   - Email & Password
   - Basic Info (name, birthday)
   - Identity (gender, orientation, American/International)
   - Location & preferences
   - Photos (at least 1)
   - Interests (at least 3)
   - Bio (at least 50 chars)
   - Complete!

---

## Common Issues & Fixes

### Backend won't start

**Error: "DATABASE_URL environment variable is not defined"**
```bash
# Make sure you created .env file in backend folder
cd backend
cp .env.example .env
# Edit .env and add your DATABASE_URL
```

**Error: "Port 3001 already in use"**
```bash
# Kill the process using port 3001
# On Mac/Linux:
lsof -ti:3001 | xargs kill -9

# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

**Error: "Can't connect to database"**
- Check your `DATABASE_URL` is correct
- Test connection: `npm run db:studio` (opens Prisma Studio)
- For Vercel/Supabase: verify the connection string

### Frontend won't start

**Error: "Network request failed"**
- Make sure backend is running (`npm run dev` in backend folder)
- Check `VITE_API_URL` in `shadcn-ui/.env` is correct
- Try: `http://localhost:3001/api/health` in browser

**Port 5173 already in use**
- Kill the process or use different port:
  ```bash
  npm run dev -- --port 5174
  ```

### No matches showing

- Need at least 2 users with compatible preferences
- Male + Straight → sees Females who want Men
- Female + Straight → sees Males who want Women
- Try logging in as different test accounts

---

## Next Steps

### For Development

- **Database UI**: `npm run db:studio` (in backend folder)
- **API Testing**: Use Postman or `curl` with endpoints in backend/README.md
- **View Logs**: Check terminal where backend is running

### For Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Deploying to Vercel
- Setting up production database
- Configuring Cloudinary for image uploads
- Inviting real users

---

## Architecture Overview

```
┌─────────────────────┐      HTTP/WebSocket      ┌─────────────────────┐
│                     │ ◄──────────────────────► │                     │
│  Frontend (React)   │                          │  Backend (Express)  │
│  Port: 5173         │                          │  Port: 3001         │
│                     │                          │                     │
└─────────────────────┘                          └──────────┬──────────┘
                                                            │
                                                            │ Prisma ORM
                                                            ▼
                                                   ┌─────────────────────┐
                                                   │                     │
                                                   │  PostgreSQL DB      │
                                                   │                     │
                                                   └─────────────────────┘
```

---

## Features Available

✅ User Registration & Login
✅ Profile Management
✅ Smart Matching Algorithm
✅ Swipe Interface (Like/Pass/Super Like)
✅ Real-time Messaging
✅ Feed (Posts, Events, Stories)
✅ Event RSVP System
✅ 24-hour Stories
✅ Like & Comment System
✅ Image Upload Support
✅ Responsive Mobile Design

---

## Development Tools

### Backend Commands

```bash
cd backend

npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open database UI
npm run db:seed      # Seed test data
```

### Frontend Commands

```bash
cd shadcn-ui

npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

---

## You're All Set! 🎉

Your dating app is now running locally!

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

**Have fun testing!** 🐝💛

Need help? Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or backend/README.md
