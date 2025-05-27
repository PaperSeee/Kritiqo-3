import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Fonction pour valider la configuration OAuth
function validateOAuthConfig() {
  const requiredEnvVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
  };

  const missing = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement OAuth manquantes:', missing);
    throw new Error(`Variables manquantes: ${missing.join(', ')}`);
  }

  if (process.env.NEXTAUTH_DEBUG === 'true') {
    const baseUrl = process.env.NEXTAUTH_URL;
    console.log('🔍 OAuth Debug - Base URL:', baseUrl);
    console.log('🔍 OAuth Debug - Google redirect_uri:', `${baseUrl}/api/auth/callback/google`);
    console.log('🔍 OAuth Debug - Azure redirect_uri:', `${baseUrl}/api/auth/callback/azure-ad`);
  }
  
  return true;
}

// Valider la config au démarrage
validateOAuthConfig();

export const authOptions: NextAuthOptions = {
  // ✅ Utiliser JWT pour éviter les erreurs de session cookie trop long
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          prompt: "consent", // ✅ Évite l'erreur AADSTS70000
          scope: "openid profile email offline_access User.Read",
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
        if (process.env.NEXTAUTH_DEBUG === 'true') {
          console.log("🔍 OAuth SignIn Debug:")
          console.log("- Provider:", account?.provider)
          console.log("- Email:", profile?.email)
          console.log("- Access Token disponible:", !!account?.access_token)
          console.log("- Refresh Token disponible:", !!account?.refresh_token)
        }
        
        if (!profile?.email) {
          console.error("❌ Email manquant dans le profil")
          return false
        }

        // Mode développement - autoriser toutes les connexions
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NEXTAUTH_DEBUG === 'true') {
            console.log("✅ Mode développement - connexion autorisée")
          }
          return true
        }

        // En production, ajouter des vérifications supplémentaires si nécessaire
        return true
      } catch (err) {
        console.error("❌ Erreur dans le callback signIn:", err)
        return false
      }
    },

    async jwt({ token, account, user }) {
      try {
        // ✅ Première connexion - sauvegarder les tokens
        if (account && user) {
          if (process.env.NEXTAUTH_DEBUG === 'true') {
            console.log("💾 Sauvegarde des tokens dans JWT pour:", account.provider)
          }
          
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
          token.provider = account.provider
          token.userId = user.id
          token.expiresAt = account.expires_at 
            ? Number(account.expires_at) * 1000 
            : Date.now() + (Number(account.expires_in) || 3600) * 1000
          
          // Sauvegarder dans Supabase
          if ((account.provider === 'google' || account.provider === 'azure-ad') && account.access_token) {
            try {
              const expiresAt = account.expires_at 
                ? Number(account.expires_at)
                : Math.floor(Date.now() / 1000) + (Number(account.expires_in) || 3600);

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
              } else if (process.env.NEXTAUTH_DEBUG === 'true') {
                console.log("✅ Tokens sauvegardés dans Supabase")
              }

              // 🆕 Fetch Google Business locations automatically
              if (account.provider === 'google' && account.scope?.includes('mybusiness')) {
                await fetchAndStoreGoogleBusinessLocations(user.id, account.access_token)
              }
            } catch (supabaseError) {
              console.error("❌ Erreur Supabase:", supabaseError)
            }
          }
        }

        // ✅ Gestion du refresh token pour Azure AD
        if (token.provider === 'azure-ad' && token.expiresAt && token.refreshToken) {
          const now = Date.now()
          
          // Token expiré ou expire dans moins de 5 minutes
          if (now > (token.expiresAt as number) - 300_000) {
            if (process.env.NEXTAUTH_DEBUG === 'true') {
              console.log("🔄 Tentative de refresh du token Azure AD...")
            }
            
            try {
              const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                  client_id: process.env.AZURE_AD_CLIENT_ID!,
                  client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
                  grant_type: "refresh_token",
                  refresh_token: token.refreshToken as string,
                  scope: "openid profile email offline_access User.Read",
                }),
              });

              if (response.ok) {
                const refreshed = await response.json();
                
                if (refreshed.access_token) {
                  if (process.env.NEXTAUTH_DEBUG === 'true') {
                    console.log("✅ Token Azure AD refreshed avec succès")
                  }
                  
                  token.accessToken = refreshed.access_token;
                  token.expiresAt = Date.now() + Number(refreshed.expires_in) * 1000;
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
                }
              } else {
                const errorText = await response.text()
                console.error("❌ Azure AD refresh failed:", errorText);
              }
            } catch (refreshError) {
              console.error("❌ Erreur lors du refresh token Azure AD:", refreshError);
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
      // ✅ Enrichir la session avec les tokens
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.provider = token.provider
      session.userId = token.userId
      session.expiresAt = token.expiresAt
      
      if (process.env.NEXTAUTH_DEBUG === 'true') {
        console.log("📋 Session enrichie avec tokens pour provider:", token.provider)
      }
      
      return session
    }
  },

  debug: process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_DEBUG === 'true'
}

// 🆕 Function to fetch Google Business locations
async function fetchAndStoreGoogleBusinessLocations(userId: string, accessToken: string) {
  try {
    console.log("🏪 Fetching Google Business locations...")
    
    // Step 1: Get accounts
    const accountsResponse = await fetch('https://mybusiness.googleapis.com/v4/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!accountsResponse.ok) {
      throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`)
    }

    const accountsData = await accountsResponse.json()
    const accounts = accountsData.accounts || []

    if (accounts.length === 0) {
      console.log("ℹ️ No Google Business accounts found")
      return
    }

    // Step 2: Get locations for each account
    for (const account of accounts) {
      const accountId = account.name.replace('accounts/', '')
      
      const locationsResponse = await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        const locations = locationsData.locations || []

        // Step 3: Store locations in Supabase
        for (const location of locations) {
          const { error } = await supabaseAdmin
            .from('google_business_locations')
            .upsert({
              user_id: userId,
              location_id: location.name,
              name: location.locationName || location.name,
              address: location.address ? 
                `${location.address.addressLines?.join(', ') || ''}, ${location.address.locality || ''}, ${location.address.administrativeArea || ''}`.trim() 
                : '',
              phone: location.primaryPhone || null,
              website: location.websiteUrl || null,
              state: location.locationState || 'UNVERIFIED',
              place_id: location.metadata?.placeId || null,
              google_data: location,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,location_id'
            })

          if (error) {
            console.error("❌ Error storing location:", error)
          }
        }

        console.log(`✅ Stored ${locations.length} locations for account ${accountId}`)
      }
    }
  } catch (error) {
    console.error("❌ Error fetching Google Business locations:", error)
  }
}
