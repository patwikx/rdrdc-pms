'use client'

import { Button } from '@/components/ui/button'
import { motion, Variants } from 'framer-motion'


export default function MissionVisionPage() {
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
{/* Mission and Vision section */}
<section className="py-12 bg-gray-50">
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
                Our Purpose
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              >
                Mission, Vision and Core Values
              </motion.p>
            </motion.div>
            
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  We are committed to a sustainable and profitable real estate development and business transactions through fostering a mutually beneficial relationship with our stakeholders. We aim to uplift the quality of life of the communities where we operate and glorify God in everything we do.
                </p>
              </motion.div>
              
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A diversified real estate company delivering maximum value to customers and stockholders guided by the highest ethical standards of practice and strong faith in God.
                </p>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Core Values</h3>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Integrity</li>
                  <li>Innovation</li>
                  <li>Excellence</li>
                  <li>Interdependence</li>
                  <li>Godliness</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        </main>
    </div>
  )
}