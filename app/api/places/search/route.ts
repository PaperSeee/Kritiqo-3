import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const places = await searchPlaces(query);
    return NextResponse.json({ places });
  } catch (error: any) {
    console.error('Error in places search API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search places' },
      { status: 500 }
    );
  }
}
