
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        setLoading(false);
        return;
      }
      try {
        const projectDocRef = doc(db, 'projects', projectId);
        const projectDocSnap = await getDoc(projectDocRef);
        if (projectDocSnap.exists()) {
           const data = projectDocSnap.data();
           setProject({
            ...data,
            id: projectDocSnap.id,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
           } as Project);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return notFound();
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
