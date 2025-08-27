'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { departments, getCitiesByDepartment } from "@/lib/locations";
import { projectManagers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  email: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
  phone: z.string().optional(),
  country: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Get the current user's profile, assuming the first manager for this example.
const currentUser = projectManagers[0];

const defaultValues: Partial<ProfileFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "co",
  department: "",
  city: "",
};

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [cities, setCities] = useState<string[]>([]);
  const selectedDepartment = form.watch("department");
  
  useEffect(() => {
    if (selectedDepartment) {
      setCities(getCitiesByDepartment(selectedDepartment) || []);
      form.setValue("city", ""); // Reset city when department changes
    } else {
      setCities([]);
    }
  }, [selectedDepartment, form]);


  function onSubmit(data: ProfileFormValues) {
    // In a real app, you'd call an API. Here, we'll "update" the mock data.
    const userIndex = projectManagers.findIndex(pm => pm.id === currentUser.id);
    if (userIndex !== -1) {
      projectManagers[userIndex] = {
        ...projectManagers[userIndex],
        ...data,
        firstName: data.firstName || projectManagers[userIndex].firstName,
        lastName: data.lastName || projectManagers[userIndex].lastName,
      };
    }
    
    toast({
        title: "Perfil Actualizado",
        description: "Tu información ha sido guardada exitosamente.",
    });
    console.log("Profile data submitted and saved:", projectManagers[userIndex]);
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Perfil de Usuario</CardTitle>
                <CardDescription>
                    Esta es la información que se mostrará públicamente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Dirección de Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: usuario@ejemplo.com" {...field} />
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
                                <FormLabel>Número de Celular</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un país" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="co">Colombia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un departamento" />
                                        </Trigger>
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
                                            <SelectValue placeholder="Selecciona una ciudad" />
                                        </Trigger>
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
                    <Button type="submit">Actualizar Perfil</Button>
                </form>
                </Form>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                    Gestiona la seguridad de tu cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Contraseña</h3>
                    <p className="text-sm text-muted-foreground">
                        Cambia tu contraseña para mantener tu cuenta segura.
                    </p>
                </div>
                <ChangePasswordDialog />
            </CardContent>
        </Card>
    </div>
  );
}
