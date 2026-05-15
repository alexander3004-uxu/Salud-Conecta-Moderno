import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Menu
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

// Custom clinic icon factory
const createClinicIcon = (type: string, isOpen: boolean, isSelected: boolean) => {
  const colors: Record<string, { bg: string; border: string }> = {
    pharmacy: { bg: '#51df8e', border: '#2ecc71' },
    emergency: { bg: '#F04438', border: '#c0392b' },
    default: { bg: '#a6c8ff', border: '#2E90FA' },
  };
  const color = type === 'pharmacy' ? colors.pharmacy : type === 'emergency' ? colors.emergency : colors.default;
  
  return null as any;
};

const userIcon = null as any;

function Directions({
  origin,
  destination,
  onRouteUpdate
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteUpdate: (leg: google.maps.DirectionsLeg) => void;
}) {
  const map = useMap();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsService(new google.maps.DirectionsService());

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!directionsService || !map || !origin || !destination) return;

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const route = result.routes[0];
        const leg = route.legs[0];
        
        // Remove previous polyline
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }

        // Render the route manually using a Polyline
        const path = route.overview_path;
        const polyline = new google.maps.Polyline({
          path,
          strokeColor: '#2E90FA',
          strokeWeight: 6,
          strokeOpacity: 0.8,
          map: map
        });
        polylineRef.current = polyline;

        // Fit map to show the entire route
        if (route.bounds) {
          map.fitBounds(route.bounds);
        }

        onRouteUpdate(leg);
      } else {
        console.error('Directions request failed', status);
      }
    });
  }, [directionsService, map, origin, destination, onRouteUpdate]);

  return null;
}

