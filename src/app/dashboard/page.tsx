
"use client";

import { useState, useEffect } from 'react';
import { CaseColumn } from '@/components/dashboard/case-column';
import { agents, getCasesForSeeding } from '@/lib/mock-data';
import type { Case, CaseStatus, Agent } from '@/lib/types';
import { caseStatuses } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, setDoc, writeBatch } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const casesCollectionRef = useMemoFirebase(() =>
    user && firestore ? collection(firestore, 'cases') : null
  , [user, firestore]);
  const { data: cases, isLoading } = useCollection<Case>(casesCollectionRef);

  const handleSeedDatabase = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available.' });
      return;
    }
    
    toast({ title: 'Seeding Database...', description: 'Please wait.' });

    const casesToSeed = getCasesForSeeding();
    const batch = writeBatch(firestore);

    casesToSeed.forEach(caseData => {
      const docRef = doc(firestore, 'cases', caseData.id);
      const casePayload: Omit<Case, 'id'> = { ...caseData };
      delete (casePayload as any).id;
      batch.set(docRef, casePayload);
    });

    try {
      await batch.commit();
      toast({ title: 'Database Seeded', description: `${casesToSeed.length} cases have been added to Firestore.` });
    } catch (error: any) {
      console.error("Error seeding database: ", error);
      const permissionError = new FirestorePermissionError({
        path: 'cases collection (batch write)',
        operation: 'write',
        requestResourceData: { info: `Batch operation to seed ${casesToSeed.length} cases.` }
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not write cases to the database. Check console for details.',
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
      .catch((error) => {
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
    if (!firestore || !cases) return;
    const originalCase = cases.find(c => c.id === caseId);
    if (!originalCase) {
        toast({ variant: 'destructive', title: 'Error', description: 'Original case not found.' });
        return;
    }

    try {
        const batch = writeBatch(firestore);
        const caseDataToReplicate = { ...originalCase };
        delete (caseDataToReplicate as any).id; // Don't store the ID field inside the document

        // Replicate for "All Demo - Awaiting"
        const awaitingDemoRef = doc(firestore, 'cases', `${originalCase.id}-demo-awaiting`);
        batch.set(awaitingDemoRef, { ...caseDataToReplicate, status: 'All Demo - Awaiting' });

        // Replicate for "Demo - Mentions"
        const mentionsDemoRef = doc(firestore, 'cases', `${originalCase.id}-demo-mentions`);
        batch.set(mentionsDemoRef, { ...caseDataToReplicate, status: 'Demo - Mentions' });

        await batch.commit();

        toast({
            title: 'Case Replicated',
            description: `Case #${originalCase.id} has been added to demo columns.`,
        });
    } catch (error) {
        console.error("Error replicating case: ", error);
        const permissionError = new FirestorePermissionError({
          path: 'cases', // This is a batch, so path is generic
          operation: 'write',
          requestResourceData: { info: `Batch operation to replicate case ${caseId}` }
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not replicate case.',
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
  
  if (!cases || cases.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-muted-foreground">No cases found in the database.</p>
            <Button onClick={handleSeedDatabase}>Seed Database with Mock Data</Button>
        </div>
    )
  }

  return (
    <>
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
    </>
  );
}
