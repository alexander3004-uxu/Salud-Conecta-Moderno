import React from 'react';

interface CityHealthMapProps {
  city: string;
  coordinates: { lat: number; lng: number };
  facilities: any[];
}

export default function CityHealthMap({ city }: CityHealthMapProps) {
  return (
    <div className="p-4 bg-surface rounded-2xl border border-outline-variant/30 text-center">
      <p className="text-sm font-bold text-on-surface">Mapa de {city}</p>
      <p className="text-xs text-on-surface-variant">Próximamente disponible.</p>
    </div>
  );
}