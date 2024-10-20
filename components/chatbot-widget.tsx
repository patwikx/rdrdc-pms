'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X, Phone, Mail, Facebook, Instagram } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
}

interface ContactInfo {
  icon: typeof Phone | typeof Mail | typeof Facebook | typeof Instagram
  text: string
  href: string
}

const faqData: Record<string, string> = {
  "Who are you?": "I'm a chatbot for RD Realty Development Corporation. I can answer questions about our properties and services.",
  "What properties do you offer?": "We offer a wide range of properties including land, residential, and commercial spaces. Our portfolio includes properties in various locations across the region.",
  "How can I schedule a viewing?": "To schedule a viewing, please contact our marketing team at +639 123 456 789 or email us at marketing@rdrealty.com.ph. We'll be happy to arrange a convenient time for you.",
  "What are your office hours?": "Our office is open Monday to Saturday from 7:30 AM to 5:10 PM. We're closed on sundays and public holidays.",
  "Do you offer financing options?": "Yes, we work with several partner banks to offer financing options. Our sales team can provide more details and help you find the best option for your needs.",
  "Where are you located?": "Our main office is located in General Santos Business Park, General Santos City, Philippines.",
  "What sets RD Realty apart from other developers?": "RD Realty is known for our commitment to quality, innovative designs, and excellent customer service. We have a strong track record of delivering projects on time and to the highest standards.",
}

const contactInfo: ContactInfo[] = [
  { icon: Phone, text: '+63 (083) 552-3548', href: 'tel:+63083552354' },
  { icon: Mail, text: 'marketing@rdrealty.com.ph', href: 'mailto:marketing@rdrealty.com.ph' },
  { icon: Facebook, text: 'RD Realty Development Corporation', href: 'https://www.facebook.com/RDRealty' },
  { icon: Instagram, text: '@rdrealty', href: 'https://www.instagram.com/rdrealty' },
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: "Hello! Welcome to RD Realty. How can I assist you today? You can also check out our FAQs below." }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent, question?: string) => {
    e.preventDefault()
    const userInput = question || input.trim()
    if (userInput === '') return

    const userMessage: ChatMessage = { role: 'user', content: userInput }
    setMessages(prev => [...prev, userMessage])

    let botResponse = "I'm sorry, I don't have information about that. Would you like to speak with a human representative?"

    if (userInput.toLowerCase().includes('contact') || userInput.toLowerCase().includes('details')) {
      botResponse = "Here are our contact details:"
      for (const contact of contactInfo) {
        botResponse += `\n${contact.text}`
      }
    } else {
      for (const [key, value] of Object.entries(faqData)) {
        if (userInput.toLowerCase() === key.toLowerCase()) {
          botResponse = value
          break
        }
      }
    }

    const botMessage: ChatMessage = { role: 'bot', content: botResponse }
    setMessages(prev => [...prev, botMessage])

    setInput('')
  }

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
      {isOpen ? (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={chatVariants}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="w-96 shadow-2xl border-none overflow-hidden bg-white">
            <CardHeader className="bg-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="/rdrdc.png" alt="RD Realty logo" />
                    <AvatarFallback>RD</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-bold">RD Realty Chat</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] pr-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'bot' && (
                      <Avatar className="mr-2">
                        <AvatarImage src="/rdrdc.png" alt="RD Realty logo" />
                        <AvatarFallback>RD</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="ml-2">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Frequently Asked Questions:</h3>
                <ScrollArea className="h-[150px]">
                  {Object.keys(faqData).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left mb-1 text-sm"
                      onClick={(e) => handleSubmit(e, question)}
                    >
                      {question}
                    </Button>
                  ))}
                </ScrollArea>
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message here..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e)
                      }
                    }}
                    className="flex-grow"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600"
            aria-label="Open chat"
          >
            <MessageCircle className="text-white" size={24} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}