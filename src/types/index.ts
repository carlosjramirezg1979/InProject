

import { z } from 'zod';

export type ProjectPhase = 'initiation' | 'planning' | 'execution' | 'closing';
export type PhaseStatus = 'locked' | 'not-started' | 'in-progress' | 'completed';

export interface ProjectStatus {
  initiation: PhaseStatus;
  planning: PhaseStatus;
  execution: PhaseStatus;
  closing: PhaseStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  companyId?: string;
  status: ProjectStatus;
  justification: string;
  generalObjective: string;
  scope: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  sector: string;
  sponsorName: string;
  sponsorPhone?: string;
  sponsorEmail: string;
  assumptions: string;
  constraints: string;
  highLevelRisks: string;
  mainDeliverables: string;
  approvalRequirements: string;
  acceptanceCriteria: string;
  country: string;
  department: string;
  city: string;
  projectManagerId: string;
}

export interface Company {
    id: string;
    name: string;
    description: string;
    country: string;
    department: string;
    city: string;
    address: string;
    website?: string;
    employeeCount: string;
    companyType: string;
    sector: string;
    projectIds: string[];
    ownerId: string;
}

export type CompanyFormData = Omit<Company, 'id' | 'projectIds' | 'ownerId'>;


export interface ProjectManager {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
    department?: string;
    city?: string;
    companyIds: string[];
}

export interface Stakeholder {
    id: string;
    projectId: string;
    name: string;
    phone?: string;
    email: string;
    role: string;
    dependency: string;
    country: string;
    department: string;
    city: string;
    projectRole: string;
    expectations: string;
    influence: 'Alto' | 'Medio' | 'Bajo';
    power: 'Alto' | 'Medio' | 'Bajo';
    impact: 'Alto' | 'Medio' | 'Bajo';
    interestPhase: string;
    interestType: 'Positiva' | 'Negativa' | 'Neutra';
    infoToCommunicate: string[];
    communicationFrequency: string;
    communicationResponsible: string;
    approvalResponsible: string;
    communicationMethod: string;
}

export type Risk = {
  riskName: string;
  riskDescription: string;
  riskLikelihood: string;
  riskImpact: string;
  mitigationStrategies: string[];
  relevantFactors: string[];
};

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type SignInFormValues = z.infer<typeof signInSchema>;

const signUpSchema = z.object({
    firstName: z.string().min(1, "El nombre es obligatorio."),
    lastName: z.string().min(1, "El apellido es obligatorio."),
    phone: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string(),
    country: z.string({ required_error: "El país es obligatorio." }),
    department: z.string({ required_error: "El departamento es obligatorio." }),
    city: z.string({ required_error: "La ciudad es obligatoria." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
