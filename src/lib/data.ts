import type { Project, Company, ProjectManager } from '@/types';

// Mock data for Project Managers
export const projectManagers: ProjectManager[] = [
  {
    id: 'pm-001',
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    companyIds: ['comp-a', 'comp-b'],
  },
];

// Mock data for Companies
export const companies: Company[] = [
  {
    id: 'comp-a',
    name: 'Innovaciones Tech',
    description: 'Empresa de desarrollo de software y consultoría.',
    projectIds: ['proj-001', 'proj-003'],
    ownerId: 'pm-001',
  },
  {
    id: 'comp-b',
    name: 'Marketing Creativo Co.',
    description: 'Agencia de marketing digital y branding.',
    projectIds: ['proj-002', 'proj-004'],
    ownerId: 'pm-001',
  },
];

export const projects: Project[] = [
  {
    id: 'proj-001',
    name: 'Plataforma de E-commerce',
    description: 'Desarrollo de una nueva plataforma de comercio electrónico para el cliente "Moda-Online".',
    imageUrl: 'https://picsum.photos/600/400',
    companyId: 'comp-a',
    status: {
      initiation: 'completed',
      planning: 'in-progress',
      execution: 'not-started',
      closing: 'locked',
    },
  },
  {
    id: 'proj-002',
    name: 'Campaña de Marketing Digital Q3',
    description: 'Lanzamiento de la campaña de marketing para el tercer trimestre, enfocada en redes sociales.',
    imageUrl: 'https://picsum.photos/600/401',
    companyId: 'comp-b',
    status: {
      initiation: 'completed',
      planning: 'completed',
      execution: 'completed',
      closing: 'in-progress',
    },
  },
  {
    id: 'proj-003',
    name: 'Migración a la Nube',
    description: 'Migración de la infraestructura on-premise a una solución basada en la nube (AWS).',
    imageUrl: 'https://picsum.photos/600/402',
    companyId: 'comp-a',
    status: {
      initiation: 'in-progress',
      planning: 'not-started',
      execution: 'locked',
      closing: 'locked',
    },
  },
  {
    id: 'proj-004',
    name: 'Rediseño de App Móvil',
    description: 'Actualización completa de la interfaz de usuario y la experiencia de usuario de la aplicación móvil existente.',
    imageUrl: 'https://picsum.photos/600/403',
    companyId: 'comp-b',
    status: {
      initiation: 'completed',
      planning: 'completed',
      execution: 'in-progress',
      closing: 'not-started',
    },
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};

export const getProjectsByCompanyId = (companyId: string): Project[] => {
    return projects.filter(project => project.companyId === companyId);
}

export const getProjectsByManagerId = (managerId: string): Project[] => {
    const manager = projectManagers.find(pm => pm.id === managerId);
    if (!manager) return [];

    const companyIds = manager.companyIds;
    return projects.filter(project => companyIds.includes(project.companyId));
}

export const getCompanyById = (id: string): Company | undefined => {
    return companies.find((company) => company.id === id);
}

export const getCompaniesByManagerId = (managerId: string): Company[] | undefined => {
    const manager = projectManagers.find(pm => pm.id === managerId);
    if (!manager) return undefined;
    return companies.filter(company => manager.companyIds.includes(company.id));
}
