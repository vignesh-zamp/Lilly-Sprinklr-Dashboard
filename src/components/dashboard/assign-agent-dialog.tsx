import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Agent } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

type AssignAgentDialogProps = {
  children: React.ReactNode;
  agents: Agent[];
  onAssign: (agent: Agent) => void;
};

export function AssignAgentDialog({ children, agents, onAssign }: AssignAgentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign to Agent</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          <div className="space-y-2 p-1">
            {agents.map((agent) => (
              <DialogTrigger asChild key={agent.id}>
                <button
                  onClick={() => onAssign(agent)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent text-left"
                >
                  <Avatar>
                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                  </div>
                </button>
              </DialogTrigger>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
