'use client'

import { format } from 'date-fns'

interface ProgressViewProps {
  entries: any[]
  currentDay: number
}

export default function ProgressView({ entries, currentDay }: ProgressViewProps) {
  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Current Day</p>
            <p className="text-2xl font-bold text-purple-600">{currentDay} / 30</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Entries Completed</p>
            <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total "Spent"</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">All Entries</h3>
        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No entries yet. Start with Day 1!
          </div>
        ) : (
          entries.map((entry) => (
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
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{entry.purchases}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
