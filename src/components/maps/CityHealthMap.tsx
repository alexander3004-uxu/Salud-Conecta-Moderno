import React from 'react';

interface CityHealthMapProps {
  city: string;
  coordinates: { lat: number; lng: number };
  facilities: any[];
}
import { useLanguage } from '../../contexts/LanguageContext';

export default function CityHealthMap({ city }: CityHealthMapProps) {
  const { t } = useLanguage();
  return (
    <div className="p-4 bg-surface rounded-2xl border border-outline-variant/30 text-center">
      <p className="text-sm font-bold text-on-surface">{t('maps.city_map_of')} {city}</p>
      <p className="text-xs text-on-surface-variant">{t('maps.coming_soon')}</p>
    </div>
  );
}