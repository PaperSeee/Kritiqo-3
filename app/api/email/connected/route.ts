import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/validation'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = validateUserId(session.userId)

    const { data: emails, error } = await supabaseAdmin
      .from('connected_emails')
      .select('id, email, provider, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Ajouter le statut (pour l'instant tous actifs)
    const emailsWithStatus = emails.map(email => ({
      ...email,
      status: 'active' as const
    }))

    return NextResponse.json({ emails: emailsWithStatus })
  } catch (error) {
    console.error('Erreur lors de la récupération des emails connectés:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = validateUserId(session.userId)

    const { searchParams } = new URL(request.url)
    const emailId = searchParams.get('id')

    if (!emailId) {
      return NextResponse.json(
        { error: 'ID email manquant' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('connected_emails')
      .delete()
      .eq('id', emailId)
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
