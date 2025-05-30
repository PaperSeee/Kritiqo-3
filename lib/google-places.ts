const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  city: string;
  country: string;
  rating?: number;
  user_ratings_total?: number;
  url: string;
  website?: string;
  phone?: string;
}

export async function searchPlaces(query: string): Promise<PlaceDetails[]> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.results.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      city: extractCity(place.formatted_address),
      country: extractCountry(place.formatted_address),
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la recherche de lieux:', err.message, err.name);
    } else {
      console.error('Erreur inconnue lors de la recherche de lieux:', JSON.stringify(err));
    }
    throw err;
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured');
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,rating,user_ratings_total,url,website,formatted_phone_number&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to get place details');
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const place = data.result;
    return {
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      city: extractCity(place.formatted_address),
      country: extractCountry(place.formatted_address),
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      url: place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      website: place.website,
      phone: place.formatted_phone_number,
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    throw error;
  }
}

function extractCity(address: string): string {
  // Improved city extraction
  const parts = address.split(',').map(part => part.trim())
  
  // For most addresses, city is the second-to-last part
  if (parts.length >= 2) {
    const cityPart = parts[parts.length - 2]
    // Remove postal codes and numbers
    return cityPart.replace(/^\d+\s*/, '').trim()
  }
  
  return parts[0] || ''
}

function extractCountry(address: string): string {
  // Simple extraction - peut être amélioré
  const parts = address.split(',');
  return parts[parts.length - 1].trim();
}

export function generateQRCodeUrl(url: string, size: number = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
}
