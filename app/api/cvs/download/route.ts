import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const cvId = searchParams.get('id')

    if (!cvId) {
      return NextResponse.json(
        { error: 'ID CV manquant' },
        { status: 400 }
      )
    }

    // Get CV data
    const { data: cv, error: fetchError } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .eq('user_id', session.userId)
      .single()

    if (fetchError || !cv) {
      return NextResponse.json(
        { error: 'CV non trouvé' },
        { status: 404 }
      )
    }

    // Get signed URL for download
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(cv.file_path, 3600) // 1 hour expiry

    if (urlError || !signedUrl) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération du lien de téléchargement' },
        { status: 500 }
      )
    }

    // Redirect to signed URL
    return NextResponse.redirect(signedUrl.signedUrl)
  } catch (err) {
    console.error('Erreur téléchargement CV:', err)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}
