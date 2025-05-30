import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateUserId } from '@/lib/utils/uuid-validator';

export async function ensureUserExists(userId: string): Promise<{ exists: boolean; error?: string }> {
  try {
    // First validate the UUID format
    const validUserId = validateUserId(userId);
    
    // Check if user exists in users table
    const { data: userExists, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validUserId)
      .single();

    if (userCheckError) {
      if (userCheckError.code === 'PGRST116') {
        // No rows returned - user doesn't exist
        return { exists: false, error: 'User does not exist in users table' };
      }
      // Other database error
      return { exists: false, error: `Database error: ${userCheckError.message}` };
    }

    return { exists: !!userExists };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { exists: false, error: `Validation error: ${errorMessage}` };
  }
}

export async function createUserIfNotExists(userId: string, email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const validUserId = validateUserId(userId);
    
    // Try to upsert the user
    const { error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: validUserId,
        email: email,
        name: name || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      return { success: false, error: `Failed to create/update user: ${upsertError.message}` };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `User creation error: ${errorMessage}` };
  }
}
