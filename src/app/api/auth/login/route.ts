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

    if (!existingEmail || existingEmail.length === 0) {
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

    // 📌 Extraer tokens de la sesión
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (!accessToken || !refreshToken) {
      return handleError(500, 'Authentication failed, tokens not received');
    }

    // 📌 Configurar cookie segura con el refreshToken
    // Si HttpOnly está activado, la cookie NO puede ser leída con JavaScript (document.cookie).
    // Si Secure está activado, la cookie solo se enviará en conexiones HTTPS.
    // Con SameSite=Strict, el navegador solo envía la cookie cuando la petición proviene del mismo sitio.
    const cookieOptions = {
      'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000` // 30 días
    };

    const response = { user: data.user, accessToken };

    // 📌 Responder con accessToken y datos del usuario
    return handleSuccess(200, 'Login successful', response, cookieOptions);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
