
"use client";

import { useState, useEffect } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { agents } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: cases, isLoading } = useCollection<Case>(
    user ? collection(firestore, 'cases') : null
  );

  const handleAssignCase = async (caseId: string, agent: Agent) => {
    if (!firestore || !user) return;
  
    const caseRef = doc(firestore, 'cases', caseId);
    
    try {
      const batch = writeBatch(firestore);
      
      // Update the main case document
      batch.update(caseRef, { 'assignee.id': agent.id, 'assignee.name': agent.name, 'assignee.email': agent.email, 'assignee.avatarUrl': agent.avatarUrl });
  
      // If assigned to Pace, update status
      if (agent.email === 'pace@zamp.ai') {
        batch.update(caseRef, { status: 'Assigned to Pace' });
      } else {
        // If it was assigned to pace, move it back to 'All Assigned'
        const currentCase = cases?.find(c => c.id === caseId);
        if (currentCase?.status === 'Assigned to Pace') {
            batch.update(caseRef, { status: 'All Assigned' });
        }
      }
      
      await batch.commit();
  
      toast({
        title: 'Case Assigned',
        description: `Case #${caseId} has been assigned to ${agent.name}.`,
      });
    } catch (error) {
      console.error("Error assigning case: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not assign case.',
      });
    }
  };

  const handleRestoreCase = async (caseId: string) => {
    if (!firestore) return;
    const caseRef = doc(firestore, 'cases', caseId);
    try {
        await updateDoc(caseRef, {
            status: 'All Assigned'
        });
        toast({
            title: "Case Restored",
            description: `Case #${caseId} has been restored to "All Assigned".`
        });
    } catch (error) {
        console.error("Error restoring case: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not restore case.',
        });
    }
  };


  if (isLoading) {
    return (
        <div className="flex w-full h-[calc(100vh-4rem)]">
            {caseStatuses.map((status) => (
                <div key={status} className="flex flex-col h-full bg-muted/50 rounded-none w-[380px] border-r border-y">
                    <div className="p-3 border-b flex items-center gap-3 bg-card shrink-0">
                        <p className="font-semibold text-sm">{status}</p>
                    </div>
                    <div className="p-3 space-y-3">
                        <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    )
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap bg-background">
      <div className="flex w-max h-[calc(100vh-4rem)]">
        {(caseStatuses || []).map((status, index) => (
          <CaseColumn
            key={status}
            title={status}
            cases={cases?.filter((c) => c.status === status) || []}
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
