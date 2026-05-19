import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, Phone, Navigation, Search, Clock,
  Target, Plus, Minus, X, ShieldAlert, ChevronRight,
  Loader2, Flag, Star, Globe2, Accessibility, Menu
} from 'lucide-react';
import { Clinic } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { GOOGLE_MAPS_KEY } from "../../lib/config";
import { NICARAGUA_HOSPITALS } from '../../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../../data/nicaraguaPublicHealthNetwork';
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
      <button onClick={onCenter} className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high transition-colors" title="Mi ubicaciÃ³n">
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
  const [filter, setFilter] = useState<FilterType>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isAutoCentered, setIsAutoCentered] = useState(false);
  const [placesLib, setPlacesLib] = useState<any>(null);

  // --- Autocomplete state (Google Maps-style live search) ---------------------------
  const [searchQuery, setSearchQuery] = useState('');
  // Use 'any' to avoid crashes when google.maps.places types are not available (API key restriction)
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [localSuggestions, setLocalSuggestions] = useState<(Clinic & { isOpen?: boolean })[]>([]);

  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, (Clinic & { isOpen?: boolean })[]> = {};
    localSuggestions.forEach(clinic => {
      const details = getClinicTypeDetails(clinic.type);
      const groupName = details.label || 'Otros';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(clinic);
    });
    return groups;
  }, [localSuggestions]);

  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteSessionRef = useRef<any>(null);

  const placesLibrary = useMapsLibrary('places');

  const normalizeString = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  useEffect(() => {
    setPlacesLib(placesLibrary || null);
  }, [placesLibrary]);

  // --- Seed static data so local search always works (even without API key) ------
  useEffect(() => {
    const seenNames = new Set<string>();
    const seedClinics: (Clinic & { isOpen?: boolean })[] = [];

    const addUnique = (h: Omit<Clinic, 'id'>, prefix: string, index: number) => {
      const normalized = h.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      if (!seenNames.has(normalized)) {
        seenNames.add(normalized);
        seedClinics.push({
          ...h,
          id: `seed-${prefix}-${index}-${h.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          isOpen: h.open24h ?? true,
        } as Clinic & { isOpen?: boolean });
      }
    };

    NICARAGUA_HOSPITALS.forEach((h, i) => addUnique(h, 'h', i));
    PUBLIC_HEALTH_NETWORK.forEach((h, i) => addUnique(h, 'p', i));

    setClinics(seedClinics);
  }, []);

  // --- Local fallback search: always works regardless of API key ------------------
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setLocalSuggestions([]);
      return;
    }
    const q = normalizeString(searchQuery);
    const matches = clinics
      .filter(c => normalizeString(c.name).includes(q) || normalizeString(c.address || '').includes(q))
      .slice(0, 8);
    setLocalSuggestions(matches);
  }, [searchQuery, clinics]);

  // --- Google Places Autocomplete: real-time predictions -------------------------------
  // Only runs when Google Maps API is fully authorized (production / Vercel)
  useEffect(() => {
    if (!placesLib || !searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setAutocompleteLoading(true);

    try {
      const service = new placesLib.AutocompleteService();
      if (!autocompleteSessionRef.current) {
        autocompleteSessionRef.current = new placesLib.AutocompleteSessionToken();
      }

      service.getPlacePredictions(
        {
          input: searchQuery,
          sessionToken: autocompleteSessionRef.current,
          bounds: mapInstance?.getBounds() ?? undefined,
          // 'establishment' is the only valid type for PlacesAutocomplete
          types: ['establishment'],
        },
        (predictions: any[] | null) => {
          if (cancelled) return;
          setAutocompleteLoading(false);
          setSuggestions(predictions && predictions.length > 0 ? predictions : []);
        }
      );
    } catch (err) {
      // Google Maps not loaded or API key blocked --- silently fall back to local search
      setAutocompleteLoading(false);
      setSuggestions([]);
    }

    return () => { cancelled = true; };
  }, [searchQuery, placesLib, mapInstance]);

  // --- Handle suggestion selection: fetch full details + open panel ------------
  const handleSuggestionSelect = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesLib || !mapInstance) return;

    // Clear autocomplete session so next query starts fresh
    autocompleteSessionRef.current = null;
    setSearchQuery(prediction.structured_formatting.main_text);
    setSuggestions([]);
    setSearchFocused(false);
    searchInputRef.current?.blur();

    const service = new placesLib.PlacesService(mapInstance);
    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: [
          'place_id', 'name', 'geometry', 'formatted_address',
          'formatted_phone_number', 'rating', 'user_ratings_total',
          'photos', 'opening_hours', 'website', 'price_level',
          'wheelchair_accessible_entrance', 'types',
        ],
      },
      (place: google.maps.places.PlaceResult | null, status: string) => {
        if (!place?.geometry?.location) return;

        // Pan map to place
        mapInstance.panTo(place.geometry.location);
        mapInstance.setZoom(17);

        // Resolve photos
        const photos: string[] = [];
        place.photos?.slice(0, 3).forEach(ref => {
          try { photos.push(ref.getUrl({ maxWidth: 800, maxHeight: 600 })); } catch (_) {}
        });

        // Determine type from Google place types
        const googleTypes = place.types || [];
        let detectedType: Clinic['type'] = 'clinic';
        if (googleTypes.includes('hospital')) detectedType = 'hospital';
        else if (googleTypes.includes('pharmacy')) detectedType = 'pharmacy';
        else if (googleTypes.includes('dentist')) detectedType = 'dental';
        else if (googleTypes.includes('doctor')) detectedType = 'clinic';

        const nameLower = (place.name || '').toLowerCase();
        if (/hospital nacional/i.test(nameLower)) detectedType = 'hospital-national';
        else if (/hospital regional/i.test(nameLower)) detectedType = 'hospital-regional';
        else if (/hospital primario/i.test(nameLower)) detectedType = 'hospital-primary';
        else if (/emergencia|urgencias/i.test(nameLower)) detectedType = 'emergency';
        else if (/centro de salud|minsa/i.test(nameLower)) detectedType = 'health-center';
        else if (/puesto de salud/i.test(nameLower)) detectedType = 'health-post';
        else if (/laboratorio/i.test(nameLower)) detectedType = 'laboratory';
        else if (/salud mental|psicolog|psiquiat/i.test(nameLower)) detectedType = 'mental-health';

        const isPublic = /minsa|hospital|centro de salud|puesto de salud|gobierno/i.test(nameLower);

        const clinic: Clinic & { isOpen?: boolean } = {
          id: `google-${place.place_id}`,
          placeId: place.place_id,
          name: place.name || 'Sin nombre',
          type: detectedType,
          sector: isPublic ? 'public' : 'private',
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          address: place.formatted_address || '',
          phone: place.formatted_phone_number || '',
          rating: place.rating,
          reviews: place.user_ratings_total,
          open24h: detectedType === 'hospital' || detectedType === 'hospital-national' ||
                   detectedType === 'hospital-regional' || detectedType === 'emergency',
          isOpen: place.opening_hours?.isOpen?.() ?? true,
          photos: photos.length > 0 ? photos : undefined,
          website: (place as any).website,
          openingHours: place.opening_hours ? {
            isOpen: place.opening_hours.isOpen?.(),
            weekdayText: place.opening_hours.weekday_text,
          } : undefined,
          wheelchairAccessible: (place as any).wheelchair_accessible_entrance,
          priceLevel: (place as any).price_level,
        };

        // Add to clinics list and select it
        setClinics(prev => {
          const merged = new Map(prev.map(c => [c.id, c]));
          merged.set(clinic.id, clinic);
          return Array.from(merged.values());
        });
        setSelectedClinic(clinic);

      }
    );
  }, [placesLib, mapInstance]);

  // --- Geolocation ---------------------------------------------------------------------------------------
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

  // --- Auto-center once user location is detected ------------------------------------------
  useEffect(() => {
    if (mapInstance && userLocation !== NICARAGUA_CENTER && !isAutoCentered) {
      mapInstance.panTo(userLocation);
      mapInstance.setZoom(15);
      setIsAutoCentered(true);
    }
  }, [mapInstance, userLocation, isAutoCentered]);

  // --- Load community report badges from Firestore (lightweight) ------------------
  // This is the ONLY Firestore read at startup --- clinics come from Google Places.
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        // We start with zero static clinics --- Google Places fills them on map idle.
        // We pre-load an empty reports map so the confidence badge system is ready.
        const summaries = await getReportSummaries([]);
        setReportSummaries(summaries);
      } catch (error) {
        console.warn('Could not load report summaries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  // --- Capture custom navigation event from Triage ---
  useEffect(() => {
    const handleSelectAndNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ clinic: Clinic & { isOpen?: boolean }; startNavigation?: boolean }>;
      if (customEvent.detail && customEvent.detail.clinic) {
        const targetClinic = customEvent.detail.clinic;
        
        // Ensure it is in our local clinics list so the marker renders
        setClinics(prev => {
          if (!prev.some(c => c.id === targetClinic.id)) {
            return [...prev, targetClinic];
          }
          return prev;
        });

        setSelectedClinic(targetClinic);

        if (mapInstance) {
          mapInstance.panTo(targetClinic.location);
          mapInstance.setZoom(16);
        }

        // If startNavigation was requested, open Google Maps externally
        if (customEvent.detail.startNavigation && targetClinic.location) {
          navigator.geolocation?.getCurrentPosition((pos) => {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${targetClinic.location.lat},${targetClinic.location.lng}&travelmode=driving`;
            window.open(url, '_blank');
          }, () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${targetClinic.location.lat},${targetClinic.location.lng}&travelmode=driving`;
            window.open(url, '_blank');
          });
        }
      }
    };

    window.addEventListener('selectAndNavigateClinic', handleSelectAndNavigate);
    return () => {
      window.removeEventListener('selectAndNavigateClinic', handleSelectAndNavigate);
    };
  }, [mapInstance]);

  // --- Google Places \u2192 Clinics (Zero-DB real-time discovery) ------------------------
  // No static data. No MINSA files. Google Places is the sole truth source.
  // Each search term maps to a specific Salud Conecta facility type.
  const lastSearchBoundsRef = useRef<string | null>(null);

  const searchPlacesInArea = useCallback(async (map: google.maps.Map) => {
    if (!placesLib || !hasValidKey) return;

    // Throttle: skip if bounds haven't changed significantly
    const bounds = map.getBounds();
    if (!bounds) return;
    const boundsKey = [
      bounds.getNorthEast().lat().toFixed(3),
      bounds.getNorthEast().lng().toFixed(3),
      bounds.getSouthWest().lat().toFixed(3),
      bounds.getSouthWest().lng().toFixed(3),
    ].join(',');
    if (boundsKey === lastSearchBoundsRef.current) return;
    lastSearchBoundsRef.current = boundsKey;

    setLoadingPlaces(true);
    try {
      const newClinics: Clinic[] = [];
      const processedIds = new Set<string>();
      const service = new placesLib.PlacesService(map);

      // Run all type searches sequentially to avoid overloading the API
      for (const { term, type } of ALL_SEARCH_TERMS) {
        try {
          const request: google.maps.places.TextSearchRequest = {
            query: term,
            bounds,
            fields: [
              'place_id', 'name', 'geometry', 'formatted_address',
              'formatted_phone_number', 'rating', 'user_ratings_total',
              'photos', 'opening_hours', 'website', 'price_level',
              'wheelchair_accessible_entrance',
            ],
          };

          const results = await new Promise<google.maps.places.PlaceResult[]>((resolve) => {
            service.textSearch(request, (res, status) => {
              resolve(
                status === google.maps.places.PlacesServiceStatus.OK && res ? res : []
              );
            });
          });

          for (const place of results) {
            if (!place.geometry?.location || !place.place_id) continue;
            if (processedIds.has(place.place_id)) continue;
            processedIds.add(place.place_id);

            // Resolve up to 3 real photo URLs from Places references
            const photos: string[] = [];
            place.photos?.slice(0, 3).forEach(ref => {
              try { photos.push(ref.getUrl({ maxWidth: 800, maxHeight: 600 })); } catch (_) {}
            });

            // Classify sector: if Google name or address mentions known public keywords â†’ public
            const nameLower = (place.name || '').toLowerCase();
            const isPublic = /minsa|hospital|centro de salud|puesto de salud|gobierno|public/i.test(nameLower);

            const clinic: Clinic = {
              id: `google-${place.place_id}`,
              placeId: place.place_id,
              name: place.name || 'Sin nombre',
              type: type as Clinic['type'],
              sector: isPublic ? 'public' : 'private',
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
              address: place.formatted_address || '',
              phone: place.formatted_phone_number || '',
              rating: place.rating,
              reviews: place.user_ratings_total,
              open24h: type === 'hospital' || type === 'hospital-national' ||
                       type === 'hospital-regional' || type === 'hospital-primary' ||
                       type === 'emergency',
              isOpen: place.opening_hours?.isOpen?.() ?? true,
              photos: photos.length > 0 ? photos : undefined,
              website: (place as any).website,
              openingHours: place.opening_hours ? {
                isOpen: place.opening_hours.isOpen?.(),
                weekdayText: place.opening_hours.weekday_text,
              } : undefined,
              wheelchairAccessible: (place as any).wheelchair_accessible_entrance,
              priceLevel: (place as any).price_level,
            };

            newClinics.push(clinic);
          }
        } catch (err) {
          console.warn(`[Places] Search failed for "${term}":`, err);
        }
      }

      // Merge with existing clinics, Google Places always wins on duplicates
      setClinics(prev => {
        const merged = new Map<string, Clinic>();
        prev.forEach(c => merged.set(c.id, c));
        newClinics.forEach(c => merged.set(c.id, c));
        return Array.from(merged.values());
      });

      // Update confidence badges for newly discovered clinic IDs
      if (newClinics.length > 0) {
        const ids = newClinics.map(c => c.id);
        getReportSummaries(ids).then(summaries => {
          setReportSummaries(prev => new Map([...prev, ...summaries]));
        }).catch(() => {});
      }
    } catch (error) {
      console.error('[Places] Area search error:', error);
    } finally {
      setLoadingPlaces(false);
    }
  }, [placesLib, hasValidKey]);

  const handleMapIdle = useCallback(() => {
    // Solo buscar si el mapa estÃ¡ listo, Places API estÃ¡ cargada y no estamos ya cargando
    // La condiciÃ³n clinics.length < 50 es un heurÃ­stico para evitar sobrecargar la API en el inicio
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
            <p>ðŸ“ {clinics.length} centros de salud cargados de la base de datos</p>
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
            <span className="text-xs font-bold">Buscando mÃ¡s centros...</span>
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

        {/* --- Hamburger Menu Button --- */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-3 left-3 z-40 w-12 h-12 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all duration-200"
          title="Abrir menú de búsqueda"
        >
          <Menu className="w-5 h-5 text-gray-700 hover:text-primary transition-colors" />
        </button>

        {/* --- Sliding Search Drawer (Left Panel) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 z-50 w-[360px] max-w-full h-full bg-white shadow-2xl flex flex-col border-r border-gray-200"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-display font-black uppercase tracking-wider text-primary">Buscar Centros</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-500 hover:text-gray-800"
                  title="Cerrar panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 gap-4">
                {/* Search input UI */}
                <div className="relative shrink-0">
                  <div className={`flex items-center bg-white rounded-3xl shadow-md border transition-all duration-200 ${
                    searchFocused ? 'border-blue-400' : 'border-gray-200'
                  }`} style={{ height: '46px' }}>
                    {/* Search icon */}
                    <div className="pl-4 pr-3 shrink-0">
                      {autocompleteLoading
                        ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        : <Search className="w-4 h-4 text-gray-500" />
                      }
                    </div>

                    {/* Text input */}
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                      placeholder="Buscar hospitales, clínicas..."
                      className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none font-normal"
                    />

                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(''); setSuggestions([]); setLocalSuggestions([]); searchInputRef.current?.focus(); }}
                        className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-200 shrink-0" />

                    {/* Directions button — opens Google Maps externally */}
                    {selectedClinic ? (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedClinic.location.lat},${selectedClinic.location.lng}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Cómo llegar"
                        className="w-10 h-10 mr-1 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{ background: '#1a73e8' }}
                      >
                        <Navigation className="w-4 h-4 text-white" />
                      </a>
                    ) : (
                      <div
                        className="w-10 h-10 mr-1 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: '#e8f0fe' }}
                      >
                        <Navigation className="w-4 h-4" style={{ color: '#1a73e8' }} />
                      </div>
                    )}
                  </div>

                  {/* Suggestions dropdown inside Drawer */}
                  <AnimatePresence>
                    {searchFocused && (suggestions.length > 0 || localSuggestions.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                        style={{ maxHeight: '40vh', overflowY: 'auto' }}
                      >
                        {/* Local results */}
                        {localSuggestions.length > 0 && (
                          <div className="flex flex-col">
                            {Object.entries(groupedSuggestions).map(([groupName, groupClinics]) => (
                              <div key={groupName} className="flex flex-col">
                                <div className="px-4 py-2 flex items-center justify-between bg-gray-50 border-y border-gray-100">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                                    {groupName}
                                  </span>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {groupClinics.length}
                                  </span>
                                </div>
                                {groupClinics.map((clinic, idx) => {
                                  const details = getClinicTypeDetails(clinic.type);
                                  const q = normalizeString(searchQuery);
                                  const name = clinic.name;
                                  const lowerName = normalizeString(name);
                                  const matchStart = lowerName.indexOf(q);

                                  const renderName = () => {
                                    if (matchStart === -1) return <span>{name}</span>;
                                    return (
                                      <>
                                        <span>{name.slice(0, matchStart)}</span>
                                        <span className="font-black text-on-surface">{name.slice(matchStart, matchStart + searchQuery.length)}</span>
                                        <span>{name.slice(matchStart + searchQuery.length)}</span>
                                      </>
                                    );
                                  };

                                  const isLast = idx === groupClinics.length - 1;
                                  return (
                                    <button
                                      key={clinic.id}
                                      onMouseDown={() => {
                                        setSearchQuery(clinic.name);
                                        setLocalSuggestions([]);
                                        setSuggestions([]);
                                        setSearchFocused(false);
                                        handleClinicSelect(clinic);
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${
                                        !isLast ? 'border-b border-gray-100' : ''
                                      }`}
                                    >
                                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${details.colorClasses}`}>
                                        {React.createElement(details.icon, { className: 'w-4 h-4' })}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 leading-tight truncate">
                                          {renderName()}
                                        </p>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                          {clinic.address || details.label}
                                        </p>
                                      </div>
                                      <div className="shrink-0 flex flex-col items-end gap-0.5">
                                        {clinic.rating && (
                                          <span className="text-[9px] text-amber-500 font-bold">★ {clinic.rating.toFixed(1)}</span>
                                        )}
                                        {(clinic.isOpen || clinic.open24h) ? (
                                          <span className="text-[8px] font-bold text-emerald-500">Abierto</span>
                                        ) : (
                                          <span className="text-[8px] font-bold text-red-400">Cerrado</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Google Places predictions */}
                        {suggestions.length > 0 && (
                          <>
                            {localSuggestions.length > 0 && (
                              <div className="px-4 pt-2 pb-1 border-t border-outline-variant/10 bg-surface-container/30">
                                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                                  Google Maps
                                </span>
                              </div>
                            )}
                            {suggestions.map((pred: any, idx: number) => {
                              const main = pred.structured_formatting?.main_text || pred.description || '';
                              const secondary = pred.structured_formatting?.secondary_text || '';
                              const matchedParts = pred.structured_formatting?.main_text_matched_substrings || [];

                              const renderHighlighted = () => {
                                if (matchedParts.length === 0) return <span>{main}</span>;
                                const parts: React.ReactNode[] = [];
                                let cursor = 0;
                                matchedParts.forEach((match: any, i: number) => {
                                  if (cursor < match.offset) {
                                    parts.push(<span key={`b${i}`}>{main.slice(cursor, match.offset)}</span>);
                                  }
                                  parts.push(
                                    <span key={`m${i}`} className="font-black text-on-surface">
                                      {main.slice(match.offset, match.offset + match.length)}
                                    </span>
                                  );
                                  cursor = match.offset + match.length;
                                });
                                if (cursor < main.length) parts.push(<span key="t">{main.slice(cursor)}</span>);
                                return <>{parts}</>;
                              };

                              return (
                                <button
                                  key={pred.place_id}
                                  onMouseDown={() => handleSuggestionSelect(pred)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors text-left ${
                                    idx < suggestions.length - 1 ? 'border-b border-outline-variant/10' : ''
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-on-surface-variant leading-tight truncate">
                                      {renderHighlighted()}
                                    </p>
                                    {secondary && (
                                      <p className="text-[11px] text-on-surface-variant/60 truncate mt-0.5">{secondary}</p>
                                    )}
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-on-surface-variant/40 shrink-0" />
                                </button>
                              );
                            })}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category chips (filters) inside Drawer */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 shrink-0" style={{ scrollbarWidth: 'none' }}>
                  {FILTER_OPTIONS.map(({ value, label, labelShort }) => {
                    const details = value !== 'all' ? getClinicTypeDetails(value) : null;
                    const isActive = filter === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setFilter(value)}
                        title={label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all shrink-0"
                        style={{
                          background: isActive ? '#1a73e8' : 'white',
                          color: isActive ? 'white' : '#444',
                          border: isActive ? 'none' : '1px solid #dadce0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        {details && React.createElement(details.icon, {
                          className: 'w-3 h-3',
                          style: { color: isActive ? 'white' : details.markerColors.bg }
                        })}
                        <span>{labelShort}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Clinic directory list inside Drawer */}
                <div className="flex-grow flex flex-col min-h-0 gap-2 mt-1">
                  <div className="flex items-center justify-between px-1 mb-1 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Centros Médicos ({filteredClinics.length})
                    </span>
                    {loadingPlaces && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />}
                  </div>

                  <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 no-scrollbar">
                    {filteredClinics.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-gray-100">
                        No se encontraron centros médicos en esta zona.
                      </div>
                    ) : (
                      filteredClinics.map((clinic) => {
                        const details = getClinicTypeDetails(clinic.type);
                        const isOpen = clinic.isOpen !== undefined ? clinic.isOpen : clinic.open24h;
                        const isSelected = selectedClinic?.id === clinic.id;
                        return (
                          <div
                            key={clinic.id}
                            onClick={() => {
                              handleClinicSelect(clinic);
                              if (window.innerWidth < 1024) {
                                setIsMenuOpen(false);
                              }
                            }}
                            className={`w-full p-3 rounded-2xl border text-left flex gap-3 cursor-pointer hover:bg-slate-50 transition-all duration-200 ${
                              isSelected 
                                ? 'border-primary bg-primary/[0.02] shadow-sm' 
                                : 'border-gray-100 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${details.colorClasses}`}>
                              {React.createElement(details.icon, { className: 'w-5 h-5' })}
                            </div>
                            
                            <div className="flex-grow min-w-0 flex flex-col">
                              <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">
                                {clinic.name}
                              </h4>
                              <span className="text-[11px] text-gray-400 truncate mt-0.5">
                                {clinic.address || details.label}
                              </span>
                              
                              <div className="flex items-center gap-2 mt-2 shrink-0">
                                {clinic.rating && (
                                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                    ★ {clinic.rating.toFixed(1)}
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                                  {isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                                {clinic.sector === 'public' && (
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                    Público
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rapid directions button — opens Google Maps */}
                            <div className="shrink-0 flex items-center justify-center">
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${clinic.location.lat},${clinic.location.lng}&travelmode=driving`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200"
                                title="Cómo llegar"
                              >
                                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedClinic && (
          <motion.div
            key={selectedClinic.id}
            initial={{ opacity: 0, y: 100, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed lg:absolute bottom-0 lg:top-0 lg:bottom-0 left-0 right-0 lg:right-auto z-45 flex flex-col lg:flex-row h-[60vh] lg:h-full w-full lg:w-auto transition-all duration-300 ${
              isMenuOpen ? 'lg:left-[360px]' : 'lg:left-0'
            }`}
            style={{ zIndex: 45 }}
          >
            {/* --- Narrow left strip (like Google Maps sidebar) --- hidden on mobile */}
            <div className="hidden lg:block w-10 shrink-0" />

            {/* --- Main detail panel (Google Maps left/bottom sheet) --- */}
            <div
              className="flex flex-col bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.12)] lg:shadow-2xl overflow-y-auto w-full lg:w-[360px] h-full rounded-t-[32px] lg:rounded-t-none lg:rounded-none relative"
            >
              {/* Mobile drag handle indicator */}
              <div className="lg:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
              {/* --- Photo --- */}
              {selectedClinic.photos && selectedClinic.photos.length > 0 ? (
                <div className="relative shrink-0" style={{ height: '200px' }}>
                  <img
                    src={selectedClinic.photos[0]}
                    alt={selectedClinic.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedClinic(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-all"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div
                  className="relative shrink-0 flex items-center justify-center"
                  style={{ height: '160px', background: '#f1f3f4' }}
                >
                  {React.createElement(getClinicTypeDetails(selectedClinic.type).icon, {
                    className: 'w-16 h-16 text-gray-300'
                  })}
                  <button
                    onClick={() => setSelectedClinic(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-all"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}

              {/* --- Name + Rating block --- */}
              <div className="px-5 pt-4 pb-2">
                <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                  {selectedClinic.name}
                </h2>

                {/* Stars + review count --- exactly like Google Maps */}
                {selectedClinic.rating ? (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-sm font-semibold text-gray-700">
                      {selectedClinic.rating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={s <= Math.round(selectedClinic.rating!) ? '#F9AB01' : '#E0E0E0'}>
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    {selectedClinic.reviews && (
                      <span className="text-sm text-blue-700 underline cursor-pointer">
                        ({selectedClinic.reviews.toLocaleString()})
                      </span>
                    )}
                  </div>
                ) : null}

                {/* Type badge + wheelchair --- like "Hospital • ♿" */}
                <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-gray-600">
                  <span>{getClinicTypeDetails(selectedClinic.type).label}</span>
                  {selectedClinic.wheelchairAccessible && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span>♿</span>
                    </>
                  )}
                  {selectedClinic.sector === 'public' && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-blue-600 font-medium">Público</span>
                    </>
                  )}
                  {/* Confidence badge */}
                  {(() => {
                    const badge = getConfidenceBadge(reportSummaries.get(selectedClinic.id));
                    const map: Record<string, string> = {
                      verified: '✅ Verificado',
                      warned: '⚠️ En revisión',
                      flagged: '🚩 Reportado',
                    };
                    return map[badge] ? (
                      <>
                        <span className="text-gray-400">·</span>
                        <span className="text-[12px] text-gray-500">{map[badge]}</span>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* --- Tabs: Descripci\u00F3n | Opiniones | Acerca de --- */}
              <div className="flex border-b border-gray-200 px-2 mt-1">
                {['Descripci\u00F3n general', 'Opiniones', 'Acerca de'].map((tab, i) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
                      i === 0
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* --- Circular Action Buttons --- exactly like Google Maps --- */}
              <div className="flex justify-around px-3 py-4 border-b border-gray-100">
                {/* Indicaciones — Abre Google Maps externo directamente */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedClinic.location.lat},${selectedClinic.location.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Navigation className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium text-center leading-tight" style={{ maxWidth: '56px' }}>
                    Indicaciones
                  </span>
                </a>

                {/* Guardar */}
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Flag className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium">Guardar</span>
                </button>

                {/* Cerca */}
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Search className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium">Cerca</span>
                </button>

                {/* Llamar */}
                {selectedClinic.phone ? (
                  <a
                    href={`tel:${selectedClinic.phone}`}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Phone className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">Llamar</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedForReport(selectedClinic)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Flag className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">Reportar</span>
                  </button>
                )}
              </div>

              {/* --- Address row --- */}
              {selectedClinic.address && (
                <div className="flex items-start gap-4 px-5 py-3.5 border-b border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-700 leading-snug">{selectedClinic.address}</p>
                  </div>
                </div>
              )}

              {/* --- Hours row --- */}
              {selectedClinic.open24h ? (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-[13px] text-gray-700">
                      <span className="text-green-700 font-medium">Abierto</span>
                      {' \u00B7 '}
                      <span>Abre las 24 horas</span>
                    </p>
                  </div>
                </div>
              ) : selectedClinic.openingHours ? (
                <div className="flex items-start gap-4 px-5 py-3.5 border-b border-gray-100">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-medium ${
                        selectedClinic.openingHours.isOpen ? 'text-green-700' : 'text-red-600'
                      }`}>
                        {selectedClinic.openingHours.isOpen ? 'Abierto ahora' : 'Cerrado ahora'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    {selectedClinic.openingHours.weekdayText && (
                      <div className="mt-1.5 space-y-0.5">
                        {selectedClinic.openingHours.weekdayText.map((line, i) => {
                          const today = new Date().getDay();
                          const adjustedToday = today === 0 ? 6 : today - 1;
                          const isToday = i === adjustedToday;
                          return (
                            <div key={i} className={`flex gap-3 text-[12px] ${
                              isToday ? 'font-semibold text-gray-900' : 'text-gray-500'
                            }`}>
                              <span className="w-20 shrink-0">{line.split(':')[0]}</span>
                              <span>{line.split(':').slice(1).join(':').trim()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className={`text-[13px] font-medium ${selectedClinic.isOpen ? 'text-green-700' : 'text-red-600'}`}>
                    {selectedClinic.isOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
              )}

              {/* --- Phone row --- */}
              {selectedClinic.phone && (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <a href={`tel:${selectedClinic.phone}`} className="text-[13px] text-blue-700 hover:underline">
                    {selectedClinic.phone}
                  </a>
                </div>
              )}

              {/* --- Website row --- */}
              {selectedClinic.website && (
                <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100">
                  <Globe2 className="w-4 h-4 text-gray-500 shrink-0" />
                  <a
                    href={selectedClinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-blue-700 hover:underline truncate"
                  >
                    {selectedClinic.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {/* --- Report button (community tool, unique to Salud Conecta) --- */}
              <div className="px-5 py-4">
                <button
                  onClick={() => setSelectedForReport(selectedClinic)}
                  className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span>Reportar un problema</span>
                </button>
              </div>

              {/* --- Photo gallery strip --- */}
              {selectedClinic.photos && selectedClinic.photos.length > 1 && (
                <div className="px-5 pb-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {selectedClinic.photos.slice(1).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${selectedClinic.name} foto ${i + 2}`}
                        className="w-28 h-20 object-cover rounded-lg shrink-0"
                      />
                    ))}
                  </div>
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
