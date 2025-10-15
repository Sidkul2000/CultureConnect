# Vercel Deployment Checklist ✅

Follow these steps to ensure your Pusher-powered real-time features work perfectly on Vercel.

## Prerequisites
- ✅ Pusher account created (app_id: 2064476)
- ✅ Code migrated from Socket.IO to Pusher
- ✅ Backend builds successfully
- ✅ Frontend builds successfully

## Step 1: Deploy Backend to Vercel

### 1.1 Push Code to GitHub
```bash
git add .
git commit -m "feat: migrate from Socket.IO to Pusher for Vercel compatibility"
git push origin main
```

### 1.2 Configure Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Set **Root Directory** to: `.` (root)
4. Set **Framework Preset** to: `Other`
5. Leave **Build Command** empty (handled by vercel.json)
6. Leave **Output Directory** empty

### 1.3 Add Backend Environment Variables

In Vercel Project Settings → Environment Variables, add:

```env
# Database
DATABASE_URL=postgres://cfea86890e3c5341c8e9b84552aaf2384645373c6f10c2d7ccbf0f6548334ad1:sk_fsrVoUfowPne7Zn6YB1w-@db.prisma.io:5432/postgres?sslmode=require

# JWT
JWT_SECRET=h1bee-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production

# CORS - Your Frontend URL
FRONTEND_URL=https://h1bee.us

# Pusher (CRITICAL for real-time features!)
PUSHER_APP_ID=2064476
PUSHER_KEY=62b7fbd2cf90d674ebaa
PUSHER_SECRET=0eb6fcd6a7e758c82f25
PUSHER_CLUSTER=us2
```

**Important:** Set these for **Production**, **Preview**, and **Development** environments.

### 1.4 Deploy Backend
Click "Deploy" and wait for deployment to complete.

Your backend URL will be something like:
`https://your-project-name.vercel.app`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create New Vercel Project for Frontend
1. Import the same repository
2. Set **Root Directory** to: `shadcn-ui`
3. Set **Framework Preset** to: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### 2.2 Add Frontend Environment Variables

In Vercel Project Settings → Environment Variables, add:

```env
# Your deployed backend URL
VITE_API_URL=https://your-backend-url.vercel.app

# Pusher Configuration (CRITICAL!)
VITE_PUSHER_KEY=62b7fbd2cf90d674ebaa
VITE_PUSHER_CLUSTER=us2
```

**Important:** These must be set for **Production**, **Preview**, and **Development**.

### 2.3 Deploy Frontend
Click "Deploy" and wait for deployment to complete.

## Step 3: Verify CORS Configuration

After deployment, go back to your **backend** environment variables and verify:

```env
FRONTEND_URL=https://your-frontend-url.vercel.app
```

Then **redeploy the backend** to apply CORS changes.

## Step 4: Test Real-Time Features

### 4.1 Test Match Notifications

1. Open your deployed app in **two different browsers** (or incognito mode)
2. Create two different user accounts
3. Have User A swipe right on User B
4. Have User B swipe right on User A
5. Both users should see the match modal appear **instantly**!

### 4.2 Check Browser Console

Open Developer Tools → Console and look for:
- ✅ "Pusher connected"
- ✅ No CORS errors
- ✅ No 404 errors on `/api/pusher/auth`

### 4.3 Test Pusher Dashboard

1. Go to [pusher.com/channels](https://pusher.com/channels)
2. Open your app
3. Go to "Debug Console"
4. Perform a match in your app
5. You should see events appearing in real-time!

## Step 5: Update API URLs (if needed)

If you're using custom domains:

### Backend Custom Domain
1. In Vercel → Project Settings → Domains
2. Add your custom domain (e.g., `api.h1bee.us`)
3. Update frontend environment variable:
   ```env
   VITE_API_URL=https://api.h1bee.us
   ```

### Frontend Custom Domain
1. In Vercel → Project Settings → Domains
2. Add your custom domain (e.g., `h1bee.us`)
3. Update backend environment variable:
   ```env
   FRONTEND_URL=https://h1bee.us
   ```

## Common Issues & Solutions

### Issue: "Pusher not initialized" error

**Solution:**
- Check that all Pusher environment variables are set in Vercel
- Redeploy after adding environment variables
- Verify variable names match exactly (case-sensitive)

### Issue: CORS errors in browser console

**Solution:**
- Verify `FRONTEND_URL` in backend matches your deployed frontend URL
- Make sure to redeploy backend after changing CORS settings
- Check that `credentials: true` is set in CORS config

### Issue: "403 Forbidden" when subscribing to channels

**Solution:**
- Check that `/api/pusher/auth` endpoint is working
- Verify user is logged in and has valid JWT token
- Make sure Authorization header is being sent with token

### Issue: No real-time notifications

**Solution:**
1. Open browser console and check for errors
2. Verify Pusher credentials are correct
3. Check Pusher Debug Console for connection status
4. Ensure channel names match: `private-user-{userId}`

### Issue: Build fails on Vercel

**Solution:**
- Check that all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`
- Check build logs in Vercel for specific errors

## Verify Deployment Checklist

Before going live, verify:

- ✅ Backend API responds at `/api/health`
- ✅ Frontend loads without errors
- ✅ User can log in
- ✅ Pusher connects successfully (check console)
- ✅ Match notifications work in real-time
- ✅ No CORS errors in browser console
- ✅ No 404 errors on API endpoints
- ✅ Pusher Debug Console shows events

## Monitoring

### Pusher Dashboard
Monitor your Pusher usage:
- Go to [pusher.com/channels](https://pusher.com/channels)
- Check "Message Stats" for usage
- Free tier: 200k messages/day, 100 concurrent connections

### Vercel Analytics
Monitor your deployment:
- Go to Vercel Dashboard → Your Project → Analytics
- Check for errors and performance issues

## Performance Tips

1. **Optimize Pusher Usage**: Only subscribe to channels when needed
2. **Unsubscribe**: Always unsubscribe from channels when component unmounts
3. **Rate Limiting**: Consider rate limiting match notifications if needed
4. **Caching**: Use Vercel's Edge Network for static assets

## Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ PUSHER_SECRET is kept private (never in frontend)
- ✅ CORS is restricted to your domain
- ✅ Private channels require authentication
- ✅ User can only subscribe to their own channels

## Next Steps

Once deployed and working:

1. **Set up custom domains** for professional URLs
2. **Enable Vercel Analytics** to monitor performance
3. **Set up error tracking** (e.g., Sentry)
4. **Monitor Pusher usage** to stay within free tier
5. **Add more real-time features**:
   - Typing indicators in messages
   - Online/offline status
   - Read receipts
   - Live notifications

## Support

If you encounter issues:

1. **Check Vercel Logs**: Project → Deployments → Click deployment → View Function Logs
2. **Check Pusher Debug Console**: [pusher.com](https://pusher.com) → Your App → Debug Console
3. **Check Browser Console**: Look for JavaScript errors
4. **Test Locally**: Ensure it works locally before deploying

---

**Your app is now production-ready with real-time features on Vercel! 🚀**

Pusher + Vercel = Perfect combination for serverless real-time applications!
