'use client'

import React, { Suspense, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, Search, MapPin, LandPlot, PlusCircle, X, Download } from 'lucide-react'
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
import AddSpaceModal from './add-space-modal'
import { handleExportProperties } from './actions/export-excel'
import { FaFileExcel, FaFilePdf, FaFileWord } from 'react-icons/fa'

export const revalidate = 0

interface PropertyListProps {}

export const PropertyListx: React.FC<PropertyListProps> = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
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

  const handlePropertyCreated = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handlePropertyUpdate = useCallback(async (updatedProperty: Property) => {
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
  }, [])

  const handleRPTUpdate = useCallback(async (updatedRPT: RPT[]) => {
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
  }, [selectedProperty]);

  const handleSpaceAdded = useCallback((newSpace: Space) => {
    if (selectedProperty) {
      const updatedProperty = { ...selectedProperty };
      updatedProperty.space = [...updatedProperty.space, newSpace];
      
      // Recalculate occupancy rate
      const occupiedArea = updatedProperty.space
        .filter(space => space.spaceStatus === 'Occupied')
        .reduce((sum, space) => sum + parseFloat(space.spaceArea), 0);
      const totalLeasableArea = parseFloat(updatedProperty.leasableArea);
      updatedProperty.occupancyRate = totalLeasableArea > 0
        ? ((occupiedArea / totalLeasableArea) * 100).toFixed(2)
        : '0.00';

      // Recalculate property revenue
      const totalRent = updatedProperty.space.reduce((total, space) => {
        return total + (parseFloat(space.spaceRate) * parseFloat(space.spaceArea));
      }, 0);
      updatedProperty.rent = totalRent.toFixed(2);

      setSelectedProperty(updatedProperty);
      handlePropertyUpdate(updatedProperty);
    }
  }, [selectedProperty, handlePropertyUpdate]);

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


  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 flex flex-col ml-4 mr-4'>
          <div className='flex justify-between'>
          <div>
          <Header propertiesCount={properties.length} />
          </div>
          <div className='flex justify-end items-center mr-4'>
          <Button className='mr-4' variant='outline' onClick={handleExportProperties}><FaFileExcel className='h-5 w-5 mr-2' />Export Properties</Button>
          <CreatePropertyForm onPropertyCreated={handlePropertyCreated} />
          </div>
          </div>

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
            handleSpaceAdded={handleSpaceAdded}
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
    <div className="flex items-center justify-between">
      <h1 className='text-2xl font-bold'>Properties ({propertiesCount})</h1>
    </div>
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
  <div className='w-1/4 flex flex-col p-4 border border-gray-200 rounded-lg mt-1 shadow-md bg-white mb-2 h-[855px]'>
<div className='space-y-4 mb-4 border border-gray-200 rounded-lg shadow-md p-4 bg-white'>
  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
  <FilterBar 
    selectedType={selectedType}
    setSelectedType={setSelectedType}
    propertyTypes={propertyTypes}
    clearFilters={clearFilters}
  />
