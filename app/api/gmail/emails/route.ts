import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getValidAccessToken } from '@/lib/token-manager'
import { validateUserId } from '@/lib/utils/uuid-validator'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Début de la récupération des emails Gmail')
    
    const session = await getServerSession(authOptions)
    
    // ✅ Validation stricte de la session et de l'UUID
    if (!session?.user?.id) {
      console.error('❌ Aucune session trouvée')
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      )
    }
    
    // ✅ Valider que l'ID utilisateur est un UUID valide
    const userId = validateUserId(session.user.id)
    
    // Utiliser getValidAccessToken pour obtenir un token Gmail valide
    const accessToken = await getValidAccessToken(userId, 'google')
    
    if (!accessToken) {
      console.error('❌ Token Gmail invalide ou expiré')
      return NextResponse.json(
        { error: 'Token Gmail invalide ou expiré. Veuillez vous reconnecter avec les permissions Gmail.' },
        { status: 401 }
      )
    }

    console.log('🚀 Appel à l\'API Gmail pour récupérer les messages')

    // Récupérer la liste des messages
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&labelIds=INBOX',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('📨 Réponse de l\'API Gmail:', {
      status: messagesResponse.status,
      statusText: messagesResponse.statusText,
      ok: messagesResponse.ok
    })

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text()
      console.error('❌ Gmail API Error:', {
        status: messagesResponse.status,
        statusText: messagesResponse.statusText,
        errorBody: errorText
      })
      
      // Si le token est invalide/expiré
      if (messagesResponse.status === 401) {
        return NextResponse.json(
          { error: 'Token d\'accès expiré ou invalide. Veuillez vous reconnecter.' },
          { status: 401 }
        )
      }
      
      if (messagesResponse.status === 403) {
        return NextResponse.json(
          { error: 'Permissions insuffisantes. Veuillez vous reconnecter avec les permissions Gmail.' },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: `Erreur Gmail API: ${messagesResponse.status} - ${messagesResponse.statusText}` },
        { status: messagesResponse.status }
      )
    }

    const messagesData = await messagesResponse.json()
    const messageIds = messagesData.messages || []

    console.log(`📬 ${messageIds.length} messages trouvés`)

    if (messageIds.length === 0) {
      return NextResponse.json({ emails: [] })
    }

    // Récupérer les détails de chaque message
    const emailPromises = messageIds.map(async (message: { id: string }) => {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!messageResponse.ok) {
          console.error(`❌ Erreur pour le message ${message.id}:`, {
            status: messageResponse.status,
            statusText: messageResponse.statusText
          })
          return null
        }

        const messageData = await messageResponse.json()
        const headers = messageData.payload?.headers || []
        
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'Sans sujet'
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Expéditeur inconnu'
        const dateHeader = headers.find((h: any) => h.name === 'Date')?.value
        
        // Parse date from header or use internal date
        let date = new Date().toISOString().split('T')[0]
        if (dateHeader) {
          try {
            date = new Date(dateHeader).toISOString().split('T')[0]
          } catch {
            date = new Date(parseInt(messageData.internalDate)).toISOString().split('T')[0]
          }
        } else if (messageData.internalDate) {
          date = new Date(parseInt(messageData.internalDate)).toISOString().split('T')[0]
        }

        // Extract email address from "Name <email@domain.com>" format
        const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)![1] : from
        const snippet = messageData.snippet || 'Aucun aperçu disponible'

        return {
          id: message.id,
          subject,
          sender: senderEmail,
          preview: snippet,
          date,
          source: 'gmail'
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(`❌ Erreur lors du traitement du message ${message.id}:`, err.message, err.name)
        } else {
          console.error(`❌ Erreur inconnue lors du traitement du message ${message.id}:`, JSON.stringify(err))
        }
        return null
      }
    })

    const emails = (await Promise.all(emailPromises)).filter(Boolean)

    console.log(`✅ ${emails.length} emails traités avec succès`)
    return NextResponse.json({ emails })
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erreur complète Gmail API:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
    } else {
      console.error('❌ Erreur inconnue Gmail API:', JSON.stringify(err))
    }
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des emails' },
      { status: 500 }
    )
  }
}
