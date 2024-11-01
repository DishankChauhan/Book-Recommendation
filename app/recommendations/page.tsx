'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import ThemeToggle from "@/components/ThemeToggle"
import { AlertCircle, ShoppingCart } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  description: string
  imageUrl: string
  buyLink: string
}

export default function Recommendations() {
  const { data: session, status } = useSession()
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchRecommendations()
    }
  }, [session])

  const fetchRecommendations = async () => {
    if (!session?.user?.email) return

    try {
      const userRef = doc(db, 'users', session.user.email)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        setError('No user preferences found')
        return
      }

      const userData = userSnap.data()
      const { genres, authors } = userData

      const fetchedBooks: Book[] = []

      for (const genre of genres) {
        const response = await fetch(`/api/books?q=subject:${encodeURIComponent(genre)}`)
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (data.items) {
          fetchedBooks.push(...data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0] || 'Unknown',
            description: item.volumeInfo.description || 'No description available',
            imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.png',
            buyLink: item.saleInfo?.buyLink || `https://www.google.com/search?q=${encodeURIComponent(item.volumeInfo.title + ' book')}`
          })))
        }
      }

      for (const author of authors) {
        const response = await fetch(`/api/books?q=inauthor:${encodeURIComponent(author)}`)
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (data.items) {
          fetchedBooks.push(...data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0] || 'Unknown',
            description: item.volumeInfo.description || 'No description available',
            imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.png',
            buyLink: item.saleInfo?.buyLink || `https://www.google.com/search?q=${encodeURIComponent(item.volumeInfo.title + ' book')}`
          })))
        }
      }

      setBooks(fetchedBooks)
      setError(null)
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to fetch book recommendations. Please try again later.')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in to view recommendations.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-8">
      <ThemeToggle />
      <h1 className="text-3xl font-bold text-white mb-6">Your Recommendations</h1>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white bg-opacity-20 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-30">
              <CardHeader>
                <CardTitle className="text-white">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover mb-4" />
                <p className="text-gray-200 mb-2">By {book.author}</p>
                <p className="text-gray-300 mb-4">{book.description}</p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={book.buyLink} rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}