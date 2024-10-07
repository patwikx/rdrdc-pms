'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Building, Search, MapPin, LandPlot, DollarSign, AlertTriangle, Users, FileText } from 'lucide-react';
import { CreatePropertyForm } from './create-property-form';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import PropertyLoadingSkeleton from '@/components/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { Property, RPT, Space } from '@/types/type';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const revalidate = 0;

interface SpaceDetailsDialogProps {
  space: Space;
}

const SpaceDetailsDialog: React.FC<SpaceDetailsDialogProps> = ({ space }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{space.spaceNumber}</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Space Information</TabsTrigger>
                  <TabsTrigger value="rpt">RPT Details</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
  <motion.div variants={cardVariants}>
    <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Space Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
            <LandPlot className="mr-2 h-5 w-5 text-blue-500" />
            <span className="text-lg font-medium text-gray-700">{space.spaceArea} sq ft</span>
          </div>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
            <Badge
              className={`px-2 py-1 rounded-lg text-white text-sm font-medium ${
                space.spaceStatus === 'Occupied' ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {space.spaceStatus}
            </Badge>
          </div>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
            <DollarSign className="mr-2 h-5 w-5 text-green-500" />
            <span className="text-lg font-medium text-gray-700">₱{space.rent}</span>
          </div>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md">
            <Users className="mr-2 h-5 w-5 text-purple-500" />
            <span className="text-lg font-medium text-gray-700">Capacity: 50</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</TabsContent>

                <TabsContent value="rpt">
  <motion.div variants={cardVariants}>
    <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">RPT Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-full">
          {space.rpt && space.rpt.length > 0 ? (
            space.rpt.map((rptDetail, index) => (
              <motion.div
                key={rptDetail.id || index}
                className="p-4 mb-6 bg-gray-50 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-700">Tax Dec No: {rptDetail.TaxDecNo}</h4>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 font-medium mr-2">Status:</span>
                  <Badge className={`px-2 py-1 rounded-md text-white ${
                    rptDetail.Status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {rptDetail.Status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium mr-2">Due Date:</span>
                    <span className="text-gray-800">{rptDetail.DueDate}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">Payment Mode: {rptDetail.PaymentMode}</span>
                  </div>
                </div>
                {rptDetail.custodianRemarks && (
                  <div className="mt-2 flex items-start bg-yellow-100 p-2 rounded-lg">
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-600">{rptDetail.custodianRemarks}</p>
                  </div>
                )}
                {index < space.rpt.length - 1 && <Separator className="my-4" />}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600">No RPT details available for this space.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  </motion.div>
</TabsContent>

              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

const PropertyList = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/fetch-properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mt-4 mb-4'
        >
          <div className="flex items-center justify-between mb-4 ml-4">
            <h1 className='text-3xl font-bold'>Properties</h1>
            <div className='mr-8'>
              <CreatePropertyForm />
            </div>
          </div>
          <Separator className='mb-[-17px]' />
        </motion.div>
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
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filteredProperties.map((property) => (
                      <motion.div
                        key={property.id}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                      >
                        <Card 
                          className={`mb-4 cursor-pointer hover:bg-accent ${selectedProperty?.id === property.id ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedProperty(property)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{property.propertyName}</CardTitle>
                            <CardDescription className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {property.address}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              <Badge>{property.propertyType}</Badge> | <Badge variant='pending'>{property.space.length} space</Badge>
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </ScrollArea>
          </div>
          <div className='flex-1 p-6 overflow-auto'>
            <ScrollArea>
              <AnimatePresence mode="wait">
                {selectedProperty ? (
                  <motion.div
                    key={selectedProperty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl flex flex-col items-start justify-between mr-16">
                          <div className="flex items-center">
                            <Building className="mr-2 h-6 w-6" />
                            {selectedProperty.propertyName}
                          </div>
                          <div className="mt-2">
                            <CardDescription>{selectedProperty.address}</CardDescription>
                            <CardDescription>{selectedProperty.city}</CardDescription>
                            <CardDescription>{selectedProperty.province}</CardDescription>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">

                        <Tabs defaultValue="propertyInfo" className="w-[470px]">
  {/* Tab Headers */}
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="propertyInfo">Property Information</TabsTrigger>
    <TabsTrigger value="rptDetails">RPT Details</TabsTrigger>
  </TabsList>

  {/* Property Information Tab */}
  <TabsContent value="propertyInfo" key="propertyInfo">
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }} // Adjust the duration as needed
    >
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="p-3 border-gray-200">
              <p className="text-gray-600"><strong>Title No.:</strong> {selectedProperty.titleNo}</p>
              <p className="text-gray-600"><strong>Lot No.:</strong> {selectedProperty.lotNo}</p>
              <p className="text-gray-600"><strong>Registered Owner:</strong> {selectedProperty.registeredOwner}</p>
              <p className="text-gray-600"><strong>Type:</strong> {selectedProperty.propertyType}</p>
              <p className="text-gray-600"><strong>Total Units:</strong> {selectedProperty.space.length}</p>
              <p className="text-gray-600"><strong>Occupancy Rate:</strong> {calculateOccupancyRate(selectedProperty.space)}%</p>
              <p className="text-gray-600">
                <strong>Rent:</strong> ₱{new Intl.NumberFormat('en-PH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(selectedProperty.rent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </TabsContent>

  {/* RPT Details Tab */}
  <TabsContent value="rptDetails" key="rptDetails">
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }} // Adjust the duration as needed
    >
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-2">
            {selectedProperty.rpt.map((rptDetail, index) => (
              <div key={rptDetail.id} className={`p-3 ${index < selectedProperty.rpt.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <p className="text-gray-600"><strong>Tax Dec No:</strong> {rptDetail.TaxDecNo}</p>
                <p className="text-gray-600"><strong>Title No.:</strong> {selectedProperty.titleNo}</p>
                <p className="text-gray-600"><strong>Lot No.:</strong> {selectedProperty.lotNo}</p>
                <p className="text-gray-600"><strong>Registered Owner:</strong> {selectedProperty.registeredOwner}</p>
                <p className="text-gray-600"><strong>Payment Mode:</strong> {rptDetail.PaymentMode}</p>
                <p className="text-gray-600"><strong>Due Date:</strong> {rptDetail.DueDate}</p>
                <p className="text-gray-600">
                  <strong>Status:</strong> 
                  <span 
                    className={`ml-2 px-2 py-1 rounded-md text-white text-sm ${rptDetail.Status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  >
                    {rptDetail.Status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </TabsContent>
</Tabs>




                          <div className="ml-auto mt-[-116px]">
                            <Carousel className="w-[330px] mr-8 mt-4">
                              <CarouselContent>
                                {Array.isArray(selectedProperty.attachments) && selectedProperty.attachments.length > 0 ? (
                                  selectedProperty.attachments.map((attachment) => (
                                    <CarouselItem key={attachment.id}>
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
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
                                    <SpaceDetailsDialog space={unit} />
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-full"
                  >
                    <p className="text-muted-foreground">Select a property to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyList;