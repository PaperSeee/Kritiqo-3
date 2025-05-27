'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface GoogleBusinessLocation {
  id: string
  name: string
  address?: string
  phone?: string
  website?: string
  state: 'VERIFIED' | 'UNVERIFIED' | 'PENDING'
  accountId: string
}

export interface UseGoogleBusinessDataResult {
  locations: GoogleBusinessLocation[]
  loading: boolean
  error: string | null
  refreshing: boolean
  refresh: () => Promise<void>
}

export function useGoogleBusinessData(): UseGoogleBusinessDataResult {
  const { data: session } = useSession()
  const [locations, setLocations] = useState<GoogleBusinessLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGoogleBusinessData = async (isRefresh = false) => {
    if (!session?.accessToken) {
      setError('Token d\'accès Google Business non disponible')
      setLoading(false)
      return
    }

    if (isRefresh) setRefreshing(true)
    setError(null)

    try {
      const response = await fetch('/api/google-business/fetch-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.accessToken
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setError('Token Google Business expiré. Veuillez vous reconnecter.')
        } else if (response.status === 403) {
          setError('Accès refusé. Vérifiez que votre compte Google a accès à Google Business Profile.')
        } else if (response.status === 404) {
          setError('Aucun compte Google Business trouvé. Veuillez configurer Google Business Profile.')
        } else {
          setError(data.error || 'Erreur lors de la récupération des données')
        }
        return
      }

      setLocations(data.locations || [])
      
      // Log du message de succès si présent
      if (data.message) {
        console.log('✅ Google Business:', data.message)
      }
    } catch (err) {
      console.error('Error fetching Google Business data:', err)
      setError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refresh = async () => {
    await fetchGoogleBusinessData(true)
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchGoogleBusinessData()
    } else {
      setLoading(false)
    }
  }, [session?.accessToken])

  return {
    locations,
    loading,
    error,
    refreshing,
    refresh
  }
}
