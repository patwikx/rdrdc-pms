'use client'

import React, { useState } from 'react'
import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
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
  MoreHorizontal
} from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'


interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  property: string;
  unit: string;
  rentAmount: number;
}

// Mock data for tenants
const tenants = [
  { id: 1, name: "Larry Paler", email: "lpaler@gmail.com", phone: "(555) 123-4567", moveInDate: "2022-01-15", property: "Tambykez", unit: "A101", rentAmount: 1500 },
  { id: 2, name: "Jimster Santillan", email: "jsantillan@gmail.com", phone: "(555) 987-6543", moveInDate: "2021-11-01", property: "PAG-IBIG Office", unit: "B205", rentAmount: 2000 },
  { id: 3, name: "Kristian Quizon", email: "kquizon@gmail.com", phone: "(555) 246-8135", moveInDate: "2022-03-10", property: "RD Retail Campang Ext.", unit: "C303", rentAmount: 2500 },
  { id: 4, name: "Argie Tacay", email: "atacay@gmail.com", phone: "(555) 369-2580", moveInDate: "2022-05-20", property: "7-11 Daproza Avenue", unit: "D404", rentAmount: 1800 },
  { id: 5, name: "Cezar Regalado", email: "cregalado@gmail.com", phone: "(555) 159-7531", moveInDate: "2021-09-01", property: "RD Hardware Santiago", unit: "A202", rentAmount: 1600 },
]

const TenantsForm = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
      <div className='mt-4 mb-4'>
        <h1 className='text-3xl font-bold mb-4 ml-4'>Tenants</h1>
        <Separator className='mb-[-17px]' />
      </div>
        <div className='flex-1 flex overflow-hidden'>
          {/* Tenant List (Left Side) */}

          <Card className='w-1/3 border-r flex flex-col ml-4 mr-4 mt-4 mb-4'>

          <div className='mb-4 flex items-center p-4'>
              <Input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button size="icon" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow">
        
              {filteredTenants.map((tenant) => (
                <div 
                  key={tenant.id} 
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
                      <span className="text-xs text-muted-foreground">{tenant.moveInDate}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{tenant.property} - Unit {tenant.unit}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Tenant Details (Right Side) */}
          <Card className='flex-1 flex flex-col mr-4 mt-4 mb-4'>
            {selectedTenant ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{selectedTenant.name}</h2>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{selectedTenant.email}</p>
                </div>
                <ScrollArea className="flex-grow p-6">
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
                        <li className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Lease Agreement</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="ml-auto" onClick={() => setSelectedDocument("Lease Agreement")}>View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Lease Agreement</DialogTitle>
                                <DialogDescription>
                                  This is the content of the Lease Agreement.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="secondary">Close</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </li>
                        <li className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Rent Payment History</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="ml-auto" onClick={() => setSelectedDocument("Rent Payment History")}>View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rent Payment History</DialogTitle>
                                <DialogDescription>
                                  This is the Rent Payment History content.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="secondary">Close</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </li>
                        <li className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Property Inspection Report</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="ml-auto" onClick={() => setSelectedDocument("Property Inspection Report")}>View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Property Inspection Report</DialogTitle>
                                <DialogDescription>
                                  This is the Property Inspection Report content.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="secondary">Close</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </li>
                      </ul>
                    </section>
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Select a tenant to view details</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default TenantsForm;
