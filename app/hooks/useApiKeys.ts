import { useState, useEffect } from 'react';
import { ApiKey } from '../types/apiKey';
import { apiKeyService } from '../services/apiKeyService';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const fetchApiKeys = async () => {
    try {
      const keys = await apiKeyService.fetchApiKeys();
      setApiKeys(keys);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch API keys');
      setIsLoading(false);
    }
  };

  const createApiKey = async (name: string) => {
    try {
      await apiKeyService.createApiKey(name);
      await fetchApiKeys();
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create API key');
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    isLoading,
    error,
    visibleKeys,
    createApiKey,
    deleteApiKey,
    toggleKeyVisibility,
  };
}; 