'use client';

import { usePathname } from 'next/navigation';
import PrivateLayout from '@/components/PrivateLayout';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPrivatePath = pathname?.startsWith('/(private)') || pathname?.includes('/private/');

  if (isPrivatePath) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return <>{children}</>;
} 