import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect the /protected route
  if (path.startsWith('/protected')) {
    // Get API key from cookies
    const apiKey = request.cookies.get('api_key')?.value;

    // If no API key is present, redirect to playground
    if (!apiKey) {
      return NextResponse.redirect(new URL('/playground', request.url));
    }

    try {
      // Validate the API key
      const response = await fetch(`${request.nextUrl.origin}/api/validate-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        // If API key is invalid, redirect to playground
        return NextResponse.redirect(new URL('/playground', request.url));
      }
    } catch (error) {
      // If validation fails, redirect to playground
      return NextResponse.redirect(new URL('/playground', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'],
}; 