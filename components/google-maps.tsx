'use client'

import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Property {
  id: string
  name: string
  address: string
  contactNumber: string
  email: string
}

interface GoogleMapsSectionProps {
  properties: Property[]
}

const DEFAULT_CENTER = "General Santos City, Philippines"

const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = memo(function GoogleMapsSection({ properties }) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [markers, setMarkers] = useState<Array<{ position: google.maps.LatLngLiteral; property: Property }>>([])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const geocodeAddress = useCallback((address: string): Promise<google.maps.LatLngLiteral> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          resolve({ lat: location.lat(), lng: location.lng() })
        } else {
          reject(new Error('Geocode was not successful'))
        }
      })
    })
  }, [])

  useEffect(() => {
    if (isLoaded) {
      geocodeAddress(DEFAULT_CENTER).then(setMapCenter).catch(console.error)

      Promise.all(properties.map(property => 
        geocodeAddress(property.address)
          .then(position => ({ position, property }))
          .catch(() => null)
      )).then(results => {
        setMarkers(results.filter((result): result is { position: google.maps.LatLngLiteral; property: Property } => result !== null))
      })
    }
  }, [isLoaded, properties, geocodeAddress])

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery && isLoaded) {
      geocodeAddress(searchQuery).then(setMapCenter).catch(() => {
        alert('Location not found. Please try a different search term.')
      })
    }
  }, [searchQuery, isLoaded, geocodeAddress])

  const handlePropertyClick = useCallback((property: Property) => {
    geocodeAddress(property.address).then(position => {
      setMapCenter(position)
      setSelectedProperty(property)
    }).catch(console.error)
  }, [geocodeAddress])

  const mapOptions = useMemo((): google.maps.MapOptions => ({
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true
  }), [])

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Properties</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Explore Our Properties
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {isLoaded && mapCenter ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '600px' }}
                    center={mapCenter}
                    zoom={12}
                    options={mapOptions}
                  >
                    {markers.map(({ position, property }) => (
                      <Marker
                        key={property.id}
                        position={position}
                        title={property.name}
                        onClick={() => handlePropertyClick(property)}
                      />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="bg-muted flex items-center justify-center h-[600px]">
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <ul className="space-y-4">
                  {properties.map((property) => (
                    <li 
                      key={property.id} 
                      className={`p-4 rounded-md cursor-pointer transition-colors ${
                        selectedProperty?.id === property.id ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                      onClick={() => handlePropertyClick(property)}
                    >
                      <h4 className="font-bold">{property.name}</h4>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                      <p className="text-sm">Contact: {property.contactNumber}</p>
                      <p className="text-sm">Email: {property.email}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
})

export default GoogleMapsSection