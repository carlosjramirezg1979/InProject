import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QualityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Gestión de la Calidad</CardTitle>
        <CardDescription>
          Definición de los estándares de calidad y cómo se medirán y asegurarán.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido de la gestión de la calidad...</p>
      </CardContent>
    </Card>
  );
}
