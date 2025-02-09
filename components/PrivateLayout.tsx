'use client';

import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/app/components/Sidebar';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
} 