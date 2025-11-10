import type { Message, Case } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Twitter } from 'lucide-react';

export function ConversationView({ conversation, caseData }: { conversation: Message[], caseData: Case }) {
  return (
    <div className="flex flex-col h-full bg-muted/30">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                  <Input placeholder="Search Messages" className="bg-card" />
                  <Button variant="outline" className="bg-card">Tags</Button>
              </div>

              <div className="relative text-center">
                <hr className="absolute top-1/2 left-0 w-full -translate-y-1/2" />
                <span className="relative bg-muted/30 px-2 text-xs text-muted-foreground">
                    Saturday, September 6, 2025
                </span>
              </div>
              
              <Button variant="link" size="sm" className="text-primary">
                  <Twitter className="h-4 w-4 mr-2" />
                  View Parent Post
              </Button>

            {conversation.map((message) => (
              <Card key={message.id} className="bg-card shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatarUrl} alt={message.author} />
                        <AvatarFallback className="bg-blue-500 text-white font-bold">{message.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{message.author}</p>
                                <p className="text-xs text-muted-foreground">@{message.author.toLowerCase().replace(/\s/g, '_')}</p>
                            </div>
                            <p className="text-sm text-foreground/90">{message.text}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <button className="hover:underline">Reply</button>
                                <span>{message.timestamp}</span>
                                <button className="hover:underline">Translate</button>
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center gap-3 p-3 rounded-md bg-muted text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Case assigned to {caseData.assignee?.name || 'Unassigned'}</span>
            </div>

            <Accordion type="single" collapsible className="w-full bg-card rounded-md border">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-3 text-sm font-semibold">Smart Responses (0)</AccordionTrigger>
                    <AccordionContent className="p-3 pt-0">
                    No smart responses available.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

          </div>
        </ScrollArea>
        <div className="p-4 bg-card border-t">
             <Textarea placeholder="Write a response here..." className="mb-2" />
             <div className="flex justify-between items-center">
                 <Button variant="outline">Macro</Button>
                 <Button>Send</Button>
             </div>
        </div>
    </div>
  );
}
