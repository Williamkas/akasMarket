import { supabase } from '@/lib/supabase/client';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

/**
 * ✅ Endpoint para cerrar sesión.
 */
export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return handleError(500, 'Error logging out', error);
    }

    return handleSuccess(200, 'Successfully logged out!', null);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
