-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_day INTEGER NOT NULL DEFAULT 1,
  game_version TEXT NOT NULL DEFAULT 'incremental',
  paired_with_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  amount BIGINT NOT NULL,
  purchases TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, day_number)
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entry_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_paired_with ON game_sessions(paired_with_user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_session_id ON daily_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_entry_id ON reactions(entry_id);

-- Enable Row Level Security (RLS)
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_sessions
CREATE POLICY "Users can view their own sessions and paired sessions"
  ON game_sessions FOR SELECT
  USING (user_id = current_setting('app.user_id', true) OR paired_with_user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can create their own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own sessions"
  ON game_sessions FOR UPDATE
  USING (user_id = current_setting('app.user_id', true));

-- RLS Policies for daily_entries
CREATE POLICY "Users can view their own entries and paired user entries"
  ON daily_entries FOR SELECT
  USING (
    user_id = current_setting('app.user_id', true) OR
    session_id IN (
      SELECT id FROM game_sessions
      WHERE user_id = current_setting('app.user_id', true)
      OR paired_with_user_id = current_setting('app.user_id', true)
    )
  );

CREATE POLICY "Users can create their own entries"
  ON daily_entries FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own entries"
  ON daily_entries FOR UPDATE
  USING (user_id = current_setting('app.user_id', true));

-- RLS Policies for reactions
CREATE POLICY "Anyone can view reactions"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  USING (user_id = current_setting('app.user_id', true));
