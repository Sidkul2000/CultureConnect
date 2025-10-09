# H1bee Feature Guide - New UI

## 🎉 Welcome to the New H1bee Experience!

### Main Dashboard - Two Powerful Tabs

---

## 📱 Tab 1: FEED (Social Media Experience)

### What You'll See:

#### 1. **Story Carousel** (Top of Feed)
```
[+Add] [Sofia] [Priya] [Emma] [John] →
```
- Instagram-style story circles
- Gradient ring for unviewed stories
- Gray ring for viewed stories
- Click to view full-screen story
- Swipe between stories in viewer

#### 2. **Create Post Button**
```
┌──────────────────────────────────────┐
│ [+] Share your story, create an     │
│     event, or post news...          │
└──────────────────────────────────────┘
```
- Prominent yellow/orange gradient card
- Opens modal with 3 post types

#### 3. **Feed Posts**
Each post shows:
- User avatar and name
- Time posted
- Post type badge (Event/Story/News)
- Title and content
- Image (optional)
- Event details (for events):
  - 📍 Location
  - 👥 Number of attendees
  - 💰 Price
  - 🌍 Cultural theme
- Actions:
  - ❤️ Like (with count)
  - 💬 Comment (with count)
  - 🎉 Attend (for events)

---

## 🔍 Tab 2: DISCOVER (Dating/Swiping)

### What You'll See:

#### Profile Card Stack
```
┌─────────────────────────┐
│  [92% Match ✨] [🟢 Online]│
│                         │
│    [Profile Photo]      │
│                         │
│  Sofia Rodriguez, 28    │
│  🌍 Brazilian           │
│  📍 2 miles away       │
├─────────────────────────┤
│  About Me...            │
│  Cultural Journey...    │
│  Languages: [PT][EN][ES]│
│  Interests: [Dance][...]│
└─────────────────────────┘
```

#### Swipe Actions:
- **Swipe Right** → Like (💛 appears)
- **Swipe Left** → Pass (❌ appears)
- **Or use buttons:**
  - ❌ Pass
  - 💛 Like
  - ⭐ Super Like

---

## 📝 Creating Posts - Modal Options

### Option 1: Story/Update
```
Title: *
Content: *
Image URL: (optional)
```

### Option 2: Event
```
Title: *
Content: *
Image URL: (optional)
Location:
Cultural Theme:
Event Date:
Event Time:
Price ($):
Max Attendees:
```

### Option 3: News/Article
```
Title: *
Content: *
Image URL: (optional)
```

---

## 📱 Mobile Navigation (Bottom Bar)

```
┌─────────┬─────────┬─────────┬─────────┐
│  🏠     │  🧭     │  💬     │  📅     │
│  Feed   │ Discover│Messages │ Events  │
└─────────┴─────────┴─────────┴─────────┘
```

- **Feed**: Social feed + stories
- **Discover**: Swipe on profiles
- **Messages**: Chat with matches
- **Events**: Browse all events

---

## 💻 Desktop Navigation (Top Bar)

```
🐝 H1bee  |  Messages  Events  Profile ▼
```

---

## 🎯 Key User Flows

### Flow 1: Check Feed & Stories
1. Open app → Lands on Feed tab
2. Scroll through story carousel
3. Tap a story to view full-screen
4. Swipe to next/previous story
5. Close story viewer
6. Scroll feed to see posts
7. Like/comment on posts
8. Click "Attend" on events

### Flow 2: Create Event
1. Click "Create Post" button
2. Select "Event" type
3. Fill in event details:
   - Title: "Brazilian BBQ Night"
   - Content: Description
   - Location: "Miami, FL"
   - Cultural Theme: "Brazilian"
   - Date & Time
   - Price: $25
   - Max Attendees: 50
4. Add image URL
5. Click "Publish Post"
6. Event appears at top of feed

### Flow 3: Discover & Match
1. Tap "Discover" tab
2. View profile card
3. Read bio, cultural journey
4. Check compatibility (%)
5. Swipe right to like
6. Get match notification
7. Start messaging

