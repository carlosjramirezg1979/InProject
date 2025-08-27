import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssumptionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Suposiciones y Restricciones</CardTitle>
        <CardDescription>
          Documentación de las suposiciones y restricciones iniciales del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de suposiciones y restricciones...</p>
      </CardContent>
    </Card>
  );
}
