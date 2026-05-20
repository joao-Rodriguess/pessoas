# 🔥 Firebase Implementation Guide - Netrunner: Shadow Protocol

## Overview

This document describes the complete Firebase integration implemented in the Netrunner game, enabling real-time leaderboards, game progress persistence, achievements tracking, and user authentication.

## ✅ Implemented Features

### 1. **Authentication**
- ✅ Anonymous login with custom codename
- ✅ Email/Password registration and login
- ✅ Automatic user profile creation
- ✅ Offline mode fallback for demo/development

**Files:** `src/context/AuthContext.jsx`

### 2. **Game Progress Persistence**
- ✅ Auto-save game state every 30 seconds during gameplay
- ✅ Save to Firestore `users` collection with user-specific documents
- ✅ Load saved game on login with "Resume" or "New Game" options
- ✅ Persist: score, hacks, achievements, powerups, bank balance, trace level

**Files:** `src/context/GameContext.jsx`, `src/pages/Login.jsx`

### 3. **Leaderboard System**
- ✅ Real-time leaderboard updates using Firestore listeners
- ✅ Top 10 scores displayed
- ✅ Track score, achievements count, hacks completed
- ✅ Server-side timestamps for fair ranking

**Files:** `src/context/GameContext.jsx`, `src/components/Leaderboard.jsx`

### 4. **Achievements Tracking**
- ✅ Log achievement unlocks to Firestore sub-collection
- ✅ Track unlock time and score when achievement was earned
- ✅ Achievements stored per-user in `users/{uid}/achievements`

**Files:** `src/context/GameContext.jsx`

### 5. **User Profile & Stats**
- ✅ User profiles automatically created in `users` collection
- ✅ Track display name, total score, hacks completed
- ✅ Store game statistics: firewall, encryption, auth, database, network hacks
- ✅ Merge updates to preserve existing data

**Files:** `src/context/GameContext.jsx`

---

## 🚀 Getting Started

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name (e.g., "netrunner-shadow-protocol")
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Anonymous**
   - ✅ **Email/Password**
3. Click "Save"

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Select **Start in test mode** (For development; set proper rules in production)
4. Choose your region (closest to your users)
5. Click "Create"

### Step 4: Set Firestore Security Rules

Replace the default Firestore rules with these (for production, implement proper authentication):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard: public read, authenticated write
    match /leaderboard/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // User profiles: own data only
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // User achievements: own data only
    match /users/{userId}/achievements/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Step 5: Get Your Firebase Config

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll to "Your apps" section
3. Click on the Web app (if none exist, click "Add app" → "Web")
4. Copy the Firebase config object

### Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase config values:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD...
   VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=yourproject
   VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789000
   VITE_FIREBASE_APP_ID=1:123456789000:web:abc123...
   ```

### Step 7: Test the Integration

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Test in browser:
   - Start a game anonymously
   - Try email login with save/resume
   - Check leaderboard updates in real-time
   - Check Firebase Console to see data being saved

---

## 📊 Firestore Database Schema

### Collection: `leaderboard`

```javascript
{
  uid: "user123",
  name: "GHOST",
  score: 8500,
  achievements: 12,
  hacks: 5,
  trace: 35,
  timestamp: Timestamp
}
```

### Collection: `users/{uid}`

```javascript
{
  displayName: "GHOST",
  score: 8500,
  trace: 35,
  phase: "desktop",
  achievements: ["firewall_breached", "cctv_disabled", ...],
  stats: {
    firewall: true,
    encryption: true,
    auth: true,
    database: false,
    network: false,
    hackCount: 3,
    bankBalance: 50000000,
    cctvDisabled: true,
    missileAborted: false
  },
  powerups: {
    vpn: true,
    proxy: false,
    exploit: false
  },
  lastSaved: Timestamp
}
```

### Sub-collection: `users/{uid}/achievements`

```javascript
{
  achievementId: "firewall_breached",
  score: 1000,
  unlockedAt: Timestamp
}
```

---

## 🎮 Game Context API

### New Functions

#### `saveGameProgress(user, gameState)`
Manually save game progress to Firestore.
```javascript
const { saveGameProgress } = useGame();
await saveGameProgress(currentUser, gameState);
```

#### `loadGameProgress(user)`
Load saved game progress from Firestore.
```javascript
const { loadGameProgress } = useGame();
const saved = await loadGameProgress(currentUser);
```

#### `submitScore(user)`
Submit final score to leaderboard.
```javascript
const { submitScore } = useGame();
await submitScore(user); // Called automatically on victory/gameover
```

### New State Values

- `saveStatus`: 'ready' | 'saving' | 'saved' | 'error'
- `setUser`: Function to update user for auto-save

### Auto-Save Behavior

- ✅ Saves every 30 seconds during active gameplay
- ✅ Skips boot and login screens
- ✅ Only saves for authenticated users (not offline mode)
- ✅ Includes all game progress, powerups, and achievements

---

## 🔄 Login Flow with Persistence

### Anonymous Login (No Persistence)
```
Login Screen → Anonymous → New Game → Desktop
```

### Email Login (With Persistence)
```
Login Screen → Email/Password → 
  Check for saved progress → 
    [Resume Game] or [New Game] → 
    Desktop
