import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Vérifier si on est en développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Debug OAuth disponible seulement en développement' },
      { status: 403 }
    )
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL
    
    // Configuration actuelle
    const config = {
      baseUrl,
      googleClientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
      azureClientId: process.env.AZURE_AD_CLIENT_ID?.substring(0, 20) + '...',
      redirectUris: {
        google: `${baseUrl}/api/auth/callback/google`,
        azureAd: `${baseUrl}/api/auth/callback/azure-ad`,
        googleBusiness: `${baseUrl}/api/auth/callback/google-business`
      },
      environment: process.env.NODE_ENV,
      debug: process.env.NEXTAUTH_DEBUG === 'true'
    }

    // Vérifications
    const checks = {
      nextauthUrl: !!process.env.NEXTAUTH_URL,
      googleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      azureClientId: !!process.env.AZURE_AD_CLIENT_ID,
      azureClientSecret: !!process.env.AZURE_AD_CLIENT_SECRET,
      azureTenantId: !!process.env.AZURE_AD_TENANT_ID
    }

    // Problèmes détectés
    const issues = []
    
    if (!baseUrl) {
      issues.push('NEXTAUTH_URL manquant - requis pour les redirect_uri')
    } else if (!baseUrl.startsWith('http')) {
      issues.push('NEXTAUTH_URL doit commencer par http:// ou https://')
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      issues.push('GOOGLE_CLIENT_ID manquant')
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      issues.push('GOOGLE_CLIENT_SECRET manquant')
    }

    // Instructions pour Google Cloud Console
    const instructions = [
      '1. Aller sur https://console.cloud.google.com/',
      '2. Sélectionner votre projet',
      '3. Aller dans "APIs & Services" > "Credentials"',
      '4. Cliquer sur votre "OAuth 2.0 Client ID"',
      '5. Dans "Authorized redirect URIs", ajouter:',
      `   - ${config.redirectUris.google}`,
      `   - ${config.redirectUris.azureAd}`,
      `   - ${config.redirectUris.googleBusiness}`,
      '6. Sauvegarder'
    ]

    return NextResponse.json({
      status: issues.length === 0 ? 'OK' : 'ERREURS_DETECTEES',
      config,
      checks,
      issues,
      instructions,
      note: 'Assurez-vous que les redirect_uri ci-dessus sont exactement configurés dans Google Cloud Console'
    })

  } catch (error) {
    console.error('❌ Erreur debug OAuth:', error)
    return NextResponse.json(
      { error: 'Erreur lors du debug' },
      { status: 500 }
    )
  }
}
