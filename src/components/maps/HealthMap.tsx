import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Pill, 
  Activity, 
  Navigation, 
  Search, 
  Clock, 
  CheckCircle2, 
  Route,
  Target,
  Plus,
  Minus,
  AlertCircle,
  Globe,
  X,
  ShieldAlert,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  User,
  Mic,
  RotateCcw,
  Send,
  Hospital,
  Store,
  Clock4,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

import { Clinic } from '../../types';
import { getClinics } from '../../services/clinicService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { GOOGLE_MAPS_KEY } from "../../lib/config";

const calculateDistance = (pos1: google.maps.LatLngLiteral, pos2: google.maps.LatLngLiteral): string => {
  const R = 6371; // Radius of the earth in km
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
};

const API_KEY = GOOGLE_MAPS_KEY;
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function ClinicMarker({ clinic, onClick }: { clinic: Clinic & { isOpen?: boolean }, onClick: (c: Clinic) => void, key?: any }) {
  const [markerRef] = useAdvancedMarkerRef();
  
  const isOpen = clinic.isOpen !== undefined ? clinic.isOpen : clinic.open24h;

  const getColors = () => {
    if (!isOpen) {
      return { 
        bg: 'bg-surface-container-highest', 
        text: 'text-outline', 
        glow: 'opacity-20 shadow-none',
        color: '#404753'
      };
    }

    switch (clinic.type) {
      case 'pharmacy': return { 
        bg: 'bg-secondary', 
        text: 'text-on-secondary', 
        glow: 'shadow-[0_0_15px_rgba(81,223,142,0.4)]',
        color: '#51df8e'
      };
      case 'emergency': return { 
        bg: 'bg-error', 
        text: 'text-on-error', 
        glow: 'shadow-[0_0_20px_rgba(240,68,56,0.6)] animate-pulse',
        color: '#F04438'
      };
      default: return { 
        bg: 'bg-primary', 
        text: 'text-on-primary', 
        glow: 'shadow-[0_0_15px_rgba(166,200,255,0.4)]',
        color: '#a6c8ff'
      };
    }
  };

  const colors = getColors();
  const Icon = clinic.type === 'pharmacy' ? Store : (clinic.type === 'emergency' ? ShieldAlert : Hospital);
  const isVerified = clinic.id === '3' || clinic.id === '5'; // Mock global verification for certain IDs

  return (
    <AdvancedMarker
      ref={markerRef}
      position={clinic.location}
      onClick={() => onClick(clinic)}
      title={clinic.name}
    >
      <div className="relative group cursor-pointer">
        {/* Glow Effect */}
        <div className={`absolute -inset-3 rounded-full blur-2xl transition-all duration-500 ${colors.bg} ${colors.glow} ${clinic.type === 'emergency' && isOpen ? 'opacity-60 scale-125' : 'opacity-40'}`} />
        
        {/* Main Icon Container */}
        <div className={`relative flex items-center justify-center w-12 h-12 rounded-[18px] ${colors.bg} ${colors.text} border-2 border-white/20 shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-110 active:scale-95 z-10`}>
          <Icon className={`w-6 h-6 ${!isOpen ? 'opacity-40' : 'drop-shadow-lg'}`} />
          
          {/* Verified Badge */}
          {isVerified && isOpen && (
            <div className="absolute top-1 right-1">
              <CheckCircle2 className="w-3 h-3 text-white fill-primary-container" />
            </div>
          )}

          {/* Closed Overlay */}
          {!isOpen && (
            <div className="absolute inset-0 bg-surface/40 flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-full h-[2.5px] bg-outline-variant/60 rotate-45 shadow-sm" />
            </div>
          )}

          {/* Status Indicator */}
          <div className={`absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-[2.5px] border-surface flex items-center justify-center translate-x-1.5 translate-y-1.5 z-20 ${isOpen ? 'bg-secondary shadow-[0_0_10px_rgba(81,223,142,0.8)]' : 'bg-outline-variant shadow-inner'}`}>
            {isOpen ? (
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            ) : (
              <X className="w-2.5 h-2.5 text-surface font-black" />
            )}
          </div>
        </div>

        {/* Stem/Pointer */}
        <div className="relative z-0 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[12px] mx-auto transition-all duration-300 -mt-1 drop-shadow-xl"
             style={{ borderTopColor: colors.color }} />
             
        {/* Tooltip Label */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-xl border border-outline-variant/40 rounded-2xl px-4 py-2 shadow-[0_15px_30px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0 scale-90 group-hover:scale-100">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-on-surface">{clinic.name}</span>
              {clinic.open24h && <Clock4 className="w-3 h-3 text-primary opacity-70" />}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${isOpen ? 'text-secondary' : 'text-outline-variant'}`}>
                {isOpen ? 'Abierto • Servicio Activo' : 'Cerrado Temporalmente'}
              </span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface/95 border-b border-r border-outline-variant/40 rotate-45" />
        </div>
      </div>
    </AdvancedMarker>
  );
}

function Directions({
  origin,
  destination,
  onRouteUpdate
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteUpdate: (route: google.maps.DirectionsRoute) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#2E90FA',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      directionsRenderer.setDirections(response);
      onRouteUpdate(response.routes[0]);
    }).catch(e => {
      console.error('Directions request failed', e);
    });

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

function UserLocationMarker({ position }: { position: google.maps.LatLngLiteral }) {
  return (
    <AdvancedMarker position={position} zIndex={100}>
      <div className="relative flex items-center justify-center group">
        {/* Triple layer pulse for extreme prominence */}
        <div className="absolute w-16 h-16 bg-primary/10 rounded-full animate-ping opacity-30" />
        <div className="absolute w-10 h-10 bg-primary/25 rounded-full animate-ping opacity-50" />
        <div className="absolute w-8 h-8 bg-primary/30 rounded-full animate-pulse blur-sm" />
        
        {/* Main Location Beacon */}
        <div className="relative w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(46,144,250,0.8)] border-[3px] border-primary transition-transform group-hover:scale-125">
          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
        </div>
        
        {/* Direction Shadow/Arrow */}
        <div className="absolute -bottom-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-primary/60 group-hover:border-t-primary transition-colors" />

        {/* Persistent/Hover Label */}
        <div className="absolute -top-8 bg-primary/95 backdrop-blur-md px-3 py-1 rounded-full border border-primary-fixed/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 translate-x-1/2 right-1/2">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-on-primary whitespace-nowrap">Tu ubicación</span>
        </div>
      </div>
    </AdvancedMarker>
  );
}

function HealthMapInner({ hideMap = false }: { hideMap?: boolean }) {
  const { t } = useLanguage();
  const { isPremium } = useUser();
  const [clinics, setClinics] = useState<(Clinic & { isOpen?: boolean })[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<(Clinic & { isOpen?: boolean }) | null>(null);
  const [hasPlacesError, setHasPlacesError] = useState(false);
  const [center, setCenter] = useState({ lat: 12.1364, lng: -86.2514 }); // Default to Managua
  const [userLocation, setUserLocation] = useState({ lat: 12.1364, lng: -86.2514 });
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    steps?: google.maps.DirectionsStep[];
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency'>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [triageSummary, setTriageSummary] = useState<{
    urgency: string;
    description: string;
    condition: string;
  } | null>(null);

  const placesLib = useMapsLibrary('places');
  const map = useMap();

  // Real Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setCenter(pos);
          if (map) {
            map.setCenter(pos);
          }
        },
        () => {
          console.warn("Geolocation permission denied or failed. Using default center.");
        }
      );
    }
  }, [map]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const fetchHealthPlaces = async () => {
      if (!placesLib) return;
      try {
        console.log("Searching for health centers in Nicaragua...");
        // Use a try-catch for the specific searchByText call which might be blocked
        let places: any[] = [];
        try {
          const result = await placesLib.Place.searchByText({
            textQuery: 'hospitales y farmacias abiertas en Nicaragua',
            fields: ['id', 'displayName', 'location', 'formattedAddress', 'types', 'nationalPhoneNumber', 'regularOpeningHours'],
            locationBias: userLocation,
            maxResultCount: 20,
          });
          places = result.places || [];
          setHasPlacesError(false);
        } catch (searchError: any) {
          if (searchError.message?.includes('PERMISSION_DENIED') || searchError.message?.includes('blocked') || searchError.message?.includes('not enabled')) {
            console.warn("Places API (New) is blocked, not enabled, or unauthorized. Falling back to local/mock data.");
            setHasPlacesError(true);
          } else {
            console.error("Places API Search Error:", searchError);
            setHasPlacesError(true);
          }
        }

        const mappedClinics: (Clinic & { isOpen?: boolean })[] = places.map((p: any) => {
          const name = p.displayName || 'Centro de Salud';
          // Simple heuristic for public institutions in Nicaragua
          const isPublic = name.toLowerCase().includes('ministerio') || 
                          name.toLowerCase().includes('centro de salud') || 
                          name.toLowerCase().includes('puesto de salud') ||
                          name.toLowerCase().includes('minsa');

          const safeId = p.id || `gplace-${Math.random().toString(36).substr(2, 9)}`;

          return {
            id: safeId,
            name: name,
            type: (p.types?.includes('hospital') || p.types?.includes('medical_center')) ? 'emergency' : (p.types?.includes('pharmacy') ? 'pharmacy' : 'clinic'),
            sector: isPublic ? 'public' : 'private',
            location: {
              lat: typeof p.location?.lat === 'function' ? p.location.lat() : (p.location?.lat || 0),
              lng: typeof p.location?.lng === 'function' ? p.location.lng() : (p.location?.lng || 0)
            },
            address: p.formattedAddress || 'Nicaragua',
            phone: p.nationalPhoneNumber || '',
            open24h: p.types?.includes('hospital') || p.regularOpeningHours?.periods?.length === 1 && p.regularOpeningHours?.periods[0].open?.day === 0 && !p.regularOpeningHours?.periods[0].close,
            isOpen: p.regularOpeningHours?.isOpen ? p.regularOpeningHours.isOpen() : true,
          };
        });

        if (mappedClinics.length > 0) {
          setClinics(prev => {
            const seen = new Set(prev.map(c => String(c.id)));
            const uniqueResults = mappedClinics.filter(c => {
               if (seen.has(String(c.id))) return false;
               seen.add(String(c.id));
               return true;
            });
            return [...prev, ...uniqueResults];
          });
        }
      } catch (error) {
        console.error("Error in fetchHealthPlaces core logic:", error);
      }
    };

    fetchHealthPlaces();
  }, [placesLib, map, userLocation]);

  useEffect(() => {
    const handleMedicationSearch = (e: any) => {
      const medication = e.detail?.medication;
      if (medication) {
        setSearchTerm(medication);
        setFilter('pharmacy');
      }
    };

    const handleEmergencyMode = (e: any) => {
      const data = e.detail;
      if (data) {
        setIsEmergencyMode(true);
        setFilter('emergency');
        setTriageSummary({
          urgency: data.urgency || 'emergency',
          description: data.recommendation || 'Se requiere atención inmediata.',
          condition: data.medication || 'Compromiso Agudo'
        });
      }
    };

    window.addEventListener('medicationSearch', handleMedicationSearch);
    window.addEventListener('emergencyMode', handleEmergencyMode);
    return () => {
      window.removeEventListener('medicationSearch', handleMedicationSearch);
      window.removeEventListener('emergencyMode', handleEmergencyMode);
    };
  }, []);

  useEffect(() => {
    const mockClinics: (Clinic & { isOpen?: boolean })[] = [
      {
        id: 'nic-1',
        name: 'Farmacia FarmaValue Carretera Masaya',
        type: 'pharmacy',
        sector: 'private',
        location: { lat: 12.1154, lng: -86.2354 },
        address: 'Km 4.5 Carretera a Masaya, Managua',
        phone: '+505 2270 0000',
        inStock: true,
        open24h: true,
        isOpen: true,
      },
      {
        id: 'nic-2',
        name: 'Farmacia Kielsa Altamira',
        type: 'pharmacy',
        sector: 'private',
        location: { lat: 12.1250, lng: -86.2540 },
        address: 'Altamira d’ Este, Managua',
        phone: '+505 2278 1234',
        inStock: true,
        open24h: false,
        isOpen: true,
      },
      {
        id: 'nic-3',
        name: 'Hospital Central Dr. César Amador Kühl',
        type: 'emergency',
        sector: 'public',
        location: { lat: 12.1360, lng: -86.2650 },
        address: 'Managua, Nicaragua',
        phone: '+505 2277 1234',
        open24h: true,
        isOpen: true,
      },
      {
        id: 'nic-vivian',
        name: 'Hospital Vivian Pellas',
        type: 'emergency',
        sector: 'private',
        location: { lat: 12.0950, lng: -86.2250 },
        address: 'Km 9.5 Carretera a Masaya, Managua',
        phone: '+505 2255 6900',
        open24h: true,
        isOpen: true,
      },
      {
        id: 'nic-4',
        name: 'Hospital Militar Dr. Alejandro Dávila Bolaños',
        type: 'emergency',
        sector: 'public',
        location: { lat: 12.1480, lng: -86.2750 },
        address: 'Costado Oeste de Tiscapa, Managua',
        phone: '+505 2222 2100',
        open24h: true,
        isOpen: true,
      },
      {
        id: 'nic-5',
        name: 'Centro de Salud Pedro Altamirano',
        type: 'clinic',
        sector: 'public',
        location: { lat: 12.1280, lng: -86.2420 },
        address: 'Altamira, Managua',
        phone: '+505 2267 1111',
        open24h: false,
        isOpen: true,
      }
    ];

    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        // Defensive deduplication
        const seen = new Set();
        const deduplicated = data.filter(c => {
          if (seen.has(String(c.id))) return false;
          seen.add(String(c.id));
          return true;
        });

        if (deduplicated.length > 5) {
          setClinics(deduplicated);
        } else {
          setClinics(prev => {
             const existingIds = new Set(prev.map(c => String(c.id)));
             const uniqueMocks = mockClinics.filter(c => !existingIds.has(String(c.id)));
             return [...prev, ...uniqueMocks];
          });
        }
      } catch (e) {
        setClinics(prev => {
          const existingIds = new Set(prev.map(c => String(c.id)));
          const uniqueMocks = mockClinics.filter(c => !existingIds.has(String(c.id)));
          return [...prev, ...uniqueMocks];
        });
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => {
    const matchesFilter = filter === 'all' || c.type === filter;
    
    // Tiered Access Logic
    // If not premium, only show public sector units
    const matchesTier = isPremium || c.sector === 'public';

    return matchesFilter && matchesTier;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* Emergency Banner - Shown when in emergency mode */}
      <AnimatePresence>
        {isEmergencyMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-error-container text-on-error-container shrink-0 z-50 shadow-lg border-b border-error/50"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                  <ShieldAlert className="w-6 h-6 text-error animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-error leading-tight">Modo Emergencia Activo</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase font-mono">{triageSummary?.condition || 'Compromiso Cardiovascular Detectado'}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">ETA Guardia Central</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-error leading-none tracking-tighter">--:--</span>
                  <span className="text-xs font-bold text-error uppercase">min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar: Logistical Clarity */}
        <aside className="w-full md:w-[420px] lg:w-[480px] bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-20 shadow-xl overflow-hidden relative">
          
          {/* Navigation Active Sidebar */}
          <AnimatePresence mode="wait">
            {isNavigating && routeInfo ? (
              <motion.div 
                key="navigation"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-6 bg-surface-container border-b border-outline-variant/30 shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => {
                        setIsNavigating(false);
                        setRouteInfo(null);
                      }}
                      className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 active:scale-95 transition-transform"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Cancelar Ruta
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-secondary tracking-widest uppercase">En Camino</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-current shadow-xl ${
                      selectedClinic?.type === 'emergency' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                    }`}>
                      {selectedClinic?.type === 'emergency' ? <Activity className="w-8 h-8" /> : <Hospital className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-display font-black text-on-surface leading-tight tracking-tight">
                        {selectedClinic?.name || 'Centro Médico'}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline-variant uppercase">Distancia</span>
                          <span className="text-sm font-display font-bold text-on-surface">{routeInfo.distance}</span>
                        </div>
                        <div className="w-px h-6 bg-outline-variant/30" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline-variant uppercase">Tiempo</span>
                          <span className={`text-sm font-display font-bold ${selectedClinic?.type === 'emergency' ? 'text-error' : 'text-primary'}`}>{routeInfo.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/20 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                          <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Centro Notificado</span>
                    </div>
                    <button className="text-[10px] font-bold text-outline-variant hover:text-primary transition-colors">
                      DETALLES
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  <h4 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono mb-6">Instrucciones de Ruta</h4>
                  <div className="space-y-6">
                    {routeInfo.steps?.map((step, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-lg bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          </div>
                          {idx !== (routeInfo.steps?.length || 0) - 1 && (
                            <div className="w-0.5 flex-1 bg-outline-variant/20 my-1 group-hover:bg-primary/30 transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="text-sm text-on-surface font-medium mb-1" dangerouslySetInnerHTML={{ __html: step.instructions }} />
                          <div className="flex items-center gap-3 text-[10px] font-bold text-outline-variant font-mono">
                            <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {step.distance?.text}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {step.duration?.text}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-surface-container border-t border-outline-variant/20">
                  <button className="w-full h-14 bg-error text-on-error font-display font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    <AlertCircle className="w-5 h-5 fill-current" />
                    SOS: Alerta Médica
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-6 bg-surface-container border-b border-outline-variant/30 shrink-0">
            {isEmergencyMode ? (
              <>
                <div className="mb-4 bg-error-container/10 rounded-2xl p-4 border border-error/20 flex gap-4">
                  <div className="bg-error/10 p-2 rounded-xl h-fit border border-error/20">
                    <Stethoscope className="w-5 h-5 text-error" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Resumen de Triaje IA</h4>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                      {triageSummary?.description || 'Dolor torácico agudo reportado. Posible compromiso cardiovascular. Prioridad Alta.'}
                    </p>
                  </div>
                </div>

                {/* Direct Communication Section from Mockup */}
                <div className="bg-error-container/10 border border-error/20 rounded-2xl p-4 flex flex-col gap-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Comunicación Directa</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Grabando...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="w-12 h-12 bg-error text-on-error rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(240,68,56,0.3)] animate-pulse hover:scale-105 active:scale-95 transition-all outline-none">
                      <Mic className="w-5 h-5 fill-current" />
                    </button>
                    
                    <div className="flex-1 h-8 flex items-center gap-1 overflow-hidden">
                      {[0, 0.2, 0.4, 0.1, 0.3, 0.5, 0.2, 0.4, 0.1, 0.0].map((delay, i) => (
                        <div 
                          key={i}
                          style={{ 
                            animationDelay: `${delay}s`,
                            height: `${40 + Math.random() * 60}%` 
                          }}
                          className="w-0.5 bg-error/40 rounded-full animate-voice-bounce origin-center"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl p-3 shadow-inner">
                    <h5 className="text-[9px] font-bold text-outline-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1 h-1 bg-primary rounded-full" />
                       Transcripción en tiempo real
                    </h5>
                    <p className="text-xs text-on-surface font-medium italic leading-relaxed">
                      "Siento un dolor punzante en el pecho que se extiende hacia el brazo izquierdo..."
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-error/20 border border-error/40 hover:bg-error/30 text-error py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Send className="w-3 h-3" />
                      Confirmar y Enviar
                    </button>
                    <button className="px-3 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant rounded-xl flex items-center justify-center hover:bg-surface-container-highest transition-all group">
                      <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <Search className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-on-surface">Red de Salud</h2>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      isPremium 
                        ? 'bg-primary/20 text-primary border-primary/30' 
                        : 'bg-hospital-green/10 text-hospital-green border-hospital-green/20'
                    }`}>
                      {isPremium ? 'Red Total Premium' : 'Solo Red Pública'}
                    </span>
                  </div>
                  {hasPlacesError && (
                    <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-error/10 border border-error/20 rounded-md">
                      <AlertTriangle className="w-3 h-3 text-error" />
                      <span className="text-[8px] font-black uppercase tracking-wider text-error">Modo Offline API: Habilitar Places API (New)</span>
                    </div>
                  )}
                </div>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTerm('')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all font-mono"
                  >
                    <span>{searchTerm.toUpperCase()}</span>
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </div>
            )}
            
            {!isPremium && !isEmergencyMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-5 bg-primary/5 rounded-[24px] border border-primary/20 shadow-inner relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                   <ShieldAlert className="w-16 h-16 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nuestra Misión</span>
                  </div>
                  <h4 className="text-sm font-display font-black text-on-surface mb-2">{t('maps.social_mission.title')}</h4>
                  <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-80">
                    {t('maps.social_mission.desc')}
                  </p>
                </div>
              </motion.div>
            )}
            
            <div className="flex gap-2 mt-6 md:mt-8 overflow-x-auto scrollbar-hide pb-1">
               {[
                 { id: 'all', label: 'Todos', icon: Globe },
                 { id: 'pharmacy', label: 'Farmacias', icon: Pill },
                 { id: 'emergency', label: 'Urgencias', icon: Activity }
               ].map((f) => (
                 <button
                   key={f.id}
                   onClick={() => setFilter(f.id as any)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shadow-sm font-mono ${
                     filter === f.id 
                       ? 'bg-primary text-on-primary border-primary' 
                       : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/40'
                   }`}
                 >
                   <f.icon className="w-3.5 h-3.5" />
                   {f.label.toUpperCase()}
                 </button>
               ))}
            </div>
          </div>

          <div className="p-4 px-6 bg-surface-container-low border-b border-outline-variant/10">
            <h3 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono">Centros Cercanos Prioritarios</h3>
          </div>

          {/* Scrollable Pharmacy List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {filteredClinics.map((clinic) => (
              <motion.div
                layout
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`group relative bg-surface-container p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedClinic?.id === clinic.id 
                    ? 'border-primary ring-1 ring-primary/40 shadow-[0_8px_24px_rgba(46,144,250,0.15)] bg-surface-container-high' 
                    : isEmergencyMode && clinic.type === 'emergency'
                      ? 'border-error/30 bg-error/5 hover:bg-error/10'
                      : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high'
                }`}
              >
                {selectedClinic?.id === clinic.id && (
                  <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-full ${clinic.type === 'emergency' ? 'bg-error' : 'bg-primary'}`} />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-current transition-colors ${
                      clinic.type === 'emergency' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {clinic.type === 'emergency' ? <Activity className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg leading-tight transition-colors ${
                        clinic.type === 'emergency' ? 'text-on-surface group-hover:text-error' : 'text-on-surface group-hover:text-secondary'
                      }`}>
                        {clinic.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                          clinic.sector === 'public' 
                            ? 'bg-hospital-green/10 text-hospital-green border-hospital-green/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {clinic.sector === 'public' ? t('maps.tag.public') : t('maps.tag.private')}
                        </span>
                        <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium italic opacity-70">
                          <MapPin className="w-3 h-3" /> {clinic.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xl font-display font-bold leading-none ${clinic.type === 'emergency' ? 'text-error' : 'text-primary'}`}>
                      {calculateDistance(userLocation, clinic.location)}
                    </span>
                    {clinic.type === 'emergency' ? (
                      <span className="text-[10px] font-bold text-error uppercase tracking-tighter mt-1 font-mono">Prioridad Alta</span>
                    ) : (
                      <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-tighter mt-1">Cerca de ti</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {clinic.type === 'pharmacy' && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                      searchTerm 
                        ? 'bg-secondary-container text-on-secondary-container border-secondary-container animate-pulse' 
                        : 'bg-secondary-container/10 text-secondary-container border-secondary-container/20'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" /> 
                      {searchTerm ? `Stock de ${searchTerm} Confirmado` : 'Stock Confirmado'}
                    </div>
                  )}
                  {clinic.open24h && (
                    <div className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-outline-variant/30">
                      <Clock className="w-3 h-3" /> 24 Horas
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setIsNavigating(true);
                  }}
                  className={`w-full py-3.5 px-4 rounded-[18px] font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  selectedClinic?.id === clinic.id
                    ? clinic.type === 'emergency' ? 'bg-error text-on-error shadow-lg shadow-error/20' : 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container-highest text-on-surface border border-outline-variant/30 hover:bg-surface-container transition-all active:scale-[0.98]'
                }`}>
                  <Route className="w-4 h-4" />
                  Iniciar Navegación
                </button>
              </motion.div>
            ))}
          </div>

          {/* Emergency Contacts Section from Mockup */}
          {isEmergencyMode && (
            <div className="p-6 bg-surface-container border-t border-outline-variant/20 flex flex-col gap-4">
               <h3 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono pl-1">Contactos de Emergencia</h3>
               <button className="w-full bg-surface-container-high border border-outline-variant/30 rounded-2xl p-4 flex items-center gap-4 hover:border-primary group transition-all shadow-sm">
                 <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all">
                   <User className="w-6 h-6 fill-current" />
                 </div>
                 <div className="flex-1 text-left">
                   <h4 className="font-bold text-on-surface text-sm">María (Hija)</h4>
                   <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-0.5">Aviso de Emergencia</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-all shadow-sm">
                   <Phone className="w-5 h-5" />
                 </div>
               </button>
            </div>
          )}

          {isEmergencyMode && (
             <div className="px-6 pb-6 pt-2 space-y-4">
                <button className="w-full h-14 bg-primary text-on-primary font-display font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-[0_8px_20px_rgba(46,144,250,0.3)] hover:shadow-[0_12px_28px_rgba(46,144,250,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <Navigation className="w-5 h-5 fill-current" />
                  Iniciar Navegación
                </button>

                <button 
                  onClick={() => setIsEmergencyMode(false)}
                  className="w-full py-3 text-[10px] font-bold text-outline-variant hover:text-error uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-dashed border-outline-variant/30 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" /> Finalizar Modo Emergencia
                </button>
             </div>
          )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Map Section */}
        <section className="flex-1 relative bg-background overflow-hidden">
          {hasValidKey && !hideMap ? (
              <Map
                defaultCenter={center}
                defaultZoom={13}
                mapId="DARK_MODE_MAP"
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI
                styles={[
                   {
                     "featureType": "all",
                     "elementType": "labels.text.fill",
                     "stylers": [{"color": "#8a919e"}]
                   },
                   {
                     "featureType": "all",
                     "elementType": "labels.icon",
                     "stylers": [{"visibility": "off"}]
                   },
                   {
                     "featureType": "landscape",
                     "elementType": "all",
                     "stylers": [{"color": "#0b1326"}]
                   },
                   {
                     "featureType": "poi",
                     "elementType": "all",
                     "stylers": [{"visibility": "off"}]
                   },
                   {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [{"color": "#171f33"}]
                   },
                   {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [{"color": "#060e20"}]
                   }
                ]}
              >
                {clinics.map(clinic => (
                  <ClinicMarker 
                    key={clinic.id} 
                    clinic={clinic} 
                    onClick={(c) => {
                      setSelectedClinic(c);
                      if (isNavigating) setIsNavigating(false);
                    }} 
                  />
                ))}

                {isNavigating && selectedClinic && (
                  <Directions
                    origin={userLocation}
                    destination={selectedClinic.location}
                    onRouteUpdate={(route) => {
                      setRouteInfo({
                        distance: route.legs[0].distance?.text || '',
                        duration: route.legs[0].duration?.text || '',
                        steps: route.legs[0].steps
                      });
                    }}
                  />
                )}

                {/* User Current Location */}
                <UserLocationMarker position={userLocation} />

                {/* InfoWindow custom logic */}
                {selectedClinic && (
                  <InfoWindow
                    position={selectedClinic.location}
                    onCloseClick={() => {
                      setSelectedClinic(null);
                      if (isNavigating) setIsNavigating(false);
                    }}
                    headerDisabled
                  >
                    {(() => {
                      const isOpen = selectedClinic.isOpen !== undefined ? selectedClinic.isOpen : selectedClinic.open24h;
                      return (
                        <div className="p-0 -m-1 min-w-[300px] overflow-hidden bg-surface rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
                          {/* Card Header with Type-specific background gradient */}
                          <div className={`p-4 ${
                            selectedClinic.type === 'emergency' 
                              ? 'bg-gradient-to-br from-error/20 to-error/5' 
                              : 'bg-gradient-to-br from-primary/20 to-primary/5'
                          } border-b border-outline-variant/10`}>
                            <div className="flex items-start gap-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-current shrink-0 shadow-xl ${
                                selectedClinic.type === 'emergency' ? 'bg-error/10 text-error shadow-error/10' : 'bg-primary/10 text-primary shadow-primary/10'
                              }`}>
                                {selectedClinic.type === 'emergency' ? <ShieldAlert className="w-8 h-8" /> : <Hospital className="w-8 h-8" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-display font-black text-xl text-on-surface leading-tight tracking-tight">{selectedClinic.name}</h4>
                                </div>
                                <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70">
                                  {selectedClinic.address}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                               <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em]">Estado del Centro</span>
                                  <div className="flex items-center gap-2.5">
                                     <div className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-secondary animate-pulse shadow-[0_0_10px_rgba(81,223,142,0.8)]' : 'bg-outline-variant'}`} />
                                     <span className={`text-xs font-black uppercase tracking-[0.1em] ${isOpen ? 'text-secondary' : 'text-outline-variant'}`}>
                                        {isOpen ? 'Disponible Ahora' : 'Cerrado Actualmente'}
                                     </span>
                                  </div>
                               </div>
                               <div className="flex flex-col items-end gap-1">
                                  <span className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em]">Distancia</span>
                                  <div className="flex items-center gap-1.5">
                                    <Route className="w-4 h-4 text-primary opacity-60" />
                                    <span className="text-xl font-display font-black text-on-surface leading-none">
                                      {calculateDistance(userLocation, selectedClinic.location)}
                                    </span>
                                  </div>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => setIsNavigating(true)}
                                className={`h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group/btn overflow-hidden relative ${
                                  selectedClinic.type === 'emergency' ? 'bg-error text-on-error shadow-error/30' : 'bg-primary text-on-primary shadow-primary-fixed/30'
                                }`}
                              >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <Navigation className="w-5 h-5 fill-current group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                Iniciar Navegación
                              </button>
                              <a 
                                href={`tel:${selectedClinic.phone}`} 
                                className="h-14 bg-surface-container-high border border-outline-variant/40 rounded-2xl flex items-center justify-center gap-3 text-on-surface hover:text-primary transition-all hover:bg-surface-bright group/phone shadow-lg"
                              >
                                <Phone className="w-5 h-5 group-hover/phone:rotate-[15deg] transition-transform text-secondary" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Llamar</span>
                              </a>
                            </div>
                            
                            {selectedClinic.type === 'emergency' && (
                              <div className="flex items-center gap-3 p-3 bg-error/5 rounded-xl border border-error/10">
                                <AlertTriangle className="w-4 h-4 text-error animate-pulse shrink-0" />
                                <p className="text-[10px] font-bold text-error uppercase tracking-wider leading-tight">
                                  Prioridad de urgencia activada para este destino
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </InfoWindow>
                )}
              </Map>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-cover bg-center grayscale opacity-60 mix-blend-screen" 
                 style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr1biyQAoYA3-Hq4qI8fOnXgkDERfbtqJkhE-oG7uZ4-nBBThi8jcCdIv0NgUFbXo3y-ZgwB_s_1I-5wAnm4FvBemeWNmid3vACTSYEsbzGZBuGoR5bXL2UudJAMv0AWlhvwFnKwgmGd5DOvNAdY8rTU1fkU19OHPwJpJD9sffZaPnlLUf3ZKASDhmvchKGnkH0COXzxRyi9GhwHgSlHa9ab-IfkSp-uJRxlwfm70XGgys-UtZ2YPaMWxQInl8Pz-lQNgr3E_C5g')` }}
            />
          )}

          {/* Route Overlay: Desktop only floating panel */}
          <div className="hidden md:flex absolute top-6 right-6 p-6 glass-panel-elevated rounded-2xl w-[320px] flex-col gap-4 z-10 shadow-2xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isEmergencyMode ? 'bg-error/20 text-error border-error/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
                {isEmergencyMode ? <AlertCircle className="w-4 h-4 animation-pulse" /> : <Route className="w-4 h-4" />}
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface leading-tight">
                {isEmergencyMode ? 'Ruta de Urgencia' : 'Ruta Activa'}
              </h3>
            </div>
            
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-3">
              <span className="text-xs text-on-surface-variant font-medium">Llegada estimada</span>
              <span className={`text-2xl font-display font-bold ${isEmergencyMode ? 'text-error' : 'text-primary'}`}>14:35</span>
            </div>

            <div className={`flex items-center gap-3 ${isEmergencyMode ? 'text-error' : 'text-secondary-container'}`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isEmergencyMode ? 'animate-pulse' : ''}`} />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono leading-tight">
                {isEmergencyMode ? 'Prioridad Médica Notificada' : 'Stock Reservado Temporalmente'}
              </p>
            </div>

            {!hasValidKey && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-error leading-tight">Configuración de API Key requerida para navegación real.</p>
              </div>
            )}
            
            {isEmergencyMode && (
              <div className="bg-surface-container-high rounded-xl p-3 border border-error/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-error uppercase tracking-widest">Estado Guardia</span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase bg-error/10 px-2 py-0.5 rounded-full">Alta Demanda</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                   <div className="bg-error h-full w-4/5 animate-shimmer" />
                </div>
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
             <button 
               onClick={() => map?.setCenter(userLocation)}
               className="w-12 h-12 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
               title="Centrar en mi ubicación"
             >
               <Target className="w-6 h-6" />
             </button>
             <div className="flex flex-col bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
               <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/20">
                 <Plus className="w-6 h-6" />
               </button>
               <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all">
                 <Minus className="w-6 h-6" />
               </button>
             </div>
          </div>

          {/* Mobile Toggle: Map View Label */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary-fixed uppercase tracking-widest shadow-lg">
            Vista Satelital IA
          </div>
        </section>
      </div>

    </div>
  );
}

export default function HealthMap() {
  const { t } = useLanguage();
  const [authError, setAuthError] = useState<string | null>(null);
  const [bypassError, setBypassError] = useState(false);

  useEffect(() => {
    // Detect Google Maps authentication failures (e.g., RefererNotAllowedMapError)
    const win = window as any;
    const originalGmAuthFailure = win.gm_authFailure;
    win.gm_authFailure = () => {
      console.error("Google Maps API Authentication Failure detected.");
      setAuthError("RefererNotAllowedMapError");
      if (originalGmAuthFailure) originalGmAuthFailure();
    };

    return () => {
      win.gm_authFailure = originalGmAuthFailure;
    };
  }, []);

  if ((!hasValidKey || authError) && !bypassError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-error/10 rounded-2xl flex items-center justify-center mx-auto border border-error/20">
             <ShieldAlert className="w-10 h-10 text-error" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface mb-2">
              {authError === "RefererNotAllowedMapError" 
                ? "Error de Configuración de API" 
                : t('maps.key_required.title')}
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {authError === "RefererNotAllowedMapError"
                ? "Hay problemas con las restricciones de seguridad (Referer) de tu Google Maps API Key."
                : t('maps.key_required.desc')}
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            {authError === "RefererNotAllowedMapError" ? (
              <div className="space-y-6">
                <div className="p-4 bg-error/5 rounded-2xl border border-error/20">
                   <h4 className="text-[10px] font-black text-error uppercase tracking-widest mb-3 flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5" /> Pasos Obligatorios para Google Cloud
                   </h4>
                   <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-3 h-3 text-error" />
                        </div>
                        <p className="text-[10px] font-medium text-on-surface-variant">
                          <b>Paso 1:</b> En tu API Key, ve a <b>Restricciones de API</b> y asegúrate que NO este restringida o que incluya <b>Maps JavaScript API</b> y <b>Places API</b>.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-3 h-3 text-error" />
                        </div>
                        <p className="text-[10px] font-medium text-on-surface-variant">
                          <b>Paso 2:</b> En <b>Restricciones de sitios web</b>, borra cualquier restricción antigua o añade la URL actual (ver abajo).
                        </p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs shrink-0">A</div>
                  <div className="text-xs text-on-surface-variant font-medium">
                    Ve a <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline inline-flex items-center gap-1 text-[10px]">Credenciales en Cloud Console <ExternalLink className="w-3 h-3" /></a>.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs shrink-0">B</div>
                  <div className="text-xs text-on-surface-variant font-medium flex-1">
                    Autoriza esta URL exacta en las restricciones de sitio web: <br/>
                    <div className="mt-2 flex items-center gap-2">
                       <code className="bg-surface-container-highest px-3 py-2 rounded-xl text-[10px] break-all border border-outline-variant/30 flex-1 font-mono">
                         {window.location.origin}/*
                       </code>
                       <button 
                         onClick={() => navigator.clipboard.writeText(`${window.location.origin}/*`)}
                         className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95 border border-primary/20"
                       >
                         COPIAR
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs shrink-0">1</div>
                  <p className="text-xs text-on-surface-variant">{t('maps.key_required.step1')} <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" className="text-primary font-bold underline">Google Cloud Console</a>.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs shrink-0">2</div>
                  <p className="text-xs text-on-surface-variant">{t('maps.key_required.step2_prefix')} <b>Settings (⚙️)</b> → <b>Secrets</b> {t('maps.key_required.step2_middle')} <code>GOOGLE_MAPS_PLATFORM_KEY</code>.</p>
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-loose">
              {authError === "RefererNotAllowedMapError" 
                ? "Una vez guardado en Google Cloud, refresca esta página."
                : t('maps.key_required.rebuild')}
            </p>
          </div>

          <button 
            onClick={() => setBypassError(true)}
            className="w-full py-4 bg-surface-container-highest rounded-2xl text-xs font-black uppercase tracking-widest text-on-surface flex items-center justify-center gap-2 hover:bg-outline-variant/20 transition-all"
          >
            Continuar sin Mapa (Modo Lista)
          </button>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <HealthMapInner hideMap={Boolean(authError)} />
    </APIProvider>
  );
}
