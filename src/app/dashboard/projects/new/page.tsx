
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { differenceInWeeks } from 'date-fns';
import { useRouter } from "next/navigation";

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
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const projectSectors = [
    {
        label: "Proyectos de Infraestructura",
        options: [
            "Construcción de Obras Públicas: Carreteras, puentes, túneles, sistemas de transporte público.",
            "Proyectos de Energía: Plantas de energía renovable (solar, eólica), centrales eléctricas, redes de distribución de energía.",
            "Suministro de Agua y Saneamiento: Redes de agua potable, sistemas de tratamiento de aguas residuales.",
        ]
    },
    {
        label: "Proyectos de Tecnología de la Información",
        options: [
            "Desarrollo de Software: Aplicaciones móviles, sistemas de gestión empresarial (ERP), plataformas en la nube.",
            "Implementación de Sistemas: Integración de nuevas tecnologías en organizaciones, sistemas de gestión de bases de datos.",
            "Seguridad Cibernética: Desarrollo de soluciones para proteger datos y redes, auditorías de seguridad.",
        ]
    },
    {
        label: "Proyectos de Construcción y Desarrollo Inmobiliario",
        options: [
            "Construcción Residencial: Viviendas, apartamentos, complejos habitacionales.",
            "Construcción Comercial: Oficinas, centros comerciales, hoteles.",
            "Renovación y remodelación: Restauración de edificios históricos, renovación de espacios comerciales.",
        ]
    },
    {
        label: "Proyectos de Investigación y Desarrollo (I+D)",
        options: [
            "Innovación de Productos: Desarrollo de nuevos productos o mejoras en productos existentes.",
            "Investigación Científica: Estudios y experimentos en campos como la biotecnología, la física, la medicina.",
            "Desarrollo de Tecnologías: Creación de nuevas tecnologías o mejoras en las existentes.",
        ]
    },
    {
        label: "Proyectos de Marketing y Publicidad",
        options: [
            "Campañas Publicitarias: Publicidad en medios digitales, impresos, y televisivos.",
            "Investigación de Mercado: Estudios sobre comportamientos y preferencias del consumidor.",
            "Lanzamiento de Productos: Estrategias para introducir nuevos productos al mercado.",
        ]
    },
    {
        label: "Proyectos de Educación y Capacitación",
        options: [
            "Desarrollo de Material Educativo: Creación de libros de texto, cursos en línea.",
            "Programas de Capacitación: Entrenamiento para habilidades específicas, desarrollo profesional.",
            "Implementación de Tecnologías Educativas: Integración de herramientas tecnológicas en el proceso educativo.",
        ]
    },
    {
        label: "Proyectos de Salud y Medicina",
        options: [
            "Desarrollo de Nuevos Medicamentos: Investigación y pruebas clínicas de fármacos.",
            "Construcción de Instalaciones de Salud: Nuevos hospitales, clínicas, centros de investigación médica.",
            "Programas de Salud Pública: Iniciativas para combatir enfermedades, campañas de vacunación.",
        ]
    },
    {
        label: "Proyectos Ambientales",
        options: [
            "Conservación de la Naturaleza: Proyectos de reforestación, protección de hábitats.",
            "Gestión de Residuos: Sistemas de reciclaje, tratamiento de residuos industriales.",
            "Energía Limpia: Desarrollo y expansión de tecnologías energéticas sostenibles.",
        ]
    },
    {
        label: "Proyectos de Desarrollo Comunitario y Social",
        options: [
            "Programas de Reducción de Pobreza: Iniciativas para mejorar las condiciones de vida en comunidades desfavorecidas.",
            "Proyectos de Infraestructura Social: Construcción de escuelas, centros comunitarios.",
            "Empoderamiento y Desarrollo Comunitario: Capacitación y apoyo a grupos locales para fomentar el desarrollo económico y social.",
        ]
    },
    {
        label: "Proyectos de Eventos y Entretenimiento",
        options: [
            "Organización de Eventos: Conferencias, ferias, festivales.",
            "Producción de Medios: Películas, programas de televisión, producciones musicales.",
            "Desarrollo de Espacios de Entretenimiento: Parques temáticos, centros deportivos.",
        ]
    },
    {
        label: "Proyectos de Defensa y Seguridad",
        options: [
            "Desarrollo de Equipos de Defensa: Creación y mejora de tecnología militar.",
            "Proyectos de Seguridad Nacional: Iniciativas para proteger infraestructuras críticas, respuesta a emergencias.",
        ]
    },
    {
        label: "Proyectos de Transporte y Logística",
        options: [
            "Infraestructura de Transporte: Construcción de redes de transporte, sistemas de gestión del tráfico.",
            "Gestión de la Cadena de Suministro: Optimización de la logística, distribución de productos.",
        ]
    }
];

