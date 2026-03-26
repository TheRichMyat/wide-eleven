import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getAdminClient } from './supabase'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabaseAdmin = getAdminClient()

        // Check bootstrap admin from env
        const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL
        const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD

        if (
          bootstrapEmail &&
          bootstrapPassword &&
          credentials.email === bootstrapEmail &&
          credentials.password === bootstrapPassword
        ) {
          // Auto-create bootstrap admin in DB if not exists
          await supabaseAdmin.from('admin_users').upsert(
            {
              email: bootstrapEmail,
              password_hash: await bcrypt.hash(bootstrapPassword, 12),
            },
            { onConflict: 'email', ignoreDuplicates: true }
          )
        }

        const { data: user, error } = await supabaseAdmin
          .from('admin_users')
          .select('id, email, password_hash')
          .eq('email', credentials.email)
          .single()

        if (error || !user) return null

        const valid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!valid) return null

        return { id: user.id, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.email = user.email }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
}
