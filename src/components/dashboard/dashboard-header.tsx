import { Bell, Search, Settings, UserCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 border-b bg-card">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-lg font-semibold">
          Lilly Sprinklr Dashboard
        </Link>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/sherina/40/40" alt="Sherina" />
            <AvatarFallback>S</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
