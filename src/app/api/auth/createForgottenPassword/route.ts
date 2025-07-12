import { supabase } from '@/lib/supabase/client';
import { handleError, handleSuccess } from '@/utils/apiHelpers';
import { sendResetEmailSchema } from '@/lib/validation/schemas';

/**
 * ✅ Endpoint para enviar email de recuperación de contraseña.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 📌 Validar con Zod
    const validation = sendResetEmailSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid data', validation.error.errors);
    }

    const { email } = validation.data;

    // 📌 Enviar email de recuperación de contraseña
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3001/?reset=true`
    });

    if (error) {
      return handleError(500, 'Error sending reset email', error.message);
    }

    return handleSuccess(200, 'Reset email sent successfully', null);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
