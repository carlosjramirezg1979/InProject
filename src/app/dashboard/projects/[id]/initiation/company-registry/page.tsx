import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompanyRegistryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Registro de Empresa</CardTitle>
        <CardDescription>
          Información detallada sobre la empresa o cliente para el cual se realiza el proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del registro de la empresa...</p>
      </CardContent>
    </Card>
  );
}
