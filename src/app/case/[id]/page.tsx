
"use client";

import { useState, useEffect, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { getCaseById, agents } from "@/lib/mock-data";
import type { Agent, Case, CaseProperties, CaseStatus } from "@/lib/types";
import { ConversationView } from "@/components/case-view/conversation-view";
import { PropertiesView } from "@/components/case-view/properties-view";
import { CaseViewHeader } from "@/components/case-view/case-view-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CasePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundCase = getCaseById(id);
    if (foundCase) {
      // Ensure all property arrays are initialized
      const initializedCase = {
        ...foundCase,
        properties: {
          ...foundCase.properties,
          corporate: foundCase.properties.corporate || [],
          audience: foundCase.properties.audience || [],
          compliance: foundCase.properties.compliance || [],
          therapeuticArea: foundCase.properties.therapeuticArea || [],
          topicGeneral: foundCase.properties.topicGeneral || [],
          brand: foundCase.properties.brand || [],
          lillyHealthApp: foundCase.properties.lillyHealthApp || [],
          lilly_products: Array.isArray(foundCase.properties.lilly_products)
            ? foundCase.properties.lilly_products
            : (foundCase.properties.lilly_products ? [foundCase.properties.lilly_products] : [])
        }
      };
      setCaseData(initializedCase);
    } else if (!isLoading) {
      notFound();
    }
    setIsLoading(false);
  }, [id, isLoading]);

  const handlePropertyChange = (
    property: keyof CaseProperties | 'assignee',
    value: any
  ) => {
    setCaseData((prev) => {
      if (!prev) return null;
      if (property === 'assignee') {
        const agent = agents.find(a => a.id === value);
        if (agent) {
             toast({
                title: 'Case Assigned',
                description: `Case #${prev.id} has been assigned to ${agent.name}.`,
            });
        }
        return { ...prev, assignee: agent };
      }
      return {
        ...prev,
        properties: {
          ...prev.properties,
          [property]: value,
        },
      };
    });
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
      setCaseData(prev => {
          if (!prev) return null;
          return { ...prev, status: newStatus };
      });
      toast({
          title: 'Case Status Changed',
          description: `Case #${id} has been moved to "${newStatus}".`
      });
      // Optionally, navigate away or update a global state
      router.push('/dashboard');
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

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <CaseViewHeader caseData={caseData} />
      <div className="grid md:grid-cols-[2fr_1fr] flex-1 overflow-hidden">
        <ConversationView 
          caseData={caseData}
          conversation={caseData.conversation}
          agents={agents}
          onPropertyChange={handlePropertyChange}
          onStatusChange={handleStatusChange}
        />
        <PropertiesView
          properties={caseData.properties}
          assignee={caseData.assignee}
          agents={agents}
          onPropertyChange={handlePropertyChange}
        />
      </div>
    </div>
  );
}
