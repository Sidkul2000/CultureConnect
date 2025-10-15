# H1bee Setup Checklist ✅

Use this checklist to ensure everything is set up correctly.

## Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, for deployment)
- [ ] PostgreSQL database access (local, Vercel, or Supabase)

## Backend Setup

- [ ] Navigate to `backend/` folder
- [ ] Run `npm install`
- [ ] Create `.env` file (already exists with defaults)
- [ ] Update `DATABASE_URL` in `.env` with your PostgreSQL connection
- [ ] Optionally update `JWT_SECRET` (for production, use a strong random string)
- [ ] Run `npm run db:generate` (generates Prisma client)
- [ ] Run `npm run db:push` (creates database tables)
- [ ] Run `npm run db:seed` (adds test data)
- [ ] Run `npm run dev` (starts backend on port 3001)
- [ ] Visit `http://localhost:3001/api/health` - should see `{"status":"ok"}`

## Frontend Setup

- [ ] Navigate to `shadcn-ui/` folder (in a NEW terminal)
- [ ] Run `npm install`
- [ ] `.env` file already created with defaults
- [ ] Run `npm run dev` (starts frontend on port 5173)
- [ ] Visit `http://localhost:5173` - should see H1bee landing page

## Test Local Setup

- [ ] Frontend loads without errors
- [ ] Click "Sign in" button
- [ ] Login with `john@example.com` / `password123`
- [ ] Dashboard loads with profile data
- [ ] Go to "Discover" tab - see potential matches
- [ ] Swipe right on a match
- [ ] Check "Messages" - no conversations yet (need mutual match)

## Test Matching & Messaging

**Open 2 browser windows:**

### Window 1: John (Male, Straight)
- [ ] Login as `john@example.com` / `password123`
- [ ] Go to "Discover" tab
- [ ] Find Sofia (Female, Brazilian)
- [ ] Swipe right (like)

### Window 2: Sofia (Female, Straight)
- [ ] Login as `sofia@example.com` / `password123`
- [ ] Go to "Discover" tab
- [ ] Find John
- [ ] Swipe right (like)
- [ ] Should see "It's a match!" notification 🎉

### Test Messaging
- [ ] Both users go to "Messages" tab
- [ ] Should see conversation with each other
- [ ] Send messages back and forth
- [ ] Messages appear in real-time
- [ ] Unread count updates

## Test All Features

- [ ] **Feed Tab**: View posts
- [ ] **Create Post**: Click "+" button, create a post
- [ ] **Like Post**: Click heart icon on a post
- [ ] **Create Event**: Create event post with date/time
- [ ] **RSVP Event**: Click "Attend" on an event
- [ ] **Stories**: Upload a story (if image upload works)
- [ ] **Profile**: View/edit profile
- [ ] **Settings**: Update preferences

## Verify Database

- [ ] Run `npm run db:studio` (in backend folder)
- [ ] Opens Prisma Studio in browser
- [ ] Check `User` table - should see 5+ users
- [ ] Check `Post` table - should see 3+ posts
- [ ] Check `Match` table - should see matches you created
- [ ] Check `Message` table - should see messages

## Production Deployment (Optional)

If deploying to production:

### Backend
- [ ] Create Vercel account
- [ ] Set up PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Deploy backend: `vercel` (in backend folder)
- [ ] Set environment variables in Vercel dashboard
- [ ] Run `vercel env pull` locally
- [ ] Run `npm run db:push` to create tables
- [ ] Run `npm run db:seed` to add test data
- [ ] Test backend: visit `https://your-backend.vercel.app/api/health`

### Frontend
- [ ] Update `shadcn-ui/.env` with production backend URL
- [ ] Deploy frontend: `vercel` (in shadcn-ui folder)
- [ ] Update backend `FRONTEND_URL` env var with frontend URL
- [ ] Redeploy backend
- [ ] Test app at `https://your-frontend.vercel.app`

### Cloudinary (Optional - for image uploads)
- [ ] Create Cloudinary account
- [ ] Get API credentials
- [ ] Add to backend environment variables
- [ ] Redeploy backend
- [ ] Test image upload

## Testing with 10 Users

- [ ] Share app URL with 10 people
- [ ] Provide signup instructions
- [ ] Encourage diversity (different genders, orientations, nationalities)
- [ ] Ask users to complete full registration
- [ ] Monitor backend logs for errors
- [ ] Check database for new users: `npm run db:studio`
- [ ] Verify matches are working
- [ ] Test messaging between users
- [ ] Check event RSVPs

## Common Issues

### Backend won't start
- [ ] Check `DATABASE_URL` is correct in `.env`
- [ ] Try `npm run db:generate` again
- [ ] Check if port 3001 is available
- [ ] Check Node.js version is 18+

### Frontend can't connect
- [ ] Backend is running on port 3001
- [ ] Check `VITE_API_URL` in frontend `.env`
- [ ] Clear browser cache and localStorage
- [ ] Try incognito mode

### No matches appearing
- [ ] At least 2 users with compatible preferences
- [ ] Check gender/orientation matching:
  - Male + Straight → sees Females
  - Female + Straight → sees Males
- [ ] Check age preferences overlap

### Real-time messaging not working
- [ ] Socket.IO port is accessible
- [ ] Check browser console for WebSocket errors
- [ ] Verify `VITE_SOCKET_URL` in frontend `.env`

## Success Criteria

✅ All checklist items completed
✅ Can login with test accounts
✅ Can create matches
✅ Can send/receive messages in real-time
✅ Can create posts and events
✅ Can RSVP to events
✅ No errors in browser console
✅ No errors in backend terminal
✅ Database has expected data

## You're Ready! 🎉

If all items are checked:
- ✅ Your app is fully functional locally
- ✅ Ready for production deployment
- ✅ Ready to invite 10 users for testing

**Next Steps:**
1. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to deploy
2. Invite users and gather feedback
3. Monitor usage and fix any issues

---

**Need Help?**
- 📖 [QUICKSTART.md](./QUICKSTART.md) - Local setup guide
- 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- 💻 [backend/README.md](./backend/README.md) - API documentation
- 📝 [README.md](./README.md) - Project overview
