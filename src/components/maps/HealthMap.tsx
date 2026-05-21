import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, Phone, Navigation, Search, Clock,
  Target, Plus, Minus, X, ShieldAlert, ChevronRight,
  Loader2, Flag, Star, Globe2, Accessibility, Menu
} from 'lucide-react';
import { Clinic } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import centrosSaludData from '../../data/centros_salud.json';
import { getClinicTypeDetails, getFilterOptions, ALL_SEARCH_TERMS, FilterType } from './mapUtils';
import { getReportSummaries, getConfidenceBadge, ReportSummary } from '../../services/facilityReportService';
import { ReportModal } from './ReportModal';


const NICARAGUA_CENTER = { lat: 11.93749, lng: -85.968 }; // Granada, Nicaragua center

const normalizeString = (str: string) => 
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const CONFIDENCE_BADGE_STYLE: Record<string, { border: string; dot?: string }> = {
  verified:    { border: '#10B981', dot: '#10B981' },
  unconfirmed: { border: 'transparent' },
  warned:      { border: '#F59E0B', dot: '#F59E0B' },
  flagged:     { border: '#EF4444', dot: '#EF4444' },
};

function LeafletMapContent({
  clinics,
  userLocation,
  onClinicSelect,
  reportSummaries,
  selectedClinic
}: {
  clinics: (Clinic & { isOpen?: boolean })[];
  userLocation: { lat: number; lng: number };
  onClinicSelect: (c: Clinic & { isOpen?: boolean }) => void;
  reportSummaries: Map<string, ReportSummary>;
  selectedClinic: (Clinic & { isOpen?: boolean }) | null;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const routePolylineRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) {
      console.error("Leaflet not loaded on window.");
      return;
    }

    const initialLat = selectedClinic?.location.lat ?? userLocation?.lat ?? 11.93749;
    const initialLng = selectedClinic?.location.lng ?? userLocation?.lng ?? -85.968;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([initialLat, initialLng], 14);

    // Apply dark tile layer or light tile layer
    const isDark = document.documentElement.classList.contains('dark');
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. React to HTML dark mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // Remove existing tile layers and add new one
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const isDark = document.documentElement.classList.contains('dark');
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);
  }, []);

  // 3. Sync User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;
    const L = (window as any).L;
    if (!L) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-14 h-14 bg-primary/10 rounded-full animate-ping opacity-40"></div>
        <div class="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping opacity-60"></div>
        <div class="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border-[2.5px] border-primary">
          <div class="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-location-marker-leaflet',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map);
  }, [userLocation]);

  // 4. Draw Clinic Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    clinics.forEach(clinic => {
      const details = getClinicTypeDetails(clinic.type);
      const color = details.markerColors;
      const isOpen = clinic.open24h || clinic.isOpen;
      
      const summary = reportSummaries.get(clinic.id);
      const confidence = getConfidenceBadge(summary);
      
      const badgeStyle = {
        verified: { border: '#10B981', bg: '#10B981' },
        unconfirmed: { border: 'transparent', bg: 'transparent' },
        warned: { border: '#F59E0B', bg: '#F59E0B' },
        flagged: { border: '#EF4444', bg: '#EF4444' }
      }[confidence];

      const isFlagged = confidence === 'flagged';

      // SVG path depending on type
      const svgPath = {
        hospital: '<path d="M19 14h-1.5v-1.5c0-.83-.67-1.5-1.5-1.5H8c-.83 0-1.5.67-1.5 1.5V14H5c-1.1 0-2 .9-2 2v4h18v-4c0-1.1-.9-2-2-2zM8 6h8c1.1 0 2-.9 2-2V2H6v2c0 1.1.9 2 2 2z" />',
        clinic: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />',
        pharmacy: '<path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z M10.5 4.5C10.5 3.67 11.17 3 12 3s1.5.67 1.5 1.5v15c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-15z" />',
        laboratory: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />'
      }[clinic.type as 'hospital' | 'clinic' | 'pharmacy' | 'laboratory'] || '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />';

      const html = `
        <div class="relative flex flex-col items-center cursor-pointer group">
          <div style="
            width: 38px; height: 38px;
            background: ${isOpen && !isFlagged ? color.bg : '#6B7280'};
            border: 2.5px solid ${badgeStyle.border || color.border};
            border-radius: 11px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: ${confidence === 'warned' ? '0 0 0 2px rgba(245,158,11,0.3)' : '0 4px 10px rgba(0,0,0,0.3)'};
            opacity: ${isFlagged ? 0.5 : !isOpen ? 0.65 : 1};
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${svgPath}
            </svg>
          </div>
          <div style="width: 0; height: 0; border-left: 4.5px solid transparent; border-right: 4.5px solid transparent; border-top: 7px solid ${isOpen && !isFlagged ? color.bg : '#6B7280'}; margin-top: -1px;"></div>
          ${badgeStyle.bg && confidence !== 'unconfirmed' ? `
            <div style="width: 8px; height: 8px; background: ${badgeStyle.bg}; border-radius: 50%; position: absolute; bottom: 12px; right: -2px; border: 1.5px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3)"></div>
          ` : ''}
          ${isFlagged ? `
            <div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #EF4444; border-radius: 50%; border: 1px solid white; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 7px; color: white; font-weight: bold;">!</span>
            </div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: html,
        className: 'leaflet-clinic-marker',
        iconSize: [36, 44],
        iconAnchor: [18, 44]
      });

      const marker = L.marker([clinic.location.lat, clinic.location.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onClinicSelect(clinic);
        });

      markersRef.current.set(clinic.id, marker);
    });
  }, [clinics, reportSummaries]);

  // 5. Pan & zoom to Selected Clinic
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedClinic) return;

    map.setView([selectedClinic.location.lat, selectedClinic.location.lng], 16, {
      animate: true,
      duration: 1.0
    });
  }, [selectedClinic]);

  // 6. Fetch route from OSRM & draw polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (!selectedClinic || !userLocation) {
      return;
    }

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${selectedClinic.location.lng},${selectedClinic.location.lat}?geometries=geojson&overview=full`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]); // Leaflet wants [lat, lng]
          
          if (routePolylineRef.current) {
            routePolylineRef.current.remove();
          }

          routePolylineRef.current = L.polyline(coords, {
            color: '#3B82F6',
            weight: 5,
            opacity: 0.8,
            dashArray: '5, 10'
          }).addTo(map);

          // Fit bounds to show entire route
          map.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50] });
        }
      } catch (err) {
        console.error("OSRM direction route fetch failed:", err);
      }
    };

    fetchRoute();

    return () => {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    };
  }, [selectedClinic, userLocation]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Premium Leaflet Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
        <button 
          onClick={() => {
            if (mapInstanceRef.current && userLocation) {
              mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
            }
          }}
          className="w-12 h-12 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant active:scale-95 transition-all duration-200"
          title="Mi ubicación"
        >
          <Target className="w-5 h-5" />
        </button>
        <button 
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.zoomIn();
            }
          }}
          className="w-12 h-12 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant active:scale-95 transition-all duration-200"
          title="Acercar"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.zoomOut();
            }
          }}
          className="w-12 h-12 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant active:scale-95 transition-all duration-200"
          title="Alejar"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
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
    const [isAutoCentered, setIsAutoCentered] = useState(false);
  
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
  
  
  const normalizeString = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
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

    // 1. Seed clinics from national database
    try {
      centrosSaludData.forEach((c: any, i: number) => {
        let mappedType = 'clinic';
        const rawType = (c.type || '').toLowerCase();
        if (rawType.includes('hospital')) mappedType = 'hospital';
        else if (rawType.includes('farmacia')) mappedType = 'pharmacy';
        else if (rawType.includes('laboratorio')) mappedType = 'laboratory';

        const clinicItem: Clinic = {
          id: `nat-${i}`,
          name: c.name,
          type: mappedType as 'hospital' | 'clinic' | 'pharmacy' | 'laboratory',
          sector: 'public',
          location: { lat: c.location.lat, lng: c.location.lng },
          address: c.address,
          phone: c.phone || '',
          open24h: rawType.includes('hospital'),
          isOpen: true,
          rating: 4.5,
          reviews: 0,
          description: c.sector || '',
          services: c.services || [],
        };
        addUnique(clinicItem, 'n', i);
      });
    } catch (e) {
      console.error("Error seeding national clinics:", e);
    }

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
  }, []);
  const filteredClinics = clinics.filter(c => {
    if (filter === 'all') return true;
    // 'hospital' matches hospital-national, hospital-regional, hospital-primary and hospital
    if (filter === 'hospital') return c.type.startsWith('hospital');
    return c.type === filter;
  });

  const handleClinicSelect = (clinic: Clinic & { isOpen?: boolean }) => {
    setSelectedClinic(clinic);
    
  };

  const handleCenterToUser = () => {};

  const handleZoomIn = () => {};

  const handleZoomOut = () => {};

  const handleRefreshSearch = () => {};

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      <section className="absolute inset-0 z-0">
        <LeafletMapContent
            clinics={filteredClinics}
            userLocation={userLocation}
            onClinicSelect={handleClinicSelect}
            reportSummaries={reportSummaries}
            selectedClinic={selectedClinic}
          />
      </section>

        {loadingPlaces && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold">{t('maps.health.searching_centers')}</span>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-error">{t('maps.health.emergency_mode')}</h3>
                  <p className="text-[10px] font-bold opacity-80">{t('maps.health.emergency_desc')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Hamburger Menu Button --- */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-3 left-3 z-40 w-12 h-12 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all duration-200"
          title={t('maps.health.open_menu')}
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
                  <span className="text-sm font-display font-black uppercase tracking-wider text-primary">{t('maps.health.search_centers')}</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-all text-gray-500 hover:text-gray-800"
                  title={t('maps.health.close_panel')}
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
                      placeholder={t('maps.health.search_placeholder')}
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
                        title={t('maps.health.directions')}
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
                                          <span className="text-[8px] font-bold text-emerald-500">{t('maps.health.open')}</span>
                                        ) : (
                                          <span className="text-[8px] font-bold text-red-400">{t('maps.health.closed')}</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}

                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category chips (filters) inside Drawer */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 shrink-0" style={{ scrollbarWidth: 'none' }}>
                  {getFilterOptions(t).map(({ value, label, labelShort }) => {
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
                      {t('maps.health.medical_centers')} ({filteredClinics.length})
                    </span>
                    {loadingPlaces && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />}
                  </div>

                  <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 no-scrollbar">
                    {filteredClinics.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-gray-100">
                        {t('maps.health.no_centers')}
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
                                  {isOpen ? t('maps.health.open') : t('maps.health.closed')}
                                </span>
                                {clinic.sector === 'public' && (
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                    {t('maps.health.public')}
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
                                title={t('maps.health.directions')}
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
                      <span className="text-blue-600 font-medium">{t('maps.health.public')}</span>
                    </>
                  )}
                  {/* Confidence badge */}
                  {(() => {
                    const badge = getConfidenceBadge(reportSummaries.get(selectedClinic.id));
                    const map: Record<string, string> = {
                      verified: t('maps.health.verified'),
                      warned: t('maps.health.in_review'),
                      flagged: t('maps.health.reported'),
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
                {[t('maps.health.desc_general'), t('maps.health.reviews'), t('maps.health.about')].map((tab, i) => (
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
                    {t('maps.health.directions_btn')}
                  </span>
                </a>

                {/* Guardar */}
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Flag className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium">{t('maps.health.save_btn')}</span>
                </button>

                {/* Cerca */}
                <button className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Search className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium">{t('maps.health.near_btn')}</span>
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
                    <span className="text-[11px] text-blue-700 font-medium">{t('maps.health.call_btn')}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedForReport(selectedClinic)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Flag className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">{t('maps.health.report_btn')}</span>
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
                      <span className="text-green-700 font-medium">{t('maps.health.open')}</span>
                      {' \u00B7 '}
                      <span>{t('maps.health.open_24h')}</span>
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
                        {selectedClinic.openingHours.isOpen ? t('maps.health.open_now') : t('maps.health.closed_now')}
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
                    {selectedClinic.isOpen ? t('maps.health.open') : t('maps.health.closed')}
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
                  <span>{t('maps.health.report_problem')}</span>
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


      </div>
  );
}
