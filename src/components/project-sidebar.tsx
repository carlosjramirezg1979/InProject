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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Home,
  FileJson,
  Rocket,
  ClipboardList,
  Construction,
  Milestone,
  ShieldCheck,
  FileText,
  Users,
  Building,
  Target,
  GanttChartSquare,
  CircleDollarSign,
  Gem,
  ShoppingBag,
  Briefcase,
  Presentation,
  Monitor,
  ListTodo,
  AlertTriangle
} from 'lucide-react';

interface ProjectSidebarProps {
  project: Project;
}

const navItems = {
    overview: { href: '', icon: Home, label: 'Resumen' },
    initiation: { 
        label: 'Inicio',
        icon: Rocket,
        items: [
            { href: '/initiation/charter', icon: FileText, label: 'Acta de inicio' },
            { href: '/initiation/company-registry', icon: Building, label: 'Registro empresa' },
            { href: '/initiation/stakeholders', icon: Users, label: 'Interesados' },
            { href: '/initiation/assumptions', icon: ListTodo, label: 'Suposiciones y restricciones' },
            { href: '/initiation/initial-risks', icon: AlertTriangle, label: 'Riesgos iniciales' },
        ]
    },
    planning: {
        label: 'Planeación',
        icon: ClipboardList,
        items: [
            { href: '/planning/team', icon: Users, label: 'Equipo del proyecto' },
            { href: '/planning/scope', icon: Target, label: 'Gestión del alcance' },
            { href: '/planning/schedule', icon: GanttChartSquare, label: 'Cronograma' },
            { href: '/planning/budget', icon: CircleDollarSign, label: 'Presupuesto y costos' },
            { href: '/planning/quality', icon: Gem, label: 'Gestión de la calidad' },
            { href: '/planning/risks', icon: ShieldCheck, label: 'Gestión de riesgos' },
            { href: '/planning/procurement', icon: ShoppingBag, label: 'Gestión de adquisiciones' },
        ]
    },
    execution: {
        label: 'Gestión',
        icon: Construction,
        items: [
            { href: '/execution/meetings', icon: Briefcase, label: 'Reunión de seguimiento' },
            { href: '/execution/reports', icon: Presentation, label: 'Informes y avances' },
        ]
    },
    monitoring: {
        label: 'Monitoreo',
        icon: Monitor,
        items: [
             // Add monitoring items here
        ]
    },
    closing: {
        label: 'Cierre',
        icon: Milestone,
        items: [
             // Add closing items here
        ]
    }
}


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

  const renderMenuItems = (items: { href: string; icon: React.ElementType; label: string }[]) => {
    return items.map((item) => {
        const fullPath = `/dashboard/projects/${projectId}${item.href}`;
        const isActive = pathname === fullPath;
        return (
            <SidebarMenuItem key={item.label}>
                <Link href={fullPath}>
                  <SidebarMenuButton isActive={isActive} tooltip={{children: item.label}}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        )
    })
  }

  return (
    <Sidebar className="border-r h-full">
        <SidebarHeader>
            <div className="p-4">
                <h2 className="font-headline text-lg font-semibold tracking-tight break-words" title={project.name}>
                    {project.name}
                </h2>
            </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <SidebarGroup>
                <SidebarGroupLabel asChild><div><navItems.initiation.icon/>{navItems.initiation.label}</div></SidebarGroupLabel>
                {renderMenuItems(navItems.initiation.items)}
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel asChild><div><navItems.planning.icon/>{navItems.planning.label}</div></SidebarGroupLabel>
                 {renderMenuItems(navItems.planning.items)}
            </SidebarGroup>
            <SidebarGroup>
                 <SidebarGroupLabel asChild><div><navItems.execution.icon/>{navItems.execution.label}</div></SidebarGroupLabel>
                 {renderMenuItems(navItems.execution.items)}
            </SidebarGroup>
             <SidebarGroup>
                 <SidebarGroupLabel asChild><div><navItems.monitoring.icon/>{navItems.monitoring.label}</div></SidebarGroupLabel>
                 {renderMenuItems(navItems.monitoring.items)}
            </SidebarGroup>
             <SidebarGroup>
                 <SidebarGroupLabel asChild><div><navItems.closing.icon/>{navItems.closing.label}</div></SidebarGroupLabel>
                 {renderMenuItems(navItems.closing.items)}
            </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
         <SidebarMenu>
             <SidebarMenuItem>
                <Link href={`/dashboard/projects/${projectId}`}>
                  <SidebarMenuButton isActive={pathname.endsWith(projectId as string)}>
                    <Home />
                    <span>Resumen</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
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
