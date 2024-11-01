'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { searchBooks } from '@/lib/googleBooks'
import { BookCard } from './BookCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export default function RecommendationForm() {
  const { data: session } = useSession()
  const [genres, setGenres] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Book[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const results = await searchBooks(genres.join(' '))
    setRecommendations(results)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <Input
          type="text"
          placeholder="Enter genres (comma-separated)"
          className="border p-2 mr-2"
          onChange={(e) => setGenres(e.target.value.split(',').map((g) => g.trim()))}
        />
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Get Recommendations
        </Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((book) => (
          <BookCard
            key={book.id}
            book={{
              id: book.id,
              title: book.volumeInfo.title,
              authors: book.volumeInfo.authors || [],
              description: book.volumeInfo.description || '',
              imageUrl: book.volumeInfo.imageLinks?.thumbnail || '',
            }}
          />
        ))}
      </div>
    </div>
  )
}