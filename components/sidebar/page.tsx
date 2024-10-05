'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
  DownloadCloud,
  Receipt
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'
import { Button } from '../ui/button'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Building, label: 'Properties', href: '/properties' },
  { icon: Users, label: 'Tenants', href: '/tenants' },
  { icon: FileText, label: 'Leases', href: '/leases' },
  { icon: Receipt, label: 'Billing', href: '/billing' },
  { icon: DollarSignIcon, label: 'Financials', href: '/financials' },
  { icon: ClipboardList, label: 'Kanban', href: '/kanban' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: MonitorIcon, label: 'System Admin', href: '/system-admin' },
]

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ width: 240 }}
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
      onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse on image click
      className="cursor-pointer ml-[1.5px]" // Add pointer cursor for better UX
    />
    <motion.h2
      initial={{ opacity: 1 }}
      animate={{ opacity: isCollapsed ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      className={`text-lg font-semibold overflow-hidden whitespace-nowrap ${isCollapsed ? "hidden" : ""}`}
    >
      RDRDC - PMS
    </motion.h2>
  </div>
  <div className="flex items-center"> {/* You can still keep an empty div here for alignment */}
    <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
    </div>
  </div>
</div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors",
                        pathname === item.href 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      </div>
                      <motion.span
                        initial={{ opacity: 1, width: 'auto' }}
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
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full justify-start">
          <div className={`flex items-center justify-center w-8 h-8 transition-all ${isCollapsed ? "mx-auto" : "mr-2"}`}>
            <Home className="h-4 w-4" />
          </div>
          <motion.span
            initial={{ opacity: 1 }}
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

export default Sidebar
