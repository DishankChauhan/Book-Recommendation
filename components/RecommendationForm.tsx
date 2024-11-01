import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RecommendationFormProps {
  onSubmit: (genres: string[], authors: string[]) => void
}

export function RecommendationForm({ onSubmit }: RecommendationFormProps) {
  const { data: session } = useSession()
  const [genres, setGenres] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [newGenre, setNewGenre] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

  const handleAddGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre])
      setNewGenre('')
    }
  }

  const handleAddAuthor = () => {
    if (newAuthor && !authors.includes(newAuthor)) {
      setAuthors([...authors, newAuthor])
      setNewAuthor('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(genres, authors)
  }

  if (!session) {
    return <p>Please sign in to set your preferences.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="genre">Favorite Genres</Label>
        <div className="flex space-x-2">
          <Input
            id="genre"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add a genre"
          />
          <Button type="button" onClick={handleAddGenre}>Add</Button>
        </div>
        <ul className="mt-2">
          {genres.map((genre) => (
            <li key={genre} className="inline-block bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm mr-2 mb-2">{genre}</li>
          ))}
        </ul>
      </div>
      <div>
        <Label htmlFor="author">Favorite Authors</Label>
        <div className="flex space-x-2">
          <Input
            id="author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Add an author"
          />
          <Button type="button" onClick={handleAddAuthor}>Add</Button>
        </div>
        <ul className="mt-2">
          {authors.map((author) => (
            <li key={author} className="inline-block bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm mr-2 mb-2">{author}</li>
          ))}
        </ul>
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  )
}