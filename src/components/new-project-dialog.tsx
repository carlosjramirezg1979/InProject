
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface NewProjectDialogProps {
  companyId: string;
}

export function NewProjectDialog({ companyId }: NewProjectDialogProps) {
  return (
    <Button asChild>
        <Link href={`/dashboard/projects/new?companyId=${companyId}`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Proyecto
        </Link>
    </Button>
  );
}
