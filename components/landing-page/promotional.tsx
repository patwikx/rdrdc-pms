'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Clock, DollarSign } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const PromotionalPage = () => {
    const [showPromoModal, setShowPromoModal] = useState(false)
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const timeout = setTimeout(() => {
          setShowPromoModal(true);
        }, 20000);
      
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
    <div className='flex flex-col'>
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

export default PromotionalPage