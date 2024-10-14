import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import "@uploadthing/react/styles.css";
import Footer from '@/components/footer/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RD Realty Development Corporation',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
          <Toaster />
          {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
