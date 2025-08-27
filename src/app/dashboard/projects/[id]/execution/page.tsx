import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Gestión/Ejecución</CardTitle>
        <CardDescription>
          Coordinación de recursos y tareas para llevar a cabo el plan del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seleccione una opción del menú de la izquierda para empezar.</p>
      </CardContent>
    </Card>
  );
}
