import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, dayNumber, amount, purchases } = body

    // Check if entry already exists
    const { data: existingEntry } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('session_id', sessionId)
      .eq('day_number', dayNumber)
      .single()

    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabase
        .from('daily_entries')
        .update({ purchases, amount })
        .eq('id', existingEntry.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, data })
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('daily_entries')
        .insert({
          session_id: sessionId,
          user_id: userId,
          day_number: dayNumber,
          amount,
          purchases,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, data })
    }
  } catch (error: any) {
    console.error('Error saving entry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save entry' },
      { status: 500 }
    )
  }
}
