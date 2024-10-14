'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Building, 
  FileText, 
  Home,
  MonitorIcon,
  ClipboardList,
  DollarSignIcon,
  Receipt,
  BarChart2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronLeftSquare,
  ChevronRightSquare
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Building, label: 'Properties', href: '/properties' },
  { icon: Users, label: 'Tenants', href: '/tenants' },
  { icon: FileText, label: 'Leases', href: '/leases' },
  { icon: Receipt, label: 'Billing', href: '/billing' },
  { icon: DollarSignIcon, label: 'Financials', href: '/financials' },
  { 
    icon: BarChart2, 
    label: 'Reports', 
    href: '/reports',
    subItems: [
      { icon: Home, label: 'Property Reports', href: '/reports/properties' },
      { icon: Users, label: 'Tenants Reports', href: '/reports/tenants' },
    ]
  },
  { icon: ClipboardList, label: 'Kanban', href: '/kanban' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: MonitorIcon, label: 'System Admin', href: '/system-admin' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-card text-card-foreground border-r flex flex-col"
    >
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center justify-center space-x-2 flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`}>
          <Image
            src='/rdrdc.png'
            alt='Logo'
            width={35}
            height={35}
            className="cursor-pointer ml-[1.5px]"
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`text-lg font-semibold overflow-hidden whitespace-nowrap ${isCollapsed ? "hidden" : ""}`}
          >
            RDRDC - PMS
          </motion.h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              {item.subItems ? (
                <Collapsible
                  open={isReportsOpen}
                  onOpenChange={setIsReportsOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between",
                        pathname.startsWith(item.href) && "bg-gray-200/70 text-primary-foreground"
                      )}
                    >
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
                          <item.icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        </div>
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      </div>
                      {!isCollapsed && (isReportsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    <AnimatePresence>
                      {!isCollapsed && item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.href}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ml-8",
                              pathname === subItem.href 
                                ? "bg-gray-200/70 text-primary-foreground" 
                                : "text-muted-foreground hover:bg-gray-200/70 hover:text-accent-foreground"
                            )}
                          >
                            <subItem.icon className="h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{subItem.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors",
                          pathname === item.href 
                            ? "bg-gray-200/70 text-primary-foreground" 
                            : "text-muted-foreground hover:bg-gray-200/70 hover:text-accent-foreground"
                        )}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
                          <item.icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        </div>
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={cn("bg-popover text-popover-foreground", !isCollapsed && "hidden")}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto space-y-2">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-start"
        >
          <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
            {isCollapsed ? (
              <ChevronRightSquare className="h-5 w-5 text-primary" />
            ) : (
              <ChevronLeftSquare className="h-5 w-5 text-primary" />
            )}
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </motion.span>
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
            <Home className="h-4 w-4 text-primary" />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            Back to Home
          </motion.span>
        </Button>
      </div>
    </motion.aside>
  )
}
