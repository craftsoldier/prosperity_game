import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()

  if (user) {
    redirect('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Prosperity Game
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Based on Abraham Hicks' teachings
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Expand your ability to imagine abundance. Play for 30 days, starting with ₹10,000
            and adding ₹10,000 each day. Share the journey with a friend!
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How to Play</h2>
            <ol className="text-left space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold text-purple-600 mr-3">1.</span>
                <span>Start with ₹10,000 on Day 1, ₹20,000 on Day 2, ₹30,000 on Day 3, and so on...</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-purple-600 mr-3">2.</span>
                <span>Each day, you must "spend" all the money on things you want</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-purple-600 mr-3">3.</span>
                <span>Be specific! Describe what you're buying in detail</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-purple-600 mr-3">4.</span>
                <span>Share your journey with a friend for accountability</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-purple-600 mr-3">5.</span>
                <span>Play for 30 days to expand your prosperity consciousness</span>
              </li>
            </ol>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
