
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";

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
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/user-service";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  email: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
  phone: z.string().optional(),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string({ required_error: "La ciudad es obligatoria." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
    const { toast } = useToast();
    const { user, userProfile, reloadUserProfile } = useAuth();
    const [cities, setCities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "co",
            department: undefined,
            city: undefined,
        },
        mode: "onChange",
    });
    
    const selectedDepartment = form.watch("department");

    useEffect(() => {
        if (userProfile) {
            form.reset({
                firstName: userProfile.firstName || "",
                lastName: userProfile.lastName || "",
                email: userProfile.email || "",
                phone: userProfile.phone || "",
                country: userProfile.country || "co",
                department: userProfile.department,
                city: userProfile.city,
            });
            if (userProfile.department) {
                setCities(getCitiesByDepartment(userProfile.department) || []);
            }
        }
    }, [userProfile, form]);
    
    useEffect(() => {
        if (selectedDepartment) {
            const departmentCities = getCitiesByDepartment(selectedDepartment) || [];
            setCities(departmentCities);
            if (selectedDepartment !== userProfile?.department) {
                form.setValue('city', '');
            }
        }
    }, [selectedDepartment, form, userProfile?.department]);


    async function onSubmit(data: ProfileFormValues) {
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "Usuario no encontrado." });
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUserProfile(user.uid, data);
            await reloadUserProfile();
            toast({
                title: "Perfil Actualizado",
                description: "Tu información ha sido guardada exitosamente.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
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
                                        <Input type="email" placeholder="Ej: usuario@ejemplo.com" {...field} readOnly />
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
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue="co">
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
                                                <SelectValue placeholder={cities.length > 0 ? "Selecciona una ciudad" : "Selecciona un departamento primero"} />
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
                        <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Perfil'}
                        </Button>
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
