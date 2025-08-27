import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProcurementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Gestión de Adquisiciones</CardTitle>
        <CardDescription>
          Planificación de las compras y contrataciones necesarias para el proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de la gestión de adquisiciones...</p>
      </CardContent>
    </Card>
  );
}
