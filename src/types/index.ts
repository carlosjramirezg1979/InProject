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
  status: ProjectStatus;
}

export type Risk = {
  riskName: string;
  riskDescription: string;
  riskLikelihood: string;
  riskImpact: string;
  mitigationStrategies: string[];
  relevantFactors: string[];
};
