
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getCaseById, agents } from "@/lib/mock-data";
import type { Agent, Case } from "@/lib/types";
import { ConversationView } from "@/components/case-view/conversation-view";
import { PropertiesView } from "@/components/case-view/properties-view";
import { CaseViewHeader } from "@/components/case-view/case-view-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CasePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundCase = getCaseById(id);
    if (foundCase) {
      setCaseData(foundCase);
    } else if (!isLoading) {
      notFound();
    }
    setIsLoading(false);
  }, [id, isLoading]);

  const handlePropertyChange = (
    property: keyof Case["properties"] | 'assignee',
    value: any
  ) => {
    setCaseData((prev) => {
      if (!prev) return null;
      if (property === 'assignee') {
        const agent = agents.find(a => a.id === value);
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
