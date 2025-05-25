import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function fetchGmailEmails(accessToken: string) {
  const messagesResponse = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&labelIds=INBOX',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!messagesResponse.ok) throw new Error('Erreur Gmail API')

  const messagesData = await messagesResponse.json()
  const messageIds = messagesData.messages || []

  const emailPromises = messageIds.map(async (message: { id: string }) => {
    const messageResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!messageResponse.ok) return null

    const messageData = await messageResponse.json()
    const headers = messageData.payload?.headers || []
    
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'Sans sujet'
    const from = headers.find((h: any) => h.name === 'From')?.value || 'Expéditeur inconnu'
    const dateHeader = headers.find((h: any) => h.name === 'Date')?.value
    
    let date = new Date().toISOString()
    if (dateHeader) {
      try {
        date = new Date(dateHeader).toISOString()
      } catch {
        date = new Date(parseInt(messageData.internalDate)).toISOString()
      }
    }

    const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)![1] : from
    const snippet = messageData.snippet || 'Aucun aperçu disponible'

    return {
      id: `gmail_${message.id}`,
      subject,
      sender: senderEmail,
      preview: snippet,
      date,
      source: 'gmail'
    }
  })

  return (await Promise.all(emailPromises)).filter(Boolean)
}

async function fetchMicrosoftEmails(accessToken: string) {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=100&$select=id,subject,sender,receivedDateTime,bodyPreview,isRead&$orderby=receivedDateTime desc',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) throw new Error('Erreur Microsoft Graph API')

  const data = await response.json()
  const messages = data.value || []

  return messages.map((message: any) => ({
    id: `microsoft_${message.id}`,
    subject: message.subject || 'Sans sujet',
    sender: message.sender?.emailAddress?.address || 'Expéditeur inconnu',
    preview: message.bodyPreview || 'Aucun aperçu disponible',
    date: new Date(message.receivedDateTime).toISOString(),
    source: 'microsoft'
  }))
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const selectedEmail = searchParams.get('email')

    // Récupérer les comptes connectés
    let query = supabaseAdmin
      .from('connected_emails')
      .select('*')
      .eq('user_id', session.userId)

    if (selectedEmail) {
      query = query.eq('email', selectedEmail)
    }

    const { data: connectedEmails, error } = await query

    if (error) throw error

    if (!connectedEmails || connectedEmails.length === 0) {
      return NextResponse.json({ emails: [], connectedEmails: [] })
    }

    // Récupérer les emails pour chaque compte connecté
    const allEmails = []
    
    for (const account of connectedEmails) {
      try {
        if (!account.access_token) continue

        let emails = []
        if (account.provider === 'google') {
          emails = await fetchGmailEmails(account.access_token)
        } else if (account.provider === 'azure-ad') {
          emails = await fetchMicrosoftEmails(account.access_token)
        }

        // Ajouter l'info du compte à chaque email
        emails.forEach((email: any) => {
          email.accountEmail = account.email
          email.accountProvider = account.provider
        })

        allEmails.push(...emails)
      } catch (error) {
        console.error(`Erreur pour le compte ${account.email}:`, error)
      }
    }

    return NextResponse.json({ 
      emails: allEmails,
      connectedEmails 
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des emails:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
