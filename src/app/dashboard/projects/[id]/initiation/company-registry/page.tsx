
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { departments, getCitiesByDepartment } from "@/lib/locations";

const companySectors = [
    {
        label: "Industria Manufacturera",
        options: [
            "Automotriz: Fabricación de automóviles, camiones, motocicletas.",
            "Electrónica: Producción de dispositivos electrónicos, semiconductores.",
            "Maquinaria: Equipos industriales, maquinaria pesada.",
            "Textiles: Ropa, tejidos, productos de moda.",
            "Alimentos y Bebidas: Procesamiento de alimentos, bebidas, productos agrícolas."
        ]
    },
    {
        label: "Construcción",
        options: [
            "Construcción Residencial: Viviendas, apartamentos.",
            "Construcción Comercial: Oficinas, centros comerciales.",
            "Infraestructura: Carreteras, puentes, sistemas de agua.",
            "Ingeniería Civil: Proyectos de infraestructura a gran escala."
        ]
    },
    {
        label: "Energía",
        options: [
            "Petróleo y Gas: Exploración, extracción, refinación, distribución.",
            "Energías Renovables: Solar, eólica, hidroeléctrica.",
            "Energía Nuclear: Producción de energía nuclear, gestión de residuos."
        ]
    },
    {
        label: "Servicios Financieros",
        options: [
            "Bancos: Servicios bancarios, préstamos, cuentas.",
            "Seguros: Seguros de vida, seguros de salud, seguros de propiedad.",
            "Inversiones: Fondos de inversión, corretaje, gestión de activos."
        ]
    },
    {
        label: "Tecnología de la Información",
        options: [
            "Software: Desarrollo de software, aplicaciones.",
            "Hardware: Computadoras, periféricos.",
            "Servicios de TI: Consultoría en TI, gestión de redes."
        ]
    },
    {
        label: "Salud",
        options: [
            "Servicios Médicos: Hospitales, clínicas, consultorios.",
            "Farmacéutica: Investigación y desarrollo de medicamentos, producción.",
            "Equipos Médicos: Fabricación de dispositivos médicos y equipos de diagnóstico."
        ]
    },
    {
        label: "Transporte y Logística",
        options: [
            "Transporte Terrestre: Camiones, trenes, autobuses.",
            "Transporte Aéreo: Aerolíneas, transporte de carga aérea.",
            "Transporte Marítimo: Barcos de carga, transporte marítimo.",
            "Logística: Gestión de la cadena de suministro, almacenamiento."
        ]
    },
    {
        label: "Turismo y Ocio",
        options: [
            "Hospitalidad: Hoteles, restaurantes, servicios de alojamiento.",
            "Entretenimiento: Cine, teatro, eventos deportivos.",
            "Agencias de Viajes: Planificación de viajes, reservas."
        ]
    },
    {
        label: "Educación",
        options: [
            "Educación Primaria y Secundaria: Escuelas, colegios.",
            "Educación Superior: Universidades, institutos técnicos.",
            "Formación Profesional: Cursos de capacitación, formación continua."
        ]
    },
    {
        label: "Agricultura y Agroindustria",
        options: [
            "Cultivos: Agricultura de granos, frutas, vegetales.",
            "Ganadería: Producción de carne, lácteos.",
            "Agroindustria: Procesamiento de productos agrícolas, fertilizantes."
        ]
    },
    {
        label: "Medios de Comunicación y Publicidad",
        options: [
            "Medios: Televisión, radio, prensa escrita.",
            "Publicidad: Agencias de publicidad, marketing digital.",
            "Producción de Contenidos: Creación de contenido para medios y plataformas digitales."
        ]
    },
    {
        label: "Química y Farmacéutica",
        options: [
            "Productos Químicos: Productos químicos industriales, plásticos.",
            "Farmacéutica: Investigación, desarrollo, fabricación de medicamentos."
        ]
    }
];

const companyRegistrySchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string({ required_error: "La ciudad es obligatoria." }),
  employeeCount: z.string({ required_error: "El número de empleados es obligatorio." }),
  companyType: z.string({ required_error: "El tipo de empresa es obligatorio." }),
  address: z.string().min(1, "La dirección es obligatoria."),
  website: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  description: z.string().optional(),
  sector: z.string({ required_error: "El sector es obligatorio." }),
  contactName: z.string().min(1, "El nombre del contacto es obligatorio."),
  contactEmail: z.string().email("Debe ser un correo electrónico válido."),
  contactEmailConfirm: z.string().email("Debe ser un correo electrónico válido."),
  contactRole: z.string().min(1, "El cargo es obligatorio."),
  contactPhoneCountryCode: z.string().min(1, "El código de país es obligatorio."),
  contactPhoneNumber: z.string().min(1, "El número de contacto es obligatorio."),
  contactPhoneExtension: z.string().optional(),
}).refine(data => data.contactEmail === data.contactEmailConfirm, {
    message: "Los correos electrónicos no coinciden.",
    path: ["contactEmailConfirm"],
});