### Flow 4: Interact with Posts
1. See post in feed
2. Tap ❤️ to like
3. Number increases
4. Heart turns pink
5. Tap again to unlike
6. For events: tap "Attend"
7. See toast: "Redirecting to Events page! 🎉"
8. Automatically redirected to Events page
9. Can view full event details and RSVP

---

## 🎨 Visual Elements

### Color Meanings:
- **Yellow/Orange Gradient** → H1bee branding, primary actions
- **Pink/Rose** → Likes, romantic actions
- **Blue** → Events, informational
- **Purple** → Interests, cultural themes
- **Green** → Matches, online status, success

### Badges:
- **Match %** → Green gradient with ✨
- **Online** → Green with 🟢
- **Event** → Blue with 📅
- **Cultural Theme** → Outlined badge

### Animations:
- Card swipe (left/right with rotation)
- Story view (fade in)
- Post creation (scale in)
- Feed scroll (fade in posts)
- Bottom nav (slide up)

---

## 🔔 Notifications/Toasts

Users receive toasts for:
- ✅ "You liked Sofia! 💛"
- 🎉 "It's a match with Sofia!"
- ✅ "Post created successfully! 🎉"
- ✅ "Message sent!"
- 🎉 "Redirecting to Events page! 🎉" (when clicking Attend)
- ℹ️ "No worries, there are plenty more people to meet!"

---

## 📊 Feed Post Types

### 1. User Story Post
```
┌─────────────────────────────────┐
│ 👤 Emma Chen        2h ago      │
├─────────────────────────────────┤
│ My Cultural Exchange Journey 🌍 │
│                                 │
│ Just got back from Tokyo...     │
│ [Photo of tea ceremony]         │
│                                 │
│ ❤️ 89  💬 12                   │
└─────────────────────────────────┘
```

### 2. Event Post
```
┌─────────────────────────────────┐
│ 👥 H1bee Events    30m ago  [Event]│
├─────────────────────────────────┤
│ Brazilian Carnival Night 🎭     │
│                                 │
│ Join us for authentic...        │
│ [Photo of carnival]             │
│                                 │
│ 📍 Miami, FL                    │
│ 👥 45 interested                │
│ 💰 $25  🌍 Brazilian Culture    │
│                                 │
│ ❤️ 127  💬 23  [🎉 Attend]     │
└─────────────────────────────────┘
```

### 3. News/Article Post
```
┌─────────────────────────────────┐
│ 📰 H1bee Community  6h ago      │
├─────────────────────────────────┤
│ Cross-Cultural Love Success ❤️  │
│                                 │
│ Maria & John share their story..│
│ [Photo of couple]               │
│                                 │
│ ❤️ 234  💬 45                  │
└─────────────────────────────────┘
```

---

## 🎯 Best Practices for Users

### For Better Matches:
1. Complete your profile
2. Add multiple photos
3. Write authentic bio
4. Share cultural journey
5. Be active (like/comment)
6. Attend events
7. Post stories regularly

### For Better Engagement:
1. Create interesting events
2. Share personal stories
3. Comment on posts
4. React to stories
5. Join cultural events
6. Message matches quickly

### For Mobile Users:
1. Use bottom navigation
2. Swipe gestures work smoothly
3. Story carousel scrolls horizontally
4. All features available
5. Touch-optimized buttons

---

## 🐛 Troubleshooting

### Story not loading?
- Check internet connection
- Refresh the page
- Clear browser cache

### Can't swipe cards?
- Try using action buttons
- Check if you're on Discover tab
- Refresh if stuck

### Post creation not working?
- Fill all required fields (*)
- Check image URL format
- Ensure you're logged in

---

## 🎓 Quick Tips

1. **Desktop users**: Use keyboard shortcuts (coming soon)
2. **Mobile users**: Swipe horizontally on story carousel
3. **All users**: Click story circles to view full story
4. **Tab switching**: Click tabs on desktop, use bottom nav on mobile
5. **Quick like**: Double-tap post image (coming soon)

---

## 🌟 Pro Features

### Coming Soon:
- Video stories
- Live events
- Group chats
- Advanced filters
- Premium profiles
- Verified badges
- Story highlights
- Photo albums

---

**Enjoy your H1bee experience! 🐝**
*Where Cultures Connect & Hearts Meet*
