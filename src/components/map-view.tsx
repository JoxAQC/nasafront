'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import type { Coordinates } from '@/app/page';
import { cn } from '@/lib/utils';

type MapViewProps = {
  onLocationSelect: (coords: Coordinates) => void;
  selectedLocation: Coordinates | null;
  isBusy: boolean;
};

export function MapView({ onLocationSelect, selectedLocation, isBusy }: MapViewProps) {
  const mapImage = PlaceHolderImages.find((p) => p.id === 'world-map');
  const mapRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBusy || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lat = 90 - (y / rect.height) * 180;
    const lng = (x / rect.width) * 360 - 180;

    onLocationSelect({ lat, lng, x, y });
  };

  return (
    <div
      ref={mapRef}
      className={cn("relative w-full h-full", isBusy ? "cursor-wait" : "cursor-crosshair")}
      onClick={handleClick}
    >
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          data-ai-hint={mapImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/20" />
      {selectedLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
          style={{ left: `${selectedLocation.x}px`, top: `${selectedLocation.y}px` }}
        >
          <MapPin className="w-10 h-10 text-primary drop-shadow-lg" fill="currentColor" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
