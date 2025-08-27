import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

const phaseStatusToProgress = (status: Project['status']) => {
  const completedPhases = Object.values(status).filter(
    (phaseStatus) => phaseStatus === 'completed'
  ).length;
  return (completedPhases / 4) * 100;
};

const getCurrentPhase = (status: Project['status']) => {
  if (status.closing === 'in-progress' || status.closing === 'completed') return {label: 'Cierre', variant: 'green' as const};
  if (status.execution === 'in-progress' || status.execution === 'completed') return {label: 'Ejecución', variant: 'blue' as const};
  if (status.planning === 'in-progress' || status.planning === 'completed') return {label: 'Planificación', variant: 'orange' as const};
  if (status.initiation === 'in-progress' || status.initiation === 'completed') return {label: 'Inicio', variant: 'purple' as const};
  return {label: 'No Iniciado', variant: 'gray' as const};
};

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = phaseStatusToProgress(project.status);
  const currentPhase = getCurrentPhase(project.status);
  
  const badgeVariants = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800",
    blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
    orange: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800",
    purple: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800",
    gray: "bg-muted text-muted-foreground border-border",
  };


  return (
    <Link href={`/dashboard/projects/${project.id}`} className="block">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="aspect-[3/2] relative w-full mb-4">
            <Image
              src={project.imageUrl}
              alt={project.name}
              fill
              className="rounded-t-lg object-cover"
              data-ai-hint="project management"
            />
          </div>
          <CardTitle className="font-headline text-xl leading-tight">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
           <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Progreso:</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </CardContent>
        <CardFooter>
           <Badge variant="outline" className={cn("text-xs font-medium", badgeVariants[currentPhase.variant])}>
            Fase Actual: {currentPhase.label}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
