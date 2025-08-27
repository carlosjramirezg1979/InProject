'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, GanttChart, ArrowLeft } from 'lucide-react';

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
import { resetPassword } from '@/lib/auth-service';
import type { ForgotPasswordFormValues } from '@/types';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    const { success, error } = await resetPassword(values);
    setIsLoading(false);

    if (success) {
      setSubmitted(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    }
  };
  
  if (submitted) {
    return (
        <div className="flex h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <GanttChart className="mx-auto h-12 w-12 text-primary" />
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Correo Enviado
                </h1>
                <p className="text-muted-foreground">
                    Si existe una cuenta con el correo electrónico proporcionado, hemos enviado un enlace para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).
                </p>
                <Button asChild>
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Inicio de Sesión
                    </Link>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <GanttChart className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-6 text-3xl font-bold font-headline tracking-tight">
                Recupera tu Contraseña
            </h1>
            <p className="mt-2 text-muted-foreground">
                Introduce tu correo y te enviaremos un enlace para restablecerla.
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
                    <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Enviar Enlace de Recuperación
            </Button>
             <div className="text-sm text-center">
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                  Volver a Inicio de Sesión
                </Link>
              </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
