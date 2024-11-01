'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface BookClub {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
}

export default function BookClubs() {
  const { data: session } = useSession()
  const [clubs, setClubs] = useState<BookClub[]>([])
  const [newClubName, setNewClubName] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      fetchBookClubs()
    }
  }, [session])

  const fetchBookClubs = async () => {
    const querySnapshot = await getDocs(collection(db, 'bookClubs'))
    const clubsData: BookClub[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<BookClub, 'id'>
    }))
    setClubs(clubsData)
  }

  const createBookClub = async () => {
    if (session?.user?.email) {
      await addDoc(collection(db, 'bookClubs'), {
        name: newClubName,
        createdBy: session.user.email,
        members: [session.user.email]
      })
      setNewClubName('')
      fetchBookClubs()
    }
  }

  const deleteBookClub = async (clubId: string) => {
    await deleteDoc(doc(db, 'bookClubs', clubId))
    fetchBookClubs()
  }

  const joinBookClub = async (clubId: string) => {
    if (session?.user?.email) {
      const clubRef = doc(db, 'bookClubs', clubId)
      await updateDoc(clubRef, {
        members: [...clubs.find(club => club.id === clubId)!.members, session.user.email]
      })
      fetchBookClubs()
    }
  }

  if (!session) {
    return <div>Please sign in to view book clubs.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Clubs</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="New club name"
          value={newClubName}
          onChange={(e) => setNewClubName(e.target.value)}
        />
        <Button onClick={createBookClub} className="mt-2">Create Book Club</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <CardTitle>{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Members: {club.members.length}</p>
              {club.createdBy === session.user?.email ? (
                <Button onClick={() => deleteBookClub(club.id)}>Delete Club</Button>
              ) : !club.members.includes(session.user?.email!) ? (
                <Button onClick={() => joinBookClub(club.id)}>Join Club</Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}