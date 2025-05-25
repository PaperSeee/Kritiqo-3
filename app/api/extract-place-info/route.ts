import { NextResponse } from 'next/server'
import { extractBusinessNameFromGoogleMapsUrl, extractPlaceIdFromGoogleMapsUrl } from '@/lib/utils/url-validator'

export async function POST(request: Request) {
  try {
    const { mapsUrl } = await request.json()

    if (!mapsUrl) {
      return NextResponse.json({ error: 'Google Maps URL is required' }, { status: 400 })
    }

    // Extract business name and place ID from the Google Maps URL
    const businessName = extractBusinessNameFromGoogleMapsUrl(mapsUrl)
    const placeId = extractPlaceIdFromGoogleMapsUrl(mapsUrl)
    
    console.log('Extracted business name:', businessName)
    console.log('Extracted place ID:', placeId)

    if (!businessName?.trim()) {
      return NextResponse.json({
        error: 'Impossible d\'extraire le nom de l\'établissement depuis l\'URL Google Maps. Veuillez utiliser un lien Google Maps direct vers un lieu spécifique.'
      }, { status: 400 })
    }

    // Ensure API key is loaded
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      console.error('Google Places API key missing')
      return NextResponse.json({ error: 'Configuration API manquante' }, { status: 500 })
    }

    // Get place details from Google Places API
    let placeDetails
    if (placeId) {
      placeDetails = await getPlaceDetails(placeId, apiKey)
    } else {
      placeDetails = await findPlaceFromText(businessName, apiKey)
    }

    if (!placeDetails) {
      return NextResponse.json({
        error: 'Impossible de trouver l\'établissement. Veuillez coller un lien Google Maps valide vers un lieu.'
      }, { status: 400 })
    }

    // Search for delivery platform links
    const deliveryLinks = await searchDeliveryPlatforms(placeDetails.name, placeDetails.city)

    const result = {
      name: placeDetails.name,
      city: placeDetails.city,
      country: placeDetails.country,
      place_id: placeDetails.place_id,
      googleReviewLink: `https://search.google.com/local/writereview?placeid=${placeDetails.place_id}`,
      ...deliveryLinks
    }

    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de l\'extraction des informations du lieu:', err.message, err.name, err.stack)
      return NextResponse.json({
        error: err.message || 'Erreur serveur inconnue'
      }, { status: 500 })
    } else {
      console.error('Erreur inconnue lors de l\'extraction des informations du lieu:', JSON.stringify(err))
      return NextResponse.json({
        error: 'Erreur serveur inconnue'
      }, { status: 500 })
    }
  }
}

async function getPlaceDetails(placeId: string, apiKey: string) {
  try {
    console.log('Fetching place details for:', placeId)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,address_components&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Google Places API response:', data)

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`)
    }

    const place = data.result

    // Extract city and country from address components
    const cityComponent = place.address_components?.find((component: any) =>
      component.types.includes('locality') ||
      component.types.includes('administrative_area_level_2') ||
      component.types.includes('administrative_area_level_1')
    )

    const countryComponent = place.address_components?.find((component: any) =>
      component.types.includes('country')
    )

    return {
      place_id: placeId,
      name: place.name,
      city: cityComponent?.long_name || 'Ville inconnue',
      country: countryComponent?.long_name || 'Pays inconnu',
      address: place.formatted_address
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la récupération des détails du lieu:', err.message, err.name)
    } else {
      console.error('Erreur inconnue lors de la récupération des détails du lieu:', JSON.stringify(err))
    }
    throw err
  }
}

async function findPlaceFromText(businessName: string, apiKey: string) {
  try {
    console.log('Finding place for:', businessName)
    
    // Use Find Place from Text API
    const findResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
    )

    if (!findResponse.ok) {
      throw new Error(`HTTP error! status: ${findResponse.status}`)
    }

    const findData = await findResponse.json()
    console.log('Find Place API response:', findData)

    if (findData.status !== 'OK' || !findData.candidates?.length) {
      throw new Error(`Aucun établissement trouvé pour: ${businessName}`)
    }

    const candidate = findData.candidates[0]
    const placeId = candidate.place_id

    // Get detailed place information
    return await getPlaceDetails(placeId, apiKey)
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la recherche du lieu:', err.message, err.name)
    } else {
      console.error('Erreur inconnue lors de la recherche du lieu:', JSON.stringify(err))
    }
    throw err
  }
}

async function searchDeliveryPlatforms(name: string, city: string) {
  const searchQuery = encodeURIComponent(`${name} ${city}`)
  
  const platforms = {
    ubereats: `https://ubereats.com/be/search?q=${searchQuery}`,
    deliveroo: `https://deliveroo.be/fr/search?q=${searchQuery}`,
    takeaway: `https://takeaway.com/be-en/search?q=${searchQuery}`
  }

  // For demo purposes, return the search URLs
  // In production, you might want to scrape these to find exact restaurant pages
  return {
    ubereatsLink: platforms.ubereats,
    deliverooLink: platforms.deliveroo,
    takeawayLink: platforms.takeaway
  }
}
