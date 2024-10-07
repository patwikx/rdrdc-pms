'use client'

import { motion, Variants } from 'framer-motion'
import { BarChart3, Building2, CheckCircle, MapPin, Users } from 'lucide-react'

export default function OurServicesPage() {
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
{/* Services section */}
<section id="services" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="lg:text-center"
            >
              <motion.h2 variants={fadeIn} className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</motion.h2>
              <motion.p variants={fadeIn} className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Comprehensive Real Estate Solutions
              </motion.p>
              <motion.p variants={fadeIn} className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                We offer a range of services to support your real estate needs.
              </motion.p>
            </motion.div>

            <div className="mt-10">
              <motion.dl
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
              >
                {[
                  {
                    name: 'Property Management',
                    description: 'Comprehensive management services for your real estate investments.',
                    icon: Building2,
                  },
                  {
                    name: 'Tenant Screening',
                    description: 'Thorough background checks and selection process for quality tenants.',
                    icon: Users,
                  },
                  {
                    name: 'Financial Reporting',
                    description: 'Detailed financial analysis and reporting for your properties.',
                    icon: BarChart3,
                  },
                  {
                    name: 'Maintenance Coordination',
                    description: 'Efficient handling of property maintenance and repairs.',
                    icon: CheckCircle,
                  },
                ].map((service) => (
                  <motion.div key={service.name} variants={fadeIn} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <service.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{service.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{service.description}</dd>
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