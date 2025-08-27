
'use client';

import { useAuth } from "@/context/auth-context";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/types";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";


export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        // This query is now secure because the security rules ensure
        // a user can only read projects they are the manager of.
        const q = query(
          collection(db, "projects"),
          where("projectManagerId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        
        const userProjects = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          // Firestore Timestamps need to be converted to JS Dates
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate(),
        })) as Project[];
        
        setProjects(userProjects);

      } catch (error) {
        console.error("Error fetching projects: ", error);
        // Set projects to empty array on error to avoid showing stale data
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    // We only need the user to be loaded, not necessarily the profile,
    // as the query only depends on user.uid.
    if (user) {
        fetchProjects();
    } else {
        setLoading(false);
    }
  }, [user]);
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Proyectos</h1>
          <p className="text-muted-foreground">
            Un resumen de todos los proyectos que gestionas.
          </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Nuevo Proyecto
            </Link>
        </Button>
      </div>

       {loading ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-xl font-semibold">No se encontraron proyectos</h2>
            <p className="text-muted-foreground mt-2">
                Crea un nuevo proyecto para comenzar.
            </p>
             <Button asChild className="mt-4">
                <Link href="/dashboard/projects/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo Proyecto
                </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
