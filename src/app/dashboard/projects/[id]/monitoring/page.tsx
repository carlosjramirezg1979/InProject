import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonitoringPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Monitoreo</CardTitle>
        <CardDescription>
          Seguimiento y control del progreso y rendimiento del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de Monitoreo...</p>
      </CardContent>
    </Card>
  );
}
