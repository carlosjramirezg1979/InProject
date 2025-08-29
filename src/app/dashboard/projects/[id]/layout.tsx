
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { ProjectSidebar } from '@/components/project-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';
import React from 'react';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!project) {
    return notFound();
  }

  return (
    <SidebarProvider>
        <div className="flex-1 grid md:grid-cols-[auto_1fr]">
            <ProjectSidebar project={project} />
            <div className="bg-muted/30 p-8 overflow-auto">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { project } as { project: Project });
                    }
                    return child;
                })}
            </div>
        </div>
    </SidebarProvider>
  );
}
