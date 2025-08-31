
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from "@/components/header";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While checking auth state or fetching the profile, show a loader.
  if (loading || (user && !userProfile)) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  // If we have a user and a profile, render the dashboard.
  if (user && userProfile) {
    return (
        <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        </div>
    );
  }

  // Fallback while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
