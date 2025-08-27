import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchedulePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Cronograma</CardTitle>
        <CardDescription>
          Planificación de actividades, duraciones y dependencias (Ej. Diagrama de Gantt).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del cronograma...</p>
      </CardContent>
    </Card>
  );
}
