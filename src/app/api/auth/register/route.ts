import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { registerSchema } from '@/lib/validation/schemas';
import { handleError } from '@/utils/apiHelpers';

/**
 * ✅ Endpoint para registrar un nuevo usuario.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 📌 Validar los datos del cuerpo de la solicitud
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return handleError(400, 'Invalid data', validation.error.errors);
    }

    const { email, password, name, lastname } = validation.data;

    // 📌 Verificación previa: Verificar si el correo o el nombre de usuario ya existe
    const { data: existingEmail, error: emailError } = await supabase.rpc('get_user_by_email', { email: email });

    if (!!existingEmail) {
      return handleError(400, 'Email already registered');
    }
    if (emailError) {
      return handleError(500, 'Error during email verification', emailError.message);
    }

    // 📌 Registrar al usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, lastname, role: 'user' } // Asignar rol automáticamente
      }
    });

    if (error) {
      // 📌 Verificar si el usuario ya está registrado
      if (error.message.includes('already registered')) {
        return handleError(400, 'User already exists.');
      }
      return handleError(500, 'Error during registration', error.message);
    }

    return NextResponse.json({ message: 'User registered successfully', user: data.user }, { status: 201 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
