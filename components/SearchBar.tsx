'use client'

import { useState } from 'react'
import { searchBooks } from '@/lib/googleBooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])

  const handleSearch = async () => {
    const searchResults = await searchBooks(query)
    setResults(searchResults)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.volumeInfo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}