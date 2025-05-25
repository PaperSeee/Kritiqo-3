import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid email profile https://graph.microsoft.com/Mail.Read offline_access"
        }
      }
    })
  ],
  
  pages: {
    error: "/error",
    signIn: "/login"
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("🔍 Tentative de connexion:")
        console.log("- Email:", profile?.email)
        console.log("- Provider:", account?.provider)
        console.log("- Access Token disponible:", !!account?.access_token)
        console.log("- Refresh Token disponible:", !!account?.refresh_token)
        
        if (!profile?.email) {
          console.error("❌ Email manquant dans le profil")
          return false
        }

        // Pendant le développement, autoriser toutes les connexions
        if (process.env.NODE_ENV === 'development') {
          console.log("✅ Mode développement - connexion autorisée")
          return true
        }

        // En production, vous pouvez ajouter des vérifications supplémentaires ici
        console.log("✅ Connexion autorisée")
        return true
      } catch (err) {
        if (err instanceof Error) {
          console.error("❌ Erreur dans le callback signIn:", err.message, err.name)
        } else {
          console.error("❌ Erreur inconnue dans le callback signIn:", JSON.stringify(err))
        }
        return false
      }
    },

    async jwt({ token, account, user }) {
      try {
        // Première connexion - sauvegarder les tokens
        if (account && user) {
          console.log("💾 Sauvegarde des tokens dans JWT")
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.provider = account.provider
          token.userId = user.id
          
          // Sauvegarder dans Supabase si c'est un nouveau compte
          if ((account.provider === 'google' || account.provider === 'azure-ad') && account.access_token) {
            try {
              const { error } = await supabaseAdmin
                .from('connected_emails')
                .upsert({
                  user_id: user.id,
                  email: user.email,
                  provider: account.provider === 'azure-ad' ? 'azure-ad' : 'google',
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id,provider'
                })
              
              if (error) {
                console.error("❌ Erreur lors de la sauvegarde dans Supabase:", error)
              } else {
                console.log("✅ Tokens sauvegardés dans Supabase")
              }
            } catch (supabaseError) {
              console.error("❌ Erreur Supabase:", supabaseError)
            }
          }
        }
        
        return token
      } catch (error) {
        console.error("❌ Erreur dans le callback JWT:", error)
        return token
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.provider = token.provider
      session.userId = token.userId
      return session
    }
  }
}
