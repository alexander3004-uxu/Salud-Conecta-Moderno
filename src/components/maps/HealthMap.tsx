import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, Phone, Navigation, Search, Clock,
  Target, Plus, Minus, X, ShieldAlert, ChevronRight,
  RefreshCw, Loader2, Menu, Flag
} from 'lucide-react';
import { Clinic } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { GOOGLE_MAPS_KEY } from "../../lib/config";
import { getClinics } from '../../services/clinicService';
import { getMinsaReferenceNames, getMinsaMetadata } from '../../services/clinicService';
import { syncClinicToFirestore } from '../../services/triageService';
import { getClinicTypeDetails, FILTER_OPTIONS, ALL_SEARCH_TERMS, FilterType } from './mapUtils';
import { getReportSummaries, getConfidenceBadge, ReportSummary } from '../../services/facilityReportService';
import { ReportModal } from './ReportModal';

const API_KEY = GOOGLE_MAPS_KEY;
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const NICARAGUA_CENTER = { lat: 12.1328, lng: -86.2504 };

const normalizeString = (str: string) => 
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const CONFIDENCE_BADGE_STYLE: Record<string, { border: string; dot?: string }> = {
  verified:    { border: '#10B981', dot: '#10B981' },
  unconfirmed: { border: 'transparent' },
  warned:      { border: '#F59E0B', dot: '#F59E0B' },
  flagged:     { border: '#EF4444', dot: '#EF4444' },
};

class SafeMarkerBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("SafeMarkerBoundary caught an error (AdvancedMarker vector/cloud failure):", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Proactive Google Maps capability checks
const getGoogleMapsSupport = () => {
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
    return { standard: false, advanced: false };
  }
  const hasMarker = typeof window.google.maps.Marker === 'function';
  // Check if AdvancedMarkerElement is supported in the loaded Maps SDK version
  const hasAdvancedMarker = typeof (window.google.maps as any).marker?.AdvancedMarkerElement !== 'undefined' ||
                            typeof (window.google.maps as any).AdvancedMarkerElement !== 'undefined';
  return { standard: hasMarker, advanced: hasAdvancedMarker };
};

// Custom lightweight React component wrapping standard google.maps.Marker
const Marker: React.FC<{
  position: { lat: number; lng: number };
  onClick?: () => void;
  icon?: string;
  zIndex?: number;
}> = ({ position, onClick, icon, zIndex }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !(window as any).google?.maps?.Marker) return;
    
    const googleMaps = (window as any).google.maps;
    const marker = new googleMaps.Marker({
      position,
      map,
      icon,
      zIndex
    });

    let clickListener: any;
    if (onClick) {
      clickListener = marker.addListener('click', onClick);
    }

    return () => {
      if (clickListener) {
        googleMaps.event.removeListener(clickListener);
      }
      marker.setMap(null);
    };
  }, [map, position, icon, zIndex, onClick]);

  return null;
};

