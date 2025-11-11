
"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter, notFound } from "next/navigation";
import { agents } from "@/lib/mock-data";
import type { Agent, Case, CaseProperties, CaseStatus } from "@/lib/types";
import { ConversationView } from "@/components/case-view/conversation-view";
import { PropertiesView } from "@/components/case-view/properties-view";
import { CaseViewHeader } from "@/components/case-view/case-view-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function CasePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  // Always look for the original case document, even if a replicated one was clicked.
  const originalCaseId = useMemo(() => id.split('-demo-')[0], [id]);

  const caseRef = useMemoFirebase(() =>
    firestore ? doc(firestore, "cases", originalCaseId) : null
  , [firestore, originalCaseId]);

  const { data: caseData, isLoading, error } = useDoc<Case>(caseRef);

  useEffect(() => {
    // Let the loading complete before deciding on a 404
    if (!isLoading && !caseData && !error) {
      notFound();
    }
  }, [isLoading, caseData, error, router]);


  const handlePropertyChange = async (
    property: keyof CaseProperties | 'assignee',
    value: any
  ) => {
    if (!caseRef) return;

    let updatePayload: { [key: string]: any } = {};

    if (property === 'assignee') {
      const agent = agents.find(a => a.id === value);
      if (agent) {
        updatePayload = { assignee: agent };
        updateDoc(caseRef, updatePayload)
          .then(() => {
            toast({
              title: 'Case Assigned',
              description: `Case #${id} has been assigned to ${agent.name}.`,
            });
          })
          .catch((error) => {
            const permissionError = new FirestorePermissionError({ path: caseRef.path, operation: 'update', requestResourceData: updatePayload });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: "destructive", title: "Error", description: "Could not assign case." });
          });
      }
    } else {
      const currentValues = (caseData?.properties as any)?.[property] || [];
      if (Array.isArray(currentValues) && !currentValues.includes(value)) {
        updatePayload = { [`properties.${property}`]: arrayUnion(value) };
      } else if (!Array.isArray(currentValues)) {
        updatePayload = { [`properties.${property}`]: value };
      } else {
        return; // Value already exists, no update needed
      }
      
      updateDoc(caseRef, updatePayload)
        .catch((error) => {
          const permissionError = new FirestorePermissionError({ path: caseRef.path, operation: 'update', requestResourceData: updatePayload });
          errorEmitter.emit('permission-error', permissionError);
          toast({ variant: "destructive", title: "Error", description: "Could not update case property." });
        });
    }
  };
  
  const handlePropertyRemove = async (
    property: keyof CaseProperties,
    value: any
  ) => {
    if (!caseRef || !caseData) return;

    const currentValues = (caseData.properties as any)[property];
    if (Array.isArray(currentValues)) {
      const updatePayload = { [`properties.${property}`]: arrayRemove(value) };
      updateDoc(caseRef, updatePayload)
        .catch((error) => {
          const permissionError = new FirestorePermissionError({ path: caseRef.path, operation: 'update', requestResourceData: updatePayload });
          errorEmitter.emit('permission-error', permissionError);
          toast({ variant: "destructive", title: "Error", description: "Could not update case property." });
        });
    }
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!firestore || !caseRef) return;

    if (newStatus === 'All closed') {
        const batch = writeBatch(firestore);
        
        const originalCaseRef = doc(firestore, 'cases', originalCaseId);

        // 1. Update original case
        batch.update(originalCaseRef, { status: newStatus });

        // 2. Delete replicated demo cases
        const awaitingDemoRef = doc(firestore, 'cases', `${originalCaseId}-demo-awaiting`);
        batch.delete(awaitingDemoRef);
        const mentionsDemoRef = doc(firestore, 'cases', `${originalCaseId}-demo-mentions`);
        batch.delete(mentionsDemoRef);

        batch.commit()
            .then(() => {
                toast({
                    title: 'Case Closed',
                    description: `Case #${originalCaseId} and its replicas have been closed.`,
                });
                router.push('/dashboard');
            })
            .catch((error) => {
                const permissionError = new FirestorePermissionError({
                  path: `cases collection (batch operation on case ${originalCaseId})`,
                  operation: 'write',
                  requestResourceData: { 
                    update: { path: originalCaseRef.path, data: { status: newStatus } },
                    delete_awaiting: { path: awaitingDemoRef.path },
                    delete_mentions: { path: mentionsDemoRef.path },
                  }
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: "destructive", title: "Error", description: "Could not close case." });
            });
    } else {
        const updatePayload = { status: newStatus };
        updateDoc(caseRef, updatePayload)
            .then(() => {
                toast({
                    title: 'Case Status Changed',
                    description: `Case #${originalCaseId} has been moved to "${newStatus}".`,
                });
                router.push('/dashboard');
            })
            .catch((error) => {
                const permissionError = new FirestorePermissionError({ path: caseRef.path, operation: 'update', requestResourceData: updatePayload });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: "destructive", title: "Error", description: "Could not change case status." });
            });
    }
  };

  if (isLoading || !caseData) {
    return (
      <div className="flex flex-col h-screen">
         <div className="flex items-center p-4 border-b">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-40 ml-auto" />
         </div>
        <div className="grid md:grid-cols-[2fr_1fr] flex-1 overflow-hidden">
            <div className="p-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="p-6 border-l bg-card space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      </div>
    );
  }

  // Ensure all property arrays are initialized
  const initializedCaseData = {
    ...caseData,
    properties: {
      corporate: [],
      audience: [],
      compliance: [],
      therapeuticArea: [],
      topicGeneral: [],
      brand: [],
      lillyHealthApp: [],
      ...caseData.properties,
      lilly_products: Array.isArray(caseData.properties?.lilly_products)
        ? caseData.properties.lilly_products
        : (caseData.properties?.lilly_products ? [caseData.properties.lilly_products] : [])
    }
  };


  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <CaseViewHeader caseData={initializedCaseData} />
      <div className="grid md:grid-cols-[2fr_1fr] flex-1 overflow-hidden">
        <ConversationView 
          caseData={initializedCaseData}
          conversation={initializedCaseData.conversation || []}
          agents={agents}
          onPropertyChange={handlePropertyChange}
          onPropertyRemove={handlePropertyRemove}
          onStatusChange={handleStatusChange}
        />
        <PropertiesView
          properties={initializedCaseData.properties}
          assignee={initializedCaseData.assignee}
          agents={agents}
          onPropertyChange={handlePropertyChange}
          onPropertyRemove={handlePropertyRemove}
        />
      </div>
    </div>
  );
}
