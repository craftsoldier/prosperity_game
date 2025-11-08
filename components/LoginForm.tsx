'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
}

interface LoginFormProps {
  users: User[]
}

export default function LoginForm({ users }: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (userId: string) => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error('Login failed')

      router.push('/game')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-purple-100">
      <div className="space-y-4">
        {users.map((user, index) => (
          <button
            key={user.id}
            onClick={() => handleLogin(user.id)}
            disabled={loading}
            className={`group w-full px-8 py-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg ${
              index === 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">{index === 0 ? '💜' : '💙'}</span>
              <span>{loading ? 'Starting your journey...' : `Play as ${user.name}`}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          ✨ Two-player prosperity journey ✨
        </p>
        <p className="text-xs text-gray-500 mt-1">
          No passwords, just abundance!
        </p>
      </div>
    </div>
  )
}
