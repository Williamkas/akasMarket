import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

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
    const errorMessage =
      typeof error === 'object' && error && 'message' in error ? (error as { message: string }).message : String(error);
    return NextResponse.json(
      { success: false, error: { message: 'Logout failed', details: errorMessage } },
      { status: 500 }
    );
  }
}
