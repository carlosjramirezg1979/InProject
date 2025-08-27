import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function ProjectOverviewPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
          <CardDescription className="text-base">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative aspect-video w-full">
                <Image src={project.imageUrl} alt={project.name} fill className="rounded-md object-cover" />
            </div>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">Resumen del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
              <p>Aquí se mostrará un resumen detallado del estado del proyecto, incluyendo KPIs, próximas tareas y alertas importantes.</p>
          </CardContent>
      </Card>
    </div>
  );
}