const newProjectFormSchema = z.object({
  name: z.string().min(5, "El nombre debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  justification: z.string().min(10, "La justificación debe tener al menos 10 caracteres."),
  generalObjective: z.string().min(10, "El objetivo debe tener al menos 10 caracteres."),
  scope: z.string().min(10, "El alcance debe tener al menos 10 caracteres."),
  startDate: z.date({ required_error: "La fecha de inicio es obligatoria." }),
  endDate: z.date({ required_error: "La fecha de fin es obligatoria." }),
  budget: z.string().regex(/^\d+$/, "El presupuesto debe ser un valor numérico."),
  currency: z.string(),
  acceptanceCriteria: z.string().min(10, "Los criterios de aceptación deben tener al menos 10 caracteres."),
  sector: z.string({ required_error: "Debe seleccionar un sector." }),
}).refine(data => data.endDate > data.startDate, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio.",
  path: ["endDate"],
});

type NewProjectFormValues = z.infer<typeof newProjectFormSchema>;

export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [weeks, setWeeks] = React.useState('');

    const form = useForm<NewProjectFormValues>({
        resolver: zodResolver(newProjectFormSchema),
        defaultValues: {
            name: "",
            description: "",
            justification: "",
            generalObjective: "",
            scope: "",
            budget: "",
            currency: "COP",
            acceptanceCriteria: "",
        },
        mode: "onChange",
    });

    const startDate = form.watch('startDate');
    const endDate = form.watch('endDate');

    React.useEffect(() => {
        if (startDate && endDate && endDate > startDate) {
            const weekCount = differenceInWeeks(endDate, startDate);
            setWeeks(`${weekCount} semana(s)`);
        } else {
            setWeeks('');
        }
    }, [startDate, endDate]);

    const onSubmit = (data: NewProjectFormValues) => {
        console.log("New project data submitted:", data);
        toast({
            title: "Proyecto Creado (Simulación)",
            description: "El nuevo proyecto ha sido creado exitosamente.",
        });
        router.push('/dashboard');
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Button asChild variant="ghost" className="mb-2">
                    <Link href="/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Crear Nuevo Proyecto</h1>
                    <p className="text-muted-foreground">
                        Complete la información inicial para registrar un nuevo proyecto en el sistema.
                    </p>
                </div>
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre del Proyecto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Nueva plataforma de E-commerce" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Descripción del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} placeholder="Ej: Desarrollo de una nueva plataforma de comercio electrónico para el cliente 'Moda-Online'." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="justification"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Justificación del proyecto</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="Ej: Aumentar las ventas en línea en un 30% y mejorar la experiencia del usuario." {...field} />
                                </FormControl>
                                <FormDescription>
                                    ¿Por qué se debe hacer este proyecto y cómo se alinea con los objetivos de la organización?
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="generalObjective"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Objetivo General</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} placeholder="Ej: Desarrollar e implementar una plataforma de e-commerce funcional y escalable." {...field} />
                                </FormControl>
                                <FormDescription>
                                    Este objetivo se refinará más adelante bajo la metodología SMART.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scope"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Alcance</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} placeholder="Ej: Incluye diseño, desarrollo, pruebas y despliegue del sitio web, con catálogo de productos, carrito de compras y pasarela de pagos." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Inicio</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Fin</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    startDate ? date <= startDate : false
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Tiempo en Semanas</FormLabel>
                                <FormControl>
                                    <Input value={weeks} readOnly placeholder="Se calcula automáticamente" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Presupuesto Global del Proyecto (COP)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text" 
                                            inputMode="numeric" 
                                            placeholder="Ej: 150000000" 
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
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sector del proyecto</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un sector" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {projectSectors.map((group) => (
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
                        <FormField
                            control={form.control}
                            name="acceptanceCriteria"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Criterios de aceptación del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="Ej: La plataforma debe procesar 100 transacciones por minuto y cargar en menos de 2 segundos." {...field} />
                                </FormControl>
                                <FormDescription>
                                Asegura que las expectativas estén alineadas entre el cliente y el equipo del proyecto.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Creando..." : "Crear Proyecto"}
                            </Button>
                        </div>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
