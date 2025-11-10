
import type { Agent, Case, CaseProperties } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { X, ChevronDown, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { propertyOptions } from '@/lib/types';
import { useState } from 'react';
import { TwitterIcon } from '../icons/twitter-icon';
import { Facebook, Mail, MessageSquare, HelpCircle } from 'lucide-react';
import type { CaseSource } from '@/lib/types';

type PropertiesViewProps = {
  properties: CaseProperties;
  assignee?: Case['assignee'];
  agents: Agent[];
  onPropertyChange: (property: keyof CaseProperties | 'assignee', value: any) => void;
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

export const PropertyMultiSelect = ({
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

const PropertyRow = ({ label, value, hasInfo = false, isClickable=false }: { label: string; value: string; hasInfo?: boolean, isClickable?: boolean }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b">
        <div className="flex items-center">
            <span className="text-muted-foreground">{label}</span>
            {hasInfo && <Info className="h-3 w-3 ml-1 text-muted-foreground" />}
        </div>
        <span className={`font-medium ${isClickable ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
);

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

const ChannelSection = ({ source }: { source: string }) => {
    const SourceIcon = sourceIcons[source as CaseSource] || HelpCircle;
    let channelName = source;
    if (source === 'Twitter') {
        channelName = "X (Formerly Twitter)"
    } else if (source === 'Meta') {
        channelName = "Meta"
    }

    return (
        <PropertySection title="Channel" defaultOpen>
            <div className="flex items-center gap-2 text-sm">
                <SourceIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{channelName}</span>
            </div>
        </PropertySection>
    );
};


const PropertiesListSection = ({ properties }: { properties: CaseProperties }) => (
    <PropertySection title="Properties" defaultOpen>
        <PropertyRow label="Region" value={properties.region} hasInfo />
        <PropertyRow label="Country (CF)" value={properties.country} hasInfo />
        <PropertyRow label="Issue Type" value={properties.issueType} isClickable hasInfo />
        <PropertyRow label="Theme Matches" value={properties.themeMatches} isClickable />
        <PropertyRow label="Topic Matches" value={properties.topicMatches} isClickable />
        <PropertyRow label="Topic Group Matches" value={properties.topicGroupMatches} isClickable />
        <PropertyRow label="Sourced From Listening" value={properties.sourcedFromListening} hasInfo />
        <PropertyRow label="Sourced From CTM" value={properties.sourcedFromCTM} />
        <PropertyRow label="CTM Ad ID" value={properties.ctmAdId} isClickable />
        <PropertyRow label="Initial Messsage Privacy" value={properties.initialMessagePrivacy} isClickable />
        <PropertyRow label="HCP Type" value={properties.hcpType} />
        <PropertyRow label="Patient Gender" value={properties.patientGender} />
        <PropertyRow label="Patient Age" value={properties.patientAge} />
        <PropertyRow label="Contacted Poster" value={properties.contactedPoster} />
        <PropertyRow label="Poster Consent" value={properties.posterConsent} />
        <PropertyRow label="Poster Contact Info" value={properties.posterContactInfo} />
        <PropertyRow label="Lot Control Number" value={properties.lotControlNumber} />
    </PropertySection>
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

            <Card>
                <CardContent className="p-3 space-y-4 text-sm">
                    <ChannelSection source={properties.channel} />
                </CardContent>
            </Card>

             <Card>
                <CardContent className="p-3 space-y-4 text-sm">
                    <PropertiesListSection properties={properties} />
                </CardContent>
            </Card>

        </div>
      </ScrollArea>
    </aside>
  );
}
    
    