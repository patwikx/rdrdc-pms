'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, CheckCircle, Users, BarChart3, Menu, X, Home, MapPin, DollarSign, Briefcase, Facebook, Instagram, Mail, Clock, Phone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPromoModal(true);
    }, 5000);
  
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const countdownDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  const transition = { duration: 0.7 }

  const staggerChildren: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2
      }
    }
  }

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
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

  const promos = [
    {
      title: "New Commercial Lease Discount",
      description: "20% off on first month's rent for new commercial leases",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Free Property Management",
      description: "Enjoy free property management services for the first 3 months",
      icon: Clock,
      color: "bg-green-500",
    },
    {
      title: "Land Development Consultation",
      description: "Special rates on land development consultations",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
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
                      <Building2 className="h-8 w-auto text-blue-600" />
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

        {/* Property Types section */}
        <section id="properties" className="py-12 bg-white">
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

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <Image src='/rdrdc.png' alt='Logo' width={30} height={30} />
                <span className="ml-2 text-md font-bold text-white">RD REALTY DEVELOPMENT CORPORATION</span>
              </div>
              <p className="text-gray-400 text-base">
                RD REALTY DEVELOPMENT CORPORATION
                <br />
                Your premier partner in real estate solutions.
              </p>
              <div className="flex space-x-6">
                <a href="https://www.facebook.com/RDRealty" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/RDRealty" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="mailto:marketing@rdrealty.com.ph" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Email</span>
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Properties</h3>
                  <ul role="list" className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Commercial
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Residential
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Land
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Featured Listings
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Services</h3>
                  <ul role="list" className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Property Management
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Tenant Screening
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Financial Reporting
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Maintenance Coordination
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul role="list" className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Partners
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        News
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul role="list" className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Data Privacy Act
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 RD REALTY DEVELOPMENT CORPORATION. All rights reserved.
            </p>
            <p className="mt-2 text-sm text-gray-400 xl:text-center">
              General Santos Business Park, General Santos City, Philippines, 9500
            </p>
            <p className="mt-2 text-sm text-gray-400 xl:text-center">
              We comply with the Data Privacy Act of 2012 (Republic Act No. 10173)
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showPromoModal && (
          <Dialog open={showPromoModal} onOpenChange={setShowPromoModal}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-6"
              >
                <motion.div variants={contentVariants} initial="hidden" animate="visible">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                      <motion.span 
                        className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Exclusive Offers Just for You!
                      </motion.span>
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                      Dont miss out on these limited-time deals
                    </DialogDescription>
                  </DialogHeader>
                  <motion.div className="mt-6 space-y-4">
                    {promos.map((promo, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-center p-4">
                              <div className={`${promo.color} p-3 rounded-full mr-4`}>
                                <promo.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{promo.title}</h3>
                                <p className="text-sm text-gray-600">{promo.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div className="mt-6 text-center" variants={itemVariants}>
                    <Badge variant="outline" className="text-sm mb-2">Limited Time Offer</Badge>
                    <div className="text-2xl font-bold mb-2">
                      {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      These offers expire on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                    <Button 
                      onClick={() => setShowPromoModal(false)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      Claim Your Offer Now
                    </Button>
                  </motion.div>
                  <motion.div className="mt-4 text-center" variants={itemVariants}>
                    <button 
                      onClick={() => setShowPromoModal(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    >
                      No, thanks. Ill check later
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}