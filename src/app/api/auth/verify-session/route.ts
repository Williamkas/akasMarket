import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    // Get the session cookie - try multiple possible cookie names
    const sessionCookie = request.cookies.get('sb-access-token')?.value || request.cookies.get('refreshToken')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: { message: 'No session found' } }, { status: 401 });
    }

    // Verify the token with Supabase
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(sessionCookie);

    if (error || !user) {
      return NextResponse.json({ success: false, error: { message: 'Invalid or expired session' } }, { status: 401 });
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, lastname')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    const userData = {
      id: user.id,
      email: user.email!,
      name: profile?.name || null,
      lastname: profile?.lastname || null
    };

    return NextResponse.json({
      success: true,
      data: { user: userData }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 });
  }
}
