import Link from 'next/link';
import type { Agent, Case, CaseSource } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MessageSquare, Mail, Facebook, Flag, MapPin, MoreHorizontal, Edit, Reply, UserPlus } from 'lucide-react';
import { TwitterIcon } from '@/components/icons/twitter-icon';
import { AssignAgentDialog } from './assign-agent-dialog';
import { Badge } from '@/components/ui/badge';

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
    <Card className="bg-card hover:shadow-md transition-shadow w-[360px] text-sm">
        <CardHeader className="p-3 flex-row items-center justify-between">
            <Link href={`/case/${caseItem.id}`} className="font-semibold text-blue-400 hover:underline">
                Case #{caseItem.id}
            </Link>
            <span className="text-xs text-muted-foreground">{caseItem.createdAt}</span>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>{caseItem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                 <p className="font-semibold">{caseItem.user.name}</p>
                 <p className="text-xs text-muted-foreground">{caseItem.user.handle}</p>
              </div>
          </div>
          <p className="mt-2 text-foreground/90">{caseItem.preview}</p>
          <Link href="#" className="text-blue-400 text-xs hover:underline mt-1 block">View 1 Associated Message</Link>

          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            {caseItem.assignee && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span>{caseItem.assignee.name} ({caseItem.assignee.email})</span>
              </div>
            )}
             <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Universal Case Inbox</span>
              </div>
             <div className="flex items-center gap-2">
                <Flag className="h-3.5 w-3.5" />
                <Badge variant="secondary" className="text-xs font-normal">Assigned</Badge>
                <span className="text-orange-400">•</span>
                <span>{caseItem.properties.priority}</span>
              </div>
               <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>FRANCE</span>
              </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><UserPlus className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Reply className="h-4 w-4" /></Button>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
        </CardFooter>
    </Card>
  );
}
