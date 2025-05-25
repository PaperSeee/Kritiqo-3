import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { supabaseAdmin } from './supabase-admin'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/gmail.readonly email profile openid"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common",
      authorization: {
        params: {
          scope: "openid profile email offline_access https://graph.microsoft.com/Mail.Read"
        }
      }
    }),
  ],
  
  // Configuration des cookies pour éviter l'erreur "State cookie was missing"
  cookies: {
    // Cookie d'état utilisé pendant le flow OAuth
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax", // Permet au cookie de passer lors des redirections OAuth
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS en prod, HTTP en dev
        maxAge: 900, // 15 minutes
      },
    },
    // Cookie de session
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 jours
      },
    },
    // Cookie CSRF
    csrfToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Host-next-auth.csrf-token" 
        : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user.email) return false

      try {
        // Créer ou récupérer l'utilisateur
        const { data: existingUser, error: userError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        let userId = existingUser?.id

        if (!existingUser) {
          const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert({
              email: user.email,
              name: user.name,
              image: user.image
            })
            .select('id')
            .single()

          if (createError) throw createError
          userId = newUser.id
        }

        // Sauvegarder la connexion email
        const { error: emailError } = await supabaseAdmin
          .from('connected_emails')
          .upsert({
            user_id: userId,
            email: user.email,
            provider: account.provider,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type || 'Bearer',
            scope: account.scope,
            updated_at: new Date().toISOString()
          })

        if (emailError) throw emailError

        return true
      } catch (error) {
        console.error('Erreur lors de la connexion:', error)
        return false
      }
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
        token.expiresAt = account.expires_at
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Récupérer l'utilisateur depuis la DB
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (user) {
          session.userId = user.id
        }
      }
      
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.provider = token.provider as string
      session.expiresAt = token.expiresAt as number
      return session
    },
  },
  pages: {
    error: '/error',
  },
}