type CompanyRegistryValues = z.infer<typeof companyRegistrySchema>;

export default function CompanyRegistryPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [cities, setCities] = React.useState<string[]>([]);
    
    const form = useForm<CompanyRegistryValues>({
        resolver: zodResolver(companyRegistrySchema),
        defaultValues: {
            companyName: "",
            country: "co",
            department: "",
            city: "",
            employeeCount: "",
            companyType: "",
            address: "",
            website: "",
            description: "",
            sector: "",
            contactName: "",
            contactEmail: "",
            contactEmailConfirm: "",
            contactRole: "",
            contactPhoneCountryCode: "+57",
            contactPhoneNumber: "",
            contactPhoneExtension: "",
        },
        mode: "onChange",
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

    async function onSubmit(data: CompanyRegistryValues) {
        setIsSubmitting(true);
        console.log(data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        toast({
            title: "Empresa Registrada",
            description: "La información de la empresa ha sido guardada exitosamente.",
        });
        form.reset();
    }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Registro de Empresa</CardTitle>
                <CardDescription>
                Información detallada sobre la empresa o cliente para el cual se realiza el proyecto.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Información General de la Empresa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Empresa *</FormLabel>
                                    <FormControl><Input placeholder="Ej: Acme Corporation" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>País *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue="co">
                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un país" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="co">Colombia</SelectItem></SelectContent>
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
                                        <FormLabel>Departamento *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un departamento" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {departments.map((dept) => (<SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>))}
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
                                        <FormLabel>Ciudad *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepartment || cities.length === 0}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={selectedDepartment ? "Selecciona una ciudad" : "Selecciona un departamento"} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección de la empresa *</FormLabel>
                                    <FormControl><Input placeholder="Ej: Carrera 5 # 72 - 35" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="employeeCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de empleados *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rango" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10</SelectItem>
                                                <SelectItem value="11-50">11-50</SelectItem>
                                                <SelectItem value="51-200">51-200</SelectItem>
                                                <SelectItem value="201-1000">201-1,000</SelectItem>
                                                <SelectItem value="1001+">1,001+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="companyType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Empresa *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="publica">Público</SelectItem>
                                                <SelectItem value="privada">Privada</SelectItem>
                                                <SelectItem value="ong">ONG</SelectItem>
                                                <SelectItem value="fundacion">Fundaciones</SelectItem>
                                                <SelectItem value="cooperativa">Cooperativa</SelectItem>
                                                <SelectItem value="mixta">Mixta (Público y privado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Página Web de la Empresa</FormLabel>
                                    <FormControl><Input placeholder="https://www.ejemplo.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción de la Empresa</FormLabel>
                                    <FormControl><Textarea placeholder="Describe brevemente la empresa y sus actividades." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sector *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un sector" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {companySectors.map((group) => (
                                                <SelectGroup key={group.label}>
                                                    <SelectLabel>{group.label}</SelectLabel>
                                                    {group.options.map((option) => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Persona de Contacto</CardTitle>
                        <CardDescription>Información del contacto principal en la empresa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre completo del contacto *</FormLabel>
                                    <FormControl><Input placeholder="Ej: Carlos Rodriguez" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo del contacto *</FormLabel>
                                        <FormControl><Input type="email" placeholder="contacto@ejemplo.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactEmailConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar correo del contacto *</FormLabel>
                                        <FormControl><Input type="email" placeholder="Repite el correo electrónico" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="contactRole"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo en la Empresa *</FormLabel>
                                    <FormControl><Input placeholder="Ej: Gerente de Proyectos" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField
                                control={form.control}
                                name="contactPhoneCountryCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código País *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue="+57">
                                            <FormControl><SelectTrigger><SelectValue placeholder="Código" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="+57">Colombia (+57)</SelectItem>
                                                <SelectItem value="+1">USA (+1)</SelectItem>
                                                <SelectItem value="+52">México (+52)</SelectItem>
                                                <SelectItem value="+54">Argentina (+54)</SelectItem>
                                                <SelectItem value="+34">España (+34)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="contactPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de contacto *</FormLabel>
                                        <FormControl><Input type="tel" placeholder="3001234567" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="contactPhoneExtension"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Extensión</FormLabel>
                                        <FormControl><Input type="tel" placeholder="123" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Guardando...' : 'Guardar Empresa'}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}

    