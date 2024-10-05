'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Home, 
  Calendar, 
  DollarSign, 
  FileText, 
  Phone,
  Mail,
  MoreHorizontal,
  Plus
} from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  property: string;
  unit: string;
  rentAmount: number;
  status: 'active' | 'late' | 'pending';
}

// Mock data for tenants
const tenants: Tenant[] = [
  { id: 1, name: "Larry Paler", email: "lpaler@gmail.com", phone: "(555) 123-4567", moveInDate: "2022-01-15", property: "Tambykez", unit: "A101", rentAmount: 1500, status: 'active' },
  { id: 2, name: "Jimster Santillan", email: "jsantillan@gmail.com", phone: "(555) 987-6543", moveInDate: "2021-11-01", property: "PAG-IBIG Office", unit: "B205", rentAmount: 2000, status: 'late' },
  { id: 3, name: "Kristian Quizon", email: "kquizon@gmail.com", phone: "(555) 246-8135", moveInDate: "2022-03-10", property: "RD Retail Campang Ext.", unit: "C303", rentAmount: 2500, status: 'active' },
  { id: 4, name: "Argie Tacay", email: "atacay@gmail.com", phone: "(555) 369-2580", moveInDate: "2022-05-20", property: "7-11 Daproza Avenue", unit: "D404", rentAmount: 1800, status: 'pending' },
  { id: 5, name: "Cezar Regalado", email: "cregalado@gmail.com", phone: "(555) 159-7531", moveInDate: "2021-09-01", property: "RD Hardware Santiago", unit: "A202", rentAmount: 1600, status: 'active' },
]

const statusColors = {
  active: 'bg-green-500',
  late: 'bg-red-500',
  pending: 'bg-yellow-500'
}

export default function TenantsPage() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col p-6'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='text-3xl font-bold mb-4'>Tenants</h1>
          <Separator className='mb-6' />
        </motion.div>
        <div className='flex-1 flex space-x-6 overflow-hidden'>
          {/* Tenant List (Left Side) */}
          <Card className='w-1/3 flex flex-col'>
            <CardHeader>
              <div className='flex items-center space-x-2'>
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-grow"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Search tenants</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-[calc(100vh-13rem)]">
                <AnimatePresence>
                  {filteredTenants.map((tenant) => (
                    <motion.div
                      key={tenant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className={`p-4 cursor-pointer hover:bg-accent flex items-center ${selectedTenant?.id === tenant.id ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${tenant.name}`} alt={tenant.name} />
                          <AvatarFallback>{tenant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium truncate">{tenant.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{tenant.property} - Unit {tenant.unit}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Tenant Details (Right Side) */}
          <Card className='flex-1 flex flex-col'>
            <AnimatePresence mode="wait">
              {selectedTenant ? (
                <motion.div
                  key={selectedTenant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <CardHeader className="flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">{selectedTenant.name}</h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-muted-foreground">{selectedTenant.email}</p>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-auto">
                    <ScrollArea className="h-full">
                      <div className="space-y-6">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                          <div className="space-y-2">
                            <p className="flex items-center"><Phone className="mr-2 h-4 w-4" /> {selectedTenant.phone}</p>
                            <p className="flex items-center"><Mail className="mr-2 h-4 w-4" /> {selectedTenant.email}</p>
                          </div>
                        </section>
                        <Separator />
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Lease Information</h3>
                          <div className="space-y-2">
                            <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Move-in Date: {selectedTenant.moveInDate}</p>
                            <p className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4" /> 
                              Rent Amount: ₱{new Intl.NumberFormat('en-PH', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              }).format(selectedTenant.rentAmount)}
                            </p>
                            <p className="flex items-center"><Home className="mr-2 h-4 w-4" /> {selectedTenant.property} - Unit {selectedTenant.unit}</p>
                          </div>
                        </section>
                        <Separator />
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Documents</h3>
                          <ul className="space-y-2">
                            {['Lease Agreement', 'Rent Payment History', 'Property Inspection Report'].map((doc) => (
                              <li key={doc} className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>{doc}</span>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="link" className="ml-auto" onClick={() => setSelectedDocument(doc)}>View</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{doc}</DialogTitle>
                                      <DialogDescription>
                                        This is the content of the {doc}.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="secondary">Close</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center h-full"
                >
                  <p className="text-muted-foreground">Select a tenant to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </main>
    </div>
  )
}