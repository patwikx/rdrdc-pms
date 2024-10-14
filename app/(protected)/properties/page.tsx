'use client'

import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import React, { useState, useEffect } from 'react'
import { PropertyListx } from './component/property-list'
import axios from 'axios'
import { Property } from '@/types/type'
import Footer from '@/components/footer/footer'

const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get<Property[]>('/api/fetch-properties')
        setProperties(response.data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <Header />
        <PropertyListx 
          properties={properties}
          loading={loading}
          selectedPropertyId={selectedPropertyId}
          setSelectedProperty={(property: Property) => {
            setSelectedProperty(property)
            setSelectedPropertyId(property.id.toString())
          }}
        />
      </main>
    </div>
  )
}

export default PropertyPage