import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { refreshGoogleBusinessLocations } from '@/lib/google-business'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await refreshGoogleBusinessLocations(
      session.userId as string,
      session.accessToken as string
    )
    
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Error in refresh API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
