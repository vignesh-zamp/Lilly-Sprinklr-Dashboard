
"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { AssignAgentDialog } from '@/components/dashboard/assign-agent-dialog';
import type { Agent, Case, CaseProperties, CaseStatus } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { propertyOptions } from '@/lib/types';
import { PropertyMultiSelect } from './properties-view';


const MacroButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 text-sm text-left hover:bg-accent rounded-md">
        <span>{children}</span>
        <ChevronRight className="h-4 w-4" />
    </button>
)

type ApplyClosedMacroDialogProps = {
    caseData: Case;
    onPropertyChange: (property: keyof CaseProperties, value: any) => void;
    onClose: () => void;
    onApply: () => void;
};

function ApplyClosedMacroDialog({ caseData, onPropertyChange, onClose, onApply }: ApplyClosedMacroDialogProps) {
    
    const handleMultiSelect = (prop: keyof Case['properties'], value: string) => {
        const currentValues = (caseData.properties[prop] as string[]) || [];
        if (!currentValues.includes(value)) {
            onPropertyChange(prop, [...currentValues, value]);
        }
    };

    const handleRemove = (prop: keyof Case['properties'], value: string) => {
        const currentValues = (caseData.properties[prop] as string[]) || [];
        onPropertyChange(prop, currentValues.filter(v => v !== value));
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Apply "Closed" Macro</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Select the tags to apply to this case before closing.</p>
                <ScrollArea className="max-h-80 my-4">
                    <div className="space-y-4 p-1">
                         <PropertyMultiSelect 
                            title="Corporate"
                            options={propertyOptions.corporate}
                            selected={caseData.properties.corporate || []}
                            onSelect={(value) => handleMultiSelect('corporate', value)}
                            onRemove={(value) => handleRemove('corporate', value)}
                        />
                         <PropertyMultiSelect 
                            title="Audience"
                            options={propertyOptions.audience}
                            selected={caseData.properties.audience || []}
                            onSelect={(value) => handleMultiSelect('audience', value)}
                            onRemove={(value) => handleRemove('audience', value)}
                        />
                        <PropertyMultiSelect 
                            title="Lilly Product (s)"
                            options={propertyOptions.productLilly}
                            selected={caseData.properties.lilly_products ? (Array.isArray(caseData.properties.lilly_products) ? caseData.properties.lilly_products : [caseData.properties.lilly_products]) : []}
                            onSelect={(value) => handleMultiSelect('lilly_products', value)}
                            onRemove={(value) => handleRemove('lilly_products', value)}
                        />
                         <PropertyMultiSelect 
                            title="Compliance"
                            options={propertyOptions.compliance}
                            selected={caseData.properties.compliance || []}
                            onSelect={(value) => handleMultiSelect('compliance', value)}
                            onRemove={(value) => handleRemove('compliance', value)}
                        />
                         <PropertyMultiSelect 
                            title="Therapeutic Area"
                            options={propertyOptions.therapeuticArea}
                            selected={caseData.properties.therapeuticArea || []}
                            onSelect={(value) => handleMultiSelect('therapeuticArea', value)}
                            onRemove={(value) => handleRemove('therapeuticArea', value)}
                        />
                        <PropertyMultiSelect 
                            title="Topic - General"
                            options={propertyOptions.topicGeneral}
                            selected={caseData.properties.topicGeneral || []}
                            onSelect={(value) => handleMultiSelect('topicGeneral', value)}
                            onRemove={(value) => handleRemove('topicGeneral', value)}
                        />
                         <PropertyMultiSelect 
                            title="Brand"
                            options={propertyOptions.brand}
                            selected={caseData.properties.brand || []}
                            onSelect={(value) => handleMultiSelect('brand', value)}
                            onRemove={(value) => handleRemove('brand', value)}
                        />
                         <PropertyMultiSelect 
                            title="Lilly Health App"
                            options={propertyOptions.lillyHealthApp}
                            selected={caseData.properties.lillyHealthApp || []}
                            onSelect={(value) => handleMultiSelect('lillyHealthApp', value)}
                            onRemove={(value) => handleRemove('lillyHealthApp', value)}
                        />
                    </div>
                </ScrollArea>
                 <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onApply}>Apply & Close Case</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type MacroDialogProps = {
    caseData: Case;
    agents: Agent[];
    onPropertyChange: (property: 'assignee', value: any) => void;
    onStatusChange: (status: CaseStatus) => void;
};


export function MacroDialog({ caseData, agents, onPropertyChange, onStatusChange }: MacroDialogProps) {
    const [mainOpen, setMainOpen] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [showApplyClosed, setShowApplyClosed] = useState(false);


    const handleAssign = (agent: Agent) => {
        onPropertyChange('assignee', agent.id);
        setShowAssign(false);
        setMainOpen(false);
    };
    
    const handleApplyAndClose = () => {
        onStatusChange('All closed');
        setShowApplyClosed(false);
        setMainOpen(false);
    }

    const openApplyClosed = () => {
        setShowApplyClosed(true);
    };

    const closeAll = () => {
        setMainOpen(false);
        setShowAssign(false);
        setShowApplyClosed(false);
    }

    return (
        <Dialog open={mainOpen} onOpenChange={setMainOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Macro</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Select a Macro</DialogTitle>
                </DialogHeader>
                <div className="space-y-1">
                    <AssignAgentDialog agents={agents} onAssign={handleAssign}>
                         <button className="w-full flex items-center justify-between p-3 text-sm text-left hover:bg-accent rounded-md">
                            <span>Assign Case</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </AssignAgentDialog>
                    <MacroButton onClick={openApplyClosed}>Apply Closed</MacroButton>
                    <MacroButton onClick={() => {}}>Adverse Event (AE)</MacroButton>
                    <MacroButton onClick={() => {}}>Product Complaint (PC)</MacroButton>
                    <MacroButton onClick={() => {}}>Request for Information (RFI)</MacroButton>
                    <MacroButton onClick={() => {}}>Spam/Irrelevant</MacroButton>
                </div>
                 {showApplyClosed && (
                    <ApplyClosedMacroDialog
                        caseData={caseData}
                        onPropertyChange={onPropertyChange as any}
                        onClose={() => setShowApplyClosed(false)}
                        onApply={handleApplyAndClose}
                    />
                 )}
            </DialogContent>
        </Dialog>
    )
}
