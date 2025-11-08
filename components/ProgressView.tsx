'use client'

import { format } from 'date-fns'

interface ProgressViewProps {
  entries: any[]
  currentDay: number
}

export default function ProgressView({ entries, currentDay }: ProgressViewProps) {
  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 mb-8 border border-purple-100">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
          📊 Your Prosperity Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 transform hover:scale-105 transition-all">
            <p className="text-sm font-medium text-purple-600 mb-2">🗓️ Current Day</p>
            <p className="text-4xl font-bold text-purple-700">{currentDay} <span className="text-xl text-gray-500">/ 30</span></p>
            <div className="mt-3 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{width: `${(currentDay / 30) * 100}%`}}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 transform hover:scale-105 transition-all">
            <p className="text-sm font-medium text-blue-600 mb-2">✅ Entries Completed</p>
            <p className="text-4xl font-bold text-blue-700">{entries.length}</p>
            <p className="text-xs text-gray-600 mt-2">{30 - entries.length} more to go!</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 transform hover:scale-105 transition-all">
            <p className="text-sm font-medium text-green-600 mb-2">💰 Total "Spent"</p>
            <p className="text-3xl font-bold text-green-700">
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>📖</span>
          <span>All Entries</span>
        </h3>
        {entries.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-purple-300">
            <span className="text-6xl mb-4 block">✨</span>
            <p className="text-gray-600 text-lg">No entries yet. Start with Day 1!</p>
          </div>
        ) : (
          entries.map((entry) => (
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.purchases}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
