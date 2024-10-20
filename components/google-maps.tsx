'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

interface Property {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  contactNumber: string
  email: string
}

interface GoogleMapsSectionProps {
  properties: Property[]
}

const DEFAULT_CENTER = { lat: 6.1164, lng: 125.1716 } // General Santos City coordinates

const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = memo(function GoogleMapsSection({ properties }) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery && isLoaded) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          setMapCenter({ lat: location.lat(), lng: location.lng() })
        } else {
          alert('Geocode was not successful for the following reason: ' + status)
        }
      })
    }
  }, [searchQuery, isLoaded])

  const handlePropertyClick = useCallback((property: Property) => {
    setMapCenter({ lat: property.lat, lng: property.lng })
    setSelectedProperty(property)
  }, [])

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true
  }), [])

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Properties</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Explore Our Properties
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Search
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-w-16 aspect-h-9">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '450px' }}
                center={mapCenter}
                zoom={12}
                options={mapOptions}
              >
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    position={{ lat: property.lat, lng: property.lng }}
                    title={property.name}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="bg-gray-200 flex items-center justify-center h-[450px]">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Property List</h3>
            <ul className="space-y-4 max-h-[450px] overflow-y-auto">
              {properties.map((property) => (
                <li 
                  key={property.id} 
                  className={`border p-4 rounded-md cursor-pointer transition-colors ${
                    selectedProperty?.id === property.id ? 'bg-primary/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handlePropertyClick(property)}
                >
                  <h4 className="font-bold">{property.name}</h4>
                  <p>{property.address}</p>
                  <p>Contact: {property.contactNumber}</p>
                  <p>Email: {property.email}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
})

export default GoogleMapsSection