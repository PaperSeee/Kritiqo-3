import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { validateUserId } from '@/lib/utils/uuid-validator'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Début de la récupération des emails Microsoft')
    
    const session = await getServerSession(authOptions)
    
    // ✅ Validation stricte de la session et de l'UUID
    if (!session?.userId) {
      console.error('❌ Aucune session trouvée')
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      )
    }
    
    // ✅ Valider que l'ID utilisateur est un UUID valide
    const userId = validateUserId(session.userId)
    
    // ✅ Récupérer le token depuis connected_emails au lieu de la session
    const { data: connectedAccount, error: tokenError } = await supabaseAdmin
      .from('connected_emails')
      .select('access_token, expires_at')
      .eq('user_id', userId)
      .eq('provider', 'azure-ad')
      .single()

    if (tokenError || !connectedAccount?.access_token) {
      console.error('❌ Token d\'accès Microsoft manquant ou expiré')
      return NextResponse.json(
        { error: 'Non autorisé - Token d\'accès manquant. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    // Vérifier l'expiration du token
    if (connectedAccount.expires_at && connectedAccount.expires_at < Date.now()) {
      console.error('❌ Token Microsoft expiré')
      return NextResponse.json(
        { error: 'Token d\'accès Microsoft expiré. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

    console.log('🚀 Appel à l\'API Microsoft Graph pour récupérer les messages')

    // Utiliser le endpoint amélioré avec gestion d'erreurs spécifiques
    const endpoint = 'https://graph.microsoft.com/v1.0/me/messages?$top=100&$select=id,subject,sender,receivedDateTime,bodyPreview,isRead&$orderby=receivedDateTime desc';
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${connectedAccount.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📨 Réponse de l\'API Microsoft Graph:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    // Gestion d'erreurs spécifiques Microsoft Graph
    if (response.status === 401) {
      console.error('❌ Unauthorized: le token Microsoft est invalide ou expiré')
      return NextResponse.json(
        { error: 'Token d\'accès Microsoft expiré ou invalide. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }
    
    if (response.status === 403) {
      console.error('❌ Forbidden: le compte ne possède pas de boîte Outlook ou les permissions sont insuffisantes')
      return NextResponse.json(
        { error: 'Permissions insuffisantes. Le compte ne possède pas de boîte Outlook ou les droits d\'accès sont insuffisants.' },
        { status: 403 }
      )
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Microsoft Graph API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      })
      
      return NextResponse.json(
        { error: `Erreur Microsoft Graph API: ${response.status} - ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const messages = data.value || []

    console.log(`✅ ${messages.length} messages Microsoft traités avec succès`)

    // Formater les emails
    const emails = messages.map((message: any) => ({
      id: message.id,
      subject: message.subject || 'Sans sujet',
      sender: message.sender?.emailAddress?.address || 'Expéditeur inconnu',
      preview: message.bodyPreview || 'Aucun aperçu disponible',
      date: new Date(message.receivedDateTime).toISOString(),
      source: 'microsoft'
    }))

    return NextResponse.json({ emails })
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erreur complète Microsoft Graph API:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
    } else {
      console.error('❌ Erreur inconnue Microsoft Graph API:', JSON.stringify(err))
    }
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des emails Microsoft' },
      { status: 500 }
    )
  }
}
