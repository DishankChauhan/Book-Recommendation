'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
}

export default function BookSearch() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])

  const searchBooks = async () => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`)
    const data = await response.json()
    if (data.items) {
      setBooks(data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        description: item.volumeInfo.description || 'No description available',
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.png'
      })))
    }
  }

  const addToReadingList = async (book: Book) => {
    if (session?.user?.email) {
      await addDoc(collection(db, 'readingList'), {
        userId: session.user.email,
        ...book,
        progress: 0
      })
      alert('Book added to reading list!')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Books</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
        <Button onClick={searchBooks}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover mb-4" />
              <p>{book.authors.join(', ')}</p>
              <p className="mt-2">{book.description}</p>
              
              <Button onClick={() => addToReadingList(book)} className="mt-4">Add to Reading List</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}