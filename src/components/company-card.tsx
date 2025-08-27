
'use client';
import Link from 'next/link';
import type { Company } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
    const [projectCount, setProjectCount] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);

    useEffect(() => {
        const fetchProjectCounts = async () => {
            if (!company.id) return;

            const q = query(collection(db, "projects"), where("companyId", "==", company.id));
            const querySnapshot = await getDocs(q);
            const projects = querySnapshot.docs.map(doc => doc.data());
            
            setProjectCount(projects.length);

            const active = projects.filter(p => p.status.closing !== 'completed').length;
            setActiveProjects(active);
        };

        fetchProjectCounts();
    }, [company.id]);


  return (
    <Link href={`/dashboard/company/${company.id}`} className="block">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-xl leading-tight">{company.name}</CardTitle>
          <CardDescription className="line-clamp-2">{company.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
           <div className="text-sm text-muted-foreground space-y-2">
                <p><span className="font-medium text-foreground">{projectCount}</span> Proyectos Totales</p>
                <p><span className="font-medium text-foreground">{activeProjects}</span> Proyectos Activos</p>
           </div>
        </CardContent>
        <CardFooter>
           <Badge variant="outline">Ver Proyectos</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
