import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation/schemas';
import { handleError } from '@/utils/errorHandler';

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

    // 📌 Autenticar al usuario en Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return handleError(401, 'Invalid credentials');
    }

    return NextResponse.json(
      { message: 'Login successful', user: data.user, accessToken: data.session?.access_token },
      { status: 200 }
    );
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
