import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateUserId } from '@/lib/utils/uuid-validator';

interface UserValidationResult {
  success: boolean;
  error?: string;
  userExists?: boolean;
}

export async function ensureUserExists(userId: string): Promise<{ exists: boolean; error?: string }> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      return { exists: false, error: error.message };
    }

    return { exists: !!user };
  } catch (error) {
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function createUserIfNotExists(
  userId: string, 
  email: string, 
  name?: string
): Promise<UserValidationResult> {
  try {
    // Check if user exists in our users table
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser && !fetchError) {
      return { success: true, userExists: true };
    }

    // Only proceed if the error is "not found", otherwise return the error
    if (fetchError && fetchError.code !== 'PGRST116') {
      return { 
        success: false, 
        error: `Fetch error: ${fetchError.message}` 
      };
    }

    // Create user in our users table
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('❌ Failed to create user in users table:', insertError);
      return { 
        success: false, 
        error: `Database error: ${insertError.message}` 
      };
    }

    console.log('✅ User created in users table:', userId);
    return { success: true, userExists: false };

  } catch (error) {
    console.error('❌ Error in createUserIfNotExists:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
