'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DayCardProps {
  dayNumber: number
  amount: number
  sessionId: string
  userId: string
  existingEntry?: any
}

export default function DayCard({
  dayNumber,
  amount,
  sessionId,
  userId,
  existingEntry,
}: DayCardProps) {
  const router = useRouter()
  const [purchases, setPurchases] = useState(existingEntry?.purchases || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!purchases.trim()) {
      setError('Please describe what you purchased!')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          dayNumber,
          amount,
          purchases,
        }),
      })

      if (!response.ok) throw new Error('Failed to save entry')

      router.refresh()
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleNextDay = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/sessions/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) throw new Error('Failed to advance day')

      router.refresh()
    } catch (err) {
      setError('Failed to advance to next day')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-purple-100">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Day {dayNumber}
          </h2>
          <p className="text-3xl text-purple-600 font-bold mt-3">
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <p className="text-gray-600 mt-3 text-lg">
            Imagine spending this entire amount today. What would you buy? 🎁
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📝</span>
            <span>What did you purchase? Be specific!</span>
          </label>
          <textarea
            value={purchases}
            onChange={(e) => setPurchases(e.target.value)}
            placeholder="Example: A luxury spa day at the Four Seasons (₹8,000), new MacBook Pro M3 Max (₹3,50,000), donation to local animal shelter (₹50,000)..."
            className="w-full h-64 px-5 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 resize-none transition-all shadow-sm hover:border-purple-300"
            disabled={existingEntry && dayNumber < (existingEntry.day_number + 1)}
          />
          <p className="text-sm text-gray-600 mt-3 bg-purple-50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> Be as detailed as possible. Describe colors, features, experiences!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {saving ? '💫 Saving...' : existingEntry ? '✏️ Update Entry' : '💾 Save Entry'}
          </button>

          {existingEntry && (
            <button
              onClick={handleNextDay}
              disabled={saving || dayNumber >= 30}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {dayNumber >= 30 ? '🎉 Game Complete!' : '➡️ Next Day'}
            </button>
          )}
        </div>

        {existingEntry && dayNumber < 30 && (
          <p className="text-sm text-gray-600 mt-4 text-center bg-blue-50 p-3 rounded-lg">
            ✨ Save your entry, then click "Next Day" to move to Day {dayNumber + 1}
          </p>
        )}
      </div>
    </div>
  )
}
