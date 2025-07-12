import { supabase } from '@/lib/supabase/client';
import { handleError, handleSuccess } from '@/utils/apiHelpers';
import { resetPasswordSchema } from '@/lib/validation/schemas';

/**
 * ✅ Endpoint para restablecer la contraseña con el token.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 📌 Validar con Zod
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid data', validation.error.errors);
    }

    const { password, token } = validation.data;

    // 📌 Setear la sesión con el token de recuperación
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token
    });
    if (sessionError) {
      return handleError(400, 'Invalid or expired token', sessionError.message);
    }

    // 📌 Restablecer la contraseña
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return handleError(500, 'Error updating password', error.message);
    }

    return handleSuccess(200, 'Password updated successfully', null);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
