import { createClient } from '@supabase/supabase-js'

// Configuration Supabase pour le côté SERVEUR
// Utilise la clé de service (privilèges élevés)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not defined in environment variables')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required but not defined in environment variables - check your .env.local file')
}

// Validate the service role key format
if (!supabaseServiceKey.startsWith('eyJ')) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY appears to be invalid - it should be a JWT token starting with "eyJ"')
}

// Client Supabase pour utilisation côté serveur (API routes, actions privilégiées)
export const supabaseAdmin = createClient(
  'https://atduymjkrjtbblnxawuj.supabase.co',
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to test the connection
export async function testSupabaseAdminConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase Admin connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase Admin connection test successful')
    return true
  } catch (err) {
    console.error('❌ Supabase Admin connection test error:', err)
    return false
  }
}
