import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, friendEmail } = body

    // Find friend's session by email
    const { data: friendSession, error: friendError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_email', friendEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (friendError || !friendSession) {
      return NextResponse.json(
        { error: 'Friend not found. Make sure they have signed up and started playing!' },
        { status: 404 }
      )
    }

    // Update current user's session with friend's user_id
    const { data, error } = await supabase
      .from('game_sessions')
      .update({
        paired_with_user_id: friendSession.user_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error

    // Also pair the friend back (mutual pairing)
    await supabase
      .from('game_sessions')
      .update({
        paired_with_user_id: data.user_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', friendSession.id)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error pairing with friend:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to pair with friend' },
      { status: 500 }
    )
  }
}
