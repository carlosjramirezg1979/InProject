import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StakeholdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Registro de Interesados</CardTitle>
        <CardDescription>
          Identificación y análisis de todas las partes interesadas (stakeholders) del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del registro de interesados...</p>
      </CardContent>
    </Card>
  );
}
