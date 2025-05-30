import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId, isUUID } from '@/lib/utils/uuid-validator'
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

    // ✅ Log the received user_id for debugging
    console.log("🧪 user_id reçu:", session.userId)

    // ✅ Early UUID validation check
    if (!isUUID(session.userId)) {
      console.error('❌ Invalid UUID format received:', session.userId)
      return NextResponse.json(
        { error: 'Invalid user ID format - must be a valid UUID' },
        { status: 400 }
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
  const isDev = process.env.NODE_ENV !== "production";
  
  // Clean the app password
  const cleanAppPassword = appPassword.replace(/\s/g, '')
  
  if (cleanAppPassword.length < 16) {
    throw new Error('Mot de passe d\'application invalide - doit contenir au moins 16 caractères')
  }
  
  // Test real IMAP connection
  const config = {
    imap: {
      user: email,
      password: cleanAppPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: isDev ? { rejectUnauthorized: false } : undefined,
      authTimeout: 5000,
      connTimeout: 10000
    }
  };

  try {
    console.log(`🔒 Testing IMAP connection - TLS: ${config.imap.tls}, Dev mode: ${isDev}`)
    // Use require to avoid build issues
    const imaps = eval('require')('imap-simple');
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');
    await connection.end();
    console.log('✅ IMAP connection test successful')
  } catch (error) {
    console.error('❌ IMAP connection test failed:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage?.includes('Invalid credentials')) {
      throw new Error('Identifiants invalides - vérifiez votre mot de passe d\'application')
    } else if (errorMessage?.includes('self signed certificate')) {
      throw new Error('Erreur de certificat TLS - contactez le support')
    } else {
      throw new Error('Impossible de se connecter - vérifiez vos identifiants')
    }
  }
}
