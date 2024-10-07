'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Phone, Mail, Facebook, Instagram, Send, Minus, MessageCircle, User, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500) // Show after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  const toggleMinimize = () => setIsMinimized(!isMinimized)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Message submitted:', message)
    setMessage('')
  }

  const contactInfo = [
    { icon: Phone, text: '+63 (083) 552-3548', href: 'tel:+63083552354' },
    { icon: Mail, text: 'marketing@rdrealty.com.ph', href: 'mailto:marketing@rdrealty.com.ph' },
    { icon: Facebook, text: 'RD Realty Development Corporation', href: 'https://www.facebook.com/RDRealty' },
    { icon: Instagram, text: '@rdrealty', href: 'https://www.instagram.com/rdrealty' },
  ]

  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={chatVariants}
          className="fixed bottom-4 right-4 z-50"
        >
          <AnimatePresence mode="wait">
            {isMinimized ? (
              <motion.div
                key="minimized"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={toggleMinimize}
                  className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 relative bg-gradient-to-r from-blue-500 to-blue-600"
                  aria-label="Open chat"
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/messenger.svg" alt="RD Realty logo" />
                    <AvatarFallback>RD</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    1
                  </Badge>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Card className="w-80 shadow-2xl border-none overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src="/rdrdc.png" alt="RD Realty logo" />
                          <AvatarFallback>RD</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-bold">RD Realty</CardTitle>
                          <p className="text-xs text-blue-100">Online Now</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMinimize}
                          className="text-white hover:bg-white/20"
                          aria-label="Minimize chat"
                        >
                          <Minus size={20} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4 mb-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700">Welcome to RD Realty! How can we assist you today?</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {contactInfo.map((item, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors bg-white p-2 rounded-md shadow-sm hover:shadow-md"
                              >
                                <item.icon className="mr-2 h-4 w-4 text-blue-500" />
                                {item.text}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to {item.icon === Phone ? 'call' : item.icon === Mail ? 'email' : 'visit'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="flex items-end space-x-2">
                        <Textarea
                          placeholder="Type your message here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-grow resize-none border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                        />
                      </div>
                      <div className='mt-4'>
                      <Button type="submit" size="icon" className="w-full">
                        Send message. 
                          <Send className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-500 p-2 bg-gray-100 flex justify-between items-center">
                    <span className="italic">We typically reply within 24 hours.</span>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      <User className="h-4 w-4 mr-1" /> Login
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}