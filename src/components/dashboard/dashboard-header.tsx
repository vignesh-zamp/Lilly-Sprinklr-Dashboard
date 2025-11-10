import { Bell, Search, Settings, UserCircle2, AppWindow } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="flex items-center h-12 px-4 md:px-6 border-b bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            S
        </div>
        <Link href="/dashboard" className="text-sm font-semibold whitespace-nowrap">
          (Sandbox) Tech-Demo-Inbound Cases
        </Link>
      </div>
       <nav className="ml-6 hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2 text-muted-foreground">Asset <span className="text-foreground/70 ml-1">(Sandbox)</span></Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2">Account</Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2">AE/PC</Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2">Kunal</Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs px-2">Customer</Button>
       </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AppWindow className="h-4 w-4" />
          <span className="sr-only">Apps</span>
        </Button>
         <div className="relative">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="absolute top-1 right-1 h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 items-center justify-center text-[9px] text-white">9</span>
          </div>
        </div>
        <Avatar className="h-7 w-7">
            <AvatarImage src="https://picsum.photos/seed/sherina/40/40" alt="Sherina" />
            <AvatarFallback className="bg-blue-600 text-white text-xs">SE</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
