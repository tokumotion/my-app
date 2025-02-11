import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// 30 minutes in seconds
const INACTIVITY_TIMEOUT = 30 * 60;

export async function GET() {
  try {
    // Get the session with the Supabase access token
    const session = await getServerSession(authOptions);
    
    if (!session?.supabaseAccessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Supabase client with auth context
    const supabase = createServerSupabaseClient();
    
    // Use the client to make authenticated requests
    const { data, error } = await supabase
      .from('next_auth.users')  // Note the schema prefix
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Access granted', user: data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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