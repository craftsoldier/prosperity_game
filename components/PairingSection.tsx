'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface PairingSectionProps {
  currentUserId: string
  currentUserEmail: string
  sessionId: string
  pairedWithUserId: string | null
  pairedUserData: any
}

export default function PairingSection({
  currentUserId,
  currentUserEmail,
  sessionId,
  pairedWithUserId,
  pairedUserData,
}: PairingSectionProps) {
  const router = useRouter()
  const [friendEmail, setFriendEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reactionText, setReactionText] = useState<{ [key: string]: string }>({})

  const handlePair = async () => {
    if (!friendEmail.trim()) {
      setError('Please enter your friend\'s email')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/sessions/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          friendEmail: friendEmail.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to pair')

      router.refresh()
      setFriendEmail('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReaction = async (entryId: string) => {
    const reaction = reactionText[entryId]?.trim()
    if (!reaction) return

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId,
          userId: currentUserId,
          userEmail: currentUserEmail,
          reaction,
        }),
      })

      if (!response.ok) throw new Error('Failed to add reaction')

      setReactionText({ ...reactionText, [entryId]: '' })
      router.refresh()
    } catch (err) {
      console.error('Failed to add reaction:', err)
    }
  }

  if (!pairedWithUserId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-purple-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <span className="text-3xl">👥</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Pair with Your Friend
            </h2>
            <p className="text-gray-600 text-lg">
              Share your prosperity journey together! Connect to see each other's progress and provide encouragement. 💜
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>📧</span>
              <span>Friend's Email</span>
            </label>
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="friend@prosperity.game"
              className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm hover:border-purple-300 text-lg"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handlePair}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? '🔗 Connecting...' : '🤝 Pair with Friend'}
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center bg-blue-50 p-4 rounded-lg">
            💡 <strong>Note:</strong> Your friend must be signed in to the game first!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 mb-8 border border-purple-100">
        <div className="text-center">
          <span className="text-5xl mb-3 block">💑</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Friend's Progress
          </h2>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <span>💜 Paired with:</span>
            <strong className="text-purple-600">{pairedUserData?.session?.user_email || 'Loading...'}</strong>
          </p>
        </div>
      </div>

      {pairedUserData?.entries?.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-purple-300">
          <span className="text-6xl mb-4 block">🌱</span>
          <p className="text-gray-600 text-xl">Your friend hasn't started their journey yet!</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pairedUserData?.entries?.map((entry: any) => (
            <div key={entry.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-100 hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Day {entry.day_number}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <span>📅</span>
                    <span>{format(new Date(entry.created_at), 'MMM dd, yyyy')}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{entry.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4 border border-purple-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.purchases}</p>
              </div>

              {/* Reaction input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={reactionText[entry.id] || ''}
                  onChange={(e) =>
                    setReactionText({ ...reactionText, [entry.id]: e.target.value })
                  }
                  placeholder="Add encouragement or comment... 💬"
                  className="flex-1 px-5 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
                />
                <button
                  onClick={() => handleAddReaction(entry.id)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  💌 Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
