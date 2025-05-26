'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Business {
  id: string
  name: string
  slug: string
  city: string
  country: string
  place_id: string
  google_link: string
  ubereats_link: string | null
  deliveroo_link: string | null
  takeaway_link: string | null
  custom_url: string
  created_at: string
}

interface BusinessContextType {
  businesses: Business[]
  loading: boolean
  refreshBusinesses: () => Promise<void>
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBusinesses = async () => {
    if (!user) {
      setBusinesses([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (err) {
      console.error('Error fetching businesses:', err)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [user])

  const refreshBusinesses = async () => {
    await fetchBusinesses()
  }

  return (
    <BusinessContext.Provider value={{ businesses, loading, refreshBusinesses }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinesses() {
  const context = useContext(BusinessContext)
  if (context === undefined) {
    throw new Error('useBusinesses must be used within a BusinessProvider')
  }
  return context
}
