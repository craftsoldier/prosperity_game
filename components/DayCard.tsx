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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Day {dayNumber}</h2>
          <p className="text-2xl text-purple-600 font-semibold mt-2">
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <p className="text-gray-600 mt-2">
            Imagine spending this entire amount today. What would you buy?
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you purchase? Be specific!
          </label>
          <textarea
            value={purchases}
            onChange={(e) => setPurchases(e.target.value)}
            placeholder="Example: A luxury spa day at the Four Seasons (₹8,000), new MacBook Pro M3 Max (₹3,50,000), donation to local animal shelter (₹50,000)..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
            disabled={existingEntry && dayNumber < (existingEntry.day_number + 1)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Tip: Be as detailed as possible. Describe colors, features, experiences!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : existingEntry ? 'Update Entry' : 'Save Entry'}
          </button>

          {existingEntry && (
            <button
              onClick={handleNextDay}
              disabled={saving || dayNumber >= 30}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {dayNumber >= 30 ? 'Game Complete!' : 'Next Day →'}
            </button>
          )}
        </div>

        {existingEntry && dayNumber < 30 && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Save your entry, then click "Next Day" to move to Day {dayNumber + 1}
          </p>
        )}
      </div>
    </div>
  )
}
