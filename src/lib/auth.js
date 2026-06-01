import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          return null
        }

        if (email !== adminEmail) {
          return null
        }

        if (password !== adminPassword) {
          return null
        }

        return {
          id: "1",
          email: adminEmail,
          name: "Admin",
        }
      },
    }),
  ],
})
