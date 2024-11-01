'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ThemeToggle from "@/components/ThemeToggle"

export default function Preferences() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [genres, setGenres] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (session?.user?.email) {
      fetchUserPreferences()
    }
  }, [session, status])

  const fetchUserPreferences = async () => {
    if (session?.user?.email) {
      const userRef = doc(db, 'users', session.user.email)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setGenres(data.genres || [])
        setAuthors(data.authors || [])
      }
    }
  }

  const searchBooks = async () => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.GOOGLE_BOOKS_API_KEY}`)
    const data = await response.json()
    setSearchResults(data.items || [])
  }

  const addPreference = (type: 'genre' | 'author', value: string) => {
    if (type === 'genre') {
      setGenres([...new Set([...genres, value])])
    } else {
      setAuthors([...new Set([...authors, value])])
    }
  }

  const savePreferences = async () => {
    if (session?.user?.email) {
      await setDoc(doc(db, 'users', session.user.email), {
        genres,
        authors
      }, { merge: true })
      router.push('/recommendations')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-8">
      <ThemeToggle />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Set Your Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{genre}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Authors</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {authors.map((author, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded">{author}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={searchBooks}>Search</Button>
            </div>
            <div className="space-y-2">
              {searchResults.map((book) => (
                <div key={book.id} className="flex justify-between items-center">
                  <span>{book.volumeInfo.title}</span>
                  <div>
                    <Button onClick={() => addPreference('genre', book.volumeInfo.categories?.[0])} className="mr-2">
                      Add Genre
                    </Button>
                    <Button onClick={() => addPreference('author', book.volumeInfo.authors?.[0])}>
                      Add Author
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={savePreferences} className="w-full">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}