import type { Agent, Case } from '@/lib/types';
import { propertyOptions } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';

type PropertiesViewProps = {
  properties: Case['properties'];
  assignee?: Case['assignee'];
  agents: Agent[];
  onPropertyChange: (property: keyof Case['properties'] | 'assignee', value: any) => void;
};

export function PropertiesView({ properties, assignee, agents, onPropertyChange }: PropertiesViewProps) {
  return (
    <aside className="border-l bg-muted/50 h-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <Card className="bg-secondary">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Status</label>
                  <Select value={properties.status} onValueChange={(value) => onPropertyChange('status', value)}>
                    <SelectTrigger className="mt-1 bg-background h-8">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyOptions.status.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Priority</label>
                   <Select value={properties.priority} onValueChange={(value) => onPropertyChange('priority', value)}>
                    <SelectTrigger className="mt-1 bg-background h-8">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyOptions.priority.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">SLA Status</label>
                   <Select value={properties.slaStatus} onValueChange={(value) => onPropertyChange('slaStatus', value)}>
                    <SelectTrigger className="mt-1 bg-background h-8">
                      <SelectValue placeholder="Select SLA status" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyOptions.slaStatus.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Assignee</label>
                  <Select value={assignee?.id} onValueChange={(value) => onPropertyChange('assignee', value)}>
                    <SelectTrigger className="mt-1 bg-background h-8">
                       <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                       {agents.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Custom Status</span>
                    <span>{properties.customStatus}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span>{properties.language}</span>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {properties.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </aside>
  );
}
