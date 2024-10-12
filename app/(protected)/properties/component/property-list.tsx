'use client'

import React, { Suspense, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Building, Search, MapPin, LandPlot, PlusCircle, X } from 'lucide-react'
import { CreatePropertyForm } from './create-property-form'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Property, RPT, Space } from '@/types/type'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpaceDetailsSheet } from './space-detail-sheet'
import { EditablePropertyTable } from './editable-property-table'
import { EditableRPTTable } from './editable-property-rpt'
import { PropertyListItem } from './property-list-items'

export const revalidate = 0

interface PropertyListProps {}

const PropertyListx: React.FC<PropertyListProps> = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    try {
      const response = await axios.get<Property[]>('/api/fetch-properties')
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const filteredProperties = properties.filter(property =>
    (property.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedType || property.propertyType === selectedType)
  )

  const propertyTypes = Array.from(new Set(properties.map(p => p.propertyType)))

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType(null)
  }

  const handlePropertyUpdate = async (updatedProperty: Property) => {
    try {
      const response = await axios.put<Property>(`/api/update-property/${updatedProperty.id}`, updatedProperty)
      const updatedPropertyData = response.data
      setProperties(prevProperties => 
        prevProperties.map(prop => prop.id === updatedPropertyData.id ? updatedPropertyData : prop)
      )
      setSelectedProperty(updatedPropertyData)
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const handleRPTUpdate = async (updatedRPT: RPT[]) => {
    if (!selectedProperty) return;
  
    try {
      const response = await Promise.all(
        updatedRPT.map(rpt => 
          axios.put<RPT>(`/api/update-rpt-property/${rpt.id}`, { 
            TaxDecNo: rpt.TaxDecNo,
            PaymentMode: rpt.PaymentMode,
            DueDate: rpt.DueDate,
            Status: rpt.Status,
            custodianRemarks: rpt.custodianRemarks,
          })
        )
      );
  
      const updatedRPTs = response.map(res => res.data);
      
      setProperties(prevProperties => 
        prevProperties.map(prop => 
          prop.id === selectedProperty.id 
            ? { ...prop, rpt: updatedRPTs }
            : prop
        )
      );
  
      setSelectedProperty(prev => 
        prev ? { ...prev, rpt: updatedRPTs } : null
      );
  
    } catch (error) {
      console.error('Error updating RPT details:', error);
      alert('Failed to update RPT details. Please try again.');
    }
  };

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden flex flex-col'>
        <Header propertiesCount={properties.length} />
        <div className='flex-1 flex overflow-hidden'>
          <PropertySidebar 
            properties={filteredProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            propertyTypes={propertyTypes}
            clearFilters={clearFilters}
            loading={loading}
            selectedPropertyId={selectedProperty?.id.toString() || null}
            setSelectedProperty={setSelectedProperty}
          />
          <PropertyDetails 
            selectedProperty={selectedProperty}
            handlePropertyUpdate={handlePropertyUpdate}
            handleRPTUpdate={handleRPTUpdate}
          />
        </div>
      </main>
    </div>
  )
}

interface HeaderProps {
  propertiesCount: number;
}

const Header: React.FC<HeaderProps> = ({ propertiesCount }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className='p-4'
  >
    <div className="flex items-center justify-between mb-4">
      <h1 className='text-3xl font-bold'>Properties ({propertiesCount})</h1>
      <CreatePropertyForm />
    </div>
    <Separator className='mb-4 w-full' />
  </motion.div>
)

interface PropertySidebarProps {
  properties: Property[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  propertyTypes: string[];
  clearFilters: () => void;
  loading: boolean;
  selectedPropertyId: string | null;
  setSelectedProperty: (property: Property) => void;
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({
  properties,
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  propertyTypes,
  clearFilters,
  loading,
  selectedPropertyId,
  setSelectedProperty
}) => (
  <div className='w-1/3 border-r flex flex-col'>
    <div className='p-4 space-y-4'>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterBar 
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        propertyTypes={propertyTypes}
        clearFilters={clearFilters}
      />
      <Separator />
    </div>
    <PropertyList 
      properties={properties}
      loading={loading}
      selectedPropertyId={selectedPropertyId}
      setSelectedProperty={setSelectedProperty}
    />
  </div>
)

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <div className='flex items-center'>
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
)

interface FilterBarProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  propertyTypes: string[];
  clearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedType, setSelectedType, propertyTypes, clearFilters }) => (
  <div className='flex items-center space-x-2'>
    <Select value={selectedType || ''} onValueChange={setSelectedType}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by property type..." />
      </SelectTrigger>
      <SelectContent>
        {propertyTypes.map((type) => (
          <SelectItem key={type} value={type}>{type}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
      <X className="h-4 w-4 mr-2" />
      Clear
    </Button>
  </div>
)

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  selectedPropertyId: string | null;
  setSelectedProperty: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, loading, selectedPropertyId, setSelectedProperty }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <ScrollArea className="flex-grow">
      {loading ? (
        <Suspense fallback={<LoadingSkeleton />}>
          <LoadingSkeleton />
        </Suspense>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 p-2 mx-4"
        >
          <AnimatePresence>
            {properties.map((property) => (
              <PropertyListItem 
                key={property.id}
                property={property}
                selectedPropertyId={selectedPropertyId}
                setSelectedProperty={setSelectedProperty}
                variants={listItemVariants}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </ScrollArea>
  )
}

const LoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-4 w-full">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="space-y-2"
      >
        <div className="h-5 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </motion.div>
    ))}
  </div>
)



interface PropertyDetailsProps {
  selectedProperty: Property | null;
  handlePropertyUpdate: (property: Property) => Promise<void>;
  handleRPTUpdate: (rpt: RPT[]) => Promise<void>;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ selectedProperty, handlePropertyUpdate, handleRPTUpdate }) => (
  <div className='flex-1 overflow-auto'>
    <ScrollArea className="h-full">
      <AnimatePresence mode="wait">
        {selectedProperty ? (
          <PropertyCard 
            property={selectedProperty}
            handlePropertyUpdate={handlePropertyUpdate}
            handleRPTUpdate={handleRPTUpdate}
          />
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
)

interface PropertyCardProps {
  property: Property;
  handlePropertyUpdate: (property: Property) => Promise<void>;
  handleRPTUpdate: (rpt: RPT[]) => Promise<void>;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, handlePropertyUpdate, handleRPTUpdate }) => (
  <motion.div
    key={property.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-6"
  >
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-[-10px] mt-[-10px]">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Building className="mr-2 h-6 w-6" />
          {property.propertyName}
        </CardTitle>
        <CardDescription className='flex justify-start'>
          <MapPin className='w-6 h-6 mr-1'/>{property.address}, {property.city}, {property.province}
        
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditablePropertyTable 
          property={property} 
          onUpdate={handlePropertyUpdate} 
        />
        <EditableRPTTable 
          propertyId={property.id}
          rptDetails={property.rpt} 
          onUpdate={handleRPTUpdate}
        />
        <Separator className="mt-8" />
        <PropertyImages property={property} />
        <SpaceList spaces={property.space} />
      </CardContent>
    </Card>
  </motion.div>
)

interface PropertyImagesProps {
  property: Property;
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ property }) => (
  <Accordion type="single" collapsible className="mb-6">
    <AccordionItem value="property-images">
      <AccordionTrigger>
        <h3 className="text-lg font-semibold">Attached Property Images</h3>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-4 gap-4 mt-3">
          {Array.isArray(property.attachments) && property.attachments.length > 0 ? (
            property.attachments.map((attachment) => (
              <Dialog key={attachment.id}>
                <DialogTrigger>
                  <Image
                    src={attachment.files}
                    alt={`Image for ${property.propertyName}`}
                    width={150}
                    height={100}
                    className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity shadow-sm hover:shadow-md"
                  />
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <Image
                    src={attachment.files}
                    alt={`Image for ${property.propertyName}`}
                    width={800}
                    height={600}
                    className="object-contain rounded-md"
                  />
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <div className="col-span-4 h-[100px] flex flex-col items-center justify-center bg-muted rounded-md space-y-2">
                <p className="text-muted-foreground">No images available</p>
                <Button>Upload Images</Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

interface SpaceListProps {
  spaces: Space[];
}

const SpaceList: React.FC<SpaceListProps> = ({ spaces }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">List of Spaces ({spaces.length})</h3>
      <Button><PlusCircle className="w-5 h-5 mr-2" />Add New Space</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map((unit) => (
        <SpaceCard key={unit.id} space={unit} />
      ))}
    </div>
  </div>
)

interface SpaceCardProps {
  space: Space;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="text-lg">{space.spaceNumber}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center mb-2">
        <p className="flex items-center">
          <LandPlot className="mr-2 h-4 w-4" /> {space.spaceArea} sq ft
        </p>
        <Badge variant={space.spaceStatus === 'Occupied' ? 'destructive' : 'success'}>
          {space.spaceStatus}
        </Badge>
      </div>
      <SpaceDetailsSheet space={space} />
    </CardContent>
  </Card>
)

export default PropertyListx