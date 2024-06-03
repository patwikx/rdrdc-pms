import { auth } from '@/auth';
import Header, { Headerx } from '@/components/header/header';
import TeamSwitcher from '@/components/header/team-switcher';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Building, Building2, Home, LineChart, Package, Package2, PanelLeft, Search, Settings, ShoppingCart, Users2 } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Toaster } from 'sonner';



const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div>
      <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} w-full h-full`}>
        <div>
        <Toaster />
        <TooltipProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 sm:py-4">
          <Image alt='rdrdc-logo' src='/assets/rdrdc-logo.png' width={7200} height={7200} />
          <Link
            href="/dashboard"
          >
            <span className="sr-only">RD Realty Development Corporation</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground  hover:bg-muted md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/property-management"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground hover:bg-muted md:h-8 md:w-8"
              >
                <Building2 className="h-5 w-5" />
                <span className="sr-only">Property Management</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Property Manangement</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:h-8 md:w-8"
              >
                <Building className="h-5 w-5" />
                <span className="sr-only">Space Management</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Space Management</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/tenant-management"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:h-8 md:w-8"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Tenant Management</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tenant Management</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:h-8 md:w-8"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                >
                  <div className='w-[280px]'><TeamSwitcher /></div>
                 
                  <span className="sr-only">RD Realty Development Corporation</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground hover:bg-muted"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/property-management"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground hover:bg-muted"
                >
                  <Building2 className="h-5 w-5" />
                  Property Management
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground hover:bg-muted"
                >
                  <Building className="h-5 w-5" />
                  Space Management
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground hover:bg-muted"
                >
                  <Users2 className="h-5 w-5" />
                  Tenant Management
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground hover:bg-muted"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
    
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <div className="mt-[-6px]">
          <ModeToggle />
          </div>

          <Headerx />
        </header>
        <Separator />
      </div>
            {children}
            </div>
        </ThemeProvider>
        </TooltipProvider>
        </div>
      </body>
    </html>
      </div>
    
    </SessionProvider>
  );
}
