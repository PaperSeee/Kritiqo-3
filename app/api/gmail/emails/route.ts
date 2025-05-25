import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Non autorisé - Token d\'accès manquant' },
        { status: 401 }
      )
    }

    // Récupérer la liste des messages
    const messagesResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20',
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )

    if (!messagesResponse.ok) {
      throw new Error('Erreur lors de la récupération des messages')
    }

    const messagesData = await messagesResponse.json()
    const messageIds = messagesData.messages || []

    // Récupérer les détails de chaque message
    const emailPromises = messageIds.map(async (message: { id: string }) => {
      const messageResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )

      if (!messageResponse.ok) {
        return null
      }

      const messageData = await messageResponse.json()
      const headers = messageData.payload?.headers || []
      
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'Sans sujet'
      const from = headers.find((h: any) => h.name === 'From')?.value || 'Expéditeur inconnu'
      const date = new Date(parseInt(messageData.internalDate)).toISOString().split('T')[0]
      const snippet = messageData.snippet || ''

      return {
        id: message.id,
        subject,
        sender: from,
        preview: snippet,
        date,
        source: 'gmail'
      }
    })

    const emails = (await Promise.all(emailPromises)).filter(Boolean)

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Erreur Gmail API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des emails' },
      { status: 500 }
    )
  }
}
