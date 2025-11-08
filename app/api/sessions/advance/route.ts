import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    // Get current session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Session not found')
    }

    // Check if current day has an entry
    const { data: entry } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('session_id', sessionId)
      .eq('day_number', session.current_day)
      .single()

    if (!entry) {
      return NextResponse.json(
        { error: 'Please complete today\'s entry before advancing' },
        { status: 400 }
      )
    }

    // Advance to next day
    const newDay = Math.min(session.current_day + 1, 30)
    const { data, error } = await supabase
      .from('game_sessions')
      .update({
        current_day: newDay,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error advancing day:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to advance day' },
      { status: 500 }
    )
  }
}
