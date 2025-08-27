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
} from 'lucide-react';
import { Button } from './ui/button';

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
    <Sidebar className="border-r h-full">
        <SidebarHeader>
            <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard">
                    <span>Volver a Proyectos</span>
                </Link>
            </Button>
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
