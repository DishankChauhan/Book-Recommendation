import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      preferences?: {
        genres?: string[]
        authors?: string[]
        monthlyGoal?: number
      } | null
    }
  }

  interface User {
    id: string
    preferences?: {
      genres?: string[]
      authors?: string[]
      monthlyGoal?: number
    } | null
  }
}