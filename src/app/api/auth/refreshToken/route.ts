import { supabase } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

export async function POST() {
  try {
    // 📌 Leer las cookies del request (cookies() es un helper de Next.js para acceder directamente a las cookies del request, por eso no leemos el request del argumento de la función del POST)
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return handleError(401, 'No refresh token provided');
    }

    // 📌 Verificar si el refreshToken es válido y obtener un nuevo accessToken
    const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (refreshError || !sessionData.session?.user) {
      return handleError(
        403,
        'Invalid refresh token',
        refreshError ? refreshError.message : 'User not found in session data'
      );
    }

    const accessToken = sessionData.session.access_token;

    if (!accessToken) {
      return handleError(500, 'Failed to generate new accessToken', 'No access token received from Supabase');
    }

    // 📌 Responder con el nuevo accessToken
    return handleSuccess(200, 'Token refreshed', { accessToken });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
