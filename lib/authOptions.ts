import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createUserIfNotExists } from '@/lib/utils/user-validator'

export const authOptions: NextAuthOptions = {
  // ✅ Retirer l'adaptateur pour éviter le conflit de schéma
  // adapter: supabaseAuthAdapter,
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ Identifiants manquants')
          return null
        }

        try {
          console.log('🔐 Tentative de connexion pour:', credentials.email)
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error) {
            console.error('❌ Erreur Supabase Auth:', error.message)
            return null
          }

          if (!data.user) {
            console.error('❌ Aucun utilisateur retourné')
            return null
          }

          console.log('✅ Connexion réussie pour:', data.user.email)
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0]
          }
        } catch (error) {
          console.error('❌ Erreur authorize:', error)
          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/business.manage'
        }
      }
    }),

    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid email profile https://graph.microsoft.com/Mail.Read offline_access'
        }
      }
    })
  ],

  session: {
    strategy: 'jwt', // ✅ Utiliser JWT au lieu de database
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Lors de la première connexion
      if (user) {
        token.userId = user.id
        token.email = user.email
      }

      // Si c'est une connexion OAuth, sauvegarder les tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
        token.expiresAt = account.expires_at
        
        // Sauvegarder en base pour les providers OAuth
        if (account.provider !== 'credentials' && user?.id && user?.email) {
          try {
            // ✅ Ensure user exists before inserting into connected_emails
            const userCreated = await createUserIfNotExists(user.id, user.email, user.name || undefined);
            
            if (!userCreated.success) {
              console.error('❌ Failed to create user:', userCreated.error);
              return token;
            }

            await supabaseAdmin
              .from('connected_emails')
              .upsert({
                user_id: user.id,
                email: user.email!,
                provider: account.provider,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type || 'Bearer',
                scope: account.scope,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id,provider'
              })
          } catch (error) {
            console.error('❌ Erreur sauvegarde token:', error)
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.userId = token.userId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.provider = token.provider as string
        session.expiresAt = token.expiresAt as number
        
        // Ajouter les infos utilisateur
        if (session.user) {
          session.user.id = token.userId as string
        }
      }
      return session
    },

    async signIn({ user, account, profile }) {
      try {
        // Pour les connexions par credentials, pas besoin de vérification email
        if (account?.provider === 'credentials') {
          return true
        }
        
        // Pour les connexions OAuth, vérifier/créer l'utilisateur
        if (account?.provider !== 'credentials') {
          // Vérifier si l'utilisateur existe déjà
          const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(user.id!)
          
          if (!existingUser.user) {
            // Get avatar URL based on provider
            let avatarUrl = user.image
            if (!avatarUrl && profile && account) {
              if (account.provider === 'google' && 'picture' in profile) {
                avatarUrl = profile.picture as string
              } else if (account.provider === 'azure-ad' && 'picture' in profile) {
                avatarUrl = profile.picture as string
              }
            }

            // Créer l'utilisateur via Supabase Auth avec email confirmé
            const { error } = await supabaseAdmin.auth.admin.createUser({
              email: user.email!,
              user_metadata: {
                full_name: user.name || profile?.name,
                avatar_url: avatarUrl,
                provider: account.provider
              },
              email_confirm: true // ✅ Confirmer automatiquement l'email pour OAuth
            })
            
            if (error) {
              console.error('❌ Erreur création utilisateur OAuth:', error)
              return false
            }
          }
        }
        
        return true
      } catch (error) {
        console.error('❌ Erreur signIn callback:', error)
        return false
      }
    }
  },

  pages: {
    signIn: '/login',
    error: '/login'
  },

  debug: process.env.NODE_ENV === 'development',
  
  secret: process.env.NEXTAUTH_SECRET,
}
