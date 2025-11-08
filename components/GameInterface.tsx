'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import type { User } from '@clerk/nextjs/server'
import DayCard from './DayCard'
import PairingSection from './PairingSection'
import ProgressView from './ProgressView'

interface GameInterfaceProps {
  user: User
  session: any
  entries: any[]
  pairedUserData: any
}

export default function GameInterface({
  user,
  session,
  entries,
  pairedUserData,
}: GameInterfaceProps) {
  const [currentView, setCurrentView] = useState<'today' | 'history' | 'friend'>('today')

  const currentDay = session?.current_day || 1
  const todaysAmount = currentDay * 10000 // ₹10,000 increments

  // Check if today's entry exists
  const todaysEntry = entries.find((e) => e.day_number === currentDay)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Session Error</h1>
          <p className="text-gray-700">Unable to load your game session.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prosperity Game</h1>
              <p className="text-sm text-gray-600">
                Day {currentDay} of 30 • ₹{todaysAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <UserButton />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                currentView === 'today'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                currentView === 'history'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setCurrentView('friend')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                currentView === 'friend'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Friend {pairedUserData ? '✓' : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'today' && (
          <DayCard
            dayNumber={currentDay}
            amount={todaysAmount}
            sessionId={session.id}
            userId={user.id}
            existingEntry={todaysEntry}
          />
        )}

        {currentView === 'history' && (
          <ProgressView entries={entries} currentDay={currentDay} />
        )}

        {currentView === 'friend' && (
          <PairingSection
            currentUserId={user.id}
            currentUserEmail={user.emailAddresses[0]?.emailAddress || ''}
            sessionId={session.id}
            pairedWithUserId={session.paired_with_user_id}
            pairedUserData={pairedUserData}
          />
        )}
      </div>
    </div>
  )
}
