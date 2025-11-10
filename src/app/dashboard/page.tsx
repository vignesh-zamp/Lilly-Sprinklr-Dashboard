"use client";

import { useState } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { initialCases, agents } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const { toast } = useToast();

  const handleAssignCase = (caseId: string, agent: Agent) => {
    setCases((currentCases) =>
      currentCases.map((c) => {
        if (c.id === caseId) {
          const newStatus: CaseStatus =
            agent.email === 'pace@zamp.ai' ? 'Assigned to Pace' : 'All Assigned';
          
          toast({
            title: 'Case Assigned',
            description: `Case #${caseId} has been assigned to ${agent.name}.`,
          });

          return { ...c, assignee: agent, status: newStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="p-4 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-6 gap-4 h-full">
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
    </div>
  );
}
