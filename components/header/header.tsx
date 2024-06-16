'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Link from 'next/link'
import { CircleUser, ClipboardListIcon, FileTextIcon, HomeIcon, Menu, Package2, Search, Settings, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import TeamSwitcher from './team-switcher'
import { SystemMenu } from './system-menu'
import { SideBarNav } from '../sidebar/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Badge } from '../ui/badge'
import { ModeToggle } from '../theme-toggle'

export function Headerx () {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Sign out and redirect to homepage
    router.push('/'); // Navigate to the homepage
  };

  return (

    <div className='flex mr-4'>
      <div className='mt-[-6px] mr-4'>
      <ModeToggle />
      </div>
    <div className='mt-1'>
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
  <Button variant="outline" className="relative h-8 w-8 rounded-full">
    <Avatar className="h-8 w-8">
      {user?.image ? (
        <AvatarImage src={user.image} alt={`${user?.firstName} ${user?.lastName}`} />
      ) : (
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      )}
    </Avatar>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    </div>
         
  )
}

export default Headerx
