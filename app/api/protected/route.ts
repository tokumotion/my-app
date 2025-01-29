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
  console.log('🎯 Starting GET request validation...');
  
  try {
    // Initialize cookie store with await
    console.log('🔄 Initializing cookie store...');
    const cookieStore = await cookies();
    
    // Access cookie value after Promise resolves
    console.log('🔍 Accessing API key from cookies...');
    const apiKey = cookieStore.get('api_key')?.value;
    console.log('🔑 API key status:', apiKey ? 'Present' : 'Missing');

    if (!apiKey) {
      console.log('❌ No API key cookie found');
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      );
    }

    try {
      console.log('🔄 Validating API key with Supabase...');
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
      console.error('💥 Supabase validation error:', error);
      return NextResponse.json(
        { error: 'Server error during validation' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Cookie operation failed:', error);
    return NextResponse.json(
      { error: 'Server error during cookie processing' },
      { status: 500 }
    );
  }
}

// Add POST method to handle activity refresh
export async function POST(request: Request) {
  console.log('🎯 Starting activity refresh...');
  
  try {
    // Initialize cookie store with await
    console.log('🔄 Initializing cookie store for activity refresh...');
    const cookieStore = await cookies();
    
    // Access cookie value after Promise resolves
    console.log('🔍 Accessing API key for refresh...');
    const apiKey = cookieStore.get('api_key')?.value;
    console.log('🔑 Activity refresh - API key status:', apiKey ? 'Present' : 'Missing');

    if (!apiKey) {
      console.log('❌ No API key found for refresh');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      console.log('🔄 Creating response with refreshed cookies...');
      const response = NextResponse.json(
        { message: 'Activity refreshed' },
        { status: 200 }
      );

      // Refresh both cookies
      console.log('🍪 Setting refreshed API key cookie...');
      response.cookies.set('api_key', apiKey, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: INACTIVITY_TIMEOUT,
        httpOnly: true
      });

      console.log('⏰ Setting refreshed activity timestamp...');
      response.cookies.set('last_activity', Date.now().toString(), {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: INACTIVITY_TIMEOUT,
        httpOnly: true
      });

      console.log('✅ Activity refresh completed successfully');
      return response;
    } catch (error) {
      console.error('💥 Error setting refresh cookies:', error);
      return NextResponse.json(
        { error: 'Server error during refresh' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Cookie operation failed during refresh:', error);
    return NextResponse.json(
      { error: 'Server error during cookie processing' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ['/protected', '/protected/:path*'],
}; 