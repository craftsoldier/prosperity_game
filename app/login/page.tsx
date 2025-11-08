import { redirect } from 'next/navigation'
import { getCurrentUser, USERS } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Prosperity Game
          </h1>
          <p className="text-gray-600">Choose your player</p>
        </div>

        <LoginForm users={USERS} />
      </div>
    </div>
  )
}
