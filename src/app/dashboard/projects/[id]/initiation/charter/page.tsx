
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const InfoItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <p className="text-base text-foreground">{value || 'N/A'}</p>
    </div>
);

const InfoSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
     <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {children}
        </CardContent>
    </Card>
);


export default function ProjectCharterPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        setLoading(false);
        return;
      }
      try {
        const projectDocRef = doc(db, 'projects', projectId);
        const projectDocSnap = await getDoc(projectDocRef);
        if (projectDocSnap.exists()) {
          const data = projectDocSnap.data();
          setProject({
            ...data,
            id: projectDocSnap.id,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
          } as Project);
        } else {
          notFound();
        }
      } catch (err) {
        console.error("Error fetching project charter:", err);
        setError("No se pudo cargar el acta de inicio del proyecto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    );
  }

  if (!project) {
    return notFound();
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Acta de Inicio del Proyecto</CardTitle>
                <CardDescription>
                Este documento autoriza formalmente el proyecto y define sus objetivos y alcance iniciales, basándose en la información proporcionada durante su creación.
                </CardDescription>
                 <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Nota sobre Cambios</AlertTitle>
                    <AlertDescription>
                        Para realizar cualquier modificación a esta Acta de Inicio, se deberá gestionar a través de un "Acta de Control de Cambios", funcionalidad que se agregará próximamente.
                    </AlertDescription>
                </Alert>
            </CardHeader>
        </Card>

        <InfoSection title="1. Información General del Proyecto">
            <InfoItem label="Nombre del Proyecto" value={project.name} />
            <InfoItem label="Descripción Corta del Proyecto" value={project.description} />
            <InfoItem label="Justificación del Proyecto" value={project.justification} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Objetivo General" value={project.generalObjective} />
                <InfoItem label="Alcance" value={project.scope} />
            </div>
        </InfoSection>

        <InfoSection title="2. Cronograma y Presupuesto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Fecha de Inicio" value={format(project.startDate, "PPP", { locale: es })} />
                <InfoItem label="Fecha de Fin" value={format(project.endDate, "PPP", { locale: es })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Presupuesto Global del Proyecto" value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: project.currency }).format(project.budget)} />
                <InfoItem label="Moneda" value={project.currency} />
            </div>
        </InfoSection>
        
        <InfoSection title="3. Clasificación y Ubicación">
            <InfoItem label="Sector del Proyecto" value={project.sector} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="País" value={project.country === 'co' ? 'Colombia' : project.country} />
                <InfoItem label="Departamento" value={project.department} />
                <InfoItem label="Ciudad" value={project.city} />
            </div>
        </InfoSection>

        <InfoSection title="4. Patrocinador (Sponsor)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="Nombre del Patrocinador" value={project.sponsorName} />
                <InfoItem label="Número de Contacto" value={project.sponsorPhone} />
                <InfoItem label="Correo Electrónico de Contacto" value={project.sponsorEmail} />
            </div>
        </InfoSection>
        
        <InfoSection title="5. Supuestos, Riesgos y Criterios Clave">
            <InfoItem label="Entregables Principales" value={project.mainDeliverables} />
            <InfoItem label="Supuestos" value={project.assumptions} />
            <InfoItem label="Restricciones" value={project.constraints} />
            <InfoItem label="Riesgos de Alto Nivel" value={project.highLevelRisks} />
            <InfoItem label="Criterios de Aceptación del Proyecto" value={project.acceptanceCriteria} />
            <InfoItem label="Requisitos de Aprobación del Proyecto" value={project.approvalRequirements} />
        </InfoSection>
    </div>
  );
}
