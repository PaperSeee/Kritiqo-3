import NextAuth from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const handler = NextAuth({
  ...authOptions,
  debug: process.env.NODE_ENV === 'development'
})

export { handler as GET, handler as POST }
