import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Search,
  Filter,
  X,
  Lock,
  Building2,
  Stethoscope,
  Activity,
  Pill,
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { NICARAGUA_HOSPITALS } from '../../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../../data/nicaraguaPublicHealthNetwork';
import { Clinic } from '../../types';
import { calculateDistance, estimateTravelTime } from '../../lib/geolocationService';

type PrivateFilterType = 'all' | 'hospital' | 'clinic' | 'laboratory' | 'pharmacy';

const FILTER_OPTIONS: { value: PrivateFilterType; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todos', icon: Building2 },
  { value: 'hospital', label: 'Hospitales', icon: Building2 },
  { value: 'clinic', label: 'Clínicas', icon: Stethoscope },
  { value: 'laboratory', label: 'Laboratorios', icon: Activity },
  { value: 'pharmacy', label: 'Farmacias', icon: Pill },
];

export default function PremiumHealthMap() {
  const { isPremium, membership } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PrivateFilterType>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Clinic | null>(null);
  const [privateFacilities, setPrivateFacilities] = useState<Clinic[]>([]);

  // Get user GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 12.1328, lng: -86.2504 }), // Default: Managua
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation({ lat: 12.1328, lng: -86.2504 });
    }
  }, []);

  // Load private facilities from both datasets
  useEffect(() => {
    const allClinics: Clinic[] = [
      ...NICARAGUA_HOSPITALS.map((h, i) => ({ id: `priv-h-${i}`, ...h } as Clinic)),
      ...PUBLIC_HEALTH_NETWORK.map((h, i) => ({ id: `priv-p-${i}`, ...h } as Clinic)),
    ];
    
    // Filter to private sector only
    const privateOnly = allClinics.filter(c => c.sector === 'private');
    setPrivateFacilities(privateOnly);
  }, []);

  // Calculate distance for each facility
  const facilitiesWithDistance = privateFacilities
    .map(f => {
      if (!userLocation || !f.location) return { ...f, distanceKm: Infinity };
      const dist = calculateDistance(userLocation.lat, userLocation.lng, f.location.lat, f.location.lng);
      return { ...f, distanceKm: dist };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Apply filters
  const filteredFacilities = facilitiesWithDistance.filter(f => {
    const matchesFilter = activeFilter === 'all' || f.type.includes(activeFilter);
    const matchesSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNavigationUrl = (facility: Clinic) => {
    if (!userLocation) return `https://www.openstreetmap.org/directions?engine=osrm_car&route=${facility.location.lat},${facility.location.lng}`;
    return `https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLocation.lat},${userLocation.lng};${facility.location.lat},${facility.location.lng}`;
  };

  const getTypeLabel = (type: string) => {
    if (type.includes('hospital')) return 'Hospital Privado';
    if (type === 'clinic') return 'Clínica Privada';
    if (type === 'laboratory') return 'Laboratorio';
    if (type === 'pharmacy') return 'Farmacia';
    if (type === 'dental') return 'Clínica Dental';
    return 'Centro Privado';
  };

  const getTypeColor = (type: string) => {
    if (type.includes('hospital')) return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (type === 'clinic') return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
    if (type === 'laboratory') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (type === 'pharmacy') return 'bg-green-500/10 text-green-600 border-green-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  // --- Membership Gate ---
  if (!isPremium) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200/50 dark:border-amber-800/30 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Acceso Premium Requerido</h2>
            <p className="text-white/80 text-sm mt-2 font-medium">
              Centros de salud privados disponibles exclusivamente para usuarios Premium
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {['Hospitales y clínicas privadas', 'Laboratorios especializados', 'Navegación en tiempo real', 'Atención prioritaria'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Star className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'membership' }))}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <Crown className="w-4 h-4" />
              Obtener Premium
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-4 sm:px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">Centros Privados</h1>
            <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Red Premium de Salud • {filteredFacilities.length} centros
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar clínica, hospital o laboratorio privado..."
            className="w-full h-10 pl-10 pr-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto">
        <div className="flex gap-2">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === opt.value
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <opt.icon className="w-3 h-3" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {filteredFacilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">No se encontraron centros privados</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Intenta modificar tu búsqueda o filtros</p>
          </div>
        ) : (
          filteredFacilities.map((facility) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/50 dark:border-amber-800/30 flex items-center justify-center shrink-0">
                    {facility.type.includes('hospital') ? (
                      <Building2 className="w-5 h-5 text-amber-600" />
                    ) : facility.type === 'clinic' || facility.type === 'dental' ? (
                      <Stethoscope className="w-5 h-5 text-amber-600" />
                    ) : facility.type === 'laboratory' ? (
                      <Activity className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Pill className="w-5 h-5 text-amber-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">
                      {facility.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${getTypeColor(facility.type)}`}>
                        {getTypeLabel(facility.type)}
                      </span>
                      {facility.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-500">{facility.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                      <MapPin className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />
                      {facility.address}
                    </p>
                  </div>

                  {/* Distance */}
                  {facility.distanceKm !== Infinity && (
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                        {facility.distanceKm.toFixed(1)} km
                      </span>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                        ~{estimateTravelTime(facility.distanceKm)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Services */}
                {facility.services && facility.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {facility.services.slice(0, 4).map((s) => (
                      <span key={s} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                    {facility.services.length > 4 && (
                      <span className="text-[9px] font-bold text-slate-400">+{facility.services.length - 4} más</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={getNavigationUrl(facility)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-9 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-all active:scale-[0.98]"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Ruta en Mapa
                  </a>
                  {facility.phone && (
                    <a
                      href={`tel:${facility.phone}`}
                      className="h-9 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Llamar
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
