'use client'


import { Button } from '@/components/ui/button'
import { motion, Variants } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

export default function FeaturedProperties() {

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
          {/* Featured Properties section */}
          <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="lg:text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-base text-blue-600 font-semibold tracking-wide uppercase">Featured Listings</motion.h2>
              <motion.p variants={fadeIn} className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Discover Our Prime Properties
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  name: "General Santos Business Park",
                  type: "Commercial",
                  location: "General Santos Business Park, General Santos City",
                  price: "Contact us for pricing.",
                  image: "/rd1.jpg",
                },
                {
                  name: "Norfolk Pine",
                  type: "Residential",
                  location: " Brgy. Sinawal, General Santos City,",
                  price: "Contact us for pricing.",
                  image: "/rd2.jpg",
                },
                {
                  name: "RD City",
                  type: "Land",
                  location: "Polomolok, South Cotabato",
                  price: "Contact us for pricing.",
                  image: "/rd4.jpg",
                },
              ].map((property, index) => (
                <motion.div key={index} variants={fadeIn} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                    <p className="text-gray-600">{property.type}</p>
                    <p className="text-gray-600"><MapPin className="inline-block w-4 h-4 mr-1" />{property.location}</p>
                    <p className="text-blue-600 font-bold mt-2">{property.price}</p>
                    <Button className="mt-4 w-full">View Details</Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        </main>
    </div>
  )
}