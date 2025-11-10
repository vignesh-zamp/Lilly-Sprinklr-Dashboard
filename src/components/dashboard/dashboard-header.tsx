
"use client";

import { Bell, Search, AppWindow, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function DashboardHeader() {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    if (auth) {
        await auth.signOut();
    }
    router.push('/login');
  };

  return (
    <header className="dark flex items-center h-12 px-4 md:px-6 border-b bg-card text-card-foreground shadow-sm">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/sherina/40/40"} alt={user?.displayName || "User"} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'Sherina Espinoza'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'sherina.espinoza@lilly.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
