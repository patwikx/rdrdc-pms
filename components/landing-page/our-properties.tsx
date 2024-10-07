'use client'

import { motion,  Variants } from 'framer-motion'
import { Briefcase, Home, MapPin } from 'lucide-react'

export default function PropertyTypes() {

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
               {/* Property Types section */}
        <section id="properties" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="lg:text-center"
            >
              <motion.h2 variants={fadeIn} className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Properties</motion.h2>
              <motion.p variants={fadeIn} className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Diverse Real Estate Solutions
              </motion.p>
              <motion.p variants={fadeIn} className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Explore our wide range of properties tailored to meet your specific needs.
              </motion.p>
            </motion.div>

            <div className="mt-10">
              <motion.dl
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10"
              >
                {[
                  {
                    name: 'Commercial Buildings',
                    description: 'Prime office spaces and retail locations for your business needs.',
                    icon: Briefcase,
                  },
                  {
                    name: 'Residential Properties',
                    description: 'Comfortable homes and apartments in desirable neighborhoods.',
                    icon: Home,
                  },
                  {
                    name: 'Land for Development',
                    description: 'Strategic land parcels for your next big project or investment.',
                    icon: MapPin,
                  },
                ].map((property) => (
                  <motion.div key={property.name} variants={fadeIn} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <property.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{property.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{property.description}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </section>

        </main>
    </div>
  )
}