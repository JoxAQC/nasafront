'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import type { Coordinates } from '@/app/simulator/page';

type MapViewProps = {
  onLocationSelect: (coords: Coordinates, pixel: {x: number, y: number}) => void;
  selectedLocation: Coordinates | null;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 20,
  lng: 0,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: 'satellite',
  styles: [
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};


export function MapView({ onLocationSelect, selectedLocation }: MapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry', 'drawing'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleClick = useCallback((e: google.maps.MapMouseEvent) => {
      if (e.latLng && map) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        // This is a bit of a hack to get pixel coordinates for the animation
        // It's not perfectly accurate but good enough for a visual effect.
        const overlay = new google.maps.OverlayView();
        overlay.setMap(map);
        overlay.draw = function() {};
        const projection = overlay.getProjection();
        
        if (projection) {
            const pixel = projection.fromLatLngToContainerPixel(e.latLng);
            if (pixel) {
                onLocationSelect({ lat, lng }, pixel);
            }
        }
      }
    },[map, onLocationSelect]);


  if (loadError) {
    return <div className="flex items-center justify-center w-full h-full bg-destructive/10 text-destructive-foreground">Error loading map</div>;
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full cursor-crosshair">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={handleClick}
      >
        {selectedLocation && (
          <MarkerF
            position={selectedLocation}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 1,
              strokeWeight: 1.5,
              strokeColor: 'white',
              anchor: new google.maps.Point(12, 24),
              scale: 1.8,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
