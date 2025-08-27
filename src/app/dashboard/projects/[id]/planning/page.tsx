import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlanningPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Planeación</CardTitle>
        <CardDescription>
          Aquí se gestionan todos los planes detallados del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seleccione una opción del menú de la izquierda para empezar.</p>
      </CardContent>
    </Card>
  );
}
