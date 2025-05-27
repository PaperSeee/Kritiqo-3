import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const baseUrl = process.env.NEXTAUTH_URL
    
    if (!clientId) {
      console.error('❌ GOOGLE_CLIENT_ID manquant')
      return NextResponse.json(
        { error: 'Configuration Google manquante' },
        { status: 500 }
      )
    }

    if (!baseUrl) {
      console.error('❌ NEXTAUTH_URL manquant')
      return NextResponse.json(
        { error: 'NEXTAUTH_URL manquant' },
        { status: 500 }
      )
    }

    // Callback URL corrigé pour Google Business
    const redirectUri = `${baseUrl}/api/auth/callback/google-business`
    
    // Log pour debug
    console.log('🔍 Google Business OAuth Debug:')
    console.log('- Client ID:', clientId?.substring(0, 20) + '...')
    console.log('- Base URL:', baseUrl)
    console.log('- Redirect URI:', redirectUri)

    // Paramètres OAuth2 pour Google Business Profile
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/plus.business.manage',
        'openid',
        'email',
        'profile'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: 'google-business'
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('🚀 Redirection vers:', authUrl)
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('❌ Erreur OAuth Google Business:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la redirection OAuth' },
      { status: 500 }
    )
  }
}
