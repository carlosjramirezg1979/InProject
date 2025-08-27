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
