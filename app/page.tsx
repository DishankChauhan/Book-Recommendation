'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthButtons from "@/components/AuthButtons"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams?.get('from') ?? ''

  useEffect(() => {
    if (session) {
      if (from) {
        router.push(from)
      } else if (!session.user.preferences) {
        router.push('/profile')
      } else {
        router.push('/recommendations')
      }
    }
  }, [session, from, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900">
      <ThemeToggle />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] bg-white bg-opacity-20 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-30">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-white">Welcome to BookClub</CardTitle>
              <CardDescription className="text-gray-200">
                Join our community of book lovers. Get personalized recommendations and track your reading progress.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <AuthButtons />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center text-sm text-gray-200"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}