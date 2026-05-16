import React, { useState, useEffect, useRef, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { 
  MapPin, Phone, Pill, Activity, Navigation, Search, Clock, CheckCircle2, 
  Route, Target, Plus, Minus, X, ShieldAlert, Stethoscope, ChevronRight, 
  Hospital, RefreshCw, Loader2
} from 'lucide-react';
import { Clinic } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { GOOGLE_MAPS_KEY } from "../../lib/config";
import { getClinics } from '../../services/clinicService';

const API_KEY = GOOGLE_MAPS_KEY;
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const NICARAGUA_CENTER = { lat: 12.1328, lng: -86.2504 };

const ClinicMarker: React.FC<{ clinic: Clinic & { isOpen?: boolean }, onClick: (c: Clinic & { isOpen?: boolean }) => void }> = ({ clinic, onClick }) => {
  const isOpen = clinic.isOpen !== undefined ? clinic.isOpen : clinic.open24h;
  const colors: Record<string, { bg: string; border: string }> = {
    pharmacy: { bg: '#51df8e', border: '#2ecc71' },
    emergency: { bg: '#F04438', border: '#c0392b' },
    hospital: { bg: '#2E90FA', border: '#1a73e8' },
    'health-center': { bg: '#9334E6', border: '#7c3aed' },
    clinic: { bg: '#a6c8ff', border: '#2E90FA' },
    laboratory: { bg: '#F59E0B', border: '#d97706' },
  };
  const color = colors[clinic.type] || colors.default;

  return (
    <AdvancedMarker position={clinic.location} onClick={() => onClick(clinic)}>
      <div className="relative flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform">
        <div style={{
          width: '40px', height: '40px',
          background: isOpen ? color.bg : '#404753',
          border: `3px solid ${color.border}`,
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          opacity: !isOpen ? 0.6 : 1
        }}>
          {clinic.type === 'pharmacy' ? <Pill className="w-4 h-4 text-white" /> : 
           clinic.type === 'emergency' ? <ShieldAlert className="w-4 h-4 text-white" /> : 
           clinic.type === 'hospital' ? <Hospital className="w-4 h-4 text-white" /> :
           clinic.type === 'health-center' ? <Stethoscope className="w-4 h-4 text-white" /> :
           clinic.type === 'laboratory' ? <Activity className="w-4 h-4 text-white" /> :
           <MapPin className="w-4 h-4 text-white" />}
        </div>
        <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `8px solid ${isOpen ? color.bg : '#404753'}`, marginTop: '-1px' }} />
        {isOpen && <div style={{ width: '8px', height: '8px', background: color.bg, borderRadius: '50%', position: 'absolute', bottom: '14px', right: '-2px', border: '1.5px solid white' }} />}
      </div>
    </AdvancedMarker>
  );
};

