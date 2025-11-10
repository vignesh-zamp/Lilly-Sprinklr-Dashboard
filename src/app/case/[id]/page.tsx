
"use client";

import { useState, useEffect, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { agents } from "@/lib/mock-data";
import type { Agent, Case, CaseProperties, CaseStatus } from "@/lib/types";
import { ConversationView } from "@/components/case-view/conversation-view";
import { PropertiesView } from "@/components/case-view/properties-view";
import { CaseViewHeader } from "@/components/case-view/case-view-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDoc, useFirestore } from "@/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function CasePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const caseRef = firestore ? doc(firestore, "cases", id) : null;
  const { data: caseData, isLoading } = useDoc<Case>(caseRef);

  const handlePropertyChange = async (
    property: keyof CaseProperties | 'assignee',
    value: any
  ) => {
    if (!caseRef) return;

    try {
      if (property === 'assignee') {
        const agent = agents.find(a => a.id === value);
        if (agent) {
          await updateDoc(caseRef, { assignee: agent });
          toast({
            title: 'Case Assigned',
            description: `Case #${id} has been assigned to ${agent.name}.`,
          });
        }
      } else {
         const currentValues = (caseData?.properties as any)?.[property] || [];
         if (Array.isArray(currentValues) && !currentValues.includes(value)) {
             await updateDoc(caseRef, { [`properties.${property}`]: arrayUnion(value) });
         } else if (!Array.isArray(currentValues)) {
            await updateDoc(caseRef, { [`properties.${property}`]: value });
         }
      }
    } catch (error) {
      console.error("Error updating property: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update case property.",
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
            const newValues = currentValues.filter(v => v !== value);
            try {
                await updateDoc(caseRef, { [`properties.${property}`]: newValues });
            } catch (error) {
                console.error("Error removing property value: ", error);
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not update case property.",
                });
            }
        }
    };


  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!caseRef) return;
    try {
      await updateDoc(caseRef, { status: newStatus });
      toast({
        title: 'Case Status Changed',
        description: `Case #${id} has been moved to "${newStatus}".`
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error changing status: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not change case status.",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && !caseData) {
      notFound();
    }
  }, [isLoading, caseData]);

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
      ...caseData.properties,
      corporate: caseData.properties.corporate || [],
      audience: caseData.properties.audience || [],
      compliance: caseData.properties.compliance || [],
      therapeuticArea: caseData.properties.therapeuticArea || [],
      topicGeneral: caseData.properties.topicGeneral || [],
      brand: caseData.properties.brand || [],
      lillyHealthApp: caseData.properties.lillyHealthApp || [],
      lilly_products: Array.isArray(caseData.properties.lilly_products)
        ? caseData.properties.lilly_products
        : (caseData.properties.lilly_products ? [caseData.properties.lilly_products] : [])
    }
  };


  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <CaseViewHeader caseData={initializedCaseData} />
      <div className="grid md:grid-cols-[2fr_1fr] flex-1 overflow-hidden">
        <ConversationView 
          caseData={initializedCaseData}
          conversation={initializedCaseData.conversation}
          agents={agents}
          onPropertyChange={handlePropertyChange}
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
