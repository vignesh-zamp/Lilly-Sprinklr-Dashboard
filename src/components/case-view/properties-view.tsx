import type { Agent, Case } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { X, ChevronDown } from 'lucide-react';

type PropertiesViewProps = {
  properties: Case['properties'];
  assignee?: Case['assignee'];
  agents: Agent[];
  onPropertyChange: (property: keyof Case['properties'] | 'assignee', value: any) => void;
};

const PropertySection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : ""} className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="p-0 hover:no-underline">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
                <div className="space-y-2">
                    {children}
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);

const PropertyPill = ({ children, onRemove }: { children: React.ReactNode, onRemove?: () => void }) => (
    <div className="flex items-center justify-between text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
        <span>{children}</span>
        {onRemove && (
             <button onClick={onRemove} className="ml-1 text-blue-600 hover:text-blue-800">
                <X className="h-3 w-3" />
            </button>
        )}
    </div>
);

const AddButton = ({ label = "Click to Add" }: { label?: string }) => (
    <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs justify-between w-full font-normal">
        {label}
        <ChevronDown className="h-3 w-3 ml-1" />
    </Button>
)

export function PropertiesView({ properties, assignee, agents, onPropertyChange }: PropertiesViewProps) {
  return (
    <aside className="border-l bg-card h-full">
        <div className="flex items-center justify-between p-3 border-b">
            <h2 className="text-lg font-semibold">Properties</h2>
            <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Close Properties</span>
            </Button>
        </div>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-blue-600">55</p>
                    <p className="text-xs text-muted-foreground">Initial</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold text-blue-600">55</p>
                    <p className="text-xs text-muted-foreground">Predicted</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-3 space-y-4 text-sm">
                    <PropertySection title="Tags" defaultOpen>
                         <AddButton />
                    </PropertySection>
                    <PropertySection title="Corporate">
                        <AddButton />
                    </PropertySection>
                    <PropertySection title="Audience" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                            <PropertyPill>Careers-Intern</PropertyPill>
                            <PropertyPill>Health Care Provider</PropertyPill>
                        </div>
                        <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs font-normal">
                            Add More
                            <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                    </PropertySection>
                    <PropertySection title="Therapeutic Area">
                        <AddButton />
                    </PropertySection>
                    <PropertySection title="Compliance" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                             <PropertyPill>AE</PropertyPill>
                        </div>
                         <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs font-normal">
                            Add More
                            <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                    </PropertySection>
                    <PropertySection title="Topic-General">
                         <AddButton />
                    </PropertySection>
                    <PropertySection title="Product Lilly">
                         <AddButton />
                    </PropertySection>
                     <PropertySection title="Brand">
                         <AddButton />
                    </PropertySection>
                     <PropertySection title="Lilly Health App">
                         <AddButton />
                    </PropertySection>
                </CardContent>
            </Card>

        </div>
      </ScrollArea>
    </aside>
  );
}