function UserLocationMarker({ position }: { position: google.maps.LatLngLiteral }) {
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
  onMapReady
}: { 
  clinics: (Clinic & { isOpen?: boolean })[]; 
  userLocation: { lat: number; lng: number };
  onClinicSelect: (c: Clinic & { isOpen?: boolean }) => void;
  onMapReady: (map: google.maps.Map) => void;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);

  return (
    <>
      {clinics.map(clinic => (
        <ClinicMarker key={clinic.id} clinic={clinic} onClick={onClinicSelect} />
      ))}
      <UserLocationMarker position={userLocation} />
    </>
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
  const [center, setCenter] = useState(NICARAGUA_CENTER);
  const [userLocation, setUserLocation] = useState(NICARAGUA_CENTER);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency' | 'hospital' | 'health-center' | 'laboratory' | 'clinic'>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [placesLib, setPlacesLib] = useState<google.maps.places.PlacesLibrary | null>(null);

  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    setPlacesLib(placesLibrary || null);
  }, [placesLibrary]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn('Geolocation denied, using default')
      );
    }
  }, []);

  useEffect(() => {
    const loadClinics = async () => {
      setLoading(true);
      try {
        const dbClinics = await getClinics();
        setClinics(dbClinics);
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

      const searchTerms = [
        { term: 'hospital', type: 'hospital' },
        { term: 'clínica médica', type: 'clinic' },
        { term: 'centro de salud', type: 'health-center' },
        { term: 'farmacia', type: 'pharmacy' },
        { term: 'laboratorio clínico', type: 'laboratory' },
        { term: 'emergencia médica', type: 'emergency' },
      ];

      const newClinics: (Clinic & { isOpen?: boolean })[] = [];
      const existingIds = new Set(clinics.map(c => c.id));

      for (const { term, type } of searchTerms) {
        try {
          const request: google.maps.places.TextSearchRequest = {
            query: `${term} Nicaragua`,
            bounds: bounds,
            fields: ['id', 'name', 'geometry', 'formatted_address', 'types', 'formatted_phone_number', 'rating', 'user_ratings_total'],
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
            if (place.geometry?.location && !existingIds.has(place.place_id || '')) {
              const clinic: Clinic & { isOpen?: boolean } = {
                id: `google-${place.place_id}`,
                name: place.name || 'Sin nombre',
                type: type as Clinic['type'],
                sector: 'private',
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                },
                address: place.formatted_address || '',
                phone: place.formatted_phone_number || '',
                open24h: type === 'hospital' || type === 'emergency',
                isOpen: true,
                rating: place.rating,
                reviews: place.user_ratings_total,
              };
              newClinics.push(clinic);
              existingIds.add(place.place_id || '');
            }
          }
        } catch (err) {
          console.warn(`Search failed for ${term}:`, err);
        }
      }

      if (newClinics.length > 0) {
        setClinics(prev => [...prev, ...newClinics]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoadingPlaces(false);
    }
  }, [placesLib, clinics, hasValidKey]);

  const handleMapIdle = useCallback(() => {
    if (mapInstance && placesLib && hasValidKey && clinics.length < 50) {
      searchPlacesInArea(mapInstance);
    }
  }, [mapInstance, placesLib, hasValidKey, clinics.length, searchPlacesInArea]);

  const filteredClinics = clinics.filter(c => filter === 'all' || c.type === filter);

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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hospital: 'Hospital', pharmacy: 'Farmacia', 'health-center': 'Centro de Salud',
      emergency: 'Emergencia', clinic: 'Clínica', laboratory: 'Laboratorio'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hospital: 'bg-blue-100 text-blue-700',
      pharmacy: 'bg-green-100 text-green-700',
      emergency: 'bg-red-100 text-red-700',
      'health-center': 'bg-purple-100 text-purple-700',
      clinic: 'bg-indigo-100 text-indigo-700',
      laboratory: 'bg-amber-100 text-amber-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
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
          <Map 
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
              onCenterChange={setMapInstance}
            />
          </Map>
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

        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 max-h-[60vh] bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-outline-variant/20 z-40 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
              <input type="text" placeholder="Buscar centro de salud..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none min-w-0" />
              {loadingPlaces && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 flex-wrap">
              {(['all', 'hospital', 'emergency', 'health-center', 'pharmacy', 'clinic', 'laboratory'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {f === 'all' ? 'Todos' : getTypeLabel(f)}
                </button>
              ))}
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(clinic.type)}`}>
                    {clinic.type === 'pharmacy' ? <Pill className="w-4 h-4" /> : 
                     clinic.type === 'emergency' ? <ShieldAlert className="w-4 h-4" /> : 
                     clinic.type === 'hospital' ? <Hospital className="w-4 h-4" /> :
                     clinic.type === 'health-center' ? <Stethoscope className="w-4 h-4" /> :
                     clinic.type === 'laboratory' ? <Activity className="w-4 h-4" /> :
                     <MapPin className="w-4 h-4" />}
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
        </div>

        {selectedClinic && !isNavigating && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-surface rounded-3xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden">
            <div className={`p-4 border-b ${selectedClinic.type === 'emergency' ? 'bg-error/10' : 'bg-primary/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">{getTypeLabel(selectedClinic.type)}</span>
                {selectedClinic.sector === 'public' && <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">PÚBLICO</span>}
              </div>
              <h3 className="text-base font-black text-on-surface">{selectedClinic.name}</h3>
              <p className="text-xs text-on-surface-variant">{selectedClinic.address}</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-surface-container/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase">Teléfono</span>
                </div>
                <p className="text-xs font-bold text-on-surface">{selectedClinic.phone || 'N/A'}</p>
              </div>
              <div className="bg-surface-container/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase">Horario</span>
                </div>
                <p className="text-xs font-bold text-on-surface">{selectedClinic.open24h ? '24 horas' : selectedClinic.isOpen ? 'Abierto' : 'Cerrado'}</p>
              </div>
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <button onClick={() => setIsNavigating(true)}
                className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" /> Cómo Llegar
              </button>
              <button onClick={() => setSelectedClinic(null)}
                className="px-4 py-3 bg-surface-container text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-container-high">
                Cerrar
              </button>
            </div>
          </motion.div>
        )}

        <MapControls onCenter={handleCenterToUser} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </APIProvider>
  );
}