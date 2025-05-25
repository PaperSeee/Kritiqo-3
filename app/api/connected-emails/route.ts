import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
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
  } catch (error) {
    console.error('Erreur lors de la récupération des emails connectés:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
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
      .eq('user_id', session.userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'email connecté:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
