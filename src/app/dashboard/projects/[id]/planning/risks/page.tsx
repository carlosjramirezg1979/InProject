import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RisksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Gestión de Riesgos</CardTitle>
        <CardDescription>
          Identificación, análisis y planificación de la respuesta a los riesgos del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de la gestión de riesgos...</p>
      </CardContent>
    </Card>
  );
}
