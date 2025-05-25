import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Début de la récupération des emails Microsoft')
    
    const session = await getServerSession(authOptions)
    
    if (!session) {
      console.error('❌ Aucune session trouvée')
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      )
    }
    
    if (!session?.accessToken) {
      console.error('❌ Token d\'accès manquant dans la session')
      return NextResponse.json(
        { error: 'Non autorisé - Token d\'accès manquant. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    console.log('🚀 Appel à l\'API Microsoft Graph pour récupérer les messages')

    // Récupérer les emails depuis Microsoft Graph
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=100&$select=id,subject,sender,receivedDateTime,bodyPreview,isRead',
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('📨 Réponse de l\'API Microsoft Graph:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Microsoft Graph API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      })
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token d\'accès expiré ou invalide. Veuillez vous reconnecter.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `Erreur Microsoft Graph API: ${response.status} - ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const messages = data.value || []

    console.log(`📬 ${messages.length} messages trouvés`)

    // Formater les emails
    const emails = messages.map((message: any) => ({
      id: message.id,
      subject: message.subject || 'Sans sujet',
      sender: message.sender?.emailAddress?.address || 'Expéditeur inconnu',
      preview: message.bodyPreview || 'Aucun aperçu disponible',
      date: new Date(message.receivedDateTime).toISOString().split('T')[0],
      source: 'microsoft'
    }))

    console.log(`✅ ${emails.length} emails Microsoft traités avec succès`)
    return NextResponse.json({ emails })
  } catch (error) {
    console.error('❌ Erreur complète Microsoft Graph API:', {
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des emails Microsoft' },
      { status: 500 }
    )
  }
}
