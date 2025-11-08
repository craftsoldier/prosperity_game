import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entryId, userId, userEmail, reaction } = body

    // Check if user already reacted to this entry
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('entry_id', entryId)
      .eq('user_id', userId)
      .single()

    if (existingReaction) {
      // Update existing reaction
      const { data, error } = await supabase
        .from('reactions')
        .update({ reaction })
        .eq('id', existingReaction.id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, data })
    } else {
      // Create new reaction
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          entry_id: entryId,
          user_id: userId,
          user_email: userEmail,
          reaction,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, data })
    }
  } catch (error: any) {
    console.error('Error adding reaction:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add reaction' },
      { status: 500 }
    )
  }
}
