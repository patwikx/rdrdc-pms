'use client'

import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
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
  Plus,
  Building,
  MapPin,
  User,
  Lock,
  Clock
} from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  contactNo: string | null;
  companyName: string | null;
  address: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: 'Administrator' | 'Manager' | 'Supervisor' | 'Tenant' | 'Staff' | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;
  space: Array<{
    id: string;
    spaceNumber: string;
    spaceArea: string;
    spaceRate: string | null;
    totalSpaceRent: number | null;
    spaceStatus: string | null;
    spaceRemarks: string | null;
    property: {
      id: string;
      propertyName: string;
      address: string;
      city: string;
      province: string;
    };
  }>;
  lease: Array<{
    id: string;
    rent: number;
    status: string;
    leaseStart: string | null;
    leaseEnd: string | null;
  }>;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    try {
      const response = await axios.get<Tenant[]>('/api/fetch-tenants')
      setTenants(response.data)
    } catch (error) {
      console.error('Error fetching tenants:', error)
    }
  }, [])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const filteredTenants = tenants.filter(tenant =>
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                          <AvatarImage src={tenant.image || `https://api.dicebear.com/6.x/initials/svg?seed=${tenant.firstName} ${tenant.lastName}`} alt={`${tenant.firstName} ${tenant.lastName}`} />
                          <AvatarFallback>{tenant.firstName[0]}{tenant.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium truncate">{tenant.firstName} {tenant.lastName}</p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {tenant.space[0]?.property.propertyName} - Unit {tenant.space[0]?.spaceNumber}
                          </p>
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
                      <h2 className="text-2xl font-bold">{selectedTenant.firstName} {selectedTenant.lastName}</h2>
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
                            <p className="flex items-center"><Phone className="mr-2 h-4 w-4" /> {selectedTenant.contactNo || 'N/A'}</p>
                            <p className="flex items-center"><Mail className="mr-2 h-4 w-4" /> {selectedTenant.email}</p>
                            <p className="flex items-center"><Building className="mr-2 h-4 w-4" /> {selectedTenant.companyName || 'N/A'}</p>
                            <p className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {selectedTenant.address || 'N/A'}</p>
                          </div>
                        </section>
                        <Separator />
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                          <div className="space-y-2">
                            <p className="flex items-center"><User className="mr-2 h-4 w-4" /> Role: {selectedTenant.role || 'N/A'}</p>
                            <p className="flex items-center"><Lock className="mr-2 h-4 w-4" /> Two-Factor Auth: {selectedTenant.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                          </div>
                        </section>
                        <Separator />
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Lease Information</h3>
                          <div className="space-y-2">
                            {selectedTenant.lease.map((lease, index) => (
                              <div key={lease.id} className="bg-accent p-3 rounded-md">
                                <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Lease {index + 1}: {lease.leaseStart || 'N/A'} - {lease.leaseEnd || 'N/A'}</p>
                                <p className="flex items-center">
                                  <DollarSign className="mr-2 h-4 w-4" /> 
                                  Rent Amount: ₱{new Intl.NumberFormat('en-PH', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                  }).format(lease.rent)}
                                </p>
                                <p className="flex items-center"><Home className="mr-2 h-4 w-4" /> Status: {lease.status}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        <Separator />
                        <section>
                          <h3 className="text-lg font-semibold mb-2">Space Information</h3>
                          <div className="space-y-2">
                            {selectedTenant.space.map((space) => (
                              <div key={space.id} className="bg-accent p-3 rounded-md">
                                <p className="flex items-center"><Home className="mr-2 h-4 w-4" /> {space.property.propertyName} - Unit {space.spaceNumber}</p>
                                <p className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {space.property.address}, {space.property.city}, {space.property.province}</p>
                                <p className="flex items-center">Area: {space.spaceArea}</p>
                                <p className="flex items-center">Rate: {space.spaceRate || 'N/A'}</p>
                                <p className="flex items-center">Total Rent: ₱{space.totalSpaceRent ? new Intl.NumberFormat('en-PH', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(space.totalSpaceRent) : 'N/A'}</p>
                                <p className="flex items-center">Status: {space.spaceStatus || 'N/A'}</p>
                                <p className="flex items-center">Remarks: {space.spaceRemarks || 'N/A'}</p>
                              </div>
                            ))}
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
                  <p  className="text-muted-foreground">Select a tenant to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </main>
    </div>
  )
}