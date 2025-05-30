import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/uuid-validator'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = validateUserId(session.user.id)
    const { searchParams } = new URL(request.url)
    
    // Filtres optionnels
    const category = searchParams.get('category')
    const accountEmail = searchParams.get('account')
    const limit = parseInt(searchParams.get('limit') || '50')

    console.log(`📧 Chargement emails pour user ${userId}`)

    // Construire la requête avec filtres
    let query = supabaseAdmin
      .from('emails')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)

    if (category && category !== 'Tous') {
      query = query.eq('category', category)
    }

    if (accountEmail) {
      query = query.eq('account_email', accountEmail)
    }

    const { data: emails, error } = await query

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      throw error
    }

    // Statistiques par catégorie
    const { data: stats } = await supabaseAdmin
      .from('emails')
      .select('category')
      .eq('user_id', userId)

    const categoryStats = stats?.reduce((acc: Record<string, number>, email) => {
      acc[email.category] = (acc[email.category] || 0) + 1
      return acc
    }, {}) || {}

    console.log(`✅ ${emails?.length || 0} emails chargés`)

    return NextResponse.json({
      emails: emails || [],
      stats: categoryStats,
      total: emails?.length || 0
    })

  } catch (error) {
    console.error('❌ Erreur chargement emails:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur chargement emails' },
      { status: 500 }
    )
  }
}
