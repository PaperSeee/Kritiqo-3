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
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        'Erreur dans l\'API de recherche de lieux:',
        err.message,
        err.name,
        err.stack
      );
      return NextResponse.json(
        { error: err.message || 'Failed to search places' },
        { status: 500 }
      );
    } else {
      console.error(
        'Erreur inconnue dans l\'API de recherche de lieux:',
        JSON.stringify(err)
      );
      return NextResponse.json(
        { error: 'Failed to search places' },
        { status: 500 }
      );
    }
  }
}
