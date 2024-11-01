'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Users } from "lucide-react"

interface Friend {
  id: string
  name: string
  email: string
}

interface BookClub {
  id: string
  name: string
  members: string[]
  currentBook: string
}

export default function Friends() {
  const { data: session, status } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [bookClubs, setBookClubs] = useState<BookClub[]>([])
  const [newFriendEmail, setNewFriendEmail] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      fetchFriends(session.user.email)
      fetchBookClubs(session.user.email)
    }
  }, [session])

  const fetchFriends = async (email: string) => {
    const q = query(collection(db, 'friends'), where('userEmail', '==', email))
    const querySnapshot = await getDocs(q)
    const friendsData: Friend[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Friend, 'id'>
    }))
    setFriends(friendsData)
  }

  const fetchBookClubs = async (email: string) => {
    const q = query(collection(db, 'bookClubs'), where('members', 'array-contains', email))
    const querySnapshot = await getDocs(q)
    const bookClubsData: BookClub[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<BookClub, 'id'>
    }))
    setBookClubs(bookClubsData)
  }

  const addFriend = async () => {
    if (session?.user?.email) {
      // In a real app, you'd send an invitation and wait for acceptance
      await addDoc(collection(db, 'friends'), {
        userEmail: session.user.email,
        friendEmail: newFriendEmail,
        name: 'New Friend', // In a real app, you'd get this from the user's profile
      })
      fetchFriends(session.user.email)
      setNewFriendEmail('')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in to view your friends.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
      <div className="flex mb-4">
        <Input
          type="email"
          placeholder="Friend's email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
          
          className="mr-2"
        />
        <Button onClick={addFriend}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Friend
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <Card key={friend.id}>
            <CardHeader>
              <CardTitle>{friend.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{friend.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Your Book Clubs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookClubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <CardTitle>{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Current Book: {club.currentBook}</p>
              <p>Members: {club.members.length}</p>
              <Button variant="outline" className="mt-2">
                <Users className="mr-2 h-4 w-4" /> View Club
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}