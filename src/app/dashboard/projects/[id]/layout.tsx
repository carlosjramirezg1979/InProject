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
        <div className="flex min-h-[calc(100vh-theme(height.16))]">
            <ProjectSidebar project={project} />
            <SidebarInset className="flex-1 p-8 bg-muted/30">
                {children}
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
