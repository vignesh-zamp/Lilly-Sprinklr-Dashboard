import type { Case, Agent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CaseCard } from './case-card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type CaseColumnProps = {
  title: string;
  cases: Case[];
  agents: Agent[];
  onAssignCase: (caseId: string, agent: Agent) => void;
};

export function CaseColumn({ title, cases, agents, onAssignCase }: CaseColumnProps) {
  return (
    <div className="flex flex-col h-full bg-muted/50 rounded-lg w-[380px] border">
      <div className="p-3 border-b flex items-center gap-3 bg-card">
        <RadioGroup defaultValue={title} disabled>
          <RadioGroupItem value={title} id={title} />
        </RadioGroup>
        <Label htmlFor={title} className="font-semibold text-sm cursor-pointer">
          {title} <span className="text-muted-foreground font-normal">({cases.length})</span>
        </Label>
      </div>
      <ScrollArea className="flex-1 bg-card">
        <div className="flex flex-col">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} agents={agents} onAssignCase={onAssignCase} />
          ))}
          {cases.length === 0 && (
             <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                No cases in this queue.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
