
"use client";

import { useState, useEffect } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { agents } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const casesCollectionRef = useMemoFirebase(() =>
    user && firestore ? collection(firestore, 'cases') : null
  , [user, firestore]);
  const { data: cases, isLoading } = useCollection<Case>(casesCollectionRef);

  const handleAssignCase = async (caseId: string, agent: Agent) => {
    if (!firestore || !user) return;
  
    const caseRef = doc(firestore, 'cases', caseId);
    
    const updatePayload: any = { 
      assignee: { 
          id: agent.id, 
          name: agent.name, 
          email: agent.email, 
          avatarUrl: agent.avatarUrl 
      } 
    };

    // If assigned to Pace, update status
    if (agent.email === 'pace@zamp.ai') {
      updatePayload.status = 'Assigned to Pace';
    } else {
      const currentCase = cases?.find(c => c.id === caseId);
      // If it was assigned to pace, move it back to 'All Assigned'
      if (currentCase?.status === 'Assigned to Pace') {
          updatePayload.status = 'All Assigned';
      }
    }
    
    updateDoc(caseRef, updatePayload)
      .catch((error) => {
        console.error("Error assigning case: ", error);
        const permissionError = new FirestorePermissionError({
          path: caseRef.path,
          operation: 'update',
          requestResourceData: updatePayload
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not assign case.',
        });
      });
  };

  const handleRestoreCase = async (caseId: string) => {
    if (!firestore) return;
    const caseRef = doc(firestore, 'cases', caseId);
    const updatePayload = { status: 'All Assigned' };

    updateDoc(caseRef, updatePayload)
        .catch((error) => {
            console.error("Error restoring case: ", error);
            const permissionError = new FirestorePermissionError({
              path: caseRef.path,
              operation: 'update',
              requestResourceData: updatePayload
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not restore case.',
            });
        });
  };

  const handleMoveCase = async (caseId: string) => {
    if (!firestore) return;
    const caseRef = doc(firestore, 'cases', caseId);
    const updatePayload = { status: 'All Demo - Awaiting' };

    updateDoc(caseRef, updatePayload)
        .catch((error) => {
            console.error("Error moving case: ", error);
            const permissionError = new FirestorePermissionError({
              path: caseRef.path,
              operation: 'update',
              requestResourceData: updatePayload
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not move case.',
            });
        });
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
    <>
    {cases && cases.length > 0 && (
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
              onMoveCase={handleMoveCase}
              isFirst={index === 0}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )}
    </>
  );
}
