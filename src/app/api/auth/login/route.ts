import { supabase } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation/schemas';
import { cookies } from 'next/headers';
import { handleError, handleSuccess } from '@/utils/apiHelpers';

/**
 * ✅ Endpoint para iniciar sesión.
 */
export async function POST(request: Request) {
  try {
    // 📌 Leer las cookies del request (accedemos a la cookie del refreshToken) para evitar que usuario haga login estando previanmente logueado.
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      // 📌 Verificar si el refreshToken ya es válido
      const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (sessionData?.session?.access_token) {
        // Si ya hay un accessToken válido, significa que el usuario ya está logueado
        return handleError(400, 'User already logged in');
      }

      if (refreshError) {
        return handleError(403, 'Invalid refresh token');
      }
    }
    
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
    const refreshTokenNew = data.session?.refresh_token;

    if (!accessToken || !refreshTokenNew) {
      return handleError(500, 'Authentication failed, tokens not received');
    }

    // 📌 Configurar cookie segura con el refreshToken
    // Si HttpOnly está activado, la cookie NO puede ser leída con JavaScript (document.cookie).
    // Si Secure está activado, la cookie solo se enviará en conexiones HTTPS.
    // Con SameSite=Strict, el navegador solo envía la cookie cuando la petición proviene del mismo sitio.
    const cookieOptions = {
      'Set-Cookie': `refreshToken=${refreshTokenNew}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000` // 30 días
    };

    const response = { user: data.user, accessToken };

    // 📌 Responder con accessToken y datos del usuario
    return handleSuccess(200, 'Login successful', response, cookieOptions);
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
