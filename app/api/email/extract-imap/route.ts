import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/uuid-validator'

interface EmailData {
  id: string
  subject: string
  from: string
  date: Date
  snippet: string
  fullText?: string
}

// Simulation d'extraction IMAP (à remplacer par une vraie lib IMAP)
async function extractEmailsViaIMAP(email: string, appPassword: string): Promise<EmailData[]> {
  // Simulation - dans la vraie vie, utiliser node-imap ou similar
  console.log(`📧 Extraction IMAP simulée pour ${email}`)
  
  // Simuler un délai d'extraction
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Retourner des emails de test
  const testEmails: EmailData[] = [
    {
      id: `imap_${Date.now()}_1`,
      subject: 'Avis client - Restaurant Le Gourmet',
      from: 'client@example.com',
      date: new Date(Date.now() - 3600000), // 1h ago
      snippet: 'Excellent repas hier soir ! Service impeccable et plats délicieux...',
      fullText: 'Bonjour, Je tenais à vous remercier pour l\'excellent repas d\'hier soir. Le service était impeccable et les plats absolument délicieux. Je recommande vivement votre restaurant à tous mes amis.'
    },
    {
      id: `imap_${Date.now()}_2`,
      subject: 'Facture commande #12345',
      from: 'facturation@fournisseur.com',
      date: new Date(Date.now() - 7200000), // 2h ago
      snippet: 'Voici votre facture pour la commande #12345 du 15/01/2024...',
      fullText: 'Bonjour, Veuillez trouver ci-joint votre facture pour la commande #12345 effectuée le 15/01/2024. Montant total: 1,234.56€'
    },
    {
      id: `imap_${Date.now()}_3`,
      subject: 'Promotion spéciale - 50% de réduction !',
      from: 'noreply@publicite.com',
      date: new Date(Date.now() - 10800000), // 3h ago
      snippet: 'Profitez de notre promotion exceptionnelle avec 50% de réduction...',
      fullText: 'PROMOTION LIMITÉE ! Profitez maintenant de 50% de réduction sur tous nos produits. Offre valable jusqu\'au 31 janvier. Cliquez ici pour en profiter !'
    }
  ]
  
  return testEmails
}

function classifyEmail(subject: string, from: string, content: string) {
  const subjectLower = subject.toLowerCase()
  const fromLower = from.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // Détecter les spams/publicités
  if (fromLower.includes('noreply') || 
      subjectLower.includes('promotion') || 
      subjectLower.includes('réduction') ||
      contentLower.includes('cliquez ici')) {
    return { category: 'Spam/Pub', priority: 'Faible', isSpam: true }
  }
  
  // Détecter les avis clients
  if (subjectLower.includes('avis') || 
      contentLower.includes('restaurant') ||
      contentLower.includes('service') ||
      contentLower.includes('repas')) {
    return { category: 'Avis client', priority: 'Urgent', isSpam: false }
  }
  
  // Détecter les factures
  if (subjectLower.includes('facture') || 
      subjectLower.includes('commande') ||
      contentLower.includes('montant')) {
    return { category: 'Facture', priority: 'Moyen', isSpam: false }
  }
  
  return { category: 'Autre', priority: 'Moyen', isSpam: false }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = validateUserId(session.user.id)
    const { email, appPassword } = await request.json()

    if (!email || !appPassword) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    console.log(`🚀 Début extraction emails pour ${email}`)

    // Extraire les emails via IMAP
    const emailsData = await extractEmailsViaIMAP(email, appPassword)
    
    if (emailsData.length === 0) {
      return NextResponse.json({
        success: true,
        extracted: 0,
        message: 'Aucun email trouvé'
      })
    }

    // Préparer les emails pour Supabase
    const emailsToSave = emailsData.map(emailData => {
      const classification = classifyEmail(emailData.subject, emailData.from, emailData.fullText || emailData.snippet)
      
      return {
        id: emailData.id,
        user_id: userId,
        account_email: email,
        subject: emailData.subject,
        from_email: emailData.from,
        sender_name: emailData.from.split('@')[0],
        date: emailData.date.toISOString(),
        snippet: emailData.snippet,
        full_text: emailData.fullText || emailData.snippet,
        category: classification.category,
        priority: classification.priority,
        is_spam: classification.isSpam,
        analyzed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    // Sauvegarder en base avec upsert
    const { data, error } = await supabaseAdmin
      .from('emails')
      .upsert(emailsToSave, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select('id')

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      throw error
    }

    const extracted = data?.length || 0
    console.log(`✅ ${extracted} emails extraits et sauvegardés`)

    return NextResponse.json({
      success: true,
      extracted,
      total: emailsData.length,
      message: `${extracted} emails extraits avec succès`
    })

  } catch (error) {
    console.error('❌ Erreur extraction IMAP:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur extraction emails' },
      { status: 500 }
    )
  }
}
