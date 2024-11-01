import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { JWT } from 'next-auth/jwt'

// Initialize Firebase Admin if it hasn't been initialized
const firebaseApp = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    })
  : getApps()[0]

const firestore = getFirestore(firebaseApp)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  adapter: FirestoreAdapter(firestore),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token, user }: { session: Session; token: JWT; user: User }): Promise<Session> {
      if (session?.user) {
        session.user.id = token.sub ?? ''
        // Fetch user preferences from Firestore
        const userDoc = await firestore.collection('users').doc(session.user.id).get()
        if (userDoc.exists) {
          const userData = userDoc.data()
          session.user.preferences = userData?.preferences || null
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }: { token: JWT; user?: User; account?: any; profile?: any }): Promise<JWT> {
      if (user) {
        token.uid = user.id
      }
      return token
    }
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }