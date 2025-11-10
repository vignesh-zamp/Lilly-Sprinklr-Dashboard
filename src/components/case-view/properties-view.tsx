import type { Agent, Case } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { X, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { propertyOptions } from '@/lib/types';
import { useState } from 'react';

type PropertiesViewProps = {
  properties: Case['properties'];
  assignee?: Case['assignee'];
  agents: Agent[];
  onPropertyChange: (property: keyof Case['properties'] | 'assignee', value: any) => void;
};

const PropertyPill = ({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) => (
  <div className="flex items-center justify-between text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
    <span>{children}</span>
    {onRemove && (
      <button onClick={onRemove} className="ml-1 text-blue-600 hover:text-blue-800">
        <X className="h-3 w-3" />
      </button>
    )}
  </div>
);

const PropertyMultiSelect = ({
  title,
  options,
  selected,
  onSelect,
  onRemove,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const availableOptions = options.filter(opt => !selected.includes(opt));

    return (
        <div className="space-y-2">
             <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
             <div className="flex flex-wrap gap-1">
                {selected.map(item => (
                    <PropertyPill key={item} onRemove={() => onRemove(item)}>
                        {item}
                    </PropertyPill>
                ))}
             </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-auto px-2 py-1 text-xs justify-between w-full font-normal">
                        {selected.length > 0 ? "Add More" : "Click to Add"}
                        <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64" align="start">
                    <Command>
                        <CommandInput placeholder={`Search ${title}...`} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {availableOptions.map(option => (
                                    <CommandItem
                                        key={option}
                                        onSelect={() => {
                                            onSelect(option);
                                            setOpen(false);
                                        }}
                                    >
                                        {option}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
};


const PropertySection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : ""} className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="p-0 hover:no-underline">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
                <div className="space-y-4">
                    {children}
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);


export function PropertiesView({ properties, assignee, agents, onPropertyChange }: PropertiesViewProps) {
  
    const handleMultiSelect = (prop: keyof Case['properties'], value: string) => {
        const currentValues = (properties[prop] as string[]) || [];
        if (!currentValues.includes(value)) {
            onPropertyChange(prop, [...currentValues, value]);
        }
    };

    const handleRemove = (prop: keyof Case['properties'], value: string) => {
        const currentValues = (properties[prop] as string[]) || [];
        onPropertyChange(prop, currentValues.filter(v => v !== value));
    };


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
                        <PropertyMultiSelect 
                            title="Corporate"
                            options={propertyOptions.corporate}
                            selected={properties.corporate || []}
                            onSelect={(value) => handleMultiSelect('corporate', value)}
                            onRemove={(value) => handleRemove('corporate', value)}
                        />
                         <PropertyMultiSelect 
                            title="Audience"
                            options={propertyOptions.audience}
                            selected={properties.audience || []}
                            onSelect={(value) => handleMultiSelect('audience', value)}
                            onRemove={(value) => handleRemove('audience', value)}
                        />
                        <PropertyMultiSelect 
                            title="Lilly Product (s)"
                            options={propertyOptions.productLilly}
                            selected={properties.lilly_products ? (Array.isArray(properties.lilly_products) ? properties.lilly_products : [properties.lilly_products]) : []}
                            onSelect={(value) => handleMultiSelect('lilly_products', value)}
                            onRemove={(value) => handleRemove('lilly_products', value)}
                        />
                         <PropertyMultiSelect 
                            title="Compliance"
                            options={propertyOptions.compliance}
                            selected={properties.compliance || []}
                            onSelect={(value) => handleMultiSelect('compliance', value)}
                            onRemove={(value) => handleRemove('compliance', value)}
                        />
                         <PropertyMultiSelect 
                            title="Therapeutic Area"
                            options={propertyOptions.therapeuticArea}
                            selected={properties.therapeuticArea || []}
                            onSelect={(value) => handleMultiSelect('therapeuticArea', value)}
                            onRemove={(value) => handleRemove('therapeuticArea', value)}
                        />
                        <PropertyMultiSelect 
                            title="Topic - General"
                            options={propertyOptions.topicGeneral}
                            selected={properties.topicGeneral || []}
                            onSelect={(value) => handleMultiSelect('topicGeneral', value)}
                            onRemove={(value) => handleRemove('topicGeneral', value)}
                        />
                         <PropertyMultiSelect 
                            title="Brand"
                            options={propertyOptions.brand}
                            selected={properties.brand || []}
                            onSelect={(value) => handleMultiSelect('brand', value)}
                            onRemove={(value) => handleRemove('brand', value)}
                        />
                         <PropertyMultiSelect 
                            title="Lilly Health App"
                            options={propertyOptions.lillyHealthApp}
                            selected={properties.lillyHealthApp || []}
                            onSelect={(value) => handleMultiSelect('lillyHealthApp', value)}
                            onRemove={(value) => handleRemove('lillyHealthApp', value)}
                        />
                    </PropertySection>
                </CardContent>
            </Card>

        </div>
      </ScrollArea>
    </aside>
  );
}
