import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScopePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Gestión del Alcance</CardTitle>
        <CardDescription>
          Definición detallada del alcance del proyecto, incluyendo entregables y criterios de aceptación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de la gestión del alcance...</p>
      </CardContent>
    </Card>
  );
}
