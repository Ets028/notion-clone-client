'use client';

import { Menu, Bell, Settings, LogOut, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useNotesStore } from '@/store/notesStore';

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useNotesStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 text-muted-foreground hover:bg-accent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9 text-muted-foreground hover:bg-accent"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:bg-accent relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-lg hover:bg-accent p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
              <div className="flex items-center justify-start gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 cursor-pointer py-2 px-4">
                <Settings className="h-4 w-4" />
                <span>Settings & preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout} 
                className="text-destructive focus:text-destructive gap-3 cursor-pointer hover:!bg-destructive/10 py-2 px-4"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
