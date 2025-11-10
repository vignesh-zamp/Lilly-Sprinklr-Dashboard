
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
      let caseAssigned = false;
      const updatedCases = currentCases.map((c) => {
        if (c.id === caseId) {
          // Update the assignee for all instances of this case
          return { ...c, assignee: agent };
        }
        return c;
      });

      // If assigning to Pace, add a new entry to the "Assigned to Pace" column
      if (agent.email === 'pace@zamp.ai') {
        const originalCase = currentCases.find(c => c.id === caseId);
        if (originalCase) {
          // Check if it's already in the "Assigned to Pace" column to avoid duplicates
          const alreadyInPaceColumn = updatedCases.some(c => c.id === caseId && c.status === 'Assigned to Pace');
          
          if (!alreadyInPaceColumn) {
            const newPaceCase: Case = {
              ...originalCase,
              assignee: agent,
              status: 'Assigned to Pace',
              uniqueId: `${caseId}-Assigned to Pace-${Date.now()}` // Ensure a unique ID
            };
            updatedCases.push(newPaceCase);
            caseAssigned = true;
          }
        }
      }

      if (!caseAssigned) {
         // This block will run for agents other than Pace, or if the case was already in Pace's column
         const caseExists = updatedCases.some(c => c.id === caseId);
         if (caseExists) {
             caseAssigned = true;
         }
      }

      if (caseAssigned) {
        toast({
          title: 'Case Assigned',
          description: `Case #${caseId} has been assigned to ${agent.name}.`,
        });
      }

      return updatedCases;
    });
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
