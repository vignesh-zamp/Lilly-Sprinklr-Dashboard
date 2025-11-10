import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Case } from '@/lib/types';

export function CaseViewHeader({ caseData }: { caseData: Case }) {
  return (
    <header className="flex items-center p-3 border-b shrink-0">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/dashboard">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back to Dashboard</span>
        </Link>
      </Button>
      <div className="ml-2">
        <h1 className="text-lg font-semibold truncate" title={caseData.title}>
            {caseData.title}
        </h1>
        <p className="text-sm text-muted-foreground">Case #{caseData.id}</p>
      </div>
      <div className="ml-auto">
        {/* Placeholder for actions */}
      </div>
    </header>
  );
}
