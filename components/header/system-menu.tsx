"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { CalendarCheck, FileTextIcon, Settings, Users2Icon } from "lucide-react"
import { FaTasks } from "react-icons/fa"
import { useCurrentUser } from "@/hooks/use-current-user"
import TeamSwitcher from "./team-switcher"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "View Payslip 💵",
    href: "/dashboard/payslip",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
]

export function SystemMenu() {

  const user = useCurrentUser();

  const isAdmin = user?.role === 'Administrator';
  const isManager = user?.role === 'Manager';
  const isSupervisor = user?.role === 'Supervisor';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
        <TeamSwitcher />
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-4">
          <Link href="/dashboard/leave" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <CalendarCheck className="h-4 w-4 mr-2"/>Property Management
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {(isAdmin || isManager) && (
        <NavigationMenuItem>
        <Link href="/dashboard/employee-management" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Users2Icon className="h-4 w-4 mr-2"/>Space Management
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
          )}
          <NavigationMenuItem>
          <Link href="/dashboard/payslip" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <FileTextIcon className="h-4 w-4 mr-2"/>Tenant Management
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/kanban" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <FaTasks className="h-4 w-4 mr-2"/>Kanban Board
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/settings" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Settings className="h-4 w-4 mr-2"/>Settings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
