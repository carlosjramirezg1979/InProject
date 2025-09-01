
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, GanttChart, Eye, EyeOff } from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { signUp } from '@/lib/auth-service';
import { departments, getCitiesByDepartment } from "@/lib/locations";
import type { SignUpFormValues } from '@/types';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  lastName: z.string().min(1, { message: 'El apellido es obligatorio.' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  confirmPassword: z.string(),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string({ required_error: "La ciudad es obligatoria." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [cities, setCities] = React.useState<string[]>([]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: "co",
      department: undefined,
      city: undefined,
    },
  });

  const selectedDepartment = form.watch("department");
    
  React.useEffect(() => {
      if (selectedDepartment) {
          const departmentCities = getCitiesByDepartment(selectedDepartment) || [];
          setCities(departmentCities);
          if (!departmentCities.includes(form.getValues('city'))) {
              form.setValue('city', '');
          }
      } else {
          setCities([]);
      }
  }, [selectedDepartment, form]);

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    const { user, error } = await signUp(values);
    
    setIsLoading(false);

    if (user) {
      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada. Serás redirigido al dashboard.',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error de registro',
        description: error,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <GanttChart className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-6 text-3xl font-bold font-headline tracking-tight">
                Crea tu cuenta en ProjectWise
            </h1>
            <p className="mt-2 text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
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
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Celular (Opcional)</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="Ej: 3001234567" 
                            {...field}
                             onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, '');
                                field.onChange(numericValue);
                            }}
                         />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Departamento</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                            }} value={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un departamento" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {departments.map((dept) => (
                                        <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={cities.length === 0}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={cities.length > 0 ? "Selecciona una ciudad" : "Selecciona un departamento"} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {cities.map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Mínimo 6 caracteres" 
                        {...field} 
                      />
                    </FormControl>
                    <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                   <div className="relative">
                    <FormControl>
                        <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Repite tu contraseña" 
                            {...field} 
                        />
                    </FormControl>
                    <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear Cuenta
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
