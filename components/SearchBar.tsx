import Image from 'next/image'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

interface Book {
  id: string
  title: string
  authors: string[]
  imageUrl: string
}

interface SearchBarProps {
  onSearch: (query: string) => void
  onBookSelect: (book: Book) => void
}

export function SearchBar({ onSearch, onBookSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])

  const handleSearch = async () => {
    onSearch(query)
    const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    if (data.items) {
      setResults(data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.png'
      })))
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((book) => (
            <li key={book.id} className="flex items-center space-x-2 cursor-pointer" onClick={() => onBookSelect(book)}>
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={50}
                height={75}
                className="object-cover"
              />
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-500">{book.authors.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}