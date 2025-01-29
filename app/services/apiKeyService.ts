import { ApiKey } from '../types/apiKey';

export const apiKeyService = {
  async fetchApiKeys(): Promise<ApiKey[]> {
    const response = await fetch('/api/api-keys');
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error);
    
    return data.apiKeys;
  },

  async createApiKey(name: string): Promise<void> {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
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