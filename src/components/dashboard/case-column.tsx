import type { Case, Agent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CaseCard } from './case-card';

type CaseColumnProps = {
  title: string;
  cases: Case[];
  agents: Agent[];
  onAssignCase: (caseId: string, agent: Agent) => void;
};

export function CaseColumn({ title, cases, agents, onAssignCase }: CaseColumnProps) {
  return (
    <div className="flex flex-col h-full bg-muted/50 rounded-lg">
      <div className="p-3 border-b">
        <h2 className="font-semibold text-sm">
          {title} <span className="text-muted-foreground font-normal">{cases.length}</span>
        </h2>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} agents={agents} onAssignCase={onAssignCase} />
          ))}
          {cases.length === 0 && (
             <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                No cases
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
