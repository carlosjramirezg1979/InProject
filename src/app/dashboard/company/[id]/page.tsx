
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Company, Project } from '@/types';
import { ProjectCard } from '@/components/project-card';
import { NewProjectDialog } from '@/components/new-project-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';

export default function CompanyProjectsPage() {
  const params = useParams();
  const companyId = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyAndProjects() {
      if (!companyId) {
        setLoading(false);
        return;
      }
      try {
        // Fetch company
        const companyDocRef = doc(db, 'companies', companyId);
        const companyDocSnap = await getDoc(companyDocRef);
        if (companyDocSnap.exists()) {
          setCompany(companyDocSnap.data() as Company);
        } else {
          notFound();
          return;
        }

        // Fetch projects for the company
        const q = query(collection(db, "projects"), where("companyId", "==", companyId));
        const querySnapshot = await getDocs(q);
        const companyProjects = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            startDate: doc.data().startDate.toDate(),
            endDate: doc.data().endDate.toDate(),
        })) as Project[];
        setProjects(companyProjects);

      } catch (error) {
        console.error("Error fetching company or projects: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyAndProjects();
  }, [companyId]);
  
  if (loading) {
    return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!company) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
            <Button asChild variant="ghost" className="mb-2">
                <Link href="/dashboard/companies">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver a Empresas
                </Link>
            </Button>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline tracking-tight">{company.name}</h1>
                <p className="text-muted-foreground">
                    Un resumen de todos los proyectos para {company.name}.
                </p>
            </div>
        </div>
        <NewProjectDialog companyId={company.id} />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
            ))}
        </div>
       ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-xl font-semibold">No se encontraron proyectos</h2>
            <p className="text-muted-foreground mt-2">Cree un nuevo proyecto para comenzar.</p>
        </div>
      )}
    </div>
  );
}