</div>
    <PropertyList 
      properties={properties}
      loading={loading}
      selectedPropertyId={selectedPropertyId}
      setSelectedProperty={setSelectedProperty}
    />
  </div>
);

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
    <ScrollArea className="flex">
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
  handleSpaceAdded: (newSpace: Space) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ selectedProperty, handlePropertyUpdate, handleRPTUpdate, handleSpaceAdded }) => (
  <div className='flex-1 mt-[-10px]'>
    <ScrollArea className="h-full">
      <AnimatePresence mode="wait">
        {selectedProperty ? (
          <PropertyCard 
            property={selectedProperty}
            handlePropertyUpdate={handlePropertyUpdate}
            handleRPTUpdate={handleRPTUpdate}
            handleSpaceAdded={handleSpaceAdded}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center h-full w-full"
          >
            <p className="text-muted-foreground mt-80">Select a property to view details</p>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollArea>
  </div>
);

interface PropertyCardProps {
  property: Property;
  handlePropertyUpdate: (property: Property) => Promise<void>;
  handleRPTUpdate: (rpt: RPT[]) => Promise<void>;
  handleSpaceAdded: (newSpace: Space) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, handlePropertyUpdate, handleRPTUpdate, handleSpaceAdded }) => (
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
        <CardTitle className="text-2xl flex  items-center">
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
          onSpaceAdded={handleSpaceAdded}
        />
        <EditableRPTTable 
          propertyId={property.id}
          rptDetails={property.rpt} 
          onUpdate={handleRPTUpdate}
        />
        <PropertyImages property={property} />
        <SpaceList 
          spaces={property.space} 
          propertyId={property.id.toString()}
          onSpaceAdded={handleSpaceAdded}
          onPropertyUpdate={handlePropertyUpdate}
          property={property}
        />
      </CardContent>
    </Card>
  </motion.div>
)


interface Attachment {
  id: string;
  files: string;
}

interface PropertyImagesProps {
  property: {
    attachments: Attachment[];
    propertyName: string;
  };
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ property }) => {
  const [mimeTypes, setMimeTypes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchMimeTypes = async () => {
      const mimeTypeMap: { [key: string]: string } = {};

      await Promise.all(
        property.attachments.map(async (attachment) => {
          try {
            const response = await fetch(attachment.files, { method: 'HEAD' });
            const mimeType = response.headers.get("Content-Type") || "";
            mimeTypeMap[attachment.id] = mimeType;
          } catch (error) {
            console.error("Failed to fetch MIME type for:", attachment.files);
          }
        })
      );

      setMimeTypes(mimeTypeMap);
    };

    fetchMimeTypes();
  }, [property.attachments]);

  return (
    <Accordion type="single" collapsible className="mb-6">
      <AccordionItem value="property-images">
        <AccordionTrigger>
          <h3 className="text-lg font-semibold">
            Attached Property Documents & Images ({property.attachments.length})
          </h3>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-4 gap-4 mt-3">
            {Array.isArray(property.attachments) && property.attachments.length > 0 ? (
              property.attachments.map((attachment) => {
                const { files, id } = attachment;
                const mimeType = mimeTypes[id] || "";
                const isImage = mimeType.startsWith("image/");
                const isPdf = mimeType === "application/pdf";
                const isExcel = mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || mimeType === "application/vnd.ms-excel";
                const isWord = mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mimeType === "application/msword";

                return (
                  <div key={id}>
                    {isImage ? (
                      <Image
                        src={files}
                        alt={`Image for ${property.propertyName}`}
                        width={150}
                        height={100}
                        className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity shadow-sm hover:shadow-md"
                      />
                    ) : (
                      <a
                        href={files}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center w-36 h-28 bg-muted rounded-md cursor-pointer hover:opacity-80 transition-opacity shadow-sm hover:shadow-md"
                      >
                        {isPdf && <FaFilePdf size={48} className="text-red-600" />}
                        {isExcel && <FaFileExcel size={48} className="text-green-600" />}
                        {isWord && <FaFileWord size={48} className="text-blue-600" />}
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 h-[100px] flex flex-col items-center justify-center bg-muted rounded-md space-y-2">
                <p className="text-muted-foreground">No documents or images available</p>
                <Button>Upload Files</Button>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

interface SpaceListProps {
  spaces: Space[];
  propertyId: string;
  onSpaceAdded: (newSpace: Space) => void;
  onPropertyUpdate: (updatedProperty: Property) => void;
  property: Property;
}

const SpaceList: React.FC<SpaceListProps> = ({ spaces, propertyId, onSpaceAdded, onPropertyUpdate, property }) => (
  <div>
    <div className="flex justify-between items-center mt-[-10px] mb-2">
      <h3 className="text-lg font-semibold">List of Spaces ({spaces.length})</h3>
      <AddSpaceModal 
        propertyId={propertyId} 
        onSpaceAdded={onSpaceAdded} 
        onPropertyUpdate={onPropertyUpdate}
        property={property}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border max-w-[250px]">
  <CardHeader className="py-3 px-4">
    <CardTitle className="text-sm font-semibold">{space.spaceNumber}</CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <div className="flex justify-between items-start mb-3">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Area</span>
        <p className="flex items-center text-sm font-medium">
          {space.spaceArea} sq ft
          <LandPlot className="ml-1 h-3 w-3 text-muted-foreground" />
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs text-muted-foreground">Status</span>
        <Badge 
          variant={space.spaceStatus === 'Occupied' ? 'destructive' : 'success'}
          className="text-[10px] px-1.5 py-0.5"
        >
          {space.spaceStatus}
        </Badge>
      </div>
    </div>
    <div className="mb-3">
      <span className="text-xs text-muted-foreground block">Monthly Rent</span>
      <p className="text-sm font-semibold">
        ₱{space.totalSpaceRent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
    <SpaceDetailsSheet space={space} />
  </CardContent>
</Card>
)
