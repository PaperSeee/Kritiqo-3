import { createClient } from '@supabase/supabase-js'

// Configuration Supabase pour le côté SERVEUR
// Utilise la clé de service (privilèges élevés)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not defined in environment variables')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required but not defined in environment variables')
}

// Client Supabase pour utilisation côté serveur (API routes, actions privilégiées)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
