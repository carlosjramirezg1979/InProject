import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/data';
import { ProjectSidebar } from '@/components/project-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <SidebarProvider>
        <div className="flex-1 grid md:grid-cols-[auto_1fr]">
            <ProjectSidebar project={project} />
            <div className="bg-muted/30 p-8 overflow-auto">
                {children}
            </div>
        </div>
    </SidebarProvider>
  );
}