const FallbackClinicMarker: React.FC<{
  clinic: Clinic & { isOpen?: boolean };
  confidence: ReturnType<typeof getConfidenceBadge>;
  onClick: (c: Clinic & { isOpen?: boolean }) => void;
}> = ({ clinic, confidence, onClick }) => {
  const support = getGoogleMapsSupport();
  if (!support.standard) {
    return null; // Gracefully return null if Google Maps API failed to load to prevent app crashes
  }

  const details = getClinicTypeDetails(clinic.type);
  const color = details.markerColors;
  const badgeColor = {
    verified: '#10B981',
    unconfirmed: '#6B7280',
    warned: '#F59E0B',
    flagged: '#EF4444',
  }[confidence];

  // Dynamically constructed high-fidelity SVG path for fallback marker icon
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <path d="M18,0 C8.1,0 0,8.1 0,18 C0,28.8 18,46 18,46 C18,46 36,28.8 36,18 C36,8.1 27.9,0 18,0 Z" fill="${color.border}" />
      <path d="M18,2.5 C9.4,2.5 2.5,9.4 2.5,18 C2.5,26.6 18,42.5 18,42.5 C18,42.5 33.5,26.6 33.5,18 C33.5,9.4 26.6,2.5 18,2.5 Z" fill="${color.bg}" />
      <circle cx="18" cy="18" r="9" fill="white" opacity="0.9" />
      <path d="M14,18 h8 M18,14 v8" stroke="${color.bg}" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="28" cy="10" r="5" fill="${badgeColor}" stroke="white" stroke-width="1.2" />
    </svg>
  `;
  const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;

  return (
    <Marker
      position={clinic.location}
      onClick={() => onClick(clinic)}
      icon={iconUrl}
    />
  );
};

const FallbackUserLocationMarker: React.FC<{ position: google.maps.LatLngLiteral }> = ({ position }) => {
  const support = getGoogleMapsSupport();
  if (!support.standard) {
    return null; // Gracefully return null if Google Maps API failed to load to prevent app crashes
  }

  // Dynamically constructed SVG for user location standard marker
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="13" fill="#005fb0" fill-opacity="0.15" />
      <circle cx="15" cy="15" r="9" fill="#005fb0" fill-opacity="0.3" />
      <circle cx="15" cy="15" r="6" fill="white" />
      <circle cx="15" cy="15" r="4.5" fill="#005fb0" />
    </svg>
  `;
  const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;

  return (
    <Marker
      position={position}
      icon={iconUrl}
      zIndex={100}
    />
  );
};

