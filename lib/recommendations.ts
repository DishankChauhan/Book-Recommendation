import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { searchBooks } from './googleBooks'

export async function getRecommendations(userId: string) {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User not found')
  }

  const userData = userSnap.data()
  const { genres, authors, preferences } = userData

  // Combine user preferences to create a search query
  const searchQuery = [...genres, ...authors, ...preferences.split(',')].join(' ')

  // Get book recommendations based on the search query
  const recommendations = await searchBooks(searchQuery)

  // TODO: Implement more sophisticated recommendation logic here
  // This could include collaborative filtering, content-based filtering, or machine learning techniques

  return recommendations.slice(0, 10) // Return top 10 recommendations
}