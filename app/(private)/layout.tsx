'use client';

import PrivateLayout from '@/components/PrivateLayout';

export default function PrivateRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateLayout>{children}</PrivateLayout>;
} 