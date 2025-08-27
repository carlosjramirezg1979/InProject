import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InitiationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Inicio</CardTitle>
        <CardDescription>
          Aquí se gestionan todos los documentos y actividades de la fase de inicio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seleccione una opción del menú de la izquierda para empezar.</p>
      </CardContent>
    </Card>
  );
}
