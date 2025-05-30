import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { validateUserId } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Validate user ID format
    const userId = validateUserId(session.userId)

    // Construire l'URL d'autorisation Microsoft
    const clientId = process.env.AZURE_AD_CLIENT_ID
    const tenantId = process.env.AZURE_AD_TENANT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/email/microsoft-callback`
    
    if (!clientId || !tenantId) {
      return NextResponse.json(
        { error: 'Configuration Microsoft manquante' },
        { status: 500 }
      )
    }

    const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`)
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_mode', 'query')
    authUrl.searchParams.set('scope', 'https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read offline_access')
    authUrl.searchParams.set('state', userId)

    return NextResponse.json({ 
      authUrl: authUrl.toString() 
    })
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL Microsoft:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
