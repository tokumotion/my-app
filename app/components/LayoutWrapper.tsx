'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/';

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
