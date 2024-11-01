'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UserProfile {
  genres: string[];
  authors: string[];
  preferences: string;
  monthlyGoal: number;
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    genres: [],
    authors: [],
    preferences: '',
    monthlyGoal: 0
  })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserProfile(session.user.email)
    }
  }, [session, status])

  const fetchUserProfile = async (email: string) => {
    const userRef = doc(db, 'users', email)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setProfile(userSnap.data() as UserProfile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'authenticated' && session?.user?.email) {
      const userRef = doc(db, 'users', session.user.email)
      await setDoc(userRef, profile, { merge: true })
      router.push('/recommendations')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="genres">Favorite Genres</Label>
          <Input
            id="genres"
            value={profile.genres.join(', ')}
            onChange={(e) => setProfile({...profile, genres: e.target.value.split(',').map(g => g.trim())})}
            placeholder="e.g. Science Fiction, Fantasy, Mystery"
          />
        </div>
        <div>
          <Label htmlFor="authors">Favorite Authors</Label>
          <Input
            id="authors"
            value={profile.authors.join(', ')}
            onChange={(e) => setProfile({...profile, authors: e.target.value.split(',').map(a => a.trim())})}
            placeholder="e.g. J.K. Rowling, Stephen King, Agatha Christie"
          />
        </div>
        <div>
          <Label htmlFor="preferences">Reading Preferences</Label>
          <Input
            id="preferences"
            value={profile.preferences}
            onChange={(e) => setProfile({...profile, preferences: e.target.value})}
            placeholder="e.g. Long novels, Short stories, Non-fiction"
          />
        </div>
        <div>
          <Label htmlFor="monthlyGoal">Monthly Reading Goal (number of books)</Label>
          <Input
            id="monthlyGoal"
            type="number"
            value={profile.monthlyGoal}
            onChange={(e) => setProfile({...profile, monthlyGoal: parseInt(e.target.value)})}
          />
        </div>
        <Button type="submit">Save Profile</Button>
      </form>
    </div>
  )
}