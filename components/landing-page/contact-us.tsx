'use client'

import { Button } from '@/components/ui/button'
import { motion, Variants } from 'framer-motion'


export default function ContactUsPage() {
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
      <main className="flex-grow">
     {/* CTA Section */}
     <section id="contact" className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2 variants={fadeIn} className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to find your perfect property?</span>
                <span className="block text-blue-200">Get in touch with us today.</span>
              </motion.h2>
              <motion.p variants={fadeIn} className="mt-4 text-lg leading-6 text-blue-200">
                Lets discuss how RD REALTY DEVELOPMENT CORPORATION can help you with your real estate needs.
              </motion.p>
            </motion.div>
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
            >
              <div className="inline-flex rounded-md shadow">
                <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        </main>
    </div>
  )
}