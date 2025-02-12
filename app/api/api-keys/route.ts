import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase';
import { DB_TABLES } from '@/lib/schema'
import { createServerClient, Cookie } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper to generate API key
function generateApiKey(): string {
  const random = Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString();
  const hash = createHash('sha256')
    .update(`${random}${timestamp}`)
    .digest('hex');
  return `pk_${hash}`;
}

// GET: Fetch API keys
export async function GET() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Cookie[]) {
          const response = NextResponse.next()
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          return response
        }
      }
    }
  )
  
  console.log('🎯 Starting API keys fetch...');
  
  try {
    console.log('🔄 Attempting to fetch from next_auth.api_keys...');
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('💥 Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        schema: 'next_auth'
      });
      throw error;
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} API keys`);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('🚨 Error fetching API keys:', {
      error,
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : 'Unknown error',
      schema: 'next_auth'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch API keys',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST: Create new API key
export async function POST(request: Request) {
  console.log('🎯 Starting API key creation...');
  
  try {
    // Add authentication check
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log('🔒 User not authenticated');
      return NextResponse.json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        redirectUrl: '/auth/signin',
      }, { status: 401 });
    }

    const { name } = await request.json();
    console.log('📝 Received key name:', name);
    
    const key = generateApiKey();
    console.log('🔑 Generated API key');

    console.log('🔄 Attempting to insert into next_auth.api_keys...');
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ name, key }])
      .select()
      .single();

    if (error) {
      console.error('💥 Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('✅ API key created successfully');
    return NextResponse.json({ apiKey: data });
    
  } catch (error) {
    console.error('🚨 Error in POST /api/api-keys:', {
      error,
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Enhanced error response with authentication-specific handling
    const errorResponse = {
      error: 'Failed to create API key',
      code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
      isAuthError: error instanceof Error && 'code' in error && error.code === '42501',
      redirectUrl: '/auth/signin'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE: Delete API key
export async function DELETE(request: Request) {
  console.log('🎯 Starting API key deletion...');
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      console.log('❌ No ID provided for deletion');
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('💥 Error deleting API key:', error);
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      );
    }

    console.log('✅ API key deleted successfully');
    return NextResponse.json({ message: 'API key deleted successfully' });
    
  } catch (error) {
    console.error('🚨 Error in DELETE handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}