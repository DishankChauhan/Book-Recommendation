'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import Navigation from '@/components/Navigation'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <div className="min-h-screen pb-20">
              <ThemeToggle />
              {children}
              <Navigation />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}