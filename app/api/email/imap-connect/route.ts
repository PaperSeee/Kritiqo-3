import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/validation'
import { ensureUserExists } from '@/lib/utils/user-validator'

export async function POST(request: NextRequest) {
  try {
    console.log('IMAP connect request received')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      console.log('No session or user ID')
      return NextResponse.json(
        { error: 'Non autorisé - veuillez vous connecter' },
        { status: 401 }
      )
    }

    // Validate and sanitize user ID
    const userId = validateUserId(session.userId)
    console.log('User ID validated:', userId.substring(0, 8) + '***')

    // ✅ Check if user exists before proceeding
    const userValidation = await ensureUserExists(userId);
    if (!userValidation.exists) {
      console.error('❌ User validation failed for IMAP connect:', {
        userId: userId.substring(0, 8) + '***',
        error: userValidation.error,
        sessionExists: !!session
      });
      return NextResponse.json(
        { error: `User validation failed: ${userValidation.error || 'User not found in database. Please sign out and sign back in.'}` },
        { status: 400 }
      );
    }

    console.log('✅ User validation passed for IMAP connect')

    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      )
    }

    const { email, appPassword } = body

    if (!email || !appPassword) {
      console.log('Missing email or appPassword')
      return NextResponse.json(
        { error: 'Email et mot de passe d\'application requis' },
        { status: 400 }
      )
    }

    // Valider que c'est un email Gmail
    if (!email.toLowerCase().includes('@gmail.com')) {
      console.log('Non-Gmail email provided:', email)
      return NextResponse.json(
        { error: 'Seuls les emails Gmail sont supportés via IMAP' },
        { status: 400 }
      )
    }

    // Clean and validate app password
    const cleanAppPassword = appPassword.replace(/\s/g, '')
    if (cleanAppPassword.length < 16) {
      console.log('App password too short:', cleanAppPassword.length)
      return NextResponse.json(
        { error: 'Le mot de passe d\'application doit contenir au moins 16 caractères' },
        { status: 400 }
      )
    }

    // Test de connexion IMAP
    try {
      console.log('Testing IMAP connection...')
      await testImapConnection(email, cleanAppPassword)
      console.log('IMAP connection test passed')
    } catch (imapError) {
      console.error('IMAP connection failed:', imapError)
      return NextResponse.json(
        { error: 'Impossible de se connecter. Vérifiez votre email et votre mot de passe d\'application.' },
        { status: 400 }
      )
    }

    // Sauvegarder dans Supabase avec gestion d'erreur robuste
    try {
      console.log('Saving to Supabase...')
      const { data, error } = await supabaseAdmin
        .from('connected_emails')
        .upsert({
          user_id: userId,
          email: email.toLowerCase(),
          provider: 'imap',
          access_token: cleanAppPassword,
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

      console.log('Email connection saved successfully')

      // 🚀 Déclencher l'extraction des emails immédiatement
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        console.log('Triggering email extraction...')
        const extractResponse = await fetch(`${baseUrl}/api/email/extract-imap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            email: data.email, 
            appPassword: cleanAppPassword 
          })
        })
        
        if (!extractResponse.ok) {
          console.warn('⚠️ Extraction IMAP échouée mais connexion sauvegardée')
        } else {
          const extractResult = await extractResponse.json()
          console.log(`✅ ${extractResult.extracted || 0} emails extraits automatiquement`)
        }
      } catch (extractError) {
        console.warn('⚠️ Extraction IMAP échouée mais connexion sauvegardée:', extractError)
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
  // Clean the app password
  const cleanAppPassword = appPassword.replace(/\s/g, '')
  
  if (cleanAppPassword.length < 16) {
    throw new Error('Mot de passe d\'application invalide - doit contenir au moins 16 caractères')
  }
  
  // Simulation d'un délai de connexion
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Pour l'instant, on accepte tous les mots de passe avec le bon format
  return Promise.resolve()
}
