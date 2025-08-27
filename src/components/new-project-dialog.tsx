
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function NewProjectDialog() {
  return (
    <Button asChild>
        <Link href="/dashboard/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Proyecto
        </Link>
    </Button>
  );
}
