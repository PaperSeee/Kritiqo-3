import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Vérifier que l'utilisateur est connecté
    if (!session || !session.user || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { data: connectedEmails, error } = await supabaseAdmin
      .from('connected_emails')
      .select('*')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ connectedEmails })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la récupération des emails connectés:', err.message, err.name, err.stack)
    } else {
      console.error('Erreur inconnue lors de la récupération des emails connectés:', JSON.stringify(err))
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
    
    // Vérifier que l'utilisateur est connecté
    if (!session || !session.user || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

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

    console.log(`🗑️ Suppression du compte connecté ${emailId} pour l'utilisateur ${session.userId}`)

    const { error } = await supabaseAdmin
      .from('connected_emails')
      .delete()
      .eq('id', emailId)
      .eq('user_id', session.userId)

    if (error) {
      console.error('❌ Erreur Supabase lors de la suppression:', error)
      throw error
    }

    console.log(`✅ Compte connecté ${emailId} supprimé avec succès`)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Erreur lors de la suppression de l\'email connecté:', err.message, err.name, err.stack)
    } else {
      console.error('❌ Erreur inconnue lors de la suppression de l\'email connecté:', JSON.stringify(err))
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    )
  }
}
