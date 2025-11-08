import { cookies } from 'next/headers'

export interface User {
  id: string
  name: string
  email: string
}

export const USERS = [
  { id: 'user1', name: 'You', email: 'you@prosperity.game' },
  { id: 'user2', name: 'Your Girlfriend', email: 'her@prosperity.game' },
]

export async function getCurrentUser(): Promise<User | null> {
  'use server'
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) return null

  return USERS.find(u => u.id === userId) || null
}

export async function login(userId: string) {
  'use server'
  const user = USERS.find(u => u.id === userId)
  if (!user) throw new Error('User not found')

  const cookieStore = await cookies()
  cookieStore.set('user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return user
}

export async function logout() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete('user_id')
}

export function getAllUsers() {
  return USERS
}
