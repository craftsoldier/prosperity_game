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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pair with a Friend
          </h2>
          <p className="text-gray-600 mb-6">
            Share your prosperity journey! Enter your friend's email to see each other's
            progress and provide encouragement.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Friend's Email
            </label>
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handlePair}
            disabled={loading}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Pairing...' : 'Pair with Friend'}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Note: Your friend must have an account and be signed in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Friend's Progress
        </h2>
        <p className="text-gray-600">
          Paired with: {pairedUserData?.session?.user_email || 'Loading...'}
        </p>
      </div>

      {pairedUserData?.entries?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Your friend hasn't started yet!
        </div>
      ) : (
        <div className="space-y-4">
          {pairedUserData?.entries?.map((entry: any) => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Day {entry.day_number}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    ₹{entry.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{entry.purchases}</p>
              </div>

              {/* Reaction input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reactionText[entry.id] || ''}
                  onChange={(e) =>
                    setReactionText({ ...reactionText, [entry.id]: e.target.value })
                  }
                  placeholder="Add encouragement or comment..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddReaction(entry.id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
