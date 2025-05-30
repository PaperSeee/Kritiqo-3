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
    const category = searchParams.get('category')
    const account = searchParams.get('account')

    console.log(`📧 Chargement des emails pour l'utilisateur ${userId}`)

    // Construire la requête avec filtres optionnels
    let query = supabaseAdmin
      .from('emails')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100)

    if (category && category !== 'Tous') {
      query = query.eq('category', category)
    }

    if (account) {
      query = query.eq('account_email', account)
    }

    const { data: emails, error } = await query

    if (error) {
      console.error('❌ Erreur lors du chargement des emails:', error)
      throw error
    }

    // Calculer les statistiques par catégorie
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('emails')
      .select('category')
      .eq('user_id', userId)

    const stats: Record<string, number> = {}
    if (!statsError && statsData) {
      statsData.forEach(email => {
        stats[email.category] = (stats[email.category] || 0) + 1
      })
    }

    console.log(`✅ ${emails?.length || 0} emails chargés avec succès`)

    return NextResponse.json({
      emails: emails || [],
      stats
    })

  } catch (error) {
    console.error('❌ Erreur lors du chargement des emails:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des emails' },
      { status: 500 }
    )
  }
}
