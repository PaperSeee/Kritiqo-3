/**
 * Utilitaires pour la validation des URLs
 */

export function isValidGoogleMapsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('google.com') && 
           (urlObj.pathname.includes('/maps') || urlObj.pathname.includes('/place'))
  } catch {
    return false
  }
}

export function extractBusinessNameFromGoogleMapsUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const placeIndex = pathParts.findIndex(part => part === 'place')
    
    if (placeIndex !== -1 && placeIndex + 1 < pathParts.length) {
      const encodedName = pathParts[placeIndex + 1]
      return decodeURIComponent(encodedName).replace(/\+/g, ' ')
    }
    
    return null
  } catch {
    return null
  }
}

export function extractPlaceIdFromGoogleMapsUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const searchParams = urlObj.searchParams
    return searchParams.get('place_id') || searchParams.get('cid')
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
