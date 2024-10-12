
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Property } from '@/types/type'

export const revalidate = 0
interface PropertyListItemProps {
    property: Property;
    selectedPropertyId: string | null;
    setSelectedProperty: (property: Property) => void;
    variants: any;
  }
  
  export const PropertyListItem: React.FC<PropertyListItemProps> = ({ 
    property, 
    selectedPropertyId,
    setSelectedProperty, 
    variants 
  }) => (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      layout
    >
      <div 
        className={`p-3 cursor-pointer rounded-lg transition-all duration-200 border shadow-sm hover:shadow-md
          ${selectedPropertyId === property.id.toString() 
            ? 'bg-accent border-primary' 
            : 'hover:bg-accent border-muted hover:border-primary'
          }`}
        onClick={() => setSelectedProperty(property)}
      >
        <h3 className="font-semibold text-lg">{property.propertyName}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          {property.address}
        </div>
        <div className="flex items-center mt-2 space-x-2">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            {property.propertyType}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            {property.space.length} spaces
          </Badge>
        </div>
      </div>
    </motion.div>
  )