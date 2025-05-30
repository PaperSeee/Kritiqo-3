import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createUserIfNotExists } from '@/lib/utils/user-validator'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'UserId and email are required' },
        { status: 400 }
      )
    }

    console.log('🔧 Auto-confirming email for user:', userId)

    // Confirm the user's email using admin privileges
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        email_confirm: true,
        user_metadata: { 
          email_confirmed: true,
          auto_confirmed: true 
        }
      }
    )

    if (confirmError) {
      console.error('❌ Failed to confirm email:', confirmError)
      return NextResponse.json(
        { error: 'Failed to confirm email' },
        { status: 500 }
      )
    }

    // Ensure user exists in our users table
    const userResult = await createUserIfNotExists(userId, email)
    
    if (!userResult.success) {
      console.warn('⚠️ User creation in users table failed:', userResult.error)
    }

    console.log('✅ Email confirmed successfully for user:', userId)
    
    return NextResponse.json({ 
      success: true,
      message: 'Email confirmed successfully' 
    })

  } catch (error) {
    console.error('❌ Error in confirm-email endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
