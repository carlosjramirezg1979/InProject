
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
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
import { Separator } from "@/components/ui/separator";
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
  currency: z.string(),
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
}).refine(data => data.endDate > data.startDate, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio.",
  path: ["endDate"],
});

type NewProjectFormValues = z.infer<typeof newProjectFormSchema>;

const defaultValues: Partial<NewProjectFormValues> = {
    name: "",
    description: "",
    justification: "",
    generalObjective: "",
    scope: "",
    budget: "",
    currency: "COP",
    acceptanceCriteria: "",
    sponsorName: "",
    sponsorPhone: "",
    sponsorEmail: "",
    assumptions: "",
    constraints: "",
    highLevelRisks: "",
    mainDeliverables: "",
    approvalRequirements: "",
    country: "co",
    department: undefined,
    city: undefined,
};


export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user, userProfile } = useAuth();
    const [weeks, setWeeks] = React.useState('');
    const [cities, setCities] = React.useState<string[]>([]);
    
    const form = useForm<NewProjectFormValues>({
        resolver: zodResolver(newProjectFormSchema),
        defaultValues,
        mode: "onChange",
    });

    const startDate = form.watch('startDate');
    const endDate = form.watch('endDate');
    const selectedDepartment = form.watch("department");

    React.useEffect(() => {
        if (startDate && endDate && endDate > startDate) {
            const weekCount = differenceInWeeks(endDate, startDate);
            setWeeks(`${weekCount} semana(s)`);
        } else {
            setWeeks('');
        }
    }, [startDate, endDate]);
    
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

    const onSubmit = async (data: NewProjectFormValues) => {
        if (!user || !userProfile) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Debes iniciar sesión para crear un proyecto.",
            });
            return;
        }

        try {
            const projectRef = doc(collection(db, "projects"));
            
            await setDoc(projectRef, {
                ...data,
                id: projectRef.id,
                projectManagerId: user.uid,
                budget: parseFloat(data.budget),
                status: {
                  initiation: 'in-progress',
                  planning: 'not-started',
                  execution: 'locked',
                  closing: 'locked',
                },
                imageUrl: `https://picsum.photos/600/400?random=${projectRef.id}`
            });

            toast({
                title: "Proyecto Creado",
                description: "El nuevo proyecto ha sido guardado exitosamente.",
            });
            router.push('/dashboard');
        } catch (error) {
            console.error("Error creating project:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear el proyecto. Inténtalo de nuevo.",
            });
        }
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
                        {/* Project Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Detalles del Proyecto</h3>
                            <Separator />
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
                                        <Textarea rows={5} placeholder="¿Por qué se debe hacer este proyecto y cómo se alinea con los objetivos de la organización? Ej: Aumentar las ventas en línea en un 30% y mejorar la experiencia del usuario." {...field} />
                                    </FormControl>
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
                                        <Textarea rows={4} placeholder="Este objetivo se refinará más adelante bajo la metodología SMART. Ej: Desarrollar e implementar una plataforma de e-commerce funcional y escalable." {...field} />
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
                                        <Textarea rows={4} placeholder="Ej: Incluye diseño, desarrollo, pruebas y despliegue del sitio web, con catálogo de productos, carrito de compras y pasarela de pagos." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         {/* Assigned Project Manager */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Gerente de Proyecto Asignado</h3>
                            <Separator />
                             <p className="text-sm text-muted-foreground">
                                La siguiente información corresponde al usuario actual y no es editable.
                            </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FormLabel>Nombre del Gerente de Proyecto</FormLabel>
                                    <Input readOnly value={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : ''} />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <Input readOnly value={user?.email || ''} type="email" />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Número de Contacto</FormLabel>
                                    <Input readOnly value={userProfile?.phone || ''} />
                                </div>
                            </div>
                        </div>

                        {/* Sponsor Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Información del Patrocinador</h3>
                            <Separator />
                             <FormField
                                control={form.control}
                                name="sponsorName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nombre del Patrocinador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre completo del patrocinador" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="sponsorPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Número de Contacto</FormLabel>
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
                                    name="sponsorEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Timeline and Budget */}
                         <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Cronograma y Presupuesto</h3>
                            <Separator />
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
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Ubicación del Proyecto</h3>
                            <Separator />
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
                        </div>

                        {/* Sector and Criteria */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-medium font-headline">Clasificación y Criterios</h3>
                            <Separator />
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
                        </div>
                        
                        {/* Assumptions, Risks, and Key Criteria */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium font-headline">Supuestos, Riesgos y Criterios Clave</h3>
                            <Separator />
                             <FormField
                                control={form.control}
                                name="mainDeliverables"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Entregables Principales</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} placeholder="Liste los 3-5 entregables más importantes del proyecto. Ej: 1. Plataforma de E-commerce funcional. 2. Manual de usuario. 3. Plan de marketing de lanzamiento." {...field} />
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
                                        <Textarea rows={4} placeholder="¿Qué se da por sentado que será verdad para que el proyecto tenga éxito? Ej: La API de terceros estará disponible y documentada a tiempo." {...field} />
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
                                        <Textarea rows={4} placeholder="¿Existen limitaciones importantes más allá del tiempo y el costo? Ej: El proyecto debe cumplir con la normativa de protección de datos GDPR." {...field} />
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
                                        <Textarea rows={4} placeholder="Identifique 2 o 3 riesgos principales evidentes desde el inicio. Ej: Dependencia crítica en un único proveedor para la pasarela de pagos." {...field} />
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
                                        <Textarea rows={5} placeholder="Criterios medibles que determinan si el proyecto y sus entregables son aceptados. Ej: La plataforma debe procesar 100 transacciones por minuto y cargar en menos de 2 segundos." {...field} />
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
                                        <Textarea rows={4} placeholder="¿Qué constituye el éxito del proyecto y quién lo aprueba formalmente? Ej: El éxito del proyecto será confirmado por el Comité de Dirección de TI tras una demostración final." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


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

    