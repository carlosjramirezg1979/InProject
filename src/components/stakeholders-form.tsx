
'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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
import { roles, influenceLevels, projectLifeCycle, communicationFrequencies, communicationMethods } from "@/lib/stakeholders-data";
import type { Stakeholder } from "@/types";

const stakeholderSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  phone: z.string().optional(),
  email: z.string().email("Debe ser un correo electrónico válido."),
  role: z.string().min(1, "El cargo es obligatorio."),
  dependency: z.string().min(1, "La dependencia es obligatoria."),
  country: z.string({ required_error: "El país es obligatorio." }),
  department: z.string({ required_error: "El departamento es obligatorio." }),
  city: z.string().min(1, "La ciudad es obligatoria."),
  projectRole: z.string({ required_error: "El rol en el proyecto es obligatorio." }),
  expectations: z.string().min(1, "Las expectativas son obligatorias."),
  influence: z.string({ required_error: "El nivel de influencia es obligatorio." }),
  power: z.string({ required_error: "El nivel de poder es obligatorio." }),
  impact: z.string({ required_error: "El nivel de impacto es obligatorio." }),
  interestPhase: z.string({ required_error: "Debe seleccionar una fase." }),
  interestType: z.string({ required_error: "El tipo de interés es obligatorio." }),
  infoToCommunicate: z.array(z.string()).refine(value => value.some(item => item), {
    message: "Debes seleccionar al menos un tipo de información a comunicar.",
  }),
  communicationFrequency: z.string({ required_error: "La frecuencia es obligatoria." }),
  communicationResponsible: z.string({ required_error: "El responsable es obligatorio." }),
  approvalResponsible: z.string({ required_error: "El responsable de aprobación es obligatorio." }),
  communicationMethod: z.string({ required_error: "El método de comunicación es obligatorio." }),
});

type StakeholderFormValues = z.infer<typeof stakeholderSchema>;

export function StakeholdersForm() {
    const { toast } = useToast();
    const params = useParams();
    const projectId = params.id as string;
    
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [cities, setCities] = React.useState<string[]>([]);

    const form = useForm<StakeholderFormValues>({
        resolver: zodResolver(stakeholderSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            role: "",
            dependency: "",
            country: "co",
            department: "",
            city: "",
            projectRole: "",
            expectations: "",
            influence: "",
            power: "",
            impact: "",
            interestPhase: "",
            interestType: "Neutra",
            infoToCommunicate: [],
            communicationFrequency: "",
            communicationResponsible: "",
            approvalResponsible: "",
            communicationMethod: "",
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

    async function onSubmit(data: StakeholderFormValues) {
        setIsSubmitting(true);
        console.log({ ...data, projectId });
        
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Interesado Guardado (Simulación)",
            description: "La información del interesado ha sido registrada en la consola.",
        });

        // Here you would typically call a server action or API to save the data
        // e.g., await saveStakeholder(projectId, data);
        
        setIsSubmitting(false);
        form.reset();
    }
    
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Registro de Interesados</CardTitle>
                <CardDescription>
                Identificación y análisis de todas las partes interesadas (stakeholders) del proyecto.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                
                <Card>
                    <CardHeader><CardTitle>Información del Interesado</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nombre *</FormLabel><FormControl><Input placeholder="Ej: Dr. Ana Soto" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input placeholder="Ej: 3001234567" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Correo Electrónico *</FormLabel><FormControl><Input type="email" placeholder="Ej: ana.soto@dominio.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Cargo *</FormLabel><FormControl><Input placeholder="Ej: Gerente de Calidad" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="dependency" render={({ field }) => (
                                <FormItem><FormLabel>Dependencia *</FormLabel><FormControl><Input placeholder="Ej: Departamento de Aseguramiento de Calidad" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem><FormLabel>País *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un país" /></SelectTrigger></FormControl><SelectContent><SelectItem value="co">Colombia</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="department" render={({ field }) => (
                                <FormItem><FormLabel>Departamento *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un departamento" /></SelectTrigger></FormControl><SelectContent>{departments.map((dept) => (<SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>Ciudad *</FormLabel><FormControl><Input placeholder="Ej: Bogotá" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Rol e Influencia en el Proyecto</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="projectRole" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rol en el Proyecto *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {form.getValues("projectRole") && <FormDescription>{roles.find(r => r.value === form.getValues("projectRole"))?.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="expectations" render={({ field }) => (
                            <FormItem><FormLabel>Expectativas *</FormLabel><FormControl><Textarea placeholder="Describe las principales expectativas del interesado sobre el proyecto." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="influence" render={({ field }) => (
                                <FormItem><FormLabel>Influencia *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger></FormControl><SelectContent>{influenceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="power" render={({ field }) => (
                                <FormItem><FormLabel>Poder *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger></FormControl><SelectContent>{influenceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="impact" render={({ field }) => (
                                <FormItem><FormLabel>Impacto *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger></FormControl><SelectContent>{influenceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Estrategia de Participación (Engagement)</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="interestPhase" render={({ field }) => (
                                <FormItem><FormLabel>Ciclo de Vida Donde El Interés Es Mayor *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una fase" /></SelectTrigger></FormControl><SelectContent>{projectLifeCycle.map(phase => <SelectItem key={phase} value={phase}>{phase}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="interestType" render={({ field }) => (
                                <FormItem><FormLabel>Interés (Positiva/Negativa/Neutra) *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Positiva">Positiva</SelectItem><SelectItem value="Negativa">Negativa</SelectItem><SelectItem value="Neutra">Neutra</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Plan de Comunicación</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="infoToCommunicate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Información a ser Comunicada *</FormLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            "Avance del proyecto", "Cambios en el alcance", "Cambios en el tiempo", 
                                            "Cambios en el Costo", "Materialización o seguimiento de riesgos"
                                        ].map(item => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="infoToCommunicate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl><input type="checkbox" checked={field.value.includes(item)} onChange={e => {
                                                            const set = new Set(field.value);
                                                            if (e.target.checked) { set.add(item); } else { set.delete(item); }
                                                            field.onChange(Array.from(set));
                                                        }} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></FormControl>
                                                        <FormLabel className="font-normal">{item}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="communicationFrequency" render={({ field }) => (
                                <FormItem><FormLabel>Frecuencia de la comunicación *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una frecuencia" /></SelectTrigger></FormControl><SelectContent>{communicationFrequencies.map(freq => <SelectItem key={freq} value={freq}>{freq}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="communicationMethod" render={({ field }) => (
                                <FormItem><FormLabel>Método de comunicación *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un método" /></SelectTrigger></FormControl><SelectContent>{communicationMethods.map(method => <SelectItem key={method} value={method}>{method}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="communicationResponsible" render={({ field }) => (
                                <FormItem><FormLabel>Responsable de la comunicación *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger></FormControl><SelectContent>{roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="approvalResponsible" render={({ field }) => (
                                <FormItem><FormLabel>Responsable de Aprobar la comunicación *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger></FormControl><SelectContent>{roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Guardando...' : 'Guardar Interesado'}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
