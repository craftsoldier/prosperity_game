import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GameInterface from '@/components/GameInterface'

export default async function GamePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  try {
    // Get or create game session
    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      throw new Error('Failed to load game session')
    }

    let session = sessions?.[0]

    // Create session if doesn't exist
    if (!session) {
      const { data: newSession, error: createError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user.id,
          user_email: user.emailAddresses[0]?.emailAddress || '',
          current_day: 1,
          game_version: 'incremental',
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating session:', createError)
        throw new Error('Failed to create game session')
      }

      session = newSession
    }

    if (!session) {
      throw new Error('Failed to initialize game session')
    }

    // Get all entries for this session
    const { data: entries, error: entriesError } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('session_id', session.id)
      .order('day_number', { ascending: true })

    if (entriesError) {
      console.error('Error fetching entries:', entriesError)
    }

    // Get paired user's data if exists
    let pairedUserData = null
    if (session.paired_with_user_id) {
      const { data: pairedSession, error: pairedError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', session.paired_with_user_id)
        .single()

      if (!pairedError && pairedSession) {
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
  } catch (error) {
    console.error('Game page error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Game</h1>
          <p className="text-gray-700 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <p className="text-gray-600 text-sm">
            Please make sure the database is properly configured and try again.
          </p>
        </div>
      </div>
    )
  }
}
