'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Bell, LogOut, Moon, Settings, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut } from '@/auth';
import { ModeToggle } from '../theme-toggle';

const Header = () => {
  const router = useRouter();
  const session = useCurrentUser();
  
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'Your property has been booked!', date: '2 hours ago' },
    { id: 2, message: 'New maintenance request received.', date: '1 day ago' },
    { id: 3, message: 'Payment received for your last booking.', date: '3 days ago' },
  ];

  const [openNotifications, setOpenNotifications] = useState(false);

  return (
    <div>
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-4 justify-end w-full mr-2">
          <div className='mt-[-7px]'>
          <ModeToggle />
          </div>

          <Button variant="outline" size="icon" onClick={() => setOpenNotifications(!openNotifications)}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session?.image ?? ''} // Fallback to an empty string
                    alt="User"
                  />
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.firstName} {session?.lastName}
                  </p>
                  <p className="text-xs leading-none">
                    {session?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notifications Dropdown */}
        {openNotifications && (
          <div className="absolute right-4 top-14 z-10 w-64 rounded-md border bg-white shadow-md">
            <div className="p-2">
              <p className="font-semibold">Notifications</p>
              <DropdownMenuSeparator />
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="p-2 hover:bg-gray-100">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">No notifications</p>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
