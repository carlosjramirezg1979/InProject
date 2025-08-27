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
  companyId: string;
  status: ProjectStatus;
  currency?: string;
  budget?: number;
}

export interface Company {
    id: string;
    name: string;
    description: string;
    projectIds: string[];
    ownerId: string;
}

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
    email: z.string().email(),
    password: z.string(),
});
export type SignUpFormValues = z.infer<typeof signUpSchema>;

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
