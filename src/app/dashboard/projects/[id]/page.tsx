
'use client';

import { redirect, useParams } from 'next/navigation';

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Redirect to the project charter page by default
  redirect(`/dashboard/projects/${projectId}/initiation/charter`);
}
