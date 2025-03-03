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

    // 📌 Crear la respuesta de éxito
    const response = handleSuccess(200, 'Successfully logged out!', null);

    // 📌 Expirar cookies de autenticación
    response.headers.set('Set-Cookie', 'refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0');
    response.headers.append('Set-Cookie', 'accessToken=; HttpOnly; Secure; Path=/; Max-Age=0');

    return response;
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
