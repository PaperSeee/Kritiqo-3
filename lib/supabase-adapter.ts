import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Créer un client Supabase spécialement pour NextAuth avec le bon schéma
const supabaseForAuth = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public' // Forcer l'utilisation du schéma public
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const supabaseAuthAdapter = SupabaseAdapter({
  url: supabaseUrl,
  secret: supabaseServiceKey,
})
