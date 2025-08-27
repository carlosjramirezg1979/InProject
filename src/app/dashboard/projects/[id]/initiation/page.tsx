import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function InitiationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Inicio</CardTitle>
        <CardDescription>
          Defina los objetivos, el alcance y las partes interesadas de su proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project-goal">Objetivo del Proyecto</Label>
          <Textarea id="project-goal" placeholder="Describa el objetivo principal del proyecto..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-scope">Alcance</Label>
          <Textarea id="project-scope" placeholder="Detalle lo que está dentro y fuera del alcance..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stakeholders">Partes Interesadas Clave</Label>
          <Input id="stakeholders" placeholder="Ej: CEO, Director de Marketing, Equipo de Desarrollo" />
        </div>
      </CardContent>
    </Card>
  );
}
