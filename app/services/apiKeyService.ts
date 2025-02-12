import { ApiKey } from '../types/apiKey';
import { ApiKeyResponse } from '../types/supabase';

export const apiKeyService = {
  async fetchApiKeys(): Promise<ApiKey[]> {
    const response = await fetch('/api/api-keys');
    const data: ApiKeyResponse = await response.json();
    
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to fetch API keys');
    }
    
    return data.data || [];
  },

  async createApiKey(name: string): Promise<void> {
    console.log('🎯 apiKeyService: Starting API key creation');
    
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('💥 apiKeyService: API key creation failed', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      throw new Error(data.details || data.error || 'Failed to create API key');
    }

    console.log('✅ apiKeyService: API key created successfully');
  },

  async deleteApiKey(id: string): Promise<void> {
    const response = await fetch(`/api/api-keys?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  }
}; 