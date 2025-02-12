import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { handleError } from '@/utils/apiHelpers';
import { changePasswordSchema } from '@/lib/validation/schemas';

/**
 * ✅ Endpoint para cambiar la contraseña de un usuario.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 📌 Validar los datos con Zod
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid data', validation.error.errors);
    }

    // 📌 Asegúrate de que el cuerpo tenga los datos necesarios
    const { email, oldPassword, newPassword } = validation.data;

    // 📌 Verificación previa: Verificar si el correo o el nombre de usuario ya existe
    const { data: existingEmail, error: emailError } = await supabase.rpc('get_user_by_email', { email: email });

    if (!existingEmail) {
      return handleError(400, 'User not registered');
    }
    if (emailError) {
      return handleError(500, 'Error during email verification', emailError.message);
    }

    // 📌 Autenticar al usuario con su correo y contraseña antigua
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password: oldPassword });

    if (authError) {
      return handleError(401, 'Invalid credentials');
    }

    // 📌 Cambiar la contraseña del usuario autenticado
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return handleError(500, 'Error updating password', updateError.message);
    }

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
