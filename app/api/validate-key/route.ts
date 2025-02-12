import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DB_TABLES } from '@/lib/schema';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    // Query using standardized schema reference
    const { data, error } = await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .select('key')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error validating API key' },
        { status: 500 }
      );
    }

    if (data) {
      // API key exists in the database
      return NextResponse.json(
        { message: 'Valid API key' },
        { status: 200 }
      );
    } else {
      // API key not found
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Error validating API key' },
      { status: 500 }
    );
  }
} 