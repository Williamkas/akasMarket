import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Obtener el refreshToken de la cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: true, message: 'No session to logout' },
        {
          status: 200,
          headers: {
            'Set-Cookie': 'refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0'
          }
        }
      );
    }

    // Cerrar sesión en Supabase
    await supabase.auth.signOut();

    // Borrar la cookie
    return NextResponse.json(
      { success: true, message: 'Logged out' },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'refreshToken=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0'
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Logout failed', details: error?.message || error } },
      { status: 500 }
    );
  }
}
