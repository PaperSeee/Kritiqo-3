/**
 * Utilitaires pour la validation des URLs
 */

export function isValidGoogleMapsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    
    // Domaines Google autorisés
    const validDomains = [
      'www.google.com',
      'google.com', 
      'maps.google.com',
      'goo.gl',
      'maps.app.goo.gl'
    ]
    
    const isValidDomain = validDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    )
    
    // Vérifier que c'est bien un lien vers Google Maps
    const isMapsUrl = url.includes('/maps/') || 
                     url.includes('maps.google.com') || 
                     url.includes('goo.gl') || 
                     url.includes('place_id=') || 
                     url.includes('/place/')
    
    return isValidDomain && isMapsUrl
  } catch {
    return false
  }
}

export function extractBusinessNameFromGoogleMapsUrl(url: string): string | null {
  try {
    const cleanUrl = decodeURIComponent(url)
    
    // Method 1: Extract from /place/ path
    const placeMatch = cleanUrl.match(/\/place\/([^/@?]+)/)
    if (placeMatch) {
      // Decode and clean the business name
      let name = decodeURIComponent(placeMatch[1])
      // Replace + with spaces and clean up
      name = name.replace(/\+/g, ' ').trim()
      console.log('Extracted business name from path:', name)
      return name
    }
    
    // Method 2: Extract from search parameter
    const searchMatch = cleanUrl.match(/[?&]q=([^&]+)/)
    if (searchMatch) {
      let name = decodeURIComponent(searchMatch[1])
      name = name.replace(/\+/g, ' ').trim()
      console.log('Extracted business name from query:', name)
      return name
    }
    
    console.log('No business name found in URL')
    return null
  } catch (error) {
    console.error('Error extracting business name:', error)
    return null
  }
}

export function extractPlaceIdFromGoogleMapsUrl(url: string): string | null {
  try {
    const cleanUrl = decodeURIComponent(url)
    console.log('Extracting place ID from:', cleanUrl)
    
    // Method 1: Direct place_id parameter
    let placeIdMatch = cleanUrl.match(/place_id=([a-zA-Z0-9_-]+)/)?.[1]
    if (placeIdMatch) {
      console.log('Found place_id via parameter:', placeIdMatch)
      return placeIdMatch
    }
    
    // Method 2: ChIJ pattern (most reliable)
    placeIdMatch = cleanUrl.match(/(ChIJ[a-zA-Z0-9_-]+)/)?.[1]
    if (placeIdMatch) {
      console.log('Found ChIJ place_id:', placeIdMatch)
      return placeIdMatch
    }
    
    // Method 3: !1s pattern for ChIJ IDs
    placeIdMatch = cleanUrl.match(/!1s(ChIJ[a-zA-Z0-9_-]+)/)?.[1]
    if (placeIdMatch) {
      console.log('Found ChIJ via !1s:', placeIdMatch)
      return placeIdMatch
    }
    
    // Method 4: Try to find any place ID pattern in data parameter
    const dataMatch = cleanUrl.match(/data=([^&?#]+)/)?.[1]
    if (dataMatch) {
      const decodedData = decodeURIComponent(dataMatch)
      const chijMatch = decodedData.match(/(ChIJ[a-zA-Z0-9_-]+)/)
      if (chijMatch) {
        console.log('Found ChIJ in data:', chijMatch[1])
        return chijMatch[1]
      }
    }
    
    console.log('No place ID found in URL')
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
