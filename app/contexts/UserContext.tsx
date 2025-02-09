'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, ReactNode } from 'react';

type User = {
  name: string;
  profileImage: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user ? {
      name: session.user.name || 'Anonymous',
      profileImage: session.user.image || '/default-avatar.png'
    } : null,
    isLoading: status === 'loading',
    error: null
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

export { UserContext }; 