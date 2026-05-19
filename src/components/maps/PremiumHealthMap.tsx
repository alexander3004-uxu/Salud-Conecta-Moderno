import React, { useState, useEffect, useMemo } from 'react';
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
  Building2,
  Stethoscope,
  Activity,
  Pill,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Heart,
  PhoneCall,
  Calendar,
  X as XIcon,
  Sparkles
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
  const { isPremium } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PrivateFilterType>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Clinic | null>(null);
  const [privateFacilities, setPrivateFacilities] = useState<Clinic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [likedFacilities, setLikedFacilities] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('premium_liked_facilities');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save likes to localStorage
  useEffect(() => {
    localStorage.setItem('premium_liked_facilities', JSON.stringify(likedFacilities));
  }, [likedFacilities]);

  const toggleLike = (facilityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedFacilities(prev => ({
      ...prev,
      [facilityId]: !prev[facilityId]
    }));
  };

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

  // Reset to page 1 on query or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

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
  const facilitiesWithDistance = useMemo(() => {
    return privateFacilities
      .map(f => {
        if (!userLocation || !f.location) return { ...f, distanceKm: Infinity };
        const dist = calculateDistance(userLocation.lat, userLocation.lng, f.location.lat, f.location.lng);
        return { ...f, distanceKm: dist };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [privateFacilities, userLocation]);

  // Apply filters
  const filteredFacilities = useMemo(() => {
    return facilitiesWithDistance.filter(f => {
      const matchesFilter = activeFilter === 'all' || f.type.includes(activeFilter);
      const matchesSearch = !searchQuery || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [facilitiesWithDistance, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);
  
  const paginatedFacilities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFacilities.slice(start, start + itemsPerPage);
  }, [filteredFacilities, currentPage]);

  const getNavigationUrl = (facility: Clinic) => {
    if (!userLocation) return `https://www.google.com/maps/dir/?api=1&destination=${facility.location.lat},${facility.location.lng}&travelmode=driving`;
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${facility.location.lat},${facility.location.lng}&travelmode=driving`;
  };

  const getTypeLabel = (type: string) => {
    if (type.includes('hospital')) return 'Hospital Privado';
    if (type === 'clinic') return 'Clínica Privada';
    if (type === 'laboratory') return 'Laboratorio VIP';
    if (type === 'pharmacy') return 'Farmacia Express';
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
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-amber-200/50 dark:border-amber-800/30 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-8 text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
              <Crown className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-display font-black text-white tracking-tight">Acceso Premium Requerido</h2>
            <p className="text-white/80 text-xs mt-2 font-bold uppercase tracking-wider">
              Red Premium de Salud Privada
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              {['Hospitales y clínicas privadas de primer nivel', 'Laboratorios de alta complejidad', 'Navegación directa con Google Maps', 'Atención VIP y citas prioritarias'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/50">
                    <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'membership' }))}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98]"
            >
              <Crown className="w-4 h-4" />
              Obtener Premium Ahora
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden pb-20 md:pb-0">
      {/* Premium Header Hero banner */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-6 shrink-0 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
              <Crown className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
                Red Premium de Salud
              </h1>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                Centros Privados y Hospitales VIP de Nicaragua
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Servicio Exclusivo
          </span>
        </div>
      </div>

      {/* Info stats bar */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/40 shrink-0 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-display font-black text-amber-600 dark:text-amber-400">
            {privateFacilities.length}
          </p>
          <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Centros VIP</p>
        </div>
        <div className="border-x border-slate-100 dark:border-slate-800">
          <p className="text-xl font-display font-black text-slate-800 dark:text-white">
            {filteredFacilities.filter(f => f.distanceKm !== Infinity && f.distanceKm <= 5).length}
          </p>
          <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Cercanos (&lt;5km)</p>
        </div>
        <div>
          <p className="text-xl font-display font-black text-emerald-600 dark:text-emerald-400">
            {filteredFacilities.filter(f => f.rating >= 4.5).length}
          </p>
          <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Excelente Nota (★4.5+)</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/40 shrink-0 space-y-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar clínica, hospital o laboratorio privado..."
            className="w-full h-12 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeFilter === opt.value
                  ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Bento List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredFacilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px]">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-base font-black text-slate-700 dark:text-slate-300">No se encontraron centros privados</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium max-w-xs leading-relaxed">
              Intenta modificar tu búsqueda o cambia de filtro de categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {paginatedFacilities.map((facility) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
              >
              {/* Cover Photo */}
              <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {facility.imageUrl ? (
                  <img 
                    src={facility.imageUrl} 
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 text-center absolute inset-0">
                    <span className="text-sm font-display font-black text-amber-600 dark:text-amber-400 leading-tight">
                      {facility.name}
                    </span>
                  </div>
                )}
                {/* Float Like button */}
                <button 
                  onClick={(e) => toggleLike(facility.id, e)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-lg border transition-all active:scale-[0.85] z-10 ${
                    likedFacilities[facility.id] 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : 'bg-black/35 border-white/20 text-white hover:bg-black/55'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedFacilities[facility.id] ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getTypeColor(facility.type)}`}>
                      {getTypeLabel(facility.type)}
                    </span>
                    {facility.rating && (
                      <span className="flex items-center text-amber-500 dark:text-amber-400 gap-1 text-[10px] font-black bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                        ★ {facility.rating.toFixed(1)}
                      </span>
                    )}
                    {facility.open24h && (
                      <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        24 Horas
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-black text-slate-800 dark:text-white leading-tight group-hover:text-amber-500 transition-colors">
                    {facility.name}
                  </h3>

                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold flex items-center gap-1 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {facility.address}
                  </p>

                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 line-clamp-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* Specialties / Services tags */}
                {facility.services && facility.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {facility.services.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                    {facility.services.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400 self-center">+{facility.services.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    onClick={() => setSelectedFacility(facility)}
                    className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    Ver Perfil
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href={getNavigationUrl(facility)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 transition-all active:scale-[0.98]"
                  >
                    <Navigation className="w-4 h-4" />
                    Cómo Llegar (Maps)
                  </a>
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Golden Premium Pagination */}
      {totalPages > 1 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/40 shrink-0 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-700 dark:text-slate-300 flex items-center gap-1 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Página <strong className="text-amber-500">{currentPage}</strong> de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-700 dark:text-slate-300 flex items-center gap-1 active:scale-95"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Premium Detail Modal Overlay */}
      <AnimatePresence>
        {selectedFacility && (
          <PremiumDetailModal
            item={selectedFacility}
            likedFacilities={likedFacilities}
            onToggleLike={toggleLike}
            onClose={() => setSelectedFacility(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DetailModalProps {
  item: Clinic;
  likedFacilities: Record<string, boolean>;
  onToggleLike: (facilityId: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

function PremiumDetailModal({ item, likedFacilities, onToggleLike, onClose }: DetailModalProps) {
  const hasCoordinates = !!item.location;

  const handleDirections = () => {
    if (hasCoordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ', ' + item.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleAction = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'appointments' }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 border border-amber-500/20 rounded-[32px] overflow-hidden w-full max-w-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Cover image & close header */}
        <div className="relative h-60 w-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 text-center absolute inset-0">
              <span className="text-xl font-display font-black text-amber-600 dark:text-amber-400 leading-tight max-w-md">
                {item.name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/45 backdrop-blur-md text-white hover:bg-black/65 p-2.5 rounded-full transition-all border border-white/20 active:scale-90"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Floating tags */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2 items-center justify-between">
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Crown className="w-3 h-3 text-white fill-white" />
              Red Premium
            </span>
            
            <div className="flex gap-2">
              {item.rating && (
                <span className="flex items-center text-amber-400 gap-1 text-sm font-black bg-black/45 px-3 py-1 rounded-lg backdrop-blur-sm">
                  ★ {item.rating}
                </span>
              )}
              <button 
                onClick={(e) => onToggleLike(item.id, e)}
                className={`flex items-center gap-1.5 text-xs font-black bg-black/45 px-3 py-1.5 rounded-lg backdrop-blur-sm border transition-all active:scale-95 ${
                  likedFacilities[item.id] ? 'text-red-400 border-red-500/30 shadow-lg shadow-red-500/10' : 'text-white/80 border-white/10'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedFacilities[item.id] ? 'fill-red-400 text-red-400' : ''}`} />
                {Math.round(((item.rating || 4.2) * 14) + (likedFacilities[item.id] ? 1 : 0))}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Info Details */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-800 dark:text-white leading-tight mb-2">
              {item.name}
            </h2>
            <p className="text-amber-500 dark:text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-amber-500" />
              Establecimiento de Salud Privado Autorizado
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Acerca del Centro</h3>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-semibold opacity-90">
              {item.description || 'Instalaciones médicas premium diseñadas para ofrecer atención con los más altos estándares de calidad, comodidad y rapidez en Nicaragua.'}
            </p>
          </div>

          {item.services && item.services.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Servicios y Especialidades VIP</h3>
              <div className="flex flex-wrap gap-2">
                {item.services.map((service, idx) => (
                  <span key={idx} className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Línea Telefónica Directa</h4>
              <p className="text-slate-800 dark:text-white font-bold text-lg flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-amber-500 shrink-0" />
                {item.phone && item.phone !== 'N/D' ? item.phone : '+505 2255-6900'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Ubicación y Coordenadas</h4>
              <p className="text-slate-800 dark:text-white font-semibold text-sm flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                {item.address}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/40 shrink-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleDirections}
            className="flex-1 py-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir en Google Maps
          </button>
          
          <button 
            onClick={handleAction}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/25"
          >
            <Calendar className="w-4 h-4" />
            Agendar Turno / Cita
          </button>
        </div>
      </motion.div>
    </div>
  );
}