```

---

## 🛡️ Security Considerations

### Current Setup (Development)
- Firestore in "test mode" = public read/write
- Anonymous auth enabled
- **⚠️ NOT SUITABLE FOR PRODUCTION**

### Production Recommendations

1. **Enable Authentication Requirement**
   ```javascript
   // In Firebase Rules:
   allow read, write: if request.auth != null;
   ```

2. **Implement Rate Limiting**
   - Prevent leaderboard spam
   - Limit save frequency

3. **Validate Data Server-Side**
   - Check score ranges
   - Verify user owns the data

4. **Use Firebase Security Rules**
   - Implement proper permission checks
   - Separate public and private data

5. **Enable HTTPS Only**
   - Set secure flag on cookies
   - Implement CORS properly

---

## 🐛 Troubleshooting

### "Firebase offline" message shows
- Check if environment variables are set correctly
- Verify `.env.local` is in project root
- Restart dev server after changing `.env`

### Leaderboard not updating
- Check Firestore has `leaderboard` collection
- Verify read permissions in Security Rules
- Check browser console for errors

### Game not saving
- Verify user is authenticated (not offline)
- Check `users` collection exists in Firestore
- Verify write permissions in Security Rules
- Check last error in browser console

### Can't resume game
- Ensure email login used (anonymous doesn't persist)
- Check `users/{uid}` document exists in Firestore
- Verify `score > 0` in saved data
- Check browser console for load errors

---

## 📱 Features Demo

### 1. Anonymous Play (Offline)
- No account needed
- No data saved
- Use for testing/demo

### 2. Email Registration
- Secure account creation
- Game progress auto-saved every 30s
- Resume game on next login

### 3. Real-Time Leaderboard
- Top 10 scores globally
- Shows achievements and hacks
- Updates instantly

### 4. Achievements System
- Unlock achievements during gameplay
- Logged to Firestore with timestamps
- Displayed on leaderboard

### 5. Game Statistics
- Track all hacks completed
- Monitor trace levels
- Store power-ups used

---

## 📈 Monitoring & Analytics

### Firebase Console
Monitor in real-time:
- **Authentication** → See login activity
- **Firestore** → View document growth
- **Real-time** → Monitor active players

### Useful Queries

**Get top scorer:**
```javascript
db.collection('leaderboard')
  .orderBy('score', 'desc')
  .limit(1)
  .get()
```

**Get user achievements:**
```javascript
db.collection('users')
  .doc(userId)
  .collection('achievements')
  .get()
```

---

## 🚀 Deployment

### Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel / Netlify
```bash
# Build the app
npm run build

# Deploy 'dist' folder to your hosting service
```

---

## 📝 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Test anonymous login
4. ✅ Test email login with persistence
5. ✅ Monitor leaderboard
6. ✅ Implement production security rules
7. ✅ Deploy to Firebase Hosting

---

## 🤝 Support

For issues:
1. Check browser console for errors
2. Verify Firebase config in Foundation
3. Check Firestore Security Rules
4. Review this guide's troubleshooting section

Happy hacking! 🎮💀
