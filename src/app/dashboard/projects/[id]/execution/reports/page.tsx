import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Informes y Avances</CardTitle>
        <CardDescription>
          Generación y visualización de informes de estado y avance del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de informes y avances...</p>
      </CardContent>
    </Card>
  );
}
