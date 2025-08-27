import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'proj-001',
    name: 'Plataforma de E-commerce',
    description: 'Desarrollo de una nueva plataforma de comercio electrónico para el cliente "Moda-Online".',
    imageUrl: 'https://picsum.photos/600/400',
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
