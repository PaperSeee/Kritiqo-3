import { supabaseAdmin } from '@/lib/supabase-admin'

export interface GoogleBusinessLocation {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  state: string
  placeId?: string
  googleData: any
}

export async function getGoogleBusinessLocations(userId: string): Promise<GoogleBusinessLocation[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('google_business_locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching locations:', error)
      return []
    }

    return data.map(location => ({
      id: location.location_id,
      name: location.name,
      address: location.address,
      phone: location.phone,
      website: location.website,
      state: location.state,
      placeId: location.place_id,
      googleData: location.google_data
    }))
  } catch (error) {
    console.error('Error in getGoogleBusinessLocations:', error)
    return []
  }
}

export async function refreshGoogleBusinessLocations(userId: string, accessToken: string): Promise<GoogleBusinessLocation[]> {
  try {
    // Fetch fresh data from Google
    const accountsResponse = await fetch('https://mybusiness.googleapis.com/v4/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!accountsResponse.ok) {
      throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`)
    }

    const accountsData = await accountsResponse.json()
    const accounts = accountsData.accounts || []
    const allLocations: GoogleBusinessLocation[] = []

    for (const account of accounts) {
      const accountId = account.name.replace('accounts/', '')
      
      const locationsResponse = await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        const locations = locationsData.locations || []

        for (const location of locations) {
          const locationData = {
            id: location.name,
            name: location.locationName || location.name,
            address: location.address ? 
              `${location.address.addressLines?.join(', ') || ''}, ${location.address.locality || ''}, ${location.address.administrativeArea || ''}`.trim() 
              : '',
            phone: location.primaryPhone,
            website: location.websiteUrl,
            state: location.locationState || 'UNVERIFIED',
            placeId: location.metadata?.placeId,
            googleData: location
          }

          allLocations.push(locationData)

          // Update in database
          await supabaseAdmin
            .from('google_business_locations')
            .upsert({
              user_id: userId,
              location_id: location.name,
              name: locationData.name,
              address: locationData.address,
              phone: locationData.phone,
              website: locationData.website,
              state: locationData.state,
              place_id: locationData.placeId,
              google_data: location,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,location_id'
            })
        }
      }
    }

    return allLocations
  } catch (error) {
    console.error('Error refreshing locations:', error)
    return []
  }
}
