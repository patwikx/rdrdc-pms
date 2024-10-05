'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';  // Import framer-motion
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Building, Search, MapPin, LandPlot } from 'lucide-react';
import { CreatePropertyForm } from './register-form';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import PropertyLoadingSkeleton from '@/components/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { Property, Space } from '@/types/type';


const PropertyList = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/fetch-properties');
        setProperties(response.data);
        
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property =>
    property.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateOccupancyRate = (spaces: Space[]) => {
    const totalUnits = spaces.length;
    const occupiedUnits = spaces.filter(space => space.spaceStatus === 'Occupied').length;
    return totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(2) : 0;
  };

  // Animation variants for staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Add 1 second delay between cards
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },  // Each card takes 0.5s to animate
  };

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
        <div className='mt-4 mb-4'>
          <div className="flex items-center justify-between mb-4 ml-4">
            <h1 className='text-3xl font-bold'>Properties</h1>
            <div className='mr-8'>
              <CreatePropertyForm />
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
              {loading ? (
                <Suspense fallback={<PropertyLoadingSkeleton />}>
                  {[...Array(5)].map((_, i) => <PropertyLoadingSkeleton key={i} />)}
                </Suspense>
              ) : (
                filteredProperties.map((property) => (
                  <Card 
                    key={property.id} 
                    className={`mb-4 cursor-pointer hover:bg-accent ${selectedProperty?.id === property.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{property.propertyName}</CardTitle>
                      <CardDescription className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" /> {/* Add margin to the right of the icon */}
                      {property.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground"><Badge>{property.propertyType}</Badge> | <Badge variant='pending'>{property.space.length} space</Badge></p>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </div>
          <div className='flex-1 p-6 overflow-auto'>
            <ScrollArea>
              {selectedProperty ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}  
                  animate={{ opacity: 1, y: 0 }}   
                  transition={{ duration: 0.5 }}  
                >
                  <Card>
                    <CardHeader>
                    <CardTitle className="text-2xl flex flex-col items-start justify-between mr-16">
  <div className="flex items-center">
    <Building className="mr-2 h-6 w-6" />
    {selectedProperty.propertyName}
  </div>

  {/* Place address details directly under the property name */}
  <div className="mt-2">
    <CardDescription>{selectedProperty.address}</CardDescription>
    <CardDescription>{selectedProperty.city}</CardDescription>
    <CardDescription>{selectedProperty.province}</CardDescription>
  </div>
</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex gap-2"> {/* Use flex for side by side layout */}
  <div className="flex-1"> {/* Left section for Property Details */}
    <h3 className="font-semibold text-lg mb-2">Property Details</h3>
    <p><strong>Type:</strong> {selectedProperty.propertyType}</p>
    <p><strong>Total Units:</strong> {selectedProperty.space.length}</p>
    <p><strong>Occupancy Rate:</strong> {calculateOccupancyRate(selectedProperty.space)}%</p>
    <p>
      <strong>Rent:</strong> ₱{new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(selectedProperty.rent)}
    </p>
  </div>
  
  <div className="flex-1"> {/* Right section for RPT Details */}
    <h3 className="font-semibold text-lg mb-2">RPT Details</h3>
    {selectedProperty.rpt.map((rptDetail) => (
      <div key={rptDetail.id}>
        <p><strong>Tax Dec No:</strong> {rptDetail.TaxDecNo}</p>
        <p><strong>Payment Mode:</strong> {rptDetail.PaymentMode}</p>
        <p><strong>Due Date:</strong> {rptDetail.DueDate}</p>
        <p><strong>Status:</strong> {rptDetail.Status}</p>
        <p><strong>Remarks:</strong> {rptDetail.custodianRemarks || 'N/A'}</p>
      </div>
    ))}
  </div>
    {/* Keep the carousel on the right */}
    <div className="ml-auto mt-[-116px]">
    <Carousel className="w-[330px] mr-8">
  <CarouselContent>
    {Array.isArray(selectedProperty.attachments) && selectedProperty.attachments.length > 0 ? (
      selectedProperty.attachments.map((attachment) => (
        <CarouselItem key={attachment.id}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}  // Initial state
            animate={{ opacity: 1, scale: 1 }}    // Animated state
            exit={{ opacity: 0, scale: 0.8 }}      // Exit state
            transition={{ duration: 0.3 }}         // Transition duration
            className="p-1"
          >
            <Card>
              <CardContent className="flex aspect-[16/9] items-center justify-center p-4">
                <Image
                  src={attachment.files}
                  alt={`Image for ${selectedProperty.propertyName}`}
                  layout="responsive"
                  width={300}
                  height={150}
                  className="object-cover"
                  onError={() => console.error(`Failed to load image: ${attachment.files}`)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </CarouselItem>
      ))
    ) : (
      <div className="flex items-center justify-center w-full h-full">
        <p>No images available for this property.</p>
      </div>
    )}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
  </div>
</div>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold mb-2">List of spaces</h3>
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {selectedProperty.space.map((unit) => (
                            <motion.div key={unit.id} variants={cardVariants}>
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">{unit.spaceNumber}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className='flex'>
                                    <p className="flex items-center">
                                      <LandPlot className="mr-2 h-4 w-4" /> {unit.spaceArea} sq ft
                                    </p>
                                    <Badge className={`ml-20 ${unit.spaceStatus === 'Occupied' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                      {unit.spaceStatus}
                                    </Badge>
                                  </div>
                                  <Button className="mt-2 w-full">View Details</Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a property to view details</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyList;