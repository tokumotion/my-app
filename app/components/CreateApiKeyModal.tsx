'use client';

import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit }: CreateApiKeyModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('🎯 Starting API key creation for:', name);

    try {
      await onSubmit(name);
      console.log('✅ API key created successfully');
      setName('');
      onClose();
    } catch (err) {
      console.error('💥 Error in CreateApiKeyModal:', {
        error: err,
        type: err instanceof Error ? err.constructor.name : typeof err,
        message: err instanceof Error ? err.message : 'Unknown error'
      });
      
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="keyName" className="block text-sm font-medium mb-2">
                Key Name
              </label>
              <input
                type="text"
                id="keyName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter key name"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-foreground text-background rounded-md hover:bg-opacity-90 disabled:opacity-50"
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
}