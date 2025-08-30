

'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, setDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { departments, getCitiesByDepartment } from "@/lib/locations";

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
  currency: z.string({ required_error: "La moneda es obligatoria." }),
  sector: z.string({ required_error: "Debe seleccionar un sector." }),
  sponsorName: z.string().min(3, "El nombre del patrocinador es obligatorio."),
  sponsorPhone: z.string().optional(),
  sponsorEmail: z.string().email("Debe ser un correo electrónico válido."),
  assumptions: z.string().min(10, "Los supuestos deben tener al menos 10 caracteres."),
  constraints: z.string().min(10, "Las restricciones deben tener al menos 10 caracteres."),
  highLevelRisks: z.string().min(10, "Los riesgos deben tener al menos 10 caracteres."),
  mainDeliverables: z.string().min(10, "Los entregables deben tener al menos 10 caracteres."),
  approvalRequirements: z.string().min(10, "Los requisitos de aprobación deben tener al menos 10 caracteres."),
  acceptanceCriteria: z.string().min(10, "Los criterios de aceptación deben tener al menos 10 caracteres."),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string({ required_error: "La ciudad es obligatoria." }),
}).refine((data) => data.endDate > data.startDate, {
  message: "La fecha de fin no puede ser anterior a la fecha de inicio.",
  path: ["endDate"],
});

type NewProjectFormValues = z.infer<typeof newProjectFormSchema>;


export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, loading: userLoading } = useAuth();
    const [cities, setCities] = React.useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

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
            sector: "",
            sponsorName: "",
            sponsorPhone: "",
            sponsorEmail: "",
            assumptions: "",
            constraints: "",
            highLevelRisks: "",
            mainDeliverables: "",
            approvalRequirements: "",
            acceptanceCriteria: "",
            country: "co",
            department: "",
            city: "",
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
    }, [selectedDepartment]);

    async function onSubmit(data: NewProjectFormValues) {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Debes iniciar sesión para crear un proyecto.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const newProjectRef = doc(collection(db, "projects"));
            
            const newProjectData = {
                id: newProjectRef.id,
                projectManagerId: user.uid,
                name: data.name,
                description: data.description,
                justification: data.justification,
                generalObjective: data.generalObjective,
                scope: data.scope,
                startDate: Timestamp.fromDate(data.startDate),
                endDate: Timestamp.fromDate(data.endDate),
                budget: parseFloat(data.budget),
                currency: data.currency,
                sector: data.sector,
                sponsorName: data.sponsorName,
                sponsorPhone: data.sponsorPhone,
                sponsorEmail: data.sponsorEmail,
                assumptions: data.assumptions,
                constraints: data.constraints,
                highLevelRisks: data.highLevelRisks,
                mainDeliverables: data.mainDeliverables,
                approvalRequirements: data.approvalRequirements,
                acceptanceCriteria: data.acceptanceCriteria,
                country: data.country,
                department: data.department,
                city: data.city,
                imageUrl: `https://picsum.photos/seed/${newProjectRef.id}/600/400`,
                status: {
                    initiation: 'in-progress',
                    planning: 'locked',
                    execution: 'locked',
                    closing: 'locked',
                }
            };
            
            await setDoc(newProjectRef, newProjectData);

            toast({
                title: "Proyecto Creado",
                description: "Tu proyecto ha sido creado exitosamente. Ahora registra la empresa cliente.",
            });
            router.push(`/dashboard/projects/${newProjectRef.id}/initiation/company-registry`);
        } catch (error) {
            console.error("Error creating project: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear el proyecto. Inténtalo de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (userLoading) {
        return (
             <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">Crear Nuevo Proyecto</h1>
            <p className="text-muted-foreground">
                Completa este formulario detallado para registrar un nuevo proyecto en ProjectWise.
            </p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Información General del Proyecto</CardTitle>
                        <CardDescription>
                            Proporciona los detalles fundamentales que definen el proyecto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nombre del Proyecto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Nueva Plataforma E-commerce" {...field} />
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
                                <FormLabel>Descripción Corta del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe brevemente el proyecto, su propósito principal y el problema que resuelve." {...field} />
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
                                <FormLabel>Justificación del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Explica por qué este proyecto es necesario y el valor que aportará a la organización o al cliente." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="generalObjective"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Objetivo General</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Define el objetivo principal y medible que se espera alcanzar al finalizar el proyecto." {...field} />
                                    </FormControl>
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
                                        <Textarea placeholder="Delimita claramente lo que está incluido y lo que no está incluido dentro del proyecto." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>2. Cronograma y Presupuesto</CardTitle>
                        <CardDescription>
                           Define las fechas clave y los recursos financieros para el proyecto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: es })
                                            ) : (
                                                <span>Selecciona una fecha</span>
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
                                                date < new Date("1900-01-01")
                                            }
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
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: es })
                                            ) : (
                                                <span>Selecciona una fecha</span>
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
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Presupuesto Global del Proyecto</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Ej: 50000000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Moneda</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una moneda" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                                        <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3. Clasificación y Ubicación</CardTitle>
                        <CardDescription>
                            Define el sector al que pertenece el proyecto y su localización geográfica.
                        </CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sector del Proyecto</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un sector" />
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
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepartment || cities.length === 0}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={selectedDepartment ? "Selecciona una ciudad" : "Selecciona un departamento primero"} />
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
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>4. Patrocinador (Sponsor)</CardTitle>
                        <CardDescription>
                            Identifica a la persona que provee los recursos y el apoyo para el proyecto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="sponsorName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                    <FormLabel>Nombre del Patrocinador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Ana García" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="sponsorPhone"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                    <FormLabel>Número de Contacto (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: 3001234567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="sponsorEmail"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-1">
                                    <FormLabel>Correo Electrónico de Contacto</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Ej: ana.garcia@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>5. Supuestos, Riesgos y Criterios Clave</CardTitle>
                        <CardDescription>
                            Documenta los factores críticos que pueden influir en el éxito del proyecto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="mainDeliverables"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Entregables Principales</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Lista los resultados tangibles o intangibles más importantes que el proyecto debe producir." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assumptions"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Supuestos</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe las hipótesis que se asumen como ciertas para la planificación del proyecto (ej: disponibilidad de recursos, condiciones del mercado)." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="constraints"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Restricciones</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enumera las limitaciones o restricciones que afectan al proyecto (ej: presupuesto limitado, fechas de entrega fijas, regulaciones)." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="highLevelRisks"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Riesgos de Alto Nivel</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Identifica los riesgos más significativos que podrían impactar negativamente el proyecto." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="acceptanceCriteria"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Criterios de Aceptación del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Define los criterios que se utilizarán para que los interesados acepten formalmente los entregables finales." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="approvalRequirements"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Requisitos de Aprobación del Proyecto</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe quién aprueba el éxito del proyecto y cuáles son los hitos o entregables que requieren aprobación formal." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting || userLoading}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Creando Proyecto...' : 'Crear Proyecto'}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
