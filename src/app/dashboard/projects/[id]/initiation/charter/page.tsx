
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>1. Información General del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="project-name">Nombre del Proyecto</Label>
                    <Input id="project-name" value={project.name} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="project-description">Descripción Corta del Proyecto</Label>
                    <Textarea id="project-description" value={project.description} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="project-justification">Justificación del Proyecto</Label>
                    <Textarea id="project-justification" value={project.justification} readOnly />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="project-objective">Objetivo General</Label>
                        <Textarea id="project-objective" value={project.generalObjective} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="project-scope">Alcance</Label>
                        <Textarea id="project-scope" value={project.scope} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>2. Cronograma y Presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Fecha de Inicio</Label>
                        <Input id="start-date" value={format(project.startDate, "PPP", { locale: es })} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end-date">Fecha de Fin</Label>
                        <Input id="end-date" value={format(project.endDate, "PPP", { locale: es })} readOnly />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="budget">Presupuesto Global del Proyecto</Label>
                        <Input id="budget" value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: project.currency }).format(project.budget)} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Input id="currency" value={project.currency} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>3. Clasificación y Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="sector">Sector del Proyecto</Label>
                    <Input id="sector" value={project.sector} readOnly />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input id="country" value={project.country === 'co' ? 'Colombia' : project.country} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input id="department" value={project.department} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" value={project.city} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>4. Patrocinador (Sponsor)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="sponsor-name">Nombre del Patrocinador</Label>
                    <Input id="sponsor-name" value={project.sponsorName} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sponsor-phone">Número de Contacto</Label>
                    <Input id="sponsor-phone" value={project.sponsorPhone || 'N/A'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sponsor-email">Correo Electrónico de Contacto</Label>
                    <Input id="sponsor-email" value={project.sponsorEmail} readOnly />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>5. Supuestos, Riesgos y Criterios Clave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="deliverables">Entregables Principales</Label>
                    <Textarea id="deliverables" value={project.mainDeliverables} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assumptions">Supuestos</Label>
                    <Textarea id="assumptions" value={project.assumptions} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="constraints">Restricciones</Label>
                    <Textarea id="constraints" value={project.constraints} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="risks">Riesgos de Alto Nivel</Label>
                    <Textarea id="risks" value={project.highLevelRisks} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="acceptance">Criterios de Aceptación del Proyecto</Label>
                    <Textarea id="acceptance" value={project.acceptanceCriteria} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="approval">Requisitos de Aprobación del Proyecto</Label>
                    <Textarea id="approval" value={project.approvalRequirements} readOnly />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
