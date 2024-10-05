'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Building, Search, Bed, Bath, Square } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { CreateProperty } from './create-property'

// Define a type for properties
type Property = {
  id: number;
  name: string;
  address: string;
  type: string;
  units: number;
  occupancy: string;
  rent: number;
}

// Mock data for properties
const properties: Property[] = [
  { id: 1, name: "Tambykez", address: "General Santos Business Park", type: "Commercial Bldg.", units: 50, occupancy: "90%", rent: 1500 },
  { id: 2, name: "PAG-IBIG Office", address: "General Santos Business Park", type: "Commercial Bldg.", units: 30, occupancy: "95%", rent: 2000 },
  { id: 3, name: "RD Retail Cagampang Ext.", address: "Cagampang Ext.", type: "Commercial Bldg.", units: 1, occupancy: "100%", rent: 5000 },
  { id: 4, name: "7-11 Daproza Avenue", address: "Daproza Avenue", type: "Commercial Bldg.", units: 20, occupancy: "85%", rent: 2500 },
  { id: 5, name: "RD Hardware Santiago", address: "Santiago Boulevard", type: "Commercial Bldg.", units: 15, occupancy: "93%", rent: 1800 }
];

const PropertyList = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
      <div className='mt-4 mb-4'>
        <div className="flex items-center justify-between mb-4 ml-4">
          <h1 className='text-3xl font-bold'>Properties</h1>
          <div className='mr-8'>
          <CreateProperty />
          </div>

        </div>
        <Separator className='mb-[-17px]' />
      </div>
        <div className='flex-1 flex overflow-hidden'>
          <div className='w-1/3 border-r p-4 flex flex-col'>
            <div className='mb-4 flex items-center'>
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button size="icon" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              {filteredProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className={`mb-4 cursor-pointer hover:bg-accent ${selectedProperty?.id === property.id ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <CardDescription>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{property.type} | {property.units} units</p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
          <div className='flex-1 p-6 overflow-auto'>
            {selectedProperty ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}  // Starting state of the animation
                animate={{ opacity: 1, y: 0 }}   // End state of the animation
                transition={{ duration: 0.5 }}   // Duration of the animation
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Building className="mr-2 h-6 w-6" />
                      {selectedProperty.name}
                    </CardTitle>
                    <CardDescription>{selectedProperty.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Property Details</h3>
                        <p><strong>Type:</strong> {selectedProperty.type}</p>
                        <p><strong>Total Units:</strong> {selectedProperty.units}</p>
                        <p><strong>Occupancy Rate:</strong> {selectedProperty.occupancy}</p>
                        <p>
                          <strong>Rent:</strong> ₱{new Intl.NumberFormat('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          }).format(selectedProperty.rent)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Amenities</h3>
                        <ul className="list-disc list-inside">
                          <li>Swimming Pool</li>
                          <li>Fitness Center</li>
                          <li>Covered Parking</li>
                          <li>Pet Friendly</li>
                        </ul>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-semibold mb-2">Available Units</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((unit) => (
                          <Card key={unit}>
                            <CardHeader>
                              <CardTitle className="text-lg">Unit {unit}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="flex items-center"><Bed className="mr-2 h-4 w-4" /> 2 Bedrooms</p>
                              <p className="flex items-center"><Bath className="mr-2 h-4 w-4" /> 2 Bathrooms</p>
                              <p className="flex items-center"><Square className="mr-2 h-4 w-4" /> 1000 sq ft</p>
                              <Button className="mt-2 w-full">View Details</Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a property to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PropertyList
