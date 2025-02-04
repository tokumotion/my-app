'use client';

import { useState } from 'react';
import Toast from '../components/Toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
      
      if (response.ok) {
        Cookies.set('api_key', apiKey, { 
          expires: 1,
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        // Verify cookie was set
        const cookieCheck = Cookies.get('api_key');

        showNotification('Valid API Key, redirecting to protected content...');
        
        window.location.href = '/protected';
      } else {
        showNotification('Invalid API Key');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error validating API key');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {showToast && <Toast message={toastMessage} />}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 dark:from-rose-900 dark:via-purple-900 dark:to-blue-900 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">API Playground</h1>
          <p className="text-lg opacity-80">
            Test your API key and explore the protected endpoints
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your API key"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors flex items-center justify-center
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Validating...' : 'Validate API Key'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 