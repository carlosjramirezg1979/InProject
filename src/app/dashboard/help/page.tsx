import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">Centro de Ayuda</h1>
            <p className="text-muted-foreground">
                Encuentre orientación sobre metodologías de gestión de proyectos.
            </p>
        </div>
      
      <Card>
        <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Fase de Inicio</AccordionTrigger>
                <AccordionContent>
                La fase de inicio es la primera fase del ciclo de vida de la gestión de proyectos. Aquí es donde se define el valor del proyecto y se obtiene la autorización para comenzarlo. El objetivo principal es definir el proyecto a un nivel amplio. Esta fase incluye la creación de un caso de negocio, un estudio de viabilidad y un acta de constitución del proyecto.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Fase de Planificación</AccordionTrigger>
                <AccordionContent>
                En la fase de planificación, se desarrolla una hoja de ruta detallada para el proyecto. Esto incluye la definición del alcance, los objetivos, los entregables, el cronograma y el presupuesto. Se crea un plan de gestión de proyectos completo que guiará al equipo a través de la ejecución y el cierre. La gestión de riesgos también es una actividad crucial en esta etapa.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Fase de Ejecución</AccordionTrigger>
                <AccordionContent>
                Durante la fase de ejecución, el equipo del proyecto realiza el trabajo definido en el plan del proyecto para producir los entregables. Es la fase donde se consumen la mayoría de los recursos y el presupuesto. El director del proyecto coordina al equipo, gestiona a las partes interesadas y se asegura de que el proyecto se mantenga en el buen camino.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>Fase de Cierre</AccordionTrigger>
                <AccordionContent>
                La fase de cierre marca la finalización del proyecto. Las actividades clave incluyen la entrega formal del producto final, la obtención de la aceptación del cliente, la liberación de los recursos del proyecto y la realización de una revisión post-mortem. Es fundamental documentar las lecciones aprendidas para mejorar los proyectos futuros.
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
