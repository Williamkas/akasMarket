import { supabase } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation/schemas';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

/**
 * ✅ Endpoint para iniciar sesión.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 📌 Validar los datos del cuerpo de la solicitud
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid data', validation.error.errors);
    }

    const { email, password } = validation.data;

    // 📌 Verificación previa: Verificar si el correo o el nombre de usuario ya existe
    const { data: existingEmail, error: emailError } = await supabase.rpc('get_user_by_email', { email: email });

    if (!existingEmail) {
      return handleError(400, 'User not registered');
    }
    if (emailError) {
      return handleError(500, 'Error during email verification', emailError.message);
    }

    // 📌 Autenticar al usuario en Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return handleError(401, 'Invalid credentials');
    }
    const response = { user: data.user, accessToken: data.session?.access_token };

    return handleSuccess(200, 'Login successful', response);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
