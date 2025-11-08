import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GameInterface from '@/components/GameInterface'

export default async function GamePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get or create game session
  const { data: sessions } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  let session = sessions?.[0]

  // Create session if doesn't exist
  if (!session) {
    const { data: newSession } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        user_email: user.emailAddresses[0]?.emailAddress || '',
        current_day: 1,
        game_version: 'incremental',
      })
      .select()
      .single()

    session = newSession
  }

  // Get all entries for this session
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('session_id', session?.id)
    .order('day_number', { ascending: true })

  // Get paired user's data if exists
  let pairedUserData = null
  if (session?.paired_with_user_id) {
    const { data: pairedSession } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', session.paired_with_user_id)
      .single()

    if (pairedSession) {
      const { data: pairedEntries } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('session_id', pairedSession.id)
        .order('day_number', { ascending: true })

      pairedUserData = {
        session: pairedSession,
        entries: pairedEntries || [],
      }
    }
  }

  return (
    <GameInterface
      user={user}
      session={session}
      entries={entries || []}
      pairedUserData={pairedUserData}
    />
  )
}
