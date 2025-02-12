import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DB_SCHEMAS } from '@/lib/schema';

export function loggerMiddleware(handler: Function) {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    console.log(`🎯 [${requestId}] Request started:`, {
      method: request.method,
      path: request.nextUrl.pathname,
      schema: DB_SCHEMAS.AUTH
    });

    try {
      const response = await handler(request);
      
      console.log(`✅ [${requestId}] Request completed:`, {
        duration: Date.now() - startTime,
        status: response.status
      });

      return response;
    } catch (error) {
      console.error(`💥 [${requestId}] Request failed:`, {
        duration: Date.now() - startTime,
        error
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 