
import Link from 'next/link';
import type { Agent, Case, CaseSource } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MessageSquare, Flag, MapPin, MoreHorizontal, Edit, Reply, UserPlus, RotateCcw } from 'lucide-react';
import { TwitterIcon } from '@/components/icons/twitter-icon';
import { Facebook, Mail, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AssignAgentDialog } from './assign-agent-dialog';

type CaseCardProps = {
  caseItem: Case;
  agents: Agent[];
  onAssignCase: (caseId: string, agent: Agent) => void;
  onRestoreCase: (caseId: string) => void;
};

const sourceIcons: Record<CaseSource, React.FC<any>> = {
  Twitter: (props) => <TwitterIcon {...props} />,
  Meta: Facebook,
  Facebook: Facebook,
  Email: Mail,
  Chat: MessageSquare,
  Instagram: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  TikTok: (props) => (
     <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.04-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  Unknown: HelpCircle
};

export function CaseCard({ caseItem, agents, onAssignCase, onRestoreCase }: CaseCardProps) {
  const SourceIcon = sourceIcons[caseItem.source as CaseSource] || HelpCircle;

  const priorityColor = {
    'very high': 'text-red-500',
    'high': 'text-orange-500',
    'medium': 'text-yellow-500',
    'low': 'text-green-500',
  }[caseItem.properties.priority.toLowerCase()] || 'text-muted-foreground';

  return (
    <Card className="bg-card w-[360px] text-sm rounded-none border-x-0 border-t-0 border-b flex flex-col">
        <div className="flex-grow">
            <Link href={`/case/${caseItem.id}`} className="block h-full">
                <CardHeader className="p-3 flex-row items-start justify-between">
                    <div className="font-semibold text-primary hover:underline whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                        Case #{caseItem.id}
                    </div>
                    <div className='flex items-center gap-2'>
                    <SourceIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground flex-shrink-0">{caseItem.createdAt}</span>
                    </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border rounded-full">
                        <AvatarImage src={caseItem.user.avatarUrl} alt={caseItem.user.name} />
                        <AvatarFallback className="bg-blue-500 text-white font-bold">{caseItem.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold">{caseItem.user.name}</p>
                        <p className="text-xs text-muted-foreground">{caseItem.user.handle}</p>
                    </div>
                </div>
                <p className="mt-2 text-foreground/90 whitespace-normal break-words">{caseItem.preview}</p>
                
                <div className="text-primary text-xs hover:underline mt-2 block">
                    View {caseItem.properties.associated_messages} Associated Message{caseItem.properties.associated_messages > 1 ? 's' : ''}
                </div>

                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span>{caseItem.assignee ? `${caseItem.assignee.name} (${caseItem.assignee.email})` : 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{caseItem.assignee ? 'Universal Case Inbox' : 'Unified Routing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Flag className="h-3.5 w-3.5" />
                        <span className="capitalize">{caseItem.properties.customStatus}</span>
                        <span className={`${priorityColor}`}>•</span>
                        <span className="capitalize">{caseItem.properties.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{caseItem.properties.country}</span>
                    </div>
                </div>
                </CardContent>
            </Link>
        </div>
        <CardFooter className="p-3 pt-0 flex items-center justify-between text-muted-foreground">
          {caseItem.status === 'All closed' ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2"
                onClick={() => onRestoreCase(caseItem.id)}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Restore Case
              </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                  <AssignAgentDialog agents={agents} onAssign={(agent) => onAssignCase(caseItem.id, agent)}>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><UserPlus className="h-4 w-4" /></Button>
                  </AssignAgentDialog>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Reply className="h-4 w-4" /></Button>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
            </>
          )}
        </CardFooter>
    </Card>
  );
}
