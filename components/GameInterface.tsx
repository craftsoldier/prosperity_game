'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DayCard from './DayCard'
import PairingSection from './PairingSection'
import ProgressView from './ProgressView'

interface User {
  id: string
  name: string
  email: string
}

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
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'today' | 'history' | 'friend'>('today')

  const currentDay = session?.current_day || 1
  const todaysAmount = currentDay * 10000 // ₹10,000 increments

  // Check if today's entry exists
  const todaysEntry = entries.find((e) => e.day_number === currentDay)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prosperity Game
              </h1>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  Day {currentDay} / 30
                </span>
                <span className="text-lg font-bold text-purple-600">
                  ₹{todaysAmount.toLocaleString('en-IN')}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Playing as</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('today')}
              className={`px-6 py-3 font-medium border-b-3 transition-all ${
                currentView === 'today'
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } rounded-t-lg`}
            >
              <span className="flex items-center gap-2">
                <span>🌟</span>
                <span>Today</span>
              </span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-6 py-3 font-medium border-b-3 transition-all ${
                currentView === 'history'
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } rounded-t-lg`}
            >
              <span className="flex items-center gap-2">
                <span>📅</span>
                <span>History</span>
              </span>
            </button>
            <button
              onClick={() => setCurrentView('friend')}
              className={`px-6 py-3 font-medium border-b-3 transition-all ${
                currentView === 'friend'
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } rounded-t-lg`}
            >
              <span className="flex items-center gap-2">
                <span>👥</span>
                <span>Friend</span>
                {pairedUserData && <span className="text-green-500">✓</span>}
              </span>
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
            currentUserEmail={user.email}
            sessionId={session.id}
            pairedWithUserId={session.paired_with_user_id}
            pairedUserData={pairedUserData}
          />
        )}
      </div>
    </div>
  )
}
