import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { handleError } from '@/utils/apiHelpers';
import { sendResetEmailSchema } from '@/lib/validation/schemas';

/**
 * ✅ Endpoint para enviar un enlace de restablecimiento de contraseña.
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

    // 📌 Verificación previa: Verificar si el correo o el nombre de usuario ya existe
    const { data: existingEmail, error: emailError } = await supabase.rpc('get_user_by_email', { email: email });

    if (!existingEmail) {
      return handleError(400, 'User not registered');
    }
    if (emailError) {
      return handleError(500, 'Error during email verification', emailError.message);
    }

    // 📌 Enviar el enlace de restablecimiento de contraseña
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token={access_token}`
    });

    if (error) {
      return handleError(500, 'Error sending reset password email', error.message);
    }

    return NextResponse.json(
      { message: 'Password reset email sent successfully. Please check your inbox.' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
