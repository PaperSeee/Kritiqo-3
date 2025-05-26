import { supabaseAdmin } from '@/lib/supabase-admin';

interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
}

export async function getValidAccessToken(userId: string, provider: 'google' | 'azure-ad' = 'google'): Promise<string | null> {
  try {
    console.log(`🔍 Vérification du token pour user ${userId} (provider: ${provider})`);

    // Récupérer le token actuel depuis Supabase
    const { data: connectedEmail, error } = await supabaseAdmin
      .from('connected_emails')
      .select('access_token, refresh_token, expires_at, updated_at')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();

    if (error || !connectedEmail) {
      console.error(`❌ Aucun compte ${provider} trouvé pour l'utilisateur ${userId}`);
      return null;
    }

    if (!connectedEmail.access_token) {
      console.error(`❌ Access token manquant pour ${provider}`);
      return null;
    }

    // Vérifier si le token est encore valide (avec marge de sécurité de 5 minutes)
    const now = Date.now();
    const expiresAt = connectedEmail.expires_at ? connectedEmail.expires_at * 1000 : 0;
    const marginMs = 5 * 60 * 1000; // 5 minutes

    if (expiresAt > now + marginMs) {
      console.log(`✅ Token ${provider} encore valide (expire dans ${Math.round((expiresAt - now) / 1000 / 60)} minutes)`);
      return connectedEmail.access_token;
    }

    console.log(`🔄 Token ${provider} expiré ou bientôt expiré, tentative de refresh...`);

    // Tentative de refresh du token
    if (!connectedEmail.refresh_token) {
      console.error(`❌ Refresh token manquant pour ${provider}`);
      return null;
    }

    if (provider === 'google') {
      return await refreshGoogleToken(userId, connectedEmail.refresh_token);
    } else if (provider === 'azure-ad') {
      return await refreshAzureToken(userId, connectedEmail.refresh_token);
    }

    return null;

  } catch (error) {
    console.error(`❌ Erreur lors de la vérification du token ${provider}:`, error);
    return null;
  }
}

async function refreshGoogleToken(userId: string, refreshToken: string): Promise<string | null> {
  try {
    console.log('🔄 Refresh du token Google...');

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur refresh Google token:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }

    const tokenData: TokenRefreshResponse = await response.json();
    
    // Calculer la nouvelle date d'expiration
    const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;

    // Sauvegarder le nouveau token dans Supabase
    const { error: updateError } = await supabaseAdmin
      .from('connected_emails')
      .update({
        access_token: tokenData.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('provider', 'google');

    if (updateError) {
      console.error('❌ Erreur sauvegarde nouveau token Google:', updateError);
      return null;
    }

    console.log(`✅ Token Google rafraîchi avec succès (expire dans ${tokenData.expires_in} secondes)`);
    return tokenData.access_token;

  } catch (error) {
    console.error('❌ Erreur lors du refresh Google token:', error);
    return null;
  }
}

async function refreshAzureToken(userId: string, refreshToken: string): Promise<string | null> {
  try {
    console.log('🔄 Refresh du token Azure AD...');

    const response = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/Mail.Read offline_access',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur refresh Azure token:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }

    const tokenData: TokenRefreshResponse = await response.json();
    
    // Calculer la nouvelle date d'expiration
    const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;

    // Sauvegarder le nouveau token dans Supabase
    const { error: updateError } = await supabaseAdmin
      .from('connected_emails')
      .update({
        access_token: tokenData.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('provider', 'azure-ad');

    if (updateError) {
      console.error('❌ Erreur sauvegarde nouveau token Azure:', updateError);
      return null;
    }

    console.log(`✅ Token Azure AD rafraîchi avec succès (expire dans ${tokenData.expires_in} secondes)`);
    return tokenData.access_token;

  } catch (error) {
    console.error('❌ Erreur lors du refresh Azure token:', error);
    return null;
  }
}

export async function getGmailAccessToken(userId: string): Promise<string | null> {
  try {
    console.log(`🔍 Récupération du token Gmail pour l'utilisateur ${userId}`);

    // Récupérer les tokens Gmail depuis Supabase
    const { data: gmailAccount, error } = await supabaseAdmin
      .from('connected_emails')
      .select('access_token, refresh_token, expires_at, email')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (error || !gmailAccount) {
      console.log(`❌ Aucun compte Gmail lié pour l'utilisateur ${userId}`);
      return null;
    }

    if (!gmailAccount.access_token) {
      console.error('❌ Access token Gmail manquant');
      return null;
    }

    // Vérifier si le token est encore valide (avec marge de 5 minutes)
    const now = Date.now();
    const expiresAt = gmailAccount.expires_at ? gmailAccount.expires_at * 1000 : 0;
    const marginMs = 5 * 60 * 1000; // 5 minutes

    if (expiresAt > now + marginMs) {
      console.log(`✅ Token Gmail valide pour ${gmailAccount.email} (expire dans ${Math.round((expiresAt - now) / 1000 / 60)} minutes)`);
      return gmailAccount.access_token;
    }

    console.log(`🔄 Token Gmail expiré pour ${gmailAccount.email}, rafraîchissement nécessaire...`);

    // Vérifier si on a un refresh token
    if (!gmailAccount.refresh_token) {
      console.error('❌ Refresh token Gmail manquant - reconnexion requise');
      return null;
    }

    // Rafraîchir le token Gmail
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: gmailAccount.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur refresh token Gmail:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        return null;
      }

      const tokenData: TokenRefreshResponse = await response.json();
      
      // Calculer la nouvelle date d'expiration
      const newExpiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;

      // Sauvegarder le nouveau token
      const { error: updateError } = await supabaseAdmin
        .from('connected_emails')
        .update({
          access_token: tokenData.access_token,
          expires_at: newExpiresAt,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('provider', 'google');

      if (updateError) {
        console.error('❌ Erreur sauvegarde nouveau token Gmail:', updateError);
        return null;
      }

      console.log(`✅ Token Gmail rafraîchi avec succès pour ${gmailAccount.email} (expire dans ${tokenData.expires_in} secondes)`);
      return tokenData.access_token;

    } catch (refreshError) {
      console.error('❌ Erreur lors du rafraîchissement du token Gmail:', refreshError);
      return null;
    }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token Gmail:', error);
    return null;
  }
}
