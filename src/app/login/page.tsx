
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, GanttChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { signIn } from '@/lib/auth-service';
import type { SignInFormValues } from '@/types';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading: authLoading, user, userProfile } = useAuth();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    // If the user is authenticated and has a profile, redirect to the dashboard.
    // This logic is now primarily handled by the DashboardLayout, but this serves
    // as a quick redirect for users who are already logged in and land on this page.
    if (!authLoading && user && userProfile) {
      router.push('/dashboard');
    }
  }, [authLoading, user, userProfile, router]);


  const onSubmit = async (values: SignInFormValues) => {
    const { error } = await signIn(values);
    
    if (error) {
        toast({
            variant: 'destructive',
            title: 'Error de inicio de sesión',
            description: error,
        });
    }
    // On successful sign-in, the useEffect above and the AuthProvider will handle
    // the user state update and the DashboardLayout will manage the redirect.
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <GanttChart className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-6 text-3xl font-bold font-headline tracking-tight">
                Inicia sesión en ProjectWise
            </h1>
            <p className="mt-2 text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                    Regístrate aquí
                </Link>
            </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="usuario@ejemplo.com" {...field} disabled={authLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} disabled={authLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              { authLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
