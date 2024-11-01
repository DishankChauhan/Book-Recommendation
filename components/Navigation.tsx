'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, Book, Users, UserCircle, BookOpen, Users2 } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: UserCircle },
    { href: '/recommendations', label: 'Recommendations', icon: Book },
    { href: '/reading-list', label: 'Reading List', icon: BookOpen },
    { href: '/book-clubs', label: 'Book Clubs', icon: Users2 },
    { href: '/friends', label: 'Friends', icon: Users },
  ]

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 py-2 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {links.map((link, index) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex flex-col items-center gap-1 ${
                    isActive ? 'bg-white dark:bg-gray-800 text-purple-500 dark:text-purple-400' : 'text-white'
                  }`}
                >
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <motion.span
                    className="text-xs"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {link.label}
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}