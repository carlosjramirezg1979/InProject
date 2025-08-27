import { ProjectCard } from "@/components/project-card";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { getProjectsByManagerId } from "@/lib/data";

export default function DashboardPage() {
  // For now, we'll assume a single project manager with ID 'pm-001'
  const projectManagerId = 'pm-001';
  const projects = getProjectsByManagerId(projectManagerId);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Proyectos</h1>
          <p className="text-muted-foreground">
            Un resumen de todos sus proyectos.
          </p>
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
