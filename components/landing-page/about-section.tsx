'use client'

import { Button } from '@/components/ui/button'
import { motion, Variants } from 'framer-motion'


export default function AboutUsPage() {
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
 {/* About section */}
 <section id="about" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="lg:text-center"
            >
              <motion.h2 
                variants={fadeIn} 
                className="text-base text-blue-600 font-semibold tracking-wide uppercase"
              >
                About Us
              </motion.h2>
              <motion.p 
                variants={fadeIn} 
                className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8"
              >
                Your Trusted Real Estate Partner
              </motion.p>
            </motion.div>

            <div className="mt-10 flex flex-col sm:flex-row gap-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex-1 bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-lg text-gray-600 mb-4">
                  RD Realty Development Corporation was established & registered in June 24, 1985 and is one of the subsidiaries of RD Group of Companies under the management and direction of Mr. Roy C. Rivera.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  RD Realty Development Corporation is a member of RD Group of Companies that engaged in the development of real estate projects, property management, and construction of many of the companys future developments. It has grown into a very integrated company providing employment to over 250 people.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  RD Realty Development Corporation is the property holding firm of the Realty Development Group. It is the largest property owner and considered as the trendsetter in the leasing industry in General Santos City which today operates a growing inventory of 45,000 sqm leasable building spaces across the country and overseas.
                </p>
                <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Learn More About Us
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        </main>
    </div>
  )
}