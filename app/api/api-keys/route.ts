import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

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
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST: Create new API key
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const key = generateApiKey();

    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ name, key }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ apiKey: data });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// DELETE: Delete API key
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('api_keys')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}