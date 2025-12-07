'use client';

import { MapPin } from 'lucide-react';

interface MapProps {
  coordinates: [number, number]; // [lat, lng]
  name: string;
}

export default function TrekMap({ coordinates, name }: MapProps) {
  const [lat, lng] = coordinates;
  
  // Construct a static map URL using OpenStreetMap's staticmap service
  // Using tiles.stadiamaps.com or a similar service
  const mapUrl = `https://tile.openstreetmap.org/15/${Math.floor((lng + 180) / 360 * (1 << 15))}/${Math.floor((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2 * (1 << 15))}.png`;

  // Static map via Open-Meteo or similar (simpler approach: just display coordinates + link)
  const googleMapsUrl = `https://www.google.com/maps/search/${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=12`;

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-primary/20 bg-muted/50 flex items-center justify-center">
      <a
        href={osmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full flex items-center justify-center hover:bg-muted/70 transition-colors group relative"
      >
        {/* Placeholder: static map would require a service like Mapbox or Nominatim */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
          <h3 className="font-headline font-bold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Coordinates: {lat.toFixed(3)}°, {lng.toFixed(3)}°
          </p>
          <p className="text-xs text-primary font-semibold group-hover:underline">
            Click to view on OpenStreetMap
          </p>
        </div>
      </a>
    </div>
  );
}
