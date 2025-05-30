import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
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

    // Validate and sanitize user ID
    const userId = validateUserId(session.userId)

    const { email, appPassword } = await request.json()

    if (!email || !appPassword) {
      return NextResponse.json(
        { error: 'Email et mot de passe d\'application requis' },
        { status: 400 }
      )
    }

    // Valider que c'est un email Gmail
    if (!email.toLowerCase().includes('@gmail.com')) {
      return NextResponse.json(
        { error: 'Seuls les emails Gmail sont supportés via IMAP' },
        { status: 400 }
      )
    }

    // Test de connexion IMAP
    try {
      await testImapConnection(email, appPassword)
    } catch (imapError) {
      return NextResponse.json(
        { error: 'Impossible de se connecter. Vérifiez votre email et votre mot de passe d\'application.' },
        { status: 400 }
      )
    }

    // Sauvegarder dans Supabase avec gestion d'erreur robuste
    try {
      const { data, error } = await supabaseAdmin
        .from('connected_emails')
        .upsert({
          user_id: userId,
          email: email.toLowerCase(),
          provider: 'imap',
          access_token: appPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,email'
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      return NextResponse.json({ 
        success: true, 
        email: data.email 
      })
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde. Veuillez réessayer.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de la connexion IMAP:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur lors de la connexion' },
      { status: 500 }
    )
  }
}

// Fonction de test IMAP (à implémenter avec une vraie lib IMAP)
async function testImapConnection(email: string, appPassword: string): Promise<void> {
  // Pour l'instant, simulation d'un test de connexion
  // Dans une vraie implémentation, utiliser une librairie comme 'node-imap'
  
  if (appPassword.length < 16) {
    throw new Error('Mot de passe d\'application invalide')
  }
  
  // Simulation d'un délai de connexion
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Pour l'instant, on accepte tous les mots de passe avec le bon format
  return Promise.resolve()
}
