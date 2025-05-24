import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ensure the PUBLIC envs are present at startup
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Only instantiate a service-role client on the server side
export const supabaseAdmin =
  typeof window === 'undefined'
    ? createClient(supabaseUrl, supabaseServiceRoleKey!)
    : null
