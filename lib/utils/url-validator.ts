/**
 * Utilitaires pour la validation des URLs
 */

export function isValidGoogleMapsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return (
      (urlObj.hostname === 'maps.google.com' || 
       urlObj.hostname === 'www.google.com' ||
       urlObj.hostname === 'google.com') &&
      (urlObj.pathname.includes('/maps/') || urlObj.pathname.includes('/local/'))
    )
  } catch {
    return false
  }
}

export function extractBusinessNameFromGoogleMapsUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    
    // Extract from /maps/place/ URLs
    const placeMatch = urlObj.pathname.match(/\/maps\/place\/([^\/]+)/)
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ')
    }
    
    // Extract from search query
    const searchParams = urlObj.searchParams
    const query = searchParams.get('q')
    if (query) {
      return decodeURIComponent(query).replace(/\+/g, ' ')
    }
    
    return null
  } catch {
    return null
  }
}

export function extractPlaceIdFromGoogleMapsUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    
    // Look for place_id in search params
    const placeId = urlObj.searchParams.get('place_id')
    if (placeId) {
      return placeId
    }
    
    // Look for ftid (sometimes used instead of place_id)
    const ftid = urlObj.searchParams.get('ftid')
    if (ftid) {
      return ftid
    }
    
    // Extract from URL path (format: /maps/place/name/@lat,lng,zoom/data=...)
    const pathMatch = urlObj.pathname.match(/data=.*?1s(0x[a-f0-9]+:0x[a-f0-9]+)/)
    if (pathMatch) {
      return pathMatch[1]
    }
    
    return null
  } catch {
    return null
  }
}

export function cleanGoogleMapsUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // Garder les paramètres essentiels pour Google Maps
    const essentialParams = ['place_id', 'cid', 'data', 'entry', 'g_ep']
    
    // Créer une nouvelle URL avec seulement les paramètres essentiels
    const cleanUrl = new URL(urlObj.origin + urlObj.pathname)
    
    essentialParams.forEach(param => {
      const value = urlObj.searchParams.get(param)
      if (value) {
        cleanUrl.searchParams.set(param, value)
      }
    })
    
    return cleanUrl.toString()
  } catch {
    return url // Retourner l'URL originale en cas d'erreur
  }
}

export function isValidBusinessUrl(url: string): { isValid: boolean; platform: string | null } {
  const googleBusinessPattern = /^https:\/\/(www\.)?google\.(com|fr|be|ca)\/.*business/i
  const googleMapsPattern = /^https:\/\/(www\.)?google\.(com|fr|be|ca)\/maps/i
  const facebookPattern = /^https:\/\/(www\.)?facebook\.com\//i
  
  if (googleBusinessPattern.test(url) || googleMapsPattern.test(url) || isValidGoogleMapsUrl(url)) {
    return { isValid: true, platform: 'google' }
  }
  
  if (facebookPattern.test(url)) {
    return { isValid: true, platform: 'facebook' }
  }
  
  return { isValid: false, platform: null }
}
