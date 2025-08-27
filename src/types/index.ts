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
    name: string;
    email: string;
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
