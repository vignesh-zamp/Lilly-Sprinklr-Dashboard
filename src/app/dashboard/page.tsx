
"use client";

import { useState, useEffect } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { agents, initialCases } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
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

  const handleSeedDatabase = async () => {
    if (!firestore) return;
    try {
      const batch = writeBatch(firestore);
      initialCases.forEach((caseItem) => {
        const caseRef = doc(firestore, 'cases', caseItem.id);
        const { uniqueId, ...caseData } = caseItem;

        // Firestore does not accept 'undefined'. Convert to 'null'.
        if (caseData.assignee === undefined) {
          caseData.assignee = null;
        }
        
        batch.set(caseRef, caseData);
      });
      await batch.commit();
      toast({
        title: 'Database Seeded',
        description: 'The initial case data has been loaded into Firestore.',
      });
    } catch (error) {
      console.error("Error seeding database: ", error);
      const permissionError = new FirestorePermissionError({
        path: 'cases',
        operation: 'write',
        requestResourceData: initialCases
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not seed the database.',
      });
    }
  };


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
      .then(() => {
        toast({
          title: 'Case Assigned',
          description: `Case #${caseId} has been assigned to ${agent.name}.`,
        });
      })
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
        .then(() => {
            toast({
                title: "Case Restored",
                description: `Case #${caseId} has been restored to "All Assigned".`
            });
        })
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
    {cases && cases.length === 0 && !isLoading && (
        <div className="container mx-auto text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard!</h2>
          <p className="text-muted-foreground mb-6">It looks like your database is empty. Please seed it with the initial case data.</p>
          <Button onClick={handleSeedDatabase} size="lg">Seed Database</Button>
        </div>
      )}
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
