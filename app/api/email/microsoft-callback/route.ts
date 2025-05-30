import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/validation'
import { ensureUserExists } from '@/lib/utils/user-validator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // userId
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?error=oauth_cancelled`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?error=invalid_callback`)
    }

    // Validate the user ID from state
    const userId = validateUserId(state)

    // ✅ Check if user exists before proceeding
    const userValidation = await ensureUserExists(userId);
    if (!userValidation.exists) {
      console.error('❌ User validation failed for Microsoft callback:', {
        userId: userId.substring(0, 8) + '***',
        error: userValidation.error
      });
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?error=user_validation_failed`)
    }

    // Échanger le code pour un token
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/email/microsoft-callback`,
        scope: 'https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read offline_access',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      throw new Error('Erreur lors de l\'échange de token')
    }

    const tokenData = await tokenResponse.json()

    // Récupérer les infos utilisateur
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Erreur lors de la récupération des infos utilisateur')
    }

    const userData = await userResponse.json()

    // Sauvegarder dans Supabase avec gestion d'erreur robuste
    const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in

    try {
      const { error: dbError } = await supabaseAdmin
        .from('connected_emails')
        .upsert({
          user_id: userId,
          email: userData.mail || userData.userPrincipalName,
          provider: 'microsoft',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,email'
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw dbError
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?error=database_error`)
    }

    // Rediriger vers le dashboard avec succès
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?success=email_connected`)
  } catch (error) {
    console.error('Erreur dans le callback Microsoft:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/mails?error=connection_failed`)
  }
}
