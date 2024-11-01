import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BookProps {
  book: {
    id: string;
    title: string;
    authors: string[];
    description: string;
    imageUrl: string;
  }
}

export function BookCard({ book }: BookProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <p className="text-sm text-gray-600 mb-2">{book.authors.join(', ')}</p>
        <p className="text-sm flex-grow line-clamp-3">{book.description}</p>
        <Button className="mt-4">Add to Reading List</Button>
      </CardContent>
    </Card>
  )
}