import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 30 minutes in seconds
const INACTIVITY_TIMEOUT = 30 * 60;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔍 Middleware triggered for path:', path);

  // Only protect the /protected route
  if (path.startsWith('/protected')) {
    console.log('🛡️ Protected route accessed');
    
    // Get API key from cookies
    const apiKey = request.cookies.get('api_key')?.value;
    console.log('🔑 API Key from cookie:', apiKey);  // Log the actual key value for debugging

    // If no API key is present, redirect to playground
    if (!apiKey) {
      console.log('⚠️ No API key found, redirecting to playground');
      return NextResponse.redirect(new URL('/playground', request.url));
    }

    try {
      console.log('🔄 Validating API key with Supabase...');
      // Validate the API key directly with Supabase
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .single();

      console.log('Supabase response:', { data, error }); // Add this log

      if (error || !data) {
        console.log('❌ Invalid API key:', error);
        return NextResponse.redirect(new URL('/playground', request.url));
      }

      console.log('✅ API key validated successfully');
      // Create a new response
      const response = NextResponse.next();

      // Set/refresh the cookie with 30-minute expiry
      response.cookies.set('api_key', apiKey, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: INACTIVITY_TIMEOUT, // 30 minutes
        httpOnly: true
      });

      // Add last activity timestamp
      response.cookies.set('last_activity', Date.now().toString(), {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: INACTIVITY_TIMEOUT,
        httpOnly: true
      });

      console.log('🍪 Cookies set in response');
      return response;
    } catch (error) {
      console.error('💥 Middleware validation error:', error);
      return NextResponse.redirect(new URL('/playground', request.url));
    }
  }

  console.log('➡️ Passing through middleware');
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected', '/protected/:path*'],
}; 