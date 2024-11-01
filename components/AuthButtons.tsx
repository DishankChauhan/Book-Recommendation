'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AuthButtons() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <Button disabled className="w-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 text-white">Loading...</Button>
  }

  if (session) {
    return (
      <>
        <Button onClick={() => router.push('/recommendations')} className="w-full mb-2 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700 text-white">
          View Recommendations
        </Button>
        <Button onClick={() => signOut()} variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black dark:hover:bg-gray-700 dark:hover:text-white">
          Sign Out
        </Button>
      </>
    )
  }

  return (
    <Button onClick={() => signIn('google').then(() => router.push('/preferences'))} className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 dark:from-yellow-600 dark:via-red-700 dark:to-pink-700 text-white">
      Sign in with Google
    </Button>
  )
}