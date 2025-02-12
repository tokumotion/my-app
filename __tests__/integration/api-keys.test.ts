import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { DB_TABLES } from '@/lib/schema';

describe('API Keys Integration Tests', () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  beforeAll(async () => {
    // Setup test environment
    await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .delete()
      .neq('id', 0); // Clear test data
  });

  it('should create and retrieve API keys in the correct schema', async () => {
    const testKey = {
      name: 'test-key',
      key: 'test-value'
    };

    // Insert test data
    const { data: insertData, error: insertError } = await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .insert(testKey)
      .select()
      .single();

    expect(insertError).toBeNull();
    expect(insertData).toBeDefined();
    expect(insertData.name).toBe(testKey.name);

    // Verify retrieval
    const { data: fetchData, error: fetchError } = await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .select()
      .eq('name', testKey.name)
      .single();

    expect(fetchError).toBeNull();
    expect(fetchData).toBeDefined();
    expect(fetchData.name).toBe(testKey.name);
  });

  afterAll(async () => {
    // Cleanup test data
    await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .delete()
      .eq('name', 'test-key');
  });
}); 