import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/app/components/Sidebar';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // or redirect
  }

  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
} 