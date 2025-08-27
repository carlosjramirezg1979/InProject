'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestRisksAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2 } from 'lucide-react';
import type { Risk } from '@/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  projectDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  projectType: z.string().min(3, 'El tipo de proyecto debe tener al menos 3 caracteres.'),
  projectTimeline: z.string().min(3, 'La línea de tiempo debe tener al menos 3 caracteres.'),
  projectBudget: z.string().min(1, 'El presupuesto es obligatorio.'),
  projectTeamSkills: z.string().min(10, 'Las habilidades del equipo deben tener al menos 10 caracteres.'),
  projectDependencies: z.string().min(3, 'Las dependencias deben tener al menos 3 caracteres.'),
  projectAssumptions: z.string().min(10, 'Las suposiciones deben tener al menos 10 caracteres.'),
  riskAppetite: z.string().min(3, 'El apetito de riesgo debe tener al menos 3 caracteres.'),
});

type FormData = z.infer<typeof formSchema>;

export function RiskSuggestionForm() {
  const [suggestedRisks, setSuggestedRisks] = useState<Risk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: '',
      projectType: 'Desarrollo de Software',
      projectTimeline: '6 meses',
      projectBudget: '$50,000',
      projectTeamSkills: 'Equipo senior con experiencia en React y Node.js',
      projectDependencies: 'API de terceros para pagos',
      projectAssumptions: 'La API de terceros tendrá un 99.9% de tiempo de actividad.',
      riskAppetite: 'Moderado',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSuggestedRisks([]);
    const result = await suggestRisksAction(values);
    setIsLoading(false);

    if (result.success && result.data) {
      setSuggestedRisks(result.data.risks);
       toast({
        title: "Éxito",
        description: "Se han generado sugerencias de riesgo.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  }
  
  const getImpactLikelihoodVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'alto':
        return 'destructive';
      case 'medium':
      case 'medio':
        return 'secondary';
      case 'low':
      case 'bajo':
        return 'outline';
      default:
        return 'default';
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Análisis de Riesgos con IA</CardTitle>
          <CardDescription>
            Complete los detalles del proyecto para que la IA sugiera posibles riesgos, sus impactos y estrategias de mitigación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Proyecto</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describa las metas, el alcance y las actividades clave..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectTeamSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habilidades del Equipo</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describa las habilidades y experiencia del equipo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Proyecto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Desarrollo de Software" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Línea de Tiempo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 6 meses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuesto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: $100,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskAppetite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apetito de Riesgo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Bajo, Moderado, Alto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="projectDependencies"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dependencias del Proyecto</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Dependencias de otros proyectos o factores externos..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="projectAssumptions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Suposiciones del Proyecto</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Suposiciones clave hechas durante la planificación..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Analizando...' : 'Sugerir Riesgos'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || suggestedRisks.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Riesgos Sugeridos</CardTitle>
            <CardDescription>
              A continuación se presentan los riesgos potenciales identificados por la IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">La IA está analizando su proyecto...</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">Riesgo</TableHead>
                    <TableHead className="w-[30%]">Descripción</TableHead>
                    <TableHead>Probabilidad</TableHead>
                    <TableHead>Impacto</TableHead>
                    <TableHead className="w-[35%]">Estrategias de Mitigación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestedRisks.map((risk, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{risk.riskName}</TableCell>
                      <TableCell>{risk.riskDescription}</TableCell>
                      <TableCell>
                        <Badge variant={getImpactLikelihoodVariant(risk.riskLikelihood)}>{risk.riskLikelihood}</Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant={getImpactLikelihoodVariant(risk.riskImpact)}>{risk.riskImpact}</Badge>
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 space-y-1">
                          {risk.mitigationStrategies.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
