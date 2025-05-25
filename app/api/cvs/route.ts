import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { data: cvs, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', session.userId)
      .order('upload_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({ cvs })
  } catch (err) {
    console.error('Erreur récupération CVs:', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('cv') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Seuls les fichiers PDF, DOC et DOCX sont acceptés.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier ne doit pas dépasser 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${uuidv4()}.${fileExtension}`
    const filePath = `cvs/${session.userId}/${filename}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) throw uploadError

    // Check if this is the first CV (make it primary)
    const { data: existingCvs } = await supabase
      .from('cvs')
      .select('id')
      .eq('user_id', session.userId)

    const isPrimary = !existingCvs || existingCvs.length === 0

    // Save CV metadata to database
    const { data: cvData, error: dbError } = await supabase
      .from('cvs')
      .insert({
        user_id: session.userId,
        filename: filename,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        is_primary: isPrimary,
        upload_date: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ 
      success: true, 
      cv: cvData 
    })
  } catch (err) {
    console.error('Erreur upload CV:', err)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du CV' },
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

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([cv.file_path])

    if (storageError) {
      console.error('Erreur suppression storage:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('cvs')
      .delete()
      .eq('id', cvId)
      .eq('user_id', session.userId)

    if (dbError) throw dbError

    // If deleted CV was primary, make another one primary
    if (cv.is_primary) {
      const { data: remainingCvs } = await supabase
        .from('cvs')
        .select('id')
        .eq('user_id', session.userId)
        .limit(1)

      if (remainingCvs && remainingCvs.length > 0) {
        await supabase
          .from('cvs')
          .update({ is_primary: true })
          .eq('id', remainingCvs[0].id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erreur suppression CV:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
