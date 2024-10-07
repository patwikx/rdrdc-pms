'use client'

import Image from 'next/image'
import { motion,  Variants } from 'framer-motion'

export default function NotableClientPage() {

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

  const clientLogos = [
    '/rdrdc.png', '/rdrdc.png', '/rdrdc.png',
    '/rdrdc.png', '/rdrdc.png', '/rdrdc.png',
    '/rdrdc.png', '/rdrdc.png', '/rdrdc.png',
    '/rdrdc.png', '/rdrdc.png', '/rdrdc.png',
    '/rdrdc.png', '/rdrdc.png', '/rdrdc.png',
  ]

  return (
    <div className="flex flex-col">
      <main className="flex-grow">
                {/* Notable Clients section */}
                <section className="py-12 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="lg:text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Clients</motion.h2>
              <motion.p variants={fadeIn} className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by Industry Leaders
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              className="flex overflow-hidden"
            >
              <motion.div
                animate={{
                  x: [0, -1920],
                  transition: {
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear",
                    },
                  },
                }}
                className="flex"
              >
                {clientLogos.concat(clientLogos).map((logo, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="w-20 sm:w-40 h-20 mx-4 flex items-center justify-center"
                  >
                    <Image
                      src={logo}
                      alt={`Client ${index + 1}`}
                      width={120}
                      height={60}
                      className="max-w-full max-h-full object-contain"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
        </main>
    </div>
  )
}