'use client';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import type { Project } from '@/types';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Home,
  ClipboardList,
  Construction,
  CheckCircle,
  FileJson,
  ChevronLeft,
  Building,
} from 'lucide-react';

interface ProjectSidebarProps {
  project: Project;
}

const navItems = [
  { href: '', icon: Home, label: 'Resumen' },
  { href: '/initiation', icon: ClipboardList, label: 'Inicio', phase: 'initiation' },
  { href: '/planning', icon: Construction, label: 'Planificación', phase: 'planning' },
  { href: '/execution', icon: FileJson, label: 'Ejecución', phase: 'execution' },
  { href: '/closing', icon: CheckCircle, label: 'Cierre', phase: 'closing' },
];

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.id;

  const handleGenerateReport = () => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${project.id}_report.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="w-full">
            <SidebarMenuButton size="sm" className="w-full justify-start">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <span>Todas las Empresas</span>
            </SidebarMenuButton>
        </Link>
        <Link href={`/dashboard/company/${project.companyId}`} className="w-full">
             <SidebarMenuButton size="sm" variant="outline" className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                <span>Proyectos de la Empresa</span>
            </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isLocked = item.phase ? project.status[item.phase as keyof typeof project.status] === 'locked' : false;
            const fullPath = `/dashboard/projects/${projectId}${item.href}`;
            const isActive = item.href === '' ? pathname.endsWith(projectId as string) : pathname.endsWith(item.href);
            
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={isLocked ? '#' : fullPath} aria-disabled={isLocked} className={isLocked ? 'pointer-events-none' : ''}>
                  <SidebarMenuButton isActive={isActive} disabled={isLocked} aria-disabled={isLocked} tooltip={isLocked ? { children: 'Complete la fase anterior para desbloquear' } : {children: item.label}}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleGenerateReport}>
                    <FileJson />
                    <span>Generar Informe</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
