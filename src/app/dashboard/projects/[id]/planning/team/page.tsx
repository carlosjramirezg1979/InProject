import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Equipo del Proyecto</CardTitle>
        <CardDescription>
          Gestión de los miembros del equipo, roles y responsabilidades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del equipo del proyecto...</p>
      </CardContent>
    </Card>
  );
}
