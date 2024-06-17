import { auth } from '@/auth';
import { Navbarx } from '@/components/sidebar/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import {  TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import React from 'react';
import { Toaster } from 'sonner';



const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div>
        <Toaster />
        <TooltipProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbarx />
            {children}
        </ThemeProvider>
        </TooltipProvider>
      </div>
    
    </SessionProvider>
  );
}
