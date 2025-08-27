import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MeetingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Reunión de Seguimiento</CardTitle>
        <CardDescription>
          Registro y minutas de las reuniones de seguimiento del equipo del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de la reunión de seguimiento...</p>
      </CardContent>
    </Card>
  );
}
