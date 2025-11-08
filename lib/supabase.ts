import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Database types
export interface GameSession {
  id: string
  user_id: string
  user_email: string
  start_date: string
  current_day: number
  game_version: 'incremental' | 'doubling'
  paired_with_user_id: string | null
  created_at: string
  updated_at: string
}

export interface DailyEntry {
  id: string
  session_id: string
  user_id: string
  day_number: number
  amount: number
  purchases: string // JSON string or text description
  created_at: string
}

export interface Reaction {
  id: string
  entry_id: string
  user_id: string
  user_email: string
  reaction: string // emoji or text
  created_at: string
}
