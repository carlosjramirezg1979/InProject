import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ClosingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Cierre</CardTitle>
        <CardDescription>
          Finalice todas las actividades del proyecto, archive los documentos y documente las lecciones aprendidas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="final-report">Resumen del Informe Final</Label>
          <Textarea id="final-report" placeholder="Resuma los resultados, logros y desviaciones del proyecto..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lessons-learned">Lecciones Aprendidas</Label>
          <Textarea id="lessons-learned" placeholder="¿Qué salió bien? ¿Qué se podría mejorar en futuros proyectos?" />
        </div>
        <div className="flex justify-end">
            <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar Proyecto como Completado
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
