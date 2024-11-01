'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Book {
  id: string;
  title: string;
  authors: string[];
  progress: number;
  imageUrl: string;
  buyLink: string;
}

export default function ReadingList() {
  const { data: session, status } = useSession()
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchReadingList(session.user.email)
    }
  }, [session, status])

  const fetchReadingList = async (email: string) => {
    const q = query(collection(db, 'readingList'), where('userId', '==', email))
    const querySnapshot = await getDocs(q)
    const booksData: Book[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Book, 'id'>
    }))
    setBooks(booksData)
  }

  const updateProgress = async (bookId: string, progress: number) => {
    await updateDoc(doc(db, 'readingList', bookId), { progress })
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, progress } : book
    ))
  }

  const searchBooks = async () => {
    const response = await fetch(`/api/books?q=${encodeURIComponent(searchQuery)}`)
    const data = await response.json()
    if (data.items) {
      setSearchResults(data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        progress: 0,
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.png',
        buyLink: item.saleInfo?.buyLink || '#'
      })))
    }
  }

  const addToReadingList = async (book: Book) => {
    if (session?.user?.email) {
      await addDoc(collection(db, 'readingList'), {
        userId: session.user.email,
        ...book
      })
      setBooks([...books, book])
      setSearchResults(searchResults.filter(result => result.id !== book.id))
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to view your reading list.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Reading List</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2"
        />
        <Button onClick={searchBooks}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover mb-4" />
              <p>{book.authors?.join(', ')}</p>
              <Button onClick={() => addToReadingList(book)} className="mt-2">Add to Reading List</Button>
              <Button variant="outline" className="mt-2 ml-2" asChild>
                <a href={book.buyLink} target="_blank" rel="noopener noreferrer">Buy</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Current Reading List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover mb-4" />
              <p>{book.authors?.join(', ')}</p>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={book.progress}
                  onChange={(e) => updateProgress(book.id, parseInt(e.target.value))}
                />
                <p>Progress: {book.progress}%</p>
              </div>
              <Button variant="outline" className="mt-2" asChild>
                <a href={book.buyLink} target="_blank" rel="noopener noreferrer">Buy</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}