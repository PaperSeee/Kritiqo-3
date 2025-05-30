import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/uuid-validator'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // ✅ Validation stricte de la session et de l'UUID
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      )
    }

    // ✅ Valider que l'ID utilisateur est un UUID valide
    const userId = validateUserId(session.user.id)

    const { data: connectedEmails, error } = await supabaseAdmin
      .from('connected_emails')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      throw error
    }

    return NextResponse.json({ connectedEmails })
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erreur lors de la récupération des emails connectés:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
    } else {
      console.error('❌ Erreur inconnue:', JSON.stringify(err))
    }
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // ✅ Validation stricte de la session et de l'UUID
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé - Session manquante' },
        { status: 401 }
      )
    }

    // ✅ Valider que l'ID utilisateur est un UUID valide
    const userId = validateUserId(session.user.id)

    // Essayer de récupérer l'ID depuis l'URL (méthode existante)
    const { searchParams } = new URL(request.url)
    let emailId = searchParams.get('id')

    // Si pas d'ID dans l'URL, essayer dans le body de la requête
    if (!emailId) {
      try {
        const body = await request.json()
        emailId = body.id
      } catch (parseError) {
        console.warn('⚠️ Impossible de parser le body de la requête DELETE')
      }
    }

    if (!emailId) {
      return NextResponse.json(
        { error: 'ID email manquant (dans URL ou body)' },
        { status: 400 }
      )
    }

    // ✅ Valider que l'email ID est un UUID valide
    const validEmailId = validateUserId(emailId)

    console.log(`🗑️ Suppression du compte connecté ${validEmailId} pour l'utilisateur ${userId}`)

    const { error } = await supabaseAdmin
      .from('connected_emails')
      .delete()
      .eq('id', validEmailId)
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Erreur Supabase lors de la suppression:', error)
      throw error
    }

    console.log(`✅ Compte connecté ${validEmailId} supprimé avec succès`)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erreur lors de la suppression:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
    } else {
      console.error('❌ Erreur inconnue:', JSON.stringify(err))
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    )
  }
}
