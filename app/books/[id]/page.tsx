'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getBookDetails } from '@/lib/googleBooks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface BookDetails {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
    averageRating?: number;
    ratingsCount?: number;
  };
}

export default function BookDetails() {
  const params = useParams()
  const [book, setBook] = useState<BookDetails | null>(null)

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (params?.id && typeof params.id === 'string') {
        const details = await getBookDetails(params.id)
        setBook(details)
      }
    }
    fetchBookDetails()
  }, [params?.id])

  if (!book) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{book.volumeInfo.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {book.volumeInfo.imageLinks?.thumbnail && (
            <div className="float-left mr-4 mb-4">
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={`Cover of ${book.volumeInfo.title}`}
                width={128}
                height={192}
              />
            </div>
          )}
          <p className="text-sm text-gray-600 mb-2">{book.volumeInfo.authors?.join(', ')}</p>
          <p>{book.volumeInfo.description}</p>
          <h3 className="text-xl font-bold mt-4">User Reviews</h3>
          {book.volumeInfo.averageRating ? (
            <p>Average rating: {book.volumeInfo.averageRating} ({book.volumeInfo.ratingsCount} ratings)</p>
          ) : (
            <p>No ratings yet</p>
          )}
          <Button className="mt-4">Add to Reading List</Button>
        </CardContent>
      </Card>
    </div>
  )
}