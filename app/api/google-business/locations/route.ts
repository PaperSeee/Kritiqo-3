import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { getGoogleBusinessLocations } from '@/lib/google-business'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await getGoogleBusinessLocations(session.userId as string)
    
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Error in locations API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
