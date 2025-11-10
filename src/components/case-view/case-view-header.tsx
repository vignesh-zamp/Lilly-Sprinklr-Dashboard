import Link from 'next/link';
import { ChevronLeft, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Case } from '@/lib/types';

export function CaseViewHeader({ caseData }: { caseData: Case }) {
  return (
    <header className="flex items-center p-2 border-b shrink-0 bg-card">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/dashboard">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back to Dashboard</span>
        </Link>
      </Button>
      <div className="ml-2">
        <h1 className="text-lg font-semibold truncate">
            Case #{caseData.id}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
         <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
         </Button>
         <Button variant="ghost" size="icon">
            <Link href="/dashboard">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Link>
         </Button>
      </div>
    </header>
  );
}
