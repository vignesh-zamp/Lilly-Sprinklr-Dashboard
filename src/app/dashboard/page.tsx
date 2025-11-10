
"use client";

import { useState, useEffect } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { initialCases, agents } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const { toast } = useToast();

  useEffect(() => {
    const closedCaseId = sessionStorage.getItem('closedCaseId');
    if (closedCaseId) {
      setCases(currentCases => {
        // Find the case that was closed
        const closedCase = currentCases.find(c => c.id === closedCaseId);
        if (!closedCase) {
          sessionStorage.removeItem('closedCaseId');
          return currentCases;
        }

        // Remove all instances of this case from the list
        const filteredCases = currentCases.filter(c => c.id !== closedCaseId);

        // Check if the case is already in the 'All closed' column to avoid duplicates
        const alreadyInClosed = currentCases.some(c => c.id === closedCaseId && c.status === 'All closed');

        if (!alreadyInClosed) {
          // Add a new entry for the case in the 'All closed' column
          filteredCases.push({
            ...closedCase,
            status: 'All closed',
            uniqueId: `${closedCaseId}-All closed-${Date.now()}` // Ensure unique ID
          });
        }
        
        return filteredCases;
      });
      
      // Clean up the session storage
      sessionStorage.removeItem('closedCaseId');
    }
  }, []);

  const handleAssignCase = (caseId: string, agent: Agent) => {
    setCases((currentCases) => {
      // First, update the assignee on all existing instances of the case
      let updatedCases = currentCases.map((c) => {
        if (c.id === caseId) {
          return { ...c, assignee: agent };
        }
        return c;
      });

      if (agent.email === 'pace@zamp.ai') {
        const originalCase = currentCases.find(c => c.id === caseId);
        if (originalCase) {
          // Check if it's already in the "Assigned to Pace" column to avoid duplicates
          const alreadyInPaceColumn = updatedCases.some(c => c.id === caseId && c.status === 'Assigned to Pace');
          
          if (!alreadyInPaceColumn) {
            updatedCases.push({
              ...originalCase,
              assignee: agent,
              status: 'Assigned to Pace',
              uniqueId: `${caseId}-Assigned to Pace-${Date.now()}` // Ensure a unique ID
            });
          }
        }
      } else {
        // If assigned to someone other than Pace, remove it from the "Assigned to Pace" column
        updatedCases = updatedCases.filter(c => !(c.id === caseId && c.status === 'Assigned to Pace'));
      }
      
      return updatedCases;
    });

    toast({
      title: 'Case Assigned',
      description: `Case #${caseId} has been assigned to ${agent.name}.`,
    });
  };

  const handleRestoreCase = (caseId: string) => {
    setCases((currentCases) => {
        const caseToRestore = currentCases.find(c => c.id === caseId && c.status === 'All closed');
        if (!caseToRestore) return currentCases;

        // Remove the 'All closed' instance of the case
        const withoutClosed = currentCases.filter(c => c.uniqueId !== caseToRestore.uniqueId);
        
        // Add it back to 'All Assigned'
        withoutClosed.push({
            ...caseToRestore,
            status: 'All Assigned',
            uniqueId: `${caseId}-All Assigned-${Date.now()}`
        });

        return withoutClosed;
    });

    toast({
        title: "Case Restored",
        description: `Case #${caseId} has been restored to "All Assigned".`
    });
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap bg-background">
      <div className="flex w-max h-[calc(100vh-4rem)]">
        {caseStatuses.map((status, index) => (
          <CaseColumn
            key={status}
            title={status}
            cases={cases.filter((c) => c.status === status)}
            agents={agents}
            onAssignCase={handleAssignCase}
            onRestoreCase={handleRestoreCase}
            isFirst={index === 0}
          />
        ))}
      </div>
       <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
