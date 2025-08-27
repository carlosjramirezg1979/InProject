import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InitialRisksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Riesgos Iniciales</CardTitle>
        <CardDescription>
          Registro de los riesgos identificados en la fase de inicio del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de riesgos iniciales...</p>
      </CardContent>
    </Card>
  );
}
