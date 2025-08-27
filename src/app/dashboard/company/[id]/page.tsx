import { notFound } from "next/navigation";
import { getCompanyById, getProjectsByCompanyId } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CompanyProjectsPage({ params }: { params: { id: string } }) {
  const company = getCompanyById(params.id);

  if (!company) {
    notFound();
  }

  const projects = getProjectsByCompanyId(company.id);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
            <Button asChild variant="ghost" className="mb-2">
                <Link href="/dashboard">
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
        <NewProjectDialog />
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
