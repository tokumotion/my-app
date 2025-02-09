'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import type { FC } from 'react';

const LoginPage: FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = () => {
    signIn('google', {
      callbackUrl: decodeURIComponent(callbackUrl),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Login
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {callbackUrl !== '/' ? 'You will be redirected after login' : 'Welcome back'}
            </p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage; 