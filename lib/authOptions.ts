import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { decodeJwt } from 'jose'

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
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email offline_access https://graph.microsoft.com/Mail.Read"
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
          token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + (account.expires_in || 3600) * 1000
          
          // ✅ Vérification des scopes Microsoft Graph (debugging)
          if (account.provider === 'azure-ad' && account.access_token) {
            try {
              const decoded = decodeJwt(account.access_token);
              console.log("🔍 Microsoft Token Info:", {
                scopes: decoded.scp || decoded.roles || 'N/A',
                aud: decoded.aud,
                iss: decoded.iss,
                expires: new Date((decoded.exp || 0) * 1000).toISOString()
              });
              
              // Vérifier que le scope Mail.Read est présent
              const scopes = (decoded.scp as string) || '';
              if (scopes.includes('Mail.Read')) {
                console.log("✅ Scope Mail.Read confirmé dans le token Microsoft");
              } else {
                console.warn("⚠️ Scope Mail.Read manquant. Scopes présents:", scopes);
              }
            } catch (decodeError) {
              console.error("❌ Erreur décodage token Microsoft:", decodeError);
            }
          }
          
          // Sauvegarder dans Supabase si c'est un nouveau compte
          if ((account.provider === 'google' || account.provider === 'azure-ad') && account.access_token) {
            try {
              // Calculer expires_at si disponible
              const expiresAt = account.expires_at 
                ? account.expires_at 
                : Math.floor(Date.now() / 1000) + (account.expires_in || 3600);

              const { error } = await supabaseAdmin
                .from('connected_emails')
                .upsert({
                  user_id: user.id,
                  email: user.email,
                  provider: account.provider === 'azure-ad' ? 'azure-ad' : 'google',
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: expiresAt,
                  scope: account.scope || null,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id,provider'
                })
              
              if (error) {
                console.error("❌ Erreur lors de la sauvegarde dans Supabase:", error)
              } else {
                console.log("✅ Tokens sauvegardés dans Supabase avec expires_at et scope")
              }
            } catch (supabaseError) {
              console.error("❌ Erreur Supabase:", supabaseError)
            }
          }
        }

        // 🔁 Token refresh pour Microsoft
        if (token.provider === 'azure-ad' && token.expiresAt) {
          const now = Date.now()
          
          // Token expiré ou expire dans moins d'1 minute → refresh
          if (now > (token.expiresAt as number) - 60_000) {
            console.log("🔄 Tentative de refresh du token Microsoft...")
            
            try {
              const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                  client_id: process.env.AZURE_AD_CLIENT_ID!,
                  client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
                  grant_type: "refresh_token",
                  refresh_token: token.refreshToken as string,
                  scope: "https://graph.microsoft.com/Mail.Read offline_access openid profile email",
                }),
              });

              const refreshed = await response.json();

              if (refreshed.access_token) {
                console.log("✅ Token Microsoft refreshed avec succès")
                token.accessToken = refreshed.access_token;
                token.expiresAt = Date.now() + refreshed.expires_in * 1000;
                token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
                
                // Mettre à jour dans Supabase
                try {
                  await supabaseAdmin
                    .from('connected_emails')
                    .update({
                      access_token: refreshed.access_token,
                      refresh_token: refreshed.refresh_token ?? token.refreshToken,
                      expires_at: Math.floor(token.expiresAt as number / 1000),
                      updated_at: new Date().toISOString()
                    })
                    .eq('user_id', token.userId as string)
                    .eq('provider', 'azure-ad');
                } catch (supabaseError) {
                  console.error("❌ Erreur mise à jour Supabase après refresh:", supabaseError);
                }
              } else {
                console.error("❌ Microsoft refresh failed:", refreshed);
              }
            } catch (refreshError) {
              console.error("❌ Erreur lors du refresh token Microsoft:", refreshError);
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
      session.expiresAt = token.expiresAt
      return session
    }
  },

  debug: process.env.NODE_ENV === 'development'
}
