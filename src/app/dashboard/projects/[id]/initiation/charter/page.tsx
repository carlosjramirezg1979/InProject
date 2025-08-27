import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectCharterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Acta de Inicio del Proyecto</CardTitle>
        <CardDescription>
          Este documento autoriza formalmente el proyecto y define sus objetivos y alcance iniciales. La información se basa en la creación inicial del proyecto y no es editable aquí.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project-name">Nombre del Proyecto</Label>
          <Input id="project-name" value="Plataforma de E-commerce" readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-description">Descripción del Proyecto</Label>
          <Textarea id="project-description" value="Desarrollo de una nueva plataforma de comercio electrónico para el cliente 'Moda-Online'." readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-manager">Gerente de Proyecto Asignado</Label>
          <Input id="project-manager" value="Usuario Ejemplo" readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-sponsor">Patrocinador del Proyecto</Label>
          <Input id="project-sponsor" value="Innovaciones Tech" readOnly />
        </div>
      </CardContent>
    </Card>
  );
}
