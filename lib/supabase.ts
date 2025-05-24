import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// clé secrète utilisée côté serveur
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Ensure the PUBLIC envs are present at startup
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
// Ensure la clé service-role est présente côté serveur
if (typeof window === 'undefined' && !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Only instantiate a service-role client on the server side
export const supabaseAdmin =
  typeof window === 'undefined'
    ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
    : null
