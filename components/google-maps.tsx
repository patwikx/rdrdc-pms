"use client";

import { memo, useEffect, useMemo, useState } from 'react';
import { GoogleMapsEmbed } from '@next/third-parties/google';

interface Location {
  name: string;
  address: string;
  marked?: boolean; // Optional property to indicate marked locations
}

interface GoogleMapsSectionProps {
  locations: Location[];
}

const MemoizedGoogleMapsEmbed = memo(function MemoizedGoogleMapsEmbed({ q }: { q: string }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

  return (
    <GoogleMapsEmbed
      apiKey={apiKey} // Ensure apiKey is always a string
      height="550"
      width="100%"
      mode="search"
      q={q}
    />
  );
});

const GoogleMapsSection = memo(function GoogleMapsSection({ locations }: GoogleMapsSectionProps) {
  const [isClient, setIsClient] = useState(false);
  const formattedLocations = useMemo(() => {
    // Filter marked locations
    const markedLocations = locations.filter(loc => loc.marked);
    // Format for Google Maps query
    return markedLocations.map(loc => `${loc.name}, ${loc.address}`).join('|'); // Format for multiple locations
  }, [locations]);

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Locations</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Discover Our Properties
          </p>
        </div>

        <div className="aspect-w-16 aspect-h-9">
          {isClient && process.env.GOOGLE_MAPS_API_KEY ? (
            <MemoizedGoogleMapsEmbed q={formattedLocations} />
          ) : (
            <div className="bg-gray-200 flex items-center justify-center h-[450px]">
              <p className="text-gray-500">Google Maps API key is not set</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default GoogleMapsSection;
