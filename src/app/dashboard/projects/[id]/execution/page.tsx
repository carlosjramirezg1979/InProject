import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

export default function ExecutionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Fase de Ejecución</CardTitle>
        <CardDescription>
          Supervise el progreso, gestione las tareas y comunique las actualizaciones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Progreso General</Label>
            <Progress value={66} className="h-4" />
            <p className="text-sm text-muted-foreground text-right">66% completado</p>
        </div>
        <div className="space-y-2">
          <Label>Actualización de Estado</Label>
          <Textarea placeholder="Escriba aquí un resumen del estado actual del proyecto..." />
        </div>
        <div className="space-y-4">
            <Label>Lista de Tareas Clave</Label>
            <div className="flex items-center space-x-2">
                <Checkbox id="task1" defaultChecked />
                <label htmlFor="task1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Finalizar el diseño de la base de datos
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="task2" defaultChecked />
                <label htmlFor="task2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Desarrollar endpoints de la API
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="task3" />
                <label htmlFor="task3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Implementar la autenticación de usuarios
                </label>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
