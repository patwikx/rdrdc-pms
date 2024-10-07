'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function HeroPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  const staggerChildren: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="/" className="flex items-center">
                <Image src='/rdrdc.png' alt='Logo' width={30} height={30} />
                <span className="ml-2 text-lg font-bold text-gray-900 hidden sm:inline">RD REALTY DEVELOPMENT CORPORATION</span>
                <span className="ml-2 text-lg font-bold text-gray-900 sm:hidden">RD REALTY DEVELOPMENT CORPORATION</span>
              </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">Home</a>
              <a href="#properties" className="text-base font-medium text-gray-500 hover:text-gray-900">Properties</a>
              <a href="#services" className="text-base font-medium text-gray-500 hover:text-gray-900">Services</a>
              <a href="#about" className="text-base font-medium text-gray-500 hover:text-gray-900">About</a>
              <a href="#contact" className="text-base font-medium text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Button onClick={() => router.push('/auth/login')}>Login</Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Image src='/rdrdc.png' alt='Logo' width={30} height={40} />
                    </div>
                    <div className="-mr-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-8">
                      {['Home', 'Properties', 'Services', 'About', 'Contact'].map((item) => (
                        <a
                          key={item}
                          href={`#${item.toLowerCase()}`}
                          className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="ml-3 text-base font-medium text-gray-900">{item}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5 space-y-6">
                  <Button className="w-full" onClick={() => router.push('/auth/login')}>Login</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              className="lg:w-0 lg:flex-1"
            >
              <motion.h1 variants={fadeIn} className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                <span className="block">Your Premier</span>
                <span className="block text-blue-600">Real Estate Partner</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="mt-3 max-w-lg text-lg text-gray-500 mb-4">
                RD REALTY DEVELOPMENT CORPORATION offers a wide range of commercial, residential, and land properties for rent. Find your perfect space with us.
              </motion.p>
              <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-4">
                <Button className="w-full sm:w-auto">Schedule Viewing</Button>
                <Button className="w-full sm:w-auto">Explore Properties</Button>
                <Button variant="outline" className="w-full sm:w-auto">Our Services</Button>
              </motion.div>
            </motion.div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <Image
                  src="/rd0.jpg"
                  alt="RD Realty Properties Showcase"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>
        </main>
    </div>
  )
}