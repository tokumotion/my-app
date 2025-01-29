import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 30 minutes in seconds
const INACTIVITY_TIMEOUT = 30 * 60;

export async function GET(request: Request) {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('api_key')?.value;

  console.log('🔑 API endpoint checking cookie:', apiKey ? 'Present' : 'Missing');

  if (!apiKey) {
    console.log('❌ No API key cookie found');
    return NextResponse.json(
      { error: 'Missing API key' },
      { status: 401 }
    );
  }

  try {
    console.log('🔄 Validating API key with Supabase...');
    // Validate the API key against Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      console.log('❌ Invalid API key:', error);
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    console.log('✅ API key validated successfully');
    return NextResponse.json(
      { message: 'Access granted to protected endpoint' },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 Protected route error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

// Add POST method to handle activity refresh
export async function POST(request: Request) {
  const cookieStore = cookies();
  const apiKey = cookieStore.get('api_key')?.value;

  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = NextResponse.json(
      { message: 'Activity refreshed' },
      { status: 200 }
    );

    // Refresh both cookies
    response.cookies.set('api_key', apiKey, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: INACTIVITY_TIMEOUT,
      httpOnly: true
    });

    response.cookies.set('last_activity', Date.now().toString(), {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: INACTIVITY_TIMEOUT,
      httpOnly: true
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const config = {
  matcher: ['/protected', '/protected/:path*'],
}; 