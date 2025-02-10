import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { handleError } from '@/utils/errorHandler';

/**
 * ✅ Endpoint para cerrar sesión.
 */
export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return handleError(500, 'Error logging out', error);
    }

    return NextResponse.json({ message: 'Successfully logged out!' }, { status: 200 });
  } catch (error) {
    return handleError(500, 'Internal Server Error', error);
  }
}
