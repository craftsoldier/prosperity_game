# Prosperity Game - Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Clerk account (free tier is fine)
- A Supabase account (free tier is fine)

## Setup Steps

### 1. Clone and Install Dependencies
```bash
cd prosperity-game
npm install
```

### 2. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable Google OAuth in the Social Connections settings
4. Copy your API keys

### 3. Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the database to be ready
4. Go to SQL Editor and run the schema from `supabase-schema.sql`
5. Copy your project URL and anon key from Settings > API

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/game
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/game

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env.local` in the Vercel project settings
5. Deploy!

## Features

- **Day-by-day tracking**: Start with ₹10,000 on Day 1, incrementing by ₹10,000 each day
- **Friend pairing**: Connect with a friend to share your journeys
- **Progress history**: View all your past entries
- **Shared accountability**: See your friend's entries and leave encouraging comments
- **Google OAuth**: Easy sign-in with Google

## Database Schema

The app uses 3 main tables:
- `game_sessions`: Tracks each user's game session
- `daily_entries`: Stores daily purchase entries
- `reactions`: Stores comments/reactions to entries

See `supabase-schema.sql` for the complete schema.

## Support

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure the Supabase schema has been run
3. Check Clerk dashboard for any OAuth configuration issues

Enjoy playing the Prosperity Game!