const ClinicMarker: React.FC<{
  clinic: Clinic & { isOpen?: boolean };
  confidence: ReturnType<typeof getConfidenceBadge>;
  onClick: (c: Clinic & { isOpen?: boolean }) => void;
}> = ({ clinic, confidence, onClick }) => {
  const support = getGoogleMapsSupport();
  
  // Proactively fallback to standard Marker if AdvancedMarker is not supported (cloud/MapID failure)
  if (!support.advanced) {
    return (
      <FallbackClinicMarker
        clinic={clinic}
        confidence={confidence}
        onClick={onClick}
      />
    );
  }

  const isOpen = clinic.isOpen !== undefined ? clinic.isOpen : clinic.open24h;
  const details = getClinicTypeDetails(clinic.type);
  const color = details.markerColors;
  const Icon = details.icon;
  const badge = CONFIDENCE_BADGE_STYLE[confidence];
  const isFlagged = confidence === 'flagged';

  return (
    <AdvancedMarker position={clinic.location} onClick={() => onClick(clinic)}>
      <div className="relative flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform">
        <div style={{
          width: '40px', height: '40px',
          background: isOpen && !isFlagged ? color.bg : '#6B7280',
          border: `3px solid ${badge.border || color.border}`,
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: confidence === 'warned' ? '0 0 0 2px rgba(245,158,11,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
          opacity: isFlagged ? 0.5 : !isOpen ? 0.65 : 1,
        }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `8px solid ${isOpen && !isFlagged ? color.bg : '#6B7280'}`, marginTop: '-1px' }} />
        {badge.dot && (
          <div style={{ width: '9px', height: '9px', background: badge.dot, borderRadius: '50%', position: 'absolute', bottom: '14px', right: '-3px', border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
        )}
        {isFlagged && (
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '14px', height: '14px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>!</span>
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
};

function UserLocationMarker({ position }: { position: google.maps.LatLngLiteral }) {
  const support = getGoogleMapsSupport();
  
  // Proactively fallback to standard Marker if AdvancedMarker is not supported (cloud/MapID failure)
  if (!support.advanced) {
    return <FallbackUserLocationMarker position={position} />;
  }

  return (
    <AdvancedMarker position={position} zIndex={100}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-14 h-14 bg-primary/10 rounded-full animate-ping opacity-40" />
        <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping opacity-60" />
        <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border-[2.5px] border-primary">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>
    </AdvancedMarker>
  );
}

function MapContent({ 
  clinics, 
  userLocation, 
  onClinicSelect,
  onMapReady,
  reportSummaries,
}: { 
  clinics: (Clinic & { isOpen?: boolean })[]; 
  userLocation: { lat: number; lng: number };
  onClinicSelect: (c: Clinic & { isOpen?: boolean }) => void;
  onMapReady: (map: google.maps.Map) => void;
  reportSummaries: Map<string, ReportSummary>;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);

  return (
    <SafeMarkerBoundary
      fallback={
        <>
          {clinics.map(clinic => (
            <FallbackClinicMarker
              key={clinic.id}
              clinic={clinic}
              confidence={getConfidenceBadge(reportSummaries.get(clinic.id))}
              onClick={onClinicSelect}
            />
          ))}
          <FallbackUserLocationMarker position={userLocation} />
        </>
      }
    >
      {clinics.map(clinic => (
        <ClinicMarker
          key={clinic.id}
          clinic={clinic}
          confidence={getConfidenceBadge(reportSummaries.get(clinic.id))}
          onClick={onClinicSelect}
        />
      ))}
      <UserLocationMarker position={userLocation} />
    </SafeMarkerBoundary>
  );
}

function MapControls({ onCenter, onZoomIn, onZoomOut }: { onCenter: () => void; onZoomIn: () => void; onZoomOut: () => void }) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
      <button onClick={onCenter} className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high transition-colors" title="Mi ubicación">
        <Target className="w-5 h-5" />
      </button>
      <button onClick={onZoomIn} className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high transition-colors" title="Acercar">
        <Plus className="w-5 h-5" />
      </button>
      <button onClick={onZoomOut} className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high transition-colors" title="Alejar">
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function HealthMap() {
  const { t } = useLanguage();
  const { isPremium } = useUser();
  const [clinics, setClinics] = useState<(Clinic & { isOpen?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<(Clinic & { isOpen?: boolean }) | null>(null);
  const [selectedForReport, setSelectedForReport] = useState<(Clinic & { isOpen?: boolean }) | null>(null);
  const [reportSummaries, setReportSummaries] = useState<Map<string, ReportSummary>>(new Map());
  const [center, setCenter] = useState(NICARAGUA_CENTER);
  const [userLocation, setUserLocation] = useState(NICARAGUA_CENTER);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isAutoCentered, setIsAutoCentered] = useState(false);
  const [placesLib, setPlacesLib] = useState<any>(null);

  const placesLibrary = useMapsLibrary('places');

  const normalizeString = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  useEffect(() => {
    setPlacesLib(placesLibrary || null);
  }, [placesLibrary]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn('Geolocation error or denied:', err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Auto-centrar el mapa una sola vez cuando se detecta la ubicación y el mapa está listo
  useEffect(() => {
    if (mapInstance && userLocation !== NICARAGUA_CENTER && !isAutoCentered) {
      mapInstance.panTo(userLocation);
      mapInstance.setZoom(15);
      setIsAutoCentered(true);
    }
  }, [mapInstance, userLocation, isAutoCentered]);

  useEffect(() => {
    const loadClinics = async () => {
      setLoading(true);
      try {
        // Google Places is the primary source — Firestore only has enriched/cached results
        const dbClinics = await getClinics();
        setClinics(dbClinics);

        // Load confidence badges from report summaries
        if (dbClinics.length > 0) {
          const ids = dbClinics.map(c => c.id);
          const summaries = await getReportSummaries(ids);
          setReportSummaries(summaries);
        }
      } catch (error) {
        console.error('Error loading clinics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadClinics();
  }, []);

  const searchPlacesInArea = useCallback(async (map: google.maps.Map) => {
    if (!placesLib || !hasValidKey) return;
    
    setLoadingPlaces(true);
    try {
      const bounds = map.getBounds();
      if (!bounds) return;

      const searchTerms = ALL_SEARCH_TERMS;

      // MINSA names are used ONLY to tag public sector — NOT as location source
      const minsaReferenceNames = getMinsaReferenceNames();

      // Mapeamos las clínicas existentes por su ID de Google Place o nombre normalizado
      const existingClinicsMap = new Map<string, Clinic>();
      clinics.forEach(c => {
        if (c.id.startsWith('google-')) existingClinicsMap.set(c.id, c);
        existingClinicsMap.set(normalizeString(c.name), c); // Para clínicas que no tienen ID de Google aún
      });

      let newOrUpdatedClinics: Clinic[] = []; // Para almacenar las clínicas nuevas o actualizadas de Google
      const processedGooglePlaceIds = new Set<string>(); // Para evitar procesar el mismo Google Place varias veces

      for (const { term, type } of searchTerms) {
        try {
          const request: google.maps.places.TextSearchRequest = {
            query: `${term} Nicaragua`,
            bounds: bounds,
            fields: [
              'id', 'name', 'geometry', 'formatted_address', 'types',
              'formatted_phone_number', 'rating', 'user_ratings_total',
              'photos', 'opening_hours', 'website', 'price_level',
              'wheelchair_accessible_entrance',
            ],
          };
          
          const service = new placesLib.PlacesService(map);
          const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
            service.textSearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else {
                resolve([]);
              }
            });
          });

          for (const place of results) {
            if (place.geometry?.location && place.place_id && !processedGooglePlaceIds.has(place.place_id)) {
              const placeName = normalizeString(place.name || '');
              const googleId = `google-${place.place_id}`;
              
              let clinicToProcess: Clinic | undefined;
              let isUpdate = false;

              // 1. Buscar por ID de Google Place (más fiable)
              if (existingClinicsMap.has(googleId)) {
                clinicToProcess = existingClinicsMap.get(googleId)!;
                isUpdate = true;
              } 
              // 2. Si no se encuentra por ID, buscar por nombre normalizado (para centros MINSA que no tienen ID de Google aún)
              else if (existingClinicsMap.has(placeName)) {
                clinicToProcess = existingClinicsMap.get(placeName)!;
                isUpdate = true;
              }

              // Verificamos si este lugar de Google pertenece a la red pública del MINSA
              const isPublicMinsa = minsaReferenceNames.some(minsaName => 
                placeName.includes(minsaName) || minsaName.includes(placeName)
              );

              // Google Places is ALWAYS the authoritative source for location.
              // MINSA metadata (phone, services) enriches but never overrides Google coordinates.
              const minsaMeta = isPublicMinsa ? getMinsaMetadata(place.name || '') : null;

              // Resolve photo URLs from Places photo references (max 3 photos, 800px wide)
              const photoUrls: string[] = [];
              if (place.photos && place.photos.length > 0) {
                place.photos.slice(0, 3).forEach(photoRef => {
                  try {
                    photoUrls.push(photoRef.getUrl({ maxWidth: 800, maxHeight: 600 }));
                  } catch (_) {}
                });
              }

              const clinicData: Clinic = {
                id: googleId,
                name: place.name || 'Sin nombre',
                type: (clinicToProcess?.type ?? type) as Clinic['type'],
                sector: isPublicMinsa ? 'public' : (clinicToProcess?.sector ?? 'private'),
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                },
                address: place.formatted_address || clinicToProcess?.address || '',
                phone: place.formatted_phone_number || minsaMeta?.phone || clinicToProcess?.phone || '',
                open24h: clinicToProcess?.open24h ?? minsaMeta?.open24h ?? (type === 'hospital' || type === 'emergency'),
                isOpen: place.opening_hours?.isOpen?.() ?? true,
                rating: place.rating ?? clinicToProcess?.rating,
                reviews: place.user_ratings_total ?? clinicToProcess?.reviews,
                description: minsaMeta?.description || clinicToProcess?.description,
                services: minsaMeta?.services || clinicToProcess?.services,
                // Rich detail fields
                placeId: place.place_id,
                website: (place as any).website || clinicToProcess?.website,
                photos: photoUrls.length > 0 ? photoUrls : clinicToProcess?.photos,
                openingHours: place.opening_hours ? {
                  isOpen: place.opening_hours.isOpen?.(),
                  weekdayText: place.opening_hours.weekday_text,
                } : clinicToProcess?.openingHours,
                wheelchairAccessible: (place as any).wheelchair_accessible_entrance ?? clinicToProcess?.wheelchairAccessible,
                priceLevel: (place as any).price_level ?? clinicToProcess?.priceLevel,
              };

              newOrUpdatedClinics.push(clinicData);
              if (isPublicMinsa) syncClinicToFirestore(clinicData);
              processedGooglePlaceIds.add(place.place_id); // Marcar como procesado
            }
          }
        } catch (err) {
          console.warn(`Search failed for ${term}:`, err);
        }
      }

      // Combinar las clínicas existentes con las nuevas/actualizadas, eliminando duplicados por ID
      setClinics(prevClinics => {
        const combinedMap = new Map<string, Clinic>();
        // Añadir todas las clínicas previas
        prevClinics.forEach(c => combinedMap.set(c.id, c));
        // Sobreescribir/añadir con las nuevas/actualizadas de Google Places
        newOrUpdatedClinics.forEach(c => combinedMap.set(c.id, c));
        return Array.from(combinedMap.values());
      });
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoadingPlaces(false);
    }
  }, [placesLib, hasValidKey, clinics]);

  const handleMapIdle = useCallback(() => {
    // Solo buscar si el mapa está listo, Places API está cargada y no estamos ya cargando
    // La condición clinics.length < 50 es un heurístico para evitar sobrecargar la API en el inicio
    if (mapInstance && placesLib && hasValidKey && !loadingPlaces) {
      searchPlacesInArea(mapInstance);
    }
  }, [mapInstance, placesLib, hasValidKey, loadingPlaces, searchPlacesInArea]);

  const filteredClinics = clinics.filter(c => {
    if (filter === 'all') return true;
    // 'hospital' matches hospital-national, hospital-regional, hospital-primary and hospital
    if (filter === 'hospital') return c.type.startsWith('hospital');
    return c.type === filter;
  });

  const handleClinicSelect = (clinic: Clinic & { isOpen?: boolean }) => {
    setSelectedClinic(clinic);
    setIsNavigating(false);
    if (mapInstance) {
      mapInstance.panTo(clinic.location);
      mapInstance.setZoom(16);
    }
  };

  const handleCenterToUser = () => {
    if (mapInstance) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    }
  };

  const handleZoomIn = () => {
    if (mapInstance) mapInstance.setZoom((mapInstance.getZoom() || 14) + 1);
  };

  const handleZoomOut = () => {
    if (mapInstance) mapInstance.setZoom((mapInstance.getZoom() || 14) - 1);
  };

  const handleRefreshSearch = () => {
    if (mapInstance) {
      searchPlacesInArea(mapInstance);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-error/10 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-xl font-black text-on-surface">{t('maps.key_required.title') || 'API Key requerida'}</h2>
          <p className="text-sm text-on-surface-variant">{t('maps.key_required.description') || 'Configure su API key de Google Maps para usar el mapa.'}</p>
          <div className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg">
            <p>📍 {clinics.length} centros de salud cargados de la base de datos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
        <section className="absolute inset-0 z-0">
          <GoogleMap 
            defaultCenter={center} 
            defaultZoom={12} 
            mapId="DARK_MODE_MAP" 
            className="w-full h-full" 
            gestureHandling="greedy" 
            disableDefaultUI
            onIdle={handleMapIdle}
          >
            <MapContent 
              clinics={filteredClinics} 
              userLocation={userLocation}
              onClinicSelect={handleClinicSelect}
              onMapReady={setMapInstance}
              reportSummaries={reportSummaries}
            />
          </GoogleMap>
        </section>

        {loadingPlaces && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold">Buscando más centros...</span>
          </div>
        )}

        <AnimatePresence>
          {isEmergencyMode && (
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-error-container text-on-error-container shrink-0 z-50 shadow-2xl border border-error/50 rounded-2xl overflow-hidden p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                  <ShieldAlert className="w-6 h-6 text-error animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-error">Modo Emergencia</h3>
                  <p className="text-[10px] font-bold opacity-80">Mostrando solo centros de emergencias</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 z-40 flex flex-col gap-3 items-start">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 bg-surface/95 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                className="w-[calc(100vw-2rem)] md:w-80 max-h-[60vh] bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden flex flex-col"
              >
                <div className="p-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
                    <input type="text" placeholder="Buscar centro de salud..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none min-w-0" />
                    {loadingPlaces && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {FILTER_OPTIONS.map(({ value, label, labelShort }) => {
                      const details = value !== 'all' ? getClinicTypeDetails(value) : null;
                      const count = value === 'all'
                        ? clinics.length
                        : clinics.filter(c => value === 'hospital' ? c.type.startsWith('hospital') : c.type === value).length;
                      return (
                        <button
                          key={value}
                          onClick={() => setFilter(value)}
                          title={label}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 ${
                            filter === value
                              ? 'bg-primary text-on-primary shadow-md'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {details && React.createElement(details.icon, { className: 'w-3 h-3' })}
                          <span>{labelShort}</span>
                          {count > 0 && (
                            <span className={`ml-0.5 px-1 rounded-full text-[8px] font-black ${
                              filter === value ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                            }`}>{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-surface-container/50 border-b border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant">
                    {filteredClinics.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())).length} resultados
                  </span>
                  <button onClick={handleRefreshSearch} disabled={loadingPlaces} className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline disabled:opacity-50">
                    <RefreshCw className={`w-3 h-3 ${loadingPlaces ? 'animate-spin' : ''}`} />
                    Actualizar
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-xs text-on-surface-variant">Cargando centros de salud...</p>
                    </div>
                  ) : filteredClinics.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-xs text-on-surface-variant">No se encontraron centros</p>
                    </div>
                  ) : (
                    filteredClinics.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(clinic => (
                      <button key={clinic.id} onClick={() => handleClinicSelect(clinic)}
                        className={`w-full p-3 flex items-start gap-3 border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors ${selectedClinic?.id === clinic.id ? 'bg-primary/10' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getClinicTypeDetails(clinic.type).colorClasses}`}>
                          {React.createElement(getClinicTypeDetails(clinic.type).icon, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">{clinic.name}</p>
                          <p className="text-[10px] text-on-surface-variant truncate">{clinic.address}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${clinic.open24h || clinic.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {clinic.open24h ? '24h' : clinic.isOpen ? 'Abierto' : 'Cerrado'}
                            </span>
                            {clinic.sector === 'public' && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">PÚBLICO</span>}
                            {clinic.rating && <span className="text-[9px] text-primary">★ {clinic.rating.toFixed(1)}</span>}
                            {clinic.reviews && <span className="text-[9px] text-on-surface-variant">({clinic.reviews})</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-on-surface-variant shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {selectedClinic && !isNavigating && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* ── Photo Header ── */}
            {selectedClinic.photos && selectedClinic.photos.length > 0 ? (
              <div className="relative h-36 shrink-0 overflow-hidden">
                <img
                  src={selectedClinic.photos[0]}
                  alt={selectedClinic.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Close button over photo */}
                <button
                  onClick={() => setSelectedClinic(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Type badge over photo */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full backdrop-blur-sm ${
                    selectedClinic.type === 'emergency' ? 'bg-error/80 text-white' : 'bg-primary/80 text-white'
                  }`}>
                    {getClinicTypeDetails(selectedClinic.type).label}
                  </span>
                  {selectedClinic.sector === 'public' && (
                    <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-blue-600/80 text-white backdrop-blur-sm">PÚBLICO</span>
                  )}
                  {selectedClinic.wheelchairAccessible && (
                    <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">♿</span>
                  )}
                </div>
              </div>
            ) : (
              // Fallback header without photo
              <div className={`p-4 shrink-0 flex items-center justify-between ${
                selectedClinic.type === 'emergency' ? 'bg-error/10' : 'bg-primary/10'
              }`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">{getClinicTypeDetails(selectedClinic.type).label}</span>
                  {selectedClinic.sector === 'public' && <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">PÚBLICO</span>}
                  {selectedClinic.wheelchairAccessible && <span className="text-[9px] font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">♿ Accesible</span>}
                </div>
                <button onClick={() => setSelectedClinic(null)}
                  className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center hover:bg-surface-container-high">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1">
              {/* Name + rating + confidence */}
              <div className="px-4 pt-3 pb-2">
                <h3 className="text-base font-black text-on-surface leading-tight">{selectedClinic.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {selectedClinic.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-amber-500">{selectedClinic.rating.toFixed(1)}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-[10px] ${
                            s <= Math.round(selectedClinic.rating!) ? 'text-amber-400' : 'text-surface-container-high'
                          }`}>★</span>
                        ))}
                      </div>
                      {selectedClinic.reviews && (
                        <span className="text-[10px] text-on-surface-variant">({selectedClinic.reviews.toLocaleString()})</span>
                      )}
                    </div>
                  )}
                  {selectedClinic.priceLevel === 0 && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">Gratuito</span>}
                  {(() => {
                    const badge = getConfidenceBadge(reportSummaries.get(selectedClinic.id));
                    const badgeConfig = {
                      verified:    { label: '✅ Verificado', cls: 'bg-emerald-500/10 text-emerald-600' },
                      warned:      { label: '⚠️ En revisión', cls: 'bg-amber-500/10 text-amber-600' },
                      flagged:     { label: '🚩 Reportado', cls: 'bg-red-500/10 text-red-600' },
                      unconfirmed: null,
                    }[badge];
                    return badgeConfig ? (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeConfig.cls}`}>{badgeConfig.label}</span>
                    ) : null;
                  })()}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">{selectedClinic.address}</p>
              </div>

              {/* ── Quick action chips (Google Maps style) ── */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-y border-outline-variant/10">
                <button
                  onClick={() => setIsNavigating(true)}
                  className="flex flex-col items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-2xl shrink-0 hover:bg-primary/20 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Cómo llegar</span>
                </button>
                {selectedClinic.phone && (
                  <a
                    href={`tel:${selectedClinic.phone}`}
                    className="flex flex-col items-center gap-1 px-4 py-2 bg-surface-container text-on-surface-variant rounded-2xl shrink-0 hover:bg-surface-container-high transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-[9px] font-bold">Llamar</span>
                  </a>
                )}
                {selectedClinic.website && (
                  <a
                    href={selectedClinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-4 py-2 bg-surface-container text-on-surface-variant rounded-2xl shrink-0 hover:bg-surface-container-high transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[9px] font-bold">Sitio web</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedForReport(selectedClinic)}
                  className="flex flex-col items-center gap-1 px-4 py-2 bg-surface-container text-amber-600 rounded-2xl shrink-0 hover:bg-amber-50 transition-all"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Reportar</span>
                </button>
              </div>

              {/* ── Opening Hours ── */}
              {selectedClinic.openingHours?.weekdayText && selectedClinic.openingHours.weekdayText.length > 0 ? (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Horario de atención</span>
                    {selectedClinic.openingHours.isOpen !== undefined && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto ${
                        selectedClinic.openingHours.isOpen
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {selectedClinic.openingHours.isOpen ? '● Abierto ahora' : '● Cerrado ahora'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {selectedClinic.openingHours.weekdayText.map((line, i) => {
                      const today = new Date().getDay(); // 0=Sun, 1=Mon...
                      const adjustedToday = today === 0 ? 6 : today - 1; // Mon=0..Sun=6
                      const isToday = i === adjustedToday;
                      return (
                        <div key={i} className={`flex text-[10px] px-2 py-0.5 rounded ${
                          isToday ? 'bg-primary/5 font-bold text-on-surface' : 'text-on-surface-variant'
                        }`}>
                          <span className={`w-24 shrink-0 ${isToday ? 'text-primary font-bold' : ''}`}>
                            {line.split(':')[0]}
                          </span>
                          <span>{line.split(':').slice(1).join(':').trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-xs text-on-surface-variant">
                    {selectedClinic.open24h ? 'Abierto 24 horas' : selectedClinic.isOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
              )}

              {/* ── Photo gallery strip (if multiple photos) ── */}
              {selectedClinic.photos && selectedClinic.photos.length > 1 && (
                <div className="px-4 pb-3">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {selectedClinic.photos.slice(1).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${selectedClinic.name} foto ${i + 2}`}
                        className="w-24 h-16 object-cover rounded-xl shrink-0 border border-outline-variant/20"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Phone row (if no chip showed) ── */}
              {selectedClinic.phone && !selectedClinic.website && (
                <div className="px-4 pb-3 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-on-surface-variant shrink-0" />
                  <a href={`tel:${selectedClinic.phone}`} className="text-xs text-primary font-bold hover:underline">
                    {selectedClinic.phone}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {selectedForReport && (
          <ReportModal
            facility={selectedForReport}
            onClose={() => setSelectedForReport(null)}
          />
        )}

        <MapControls onCenter={handleCenterToUser} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </APIProvider>
  );
}