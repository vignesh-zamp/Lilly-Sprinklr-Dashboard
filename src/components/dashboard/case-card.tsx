import Link from 'next/link';
import type { Agent, Case, CaseSource } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, MessageSquare, Mail, Facebook } from 'lucide-react';
import { TwitterIcon } from '@/components/icons/twitter-icon';
import { AssignAgentDialog } from './assign-agent-dialog';

type CaseCardProps = {
  caseItem: Case;
  agents: Agent[];
  onAssignCase: (caseId: string, agent: Agent) => void;
};

const sourceIcons: Record<CaseSource, React.FC<any>> = {
  Twitter: (props) => <TwitterIcon {...props} />,
  Facebook: Facebook,
  Email: Mail,
  Chat: MessageSquare,
};

export function CaseCard({ caseItem, agents, onAssignCase }: CaseCardProps) {
  const SourceIcon = sourceIcons[caseItem.source];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <Link href={`/case/${caseItem.id}`} className="text-xs text-muted-foreground hover:underline">
            #{caseItem.id}
          </Link>
          <AssignAgentDialog agents={agents} onAssign={(agent) => onAssignCase(caseItem.id, agent)}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <UserPlus className="h-4 w-4" />
            </Button>
          </AssignAgentDialog>
        </div>
      </CardHeader>
      <Link href={`/case/${caseItem.id}`} className="block">
        <CardContent className="p-3 pt-0">
          <p className="text-sm font-medium leading-snug truncate">{caseItem.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{caseItem.preview}</p>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={caseItem.user.avatarUrl} alt={caseItem.user.name} />
              <AvatarFallback>{caseItem.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{caseItem.createdAt} on <SourceIcon className="inline h-3 w-3" /></span>
          </div>
          {caseItem.assignee && (
            <Avatar className="h-5 w-5 border">
               <AvatarImage src={caseItem.assignee.avatarUrl} alt={caseItem.assignee.name} />
              <AvatarFallback>{caseItem.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
