"use client";

import { useState } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { initialCases, agents } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const { toast } = useToast();

  const handleAssignCase = (caseId: string, agent: Agent) => {
    setCases((currentCases) =>
      currentCases.map((c) => {
        if (c.uniqueId?.startsWith(caseId)) { // Match by base ID
          const newStatus: CaseStatus =
            agent.email === 'pace@zamp.ai' ? 'Assigned to Pace' : 'All Assigned';
          
          toast({
            title: 'Case Assigned',
            description: `Case #${caseId} has been assigned to ${agent.name}.`,
          });

          // This logic might need refinement if a case can be in multiple non-assign-related columns
          // and you want to move it from all of them.
          if (c.status !== 'All closed') {
             return { ...c, assignee: agent, status: newStatus };
          }
        }
        return c;
      })
    );
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap bg-background">
      <div className="flex w-max space-x-4 p-4 h-[calc(100vh-4rem)]">
        {caseStatuses.map((status) => (
          <CaseColumn
            key={status}
            title={status}
            cases={cases.filter((c) => c.status === status)}
            agents={agents}
            onAssignCase={handleAssignCase}
          />
        ))}
      </div>
       <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
