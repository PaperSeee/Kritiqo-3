import { createClient } from '@supabase/supabase-js'

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

// Fonction pour générer l'URL du QR code
export function generateQRCodeUrl(url: string, size = 300): string {
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/'
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: url,
    format: 'PNG',
    margin: '10'
  })
  return `${baseUrl}?${params.toString()}`
}
