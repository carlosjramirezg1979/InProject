
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useParams, notFound, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Project } from "@/types";

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
import { useAuth } from "@/context/auth-context";
import { addCompanyAndAssociateWithProject } from "@/lib/company-service";

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
  name: z.string().min(1, "El nombre de la empresa es obligatorio."),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string({ required_error: "La ciudad es obligatoria." }),
  employeeCount: z.string({ required_error: "El número de empleados es obligatorio." }),
  companyType: z.string({ required_error: "El tipo de empresa es obligatorio." }),
  address: z.string().min(1, "La dirección es obligatoria."),
  website: z.string().optional(),
  description: z.string().min(1, "La descripción es obligatoria."),
  sector: z.string({ required_error: "El sector es obligatorio." }),
});

type CompanyRegistryValues = z.infer<typeof companyRegistrySchema>;

const InfoItem = ({ label, value }: { label: string; value: string | undefined }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base">{value || 'N/A'}</p>
    </div>
);


export default function CompanyRegistryPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    const { user, reloadUserProfile, loading: userLoading } = useAuth();

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [project, setProject] = React.useState<Project | null>(null);
    const [cities, setCities] = React.useState<string[]>([]);
    
    const form = useForm<CompanyRegistryValues>({
        resolver: zodResolver(companyRegistrySchema),
        defaultValues: {
            name: "",
            country: "co",
            department: "",
            city: "",
            employeeCount: "",
            companyType: "",
            address: "",
            website: "",
            description: "",
            sector: "",
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

     React.useEffect(() => {
        async function fetchProject() {
            if (!projectId) {
                return;
            }
            try {
                const projectDocRef = doc(db, 'projects', projectId);
                const projectDocSnap = await getDoc(projectDocRef);
                if (projectDocSnap.exists()) {
                    const data = projectDocSnap.data();
                     setProject({
                        ...data,
                        id: projectDocSnap.id,
                        startDate: data.startDate.toDate(),
                        endDate: data.endDate.toDate(),
                    } as Project);
                } else {
                    notFound();
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
                toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la información del proyecto." });
            }
        }
        fetchProject();
    }, [projectId, toast]);


    async function onSubmit(data: CompanyRegistryValues) {
        if (!user || !projectId || !project) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo identificar al usuario o al proyecto. Por favor, recargue la página."});
            return;
        }
        setIsSubmitting(true);
        
        try {
            const companyDataWithSponsor = {
                ...data,
                contactName: project.sponsorName,
                contactEmail: project.sponsorEmail,
                contactRole: 'Sponsor / Patrocinador',
                contactPhoneCountryCode: '+57', // Assuming a default or fetch from sponsor data if available
                contactPhoneNumber: project.sponsorPhone || '',
            };

            const { companyId } = await addCompanyAndAssociateWithProject(companyDataWithSponsor, user.uid, projectId);
            await reloadUserProfile();
            toast({
                title: "Empresa Registrada",
                description: "La información de la empresa ha sido guardada y asociada al proyecto exitosamente.",
            });
            router.push(`/dashboard/company/${companyId}`);
        } catch (error) {
            console.error("Error saving company:", error);
            const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
            toast({
                variant: "destructive",
                title: "Error al Guardar",
                description: `No se pudo guardar la empresa. ${errorMessage}`
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (userLoading || !project) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Registro de Empresa</CardTitle>
                <CardDescription>
                Información detallada sobre la empresa o cliente para el cual se realiza el proyecto. El contacto principal será el patrocinador del proyecto.
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
                            name="name"
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
                                    <FormControl><Input placeholder="www.ejemplo.com" {...field} /></FormControl>
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
                        <CardTitle>Persona de Contacto (Patrocinador)</CardTitle>
                        <CardDescription>Información del patrocinador del proyecto, quien será el contacto principal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoItem label="Nombre del Patrocinador" value={project.sponsorName} />
                            <InfoItem label="Correo Electrónico" value={project.sponsorEmail} />
                            <InfoItem label="Teléfono de Contacto" value={project.sponsorPhone} />
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
