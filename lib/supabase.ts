import { createClient } from '@supabase/supabase-js'
import { TriageAction, TriageCategorie, TriagePriorite } from './types/triage'

// Configuration Supabase pour le côté CLIENT
// Utilise la clé anonyme publique (sécurisée pour le navigateur)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not defined in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not defined in environment variables')
}

// Client Supabase pour utilisation côté client (composants React, hooks)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ConnectedEmail = {
  id: string
  user_id: string
  email: string
  provider: 'google' | 'azure-ad'
  access_token: string | null
  refresh_token: string | null
  expires_at: number | null
  token_type: string
  scope: string | null
  created_at: string
  updated_at: string
}

export type EmailTriage = {
  id: string
  email_id: string
  user_id: string
  catégorie: TriageCategorie
  priorité: TriagePriorite
  action: TriageAction
  suggestion: string | null
  created_at: string
}

// Fonctions pour générer les QR codes pour maximiser les avis
export function generateQRCodeUrl(url: string, size = 300): string {
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/'
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: url,
    format: 'PNG',
    margin: '10',
    bgcolor: 'ffffff',
    color: '000000'
  })
  return `${baseUrl}?${params.toString()}`
}

// Générer URL de review optimisée pour maximiser les avis
export function generateOptimizedReviewUrl(businessSlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kritiqo.com'
  return `${baseUrl}/review/${businessSlug}?utm_source=qr&utm_medium=physical&utm_campaign=review_collection`
}

// Fonction pour générer QR code avec tracking pour analytics
export function generateTrackedQRCode(businessSlug: string, location = 'general', size = 300): string {
  const reviewUrl = generateOptimizedReviewUrl(businessSlug)
  const trackedUrl = `${reviewUrl}&location=${location}&timestamp=${Date.now()}`
  return generateQRCodeUrl(trackedUrl, size)
}
