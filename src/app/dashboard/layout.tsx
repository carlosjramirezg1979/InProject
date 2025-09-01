
'use client';

import { Header } from "@/components/header";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si la carga ha terminado y no hay usuario.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mientras carga, mostrar un spinner.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Si hay un usuario, mostrar el dashboard.
  // El useEffect se encargará de redirigir si no hay usuario.
  if (user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // Si la carga terminó y no hay usuario, la redirección está en curso.
  // Devolver el loader para evitar un parpadeo de contenido vacío.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