const ClinicMarker: React.FC<{ clinic: Clinic & { isOpen?: boolean }, onClick: (c: Clinic & { isOpen?: boolean }) => void }> = ({ clinic, onClick }) => {
  const isOpen = clinic.isOpen !== undefined ? clinic.isOpen : clinic.open24h;
  const isSelected = false;
  
  const colors: Record<string, { bg: string; border: string }> = {
    pharmacy: { bg: '#51df8e', border: '#2ecc71' },
    emergency: { bg: '#F04438', border: '#c0392b' },
    default: { bg: '#a6c8ff', border: '#2E90FA' },
  };
  const color = clinic.type === 'pharmacy' ? colors.pharmacy : clinic.type === 'emergency' ? colors.emergency : colors.default;

  return (
    <AdvancedMarker position={clinic.location} onClick={() => onClick(clinic)}>
      <div className="relative flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform">
        <div style={{
          width: '44px', height: '44px', 
          background: isOpen ? color.bg : '#404753', 
          border: `3px solid ${isSelected ? '#fff' : color.border}`,
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          transition: 'all 0.3s',
          opacity: !isOpen ? 0.6 : 1
        }}>
          {clinic.type === 'pharmacy' ? <Pill className="w-5 h-5 text-white" /> : 
           clinic.type === 'emergency' ? <ShieldAlert className="w-5 h-5 text-white" /> : 
           <Hospital className="w-5 h-5 text-white" />}
        </div>
        <div style={{
          width: 0, height: 0, 
          borderLeft: '6px solid transparent', 
          borderRight: '6px solid transparent', 
          borderTop: `10px solid ${isOpen ? color.bg : '#404753'}`,
          marginTop: '-2px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }} />
        {isOpen && (
          <div style={{
            width: '10px', height: '10px', 
            background: color.bg, 
            borderRadius: '50%',
            position: 'absolute', bottom: '18px', right: '-2px',
            border: '2px solid white',
            boxShadow: `0 0 10px ${color.bg}`
          }} />
        )}
      </div>
    </AdvancedMarker>
  );
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
  const { isPremium, setMembership } = useUser();
  const [isSearching, setIsSearching] = useState(false);
  const [clinics, setClinics] = useState<(Clinic & { isOpen?: boolean })[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<(Clinic & { isOpen?: boolean }) | null>(null);
  const [hasPlacesError, setHasPlacesError] = useState(false);
  const [center, setCenter] = useState({ lat: 12.1328, lng: -86.2504 }); // Managua, Nicaragua
  const [userLocation, setUserLocation] = useState({ lat: 12.1328, lng: -86.2504 });
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    steps?: google.maps.DirectionsStep[];
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency' | 'hospital' | 'health-center' | 'laboratory' | 'clinic'>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleRouteUpdate = React.useCallback((leg: google.maps.DirectionsLeg) => {
    setRouteInfo({
      distance: leg.distance?.text || '',
      duration: leg.duration?.text || '',
      steps: leg.steps
    });
  }, []);

  const getStepIcon = (instructions: string) => {
    const lower = instructions.toLowerCase();
    if (lower.includes('izquierda') || lower.includes('left')) return <CornerUpLeft className="w-3.5 h-3.5" />;
    if (lower.includes('derecha') || lower.includes('right')) return <CornerUpRight className="w-3.5 h-3.5" />;
    if (lower.includes('continúa') || lower.includes('continue') || lower.includes('recto') || lower.includes('straight')) return <ArrowUp className="w-3.5 h-3.5" />;
    if (lower.includes('gira') || lower.includes('turn')) {
        if (lower.includes('izquierda') || lower.includes('left')) return <CornerUpLeft className="w-3.5 h-3.5" />;
        return <CornerUpRight className="w-3.5 h-3.5" />;
    }
    return <Navigation className="w-3.5 h-3.5" />;
  };

  const [triageSummary, setTriageSummary] = useState<{
    urgency: string;
    description: string;
    condition: string;
  } | null>(null);

  const placesLib = useMapsLibrary('places');
  const map = useMap();

  // Function to search for places in the current map view
  const searchInView = async () => {
    return; // DISABLED to prevent Google Places API quota exhaustion (429 Too Many Requests)
    
    if (!placesLib || !map) return;
    
    const bounds = map.getBounds();
    if (!bounds) return;

    setIsSearching(true);
    try {
      const searchTerms = [
        'hospital', 
        'clínica', 
        'centro de salud', 
        'farmacia', 
        'laboratorio clínico',
        'MINSA Nicaragua'
      ];

      // Use the new Places API (SearchByText) with locationBias from bounds
      // We'll execute a few broad searches to get more results
      for (const term of searchTerms) {
        try {
          const result = await placesLib.Place.searchByText({
            textQuery: `${term} en Nicaragua`,
            fields: ['id', 'displayName', 'location', 'formattedAddress', 'types', 'nationalPhoneNumber', 'regularOpeningHours', 'rating', 'userRatingCount'],
            locationBias: bounds,
            maxResultCount: 20,
          });

          if (result.places && result.places.length > 0) {
            const mappedClinics: (Clinic & { isOpen?: boolean })[] = result.places.map((p: any) => {
              const name = p.displayName || 'Centro de Salud';
              const isPublic = name.toLowerCase().includes('ministerio') || 
                              name.toLowerCase().includes('centro de salud') || 
                              name.toLowerCase().includes('puesto de salud') ||
                              name.toLowerCase().includes('minsa') ||
                              name.toLowerCase().includes('hospital escuela');

              const types = p.types || [];
              let clinicType: Clinic['type'] = 'clinic';
              
              if (types.includes('hospital')) {
                clinicType = 'hospital';
              } else if (types.includes('pharmacy') || types.includes('drugstore')) {
                clinicType = 'pharmacy';
              } else if (types.includes('health') || types.includes('medical_center')) {
                // Heuristic to distinguish between emergency and simple health center
                if (name.toLowerCase().includes('emergencia') || name.toLowerCase().includes('urgencia')) {
                  clinicType = 'emergency';
                } else if (name.toLowerCase().includes('laboratorio')) {
                  clinicType = 'laboratory';
                } else {
                  clinicType = 'health-center';
                }
              }

              return {
                id: p.id || `gplace-${Math.random().toString(36).substr(2, 9)}`,
                name: name,
                type: clinicType,
                sector: isPublic ? 'public' : 'private',
                location: {
                  lat: typeof p.location?.lat === 'function' ? p.location.lat() : (p.location?.lat || 0),
                  lng: typeof p.location?.lng === 'function' ? p.location.lng() : (p.location?.lng || 0)
                },
                address: p.formattedAddress || 'Nicaragua',
                phone: p.nationalPhoneNumber || '',
                open24h: types.includes('hospital') || (p.regularOpeningHours?.periods?.length === 1 && p.regularOpeningHours?.periods[0].open?.day === 0 && !p.regularOpeningHours?.periods[0].close),
                isOpen: p.regularOpeningHours?.isOpen ? p.regularOpeningHours.isOpen() : true,
                rating: p.rating,
                reviews: p.userRatingCount
              };
            });

            setClinics(prev => {
              const seenIds = new Set(prev.map(c => String(c.id)));
              const newUnique = mappedClinics.filter(c => !seenIds.has(String(c.id)));
              return [...prev, ...newUnique];
            });
          }
        } catch (err) {
          console.warn(`Search failed for term: ${term}`, err);
        }
      }
    } catch (error) {
      console.error("Global search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Real Geolocation - Priority Initialization
  useEffect(() => {
    if (map && placesLib) {
      searchInView();
    }
  }, [map, placesLib]);

  useEffect(() => {
    const handleLocation = (position: GeolocationPosition) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log("Location detected:", pos);
      setUserLocation(pos);
      // Only set center once or if explicitly requested to avoid jumpy UX
      setCenter(pos);
      if (map) {
        map.setCenter(pos);
      }
    };

    if (navigator.geolocation) {
      // First attempt
      navigator.geolocation.getCurrentPosition(handleLocation, (err) => {
        console.warn("Geolocation initial failed:", err);
      }, { enableHighAccuracy: true });

      // Persistent watch for better accuracy if user moves
      const watchId = navigator.geolocation.watchPosition(
        (p) => {
          const newPos = { lat: p.coords.latitude, lng: p.coords.longitude };
          setUserLocation(newPos);
        },
        null,
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map]);

  useEffect(() => {
    const handleMedicationSearch = (e: any) => {
      const medication = e.detail?.medication;
      if (medication) {
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
    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        const seen = new Set();
        const deduplicated = data.filter(c => {
          if (seen.has(String(c.id))) return false;
          seen.add(String(c.id));
          return true;
        });

        setClinics(prev => {
          const existingIds = new Set(prev.map(c => String(c.id)));
          const uniqueResults = deduplicated.filter(c => !existingIds.has(String(c.id)));
          return [...prev, ...uniqueResults];
        });
      } catch (e) {
        console.error("Error loading clinics:", e);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics
    .filter(c => {
      const matchesFilter = filter === 'all' || c.type === filter;
      
      // Removed tiered access logic that was hiding private centers
      return matchesFilter;
    })
    .sort((a, b) => {
      const aLat = a.location?.lat || 0;
      const aLng = a.location?.lng || 0;
      const bLat = b.location?.lat || 0;
      const bLng = b.location?.lng || 0;
      const distA = Math.sqrt(Math.pow(aLat - userLocation.lat, 2) + Math.pow(aLng - userLocation.lng, 2));
      const distB = Math.sqrt(Math.pow(bLat - userLocation.lat, 2) + Math.pow(bLng - userLocation.lng, 2));
      return distA - distB;
    });

  // Improved Emergency Mode: Auto-select nearest clinic
  useEffect(() => {
    if (isEmergencyMode && !selectedClinic && filteredClinics.length > 0) {
      setSelectedClinic(filteredClinics[0]);
    }
  }, [isEmergencyMode, selectedClinic, filteredClinics]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      
      {/* Map Section - Full Background */}
      <section className="absolute inset-0 z-0 overflow-hidden">
        {hasValidKey && !hideMap ? (
            <Map
              defaultCenter={center}
              defaultZoom={13}
              mapId="DARK_MODE_MAP"
              className="w-full h-full"
              gestureHandling="greedy"
              disableDefaultUI
              onIdle={searchInView}
            >
              {filteredClinics.map(clinic => (
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
                  onRouteUpdate={handleRouteUpdate}
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

                            <div className="grid grid-cols-1 gap-3">
                              <button 
                                onClick={() => {
                                  if (selectedClinic.sector === 'private' && !isPremium) {
                                    setMembership('premium');
                                    return;
                                  }
                                  setIsNavigating(true);
                                  // Scroll to top of panel to see instructions
                                  const panel = document.querySelector('aside');
                                  if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group/btn overflow-hidden relative ${
                                  selectedClinic.sector === 'private' && !isPremium
                                    ? 'bg-outline-variant/20 text-outline-variant cursor-not-allowed border border-outline-variant/30'
                                    : selectedClinic.type === 'emergency' ? 'bg-error text-on-error shadow-error/30' : 'bg-primary text-on-primary shadow-primary-fixed/30'
                                }`}
                              >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                {selectedClinic.sector === 'private' && !isPremium ? (
                                  <ShieldAlert className="w-5 h-5" />
                                ) : (
                                  <Navigation className="w-5 h-5 fill-current group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                )}
                                {selectedClinic.sector === 'private' && !isPremium ? 'Suscripción Requerida' : 'Iniciar Navegación (Instrucciones)'}
                              </button>

                              <div className="grid grid-cols-2 gap-3">
                                <a 
                                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedClinic.location.lat},${selectedClinic.location.lng}&travelmode=driving`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-14 bg-surface-container-high border border-outline-variant/40 rounded-2xl flex items-center justify-center gap-3 text-on-surface hover:text-primary transition-all hover:bg-surface-bright group/gmaps shadow-lg"
                                >
                                  <ExternalLink className="w-5 h-5 text-secondary" />
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">GPS Maps</span>
                                </a>
                                <a 
                                  href={`tel:${selectedClinic.phone}`} 
                                  className="h-14 bg-surface-container-high border border-outline-variant/40 rounded-2xl flex items-center justify-center gap-3 text-on-surface hover:text-primary transition-all hover:bg-surface-bright group/phone shadow-lg"
                                >
                                  <Phone className="w-5 h-5 group-hover/phone:rotate-[15deg] transition-transform text-secondary" />
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Llamar</span>
                                </a>
                              </div>
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
      </section>

      {/* Emergency Banner - Floating Overlay */}
      <AnimatePresence>
        {isEmergencyMode && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-error-container text-on-error-container shrink-0 z-50 shadow-2xl border border-error/50 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                  <ShieldAlert className="w-6 h-6 text-error animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-error leading-tight">Modo Emergencia Activo</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase font-mono">{triageSummary?.condition || 'Compromiso Agudo'}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">ETA Guardia</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-black text-error leading-none tracking-tighter">--:--</span>
                  <span className="text-[10px] font-bold text-error uppercase">min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Search Bar - Google Maps Style */}
      <div className="absolute top-6 left-6 right-6 md:right-auto md:w-[420px] z-40 pointer-events-auto">
        <div className="flex items-center bg-surface-container/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group transition-all focus-within:ring-2 focus-within:ring-primary/40 h-14">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-14 h-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-90 border-r border-outline-variant/10"
            title="Menú de Red de Salud"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center px-4 gap-3 cursor-pointer" onClick={() => setIsMenuOpen(true)}>
            <Search className="w-5 h-5 text-on-surface-variant/50" />
            <span className="text-sm text-on-surface-variant/60 font-medium">Buscar hospitales, farmacias...</span>
          </div>

          <div className="flex items-center gap-1 pr-2">
            <button 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-outline-variant/20 mx-1" />
            <button 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-pointer"
            />
            
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[360px] bg-surface-container-low z-[101] shadow-2xl flex flex-col pointer-events-auto"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <Plus className="w-5 h-5 rotate-45" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-on-surface leading-tight">Red de Salud</h2>
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">
                        Red Total Conectada
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-surface-container-highest transition-colors"
                  >
                    <X className="w-6 h-6 text-on-surface-variant" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-none">
                  {/* Mission Section */}
                  <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-[24px] border border-primary/20 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Misión Social Conecta</span>
                      </div>
                      <h4 className="text-base font-display font-black text-on-surface mb-2">Misión Social de Salud Conecta</h4>
                      <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-80 mb-4">
                        Estamos comprometidos con el acceso a la salud para todos. Si eres usuario gratuito, te conectamos con toda la Red Pública de Salud de Nicaragua sin costo alguno.
                      </p>
                      {!isPremium && (
                        <button 
                          onClick={() => {
                            setMembership('premium');
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                            <span>Ver Red Privada Premium</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[8px] font-black">SOLO PREMIUM</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <h3 className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] font-mono mb-4 px-1">Categorías de Salud</h3>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { id: 'all', label: 'Todos', icon: Globe },
                         { id: 'hospital', label: 'hospitales', icon: Hospital },
                         { id: 'health-center', label: 'Centros de Salud', icon: Stethoscope },
                         { id: 'laboratory', label: 'Laboratorios', icon: Activity },
                         { id: 'pharmacy', label: 'Farmacias', icon: Pill },
                         { id: 'emergency', label: 'Urgencias', icon: ShieldAlert }
                       ].map((f) => (
                         <button
                           key={f.id}
                           onClick={() => {
                             setFilter(f.id as any);
                             setIsMenuOpen(false);
                           }}
                           className={`flex items-center gap-3 px-4 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-wider transition-all border shadow-sm font-mono ${
                             filter === f.id 
                               ? 'bg-primary text-on-primary border-primary' 
                               : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/40'
                           }`}
                         >
                           <f.icon className="w-4 h-4" />
                           {f.label}
                         </button>
                       ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em] font-mono">Resultados en tiempo real</h3>
                      <div className="flex items-center gap-2">
                        {isSearching && <RefreshCw className="w-3 h-3 text-primary animate-spin" />}
                        <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">En Vivo</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {filteredClinics.length > 0 ? (
                        filteredClinics.map((clinic) => (
                          <div
                            key={clinic.id}
                            onClick={() => {
                              setSelectedClinic(clinic);
                              setIsMenuOpen(false);
                              if (map) map.panTo(clinic.location);
                            }}
                            className={`group relative bg-surface-container-high p-4 rounded-2xl border transition-all cursor-pointer hover:border-primary/40 active:scale-[0.98] ${
                              selectedClinic?.id === clinic.id ? 'border-primary ring-1 ring-primary/40' : 'border-outline-variant/10'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-current transition-colors ${
                                  clinic.type === 'emergency' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
                                }`}>
                                  {clinic.type === 'emergency' ? <Activity className="w-4 h-4" /> : <Pill className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h4 className="font-display font-bold text-sm text-on-surface leading-tight group-hover:text-primary transition-colors">
                                    {clinic.name}
                                  </h4>
                                  <p className="text-[9px] text-on-surface-variant flex items-center gap-1 font-medium mt-0.5 opacity-70">
                                    <MapPin className="w-2.5 h-2.5" /> {clinic.address}
                                  </p>
                                </div>
                              </div>
                              <span className={`text-sm font-display font-bold ${clinic.type === 'emergency' ? 'text-error' : 'text-primary'}`}>
                                {calculateDistance(userLocation, clinic.location)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
                                  clinic.sector === 'public' 
                                    ? 'bg-hospital-green/10 text-hospital-green border-hospital-green/20' 
                                    : 'bg-primary/10 text-primary border-primary/20'
                                }`}>
                                  {clinic.sector === 'public' ? t('maps.tag.public') : t('maps.tag.private')}
                                </span>
                                {clinic.open24h && (
                                  <span className="text-[8px] font-bold text-on-surface-variant uppercase bg-surface-container-highest px-1.5 py-0.5 rounded-md">24h</span>
                                )}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClinic(clinic);
                                  setIsNavigating(true);
                                  setIsMenuOpen(false);
                                }}
                                className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                              >
                                Ir ahora
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center bg-surface-container-high rounded-3xl border border-dashed border-outline-variant/30">
                          <p className="text-xs text-on-surface-variant font-medium">No se encontraron resultados</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-outline-variant/20 flex flex-col gap-3">
                   <button 
                     onClick={() => setIsMenuOpen(false)}
                     className="w-full h-12 bg-surface-container-highest text-on-surface font-display font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-outline-variant/10 transition-colors"
                   >
                     Cerrar Menú
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="flex flex-col h-full w-full">
          {/* Top Search bar wrapper for mobile */}
          <div className="md:hidden p-4 pointer-events-auto">
             {/* We can move search here if needed, but for now sidebar handles it */}
          </div>

          <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 overflow-hidden items-end md:items-start relative z-10 pointer-events-none">
            <AnimatePresence>
              {isNavigating && (
                <motion.aside 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="pointer-events-auto w-full md:w-[420px] lg:w-[480px] bg-surface-container-low/95 backdrop-blur-xl md:rounded-[32px] rounded-t-[32px] border border-outline-variant/20 flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-hidden relative max-h-[60vh] md:max-h-full h-auto md:h-full transition-all duration-500"
                >
                  {/* Drag Handle for Mobile */}
                  <div className="md:hidden flex justify-center py-2 shrink-0">
                    <div className="w-12 h-1 bg-outline-variant/30 rounded-full" />
                  </div>
                  
                  <div className="flex flex-col h-full">
                    {!routeInfo ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 mb-6 relative">
                           <Navigation className="w-10 h-10 text-primary animate-bounce" />
                           <div className="absolute -inset-4 bg-primary/5 rounded-full animate-ping" />
                        </div>
                        <h3 className="text-xl font-display font-black text-on-surface mb-2">Calculando Ruta Óptima</h3>
                        <p className="text-sm text-on-surface-variant font-medium opacity-70">
                          Buscando el camino más rápido hacia {selectedClinic?.name || 'el centro médico'}...
                        </p>
                        <button 
                          onClick={() => setIsNavigating(false)}
                          className="mt-8 px-6 py-2 rounded-xl bg-surface-container-high text-on-surface text-[10px] font-black tracking-widest uppercase border border-outline-variant/30"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
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
                              Regresar
                            </button>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                              <span className="text-[10px] font-mono font-black text-secondary tracking-widest uppercase">Ruta Activa</span>
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
                               <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Protocolo de Red</span>
                            </div>
                            <span className="text-[9px] font-black text-outline-variant">EN TIEMPO REAL</span>
                          </div>
                        </div>

                        <div id="navigation-steps" className="flex-1 overflow-y-auto scrollbar-hide p-6">
                          <h4 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono mb-6">Pasos de Navegación</h4>
                          <div className="space-y-6">
                            {routeInfo.steps?.map((step, idx) => (
                              <div key={idx} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                                    idx === 0 ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 border-primary' : 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant group-hover:border-primary/50'
                                  }`}>
                                    {getStepIcon(step.instructions || '')}
                                  </div>
                                  {idx !== (routeInfo.steps?.length || 0) - 1 && (
                                    <div className="w-0.5 flex-1 bg-outline-variant/20 my-1 group-hover:bg-primary/30 transition-colors" />
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="text-sm text-on-surface font-medium mb-1" dangerouslySetInnerHTML={{ __html: step.instructions || '' }} />
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
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedClinic?.location.lat},${selectedClinic?.location.lng}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-14 bg-error text-on-error font-display font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                          >
                            <ExternalLink className="w-5 h-5" />
                            Abrir GPS Externo
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

        {/* Floating Desktop Controls */}
        <div className="flex-1 relative hidden md:block">
          {/* Map Section was moved to background, this area is for map-top overlays */}
          
          {/* Route Overlay: Desktop only floating panel */}
          <div className="absolute top-6 right-6 p-6 glass-panel-elevated rounded-2xl w-[320px] flex flex-col gap-4 z-10 shadow-2xl border border-outline-variant/20 pointer-events-auto">
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
        </div>
      </div>
    </div>
    </div>

      {/* Map Controls - Always Floating Bottom Right */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30 pointer-events-auto">
         <button 
           onClick={() => {
             if (map) {
               map.setCenter(userLocation);
               map.setZoom(15);
             }
           }}
           className="w-12 h-12 bg-surface-container/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
           title="Centrar en mi ubicación"
         >
           <Target className="w-6 h-6" />
         </button>
         <div className="flex flex-col bg-surface-container/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
           <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/20">
             <Plus className="w-6 h-6" />
           </button>
           <button className="w-12 h-12 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all">
             <Minus className="w-6 h-6" />
           </button>
         </div>
      </div>

      {/* Mobile Map View Status */}
      <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary-fixed uppercase tracking-widest shadow-lg z-20 pointer-events-none">
        Vista Satelital IA
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
