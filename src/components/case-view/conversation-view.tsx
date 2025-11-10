import type { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export function ConversationView({ conversation }: { conversation: Message[] }) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {conversation.map((message) => (
          <div key={message.id} className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={message.avatarUrl} alt={message.author} />
              <AvatarFallback>{message.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{message.author}</p>
                <p className="text-xs text-muted-foreground">{message.timestamp}</p>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <p className="text-sm">{message.text}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
