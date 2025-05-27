import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Configuration Google manquante' },
        { status: 500 }
      )
    }

    // Paramètres OAuth2 pour Google Business Profile
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google-business`,
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
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Erreur OAuth Google Business:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la redirection OAuth' },
      { status: 500 }
    )
  }
}
