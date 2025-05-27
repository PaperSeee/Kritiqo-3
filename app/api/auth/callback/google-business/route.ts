import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Google Business Callback reçu')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    // Log des paramètres reçus
    console.log('📋 Paramètres callback:', {
      code: code ? 'PRESENT' : 'ABSENT',
      error,
      state,
      fullUrl: request.url
    })

    if (error) {
      console.error('❌ Erreur OAuth Google Business:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?error=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('❌ Code d\'autorisation manquant')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?error=missing_code`)
    }

    if (state !== 'google-business') {
      console.error('❌ State invalide:', state)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?error=invalid_state`)
    }

    // Échanger le code contre un token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google-business`
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Erreur échange token:', {
        status: tokenResponse.status,
        error: errorText
      })
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()
    
    console.log('✅ Token Google Business obtenu')
    
    // TODO: Sauvegarder le token en base pour Google Business
    // Pour l'instant, rediriger vers la page avec succès
    
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?success=google_business_connected`)

  } catch (error) {
    console.error('❌ Erreur callback Google Business:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/restaurants/add?error=callback_error`)
  }
}
