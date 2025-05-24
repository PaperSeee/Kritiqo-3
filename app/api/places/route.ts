import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID requis' },
        { status: 400 }
      )
    }

    // Appel à Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,address_components&key=${process.env.GOOGLE_PLACES_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Erreur lors de l\'appel à Google Places API')
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error('Place ID invalide')
    }

    const place = data.result
    
    // Extrait la ville et le pays depuis les composants d'adresse
    const cityComponent = place.address_components?.find(
      (component: any) => component.types.includes('locality') || 
                          component.types.includes('administrative_area_level_2')
    )

    const countryComponent = place.address_components?.find(
      (component: any) => component.types.includes('country')
    )

    return NextResponse.json({
      name: place.name,
      address: place.formatted_address,
      city: cityComponent?.long_name || 'Ville inconnue',
      country: countryComponent?.long_name || 'Pays inconnu',
      place_id: placeId
    })

  } catch (error) {
    console.error('Erreur Places API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
