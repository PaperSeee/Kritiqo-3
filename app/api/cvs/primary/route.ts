import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { cvId } = await request.json()

    if (!cvId) {
      return NextResponse.json(
        { error: 'ID CV manquant' },
        { status: 400 }
      )
    }

    // Remove primary flag from all CVs
    await supabase
      .from('cvs')
      .update({ is_primary: false })
      .eq('user_id', session.userId)

    // Set new primary CV
    const { error } = await supabase
      .from('cvs')
      .update({ is_primary: true })
      .eq('id', cvId)
      .eq('user_id', session.userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur mise à jour CV principal:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
