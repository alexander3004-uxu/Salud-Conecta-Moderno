import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  User,
  Mic,
  RotateCcw,
  Send,
  Hospital,
  Store,
  Clock4,
  AlertTriangle,
  Sparkles,
  Loader2
} from 'lucide-react';

import { Clinic } from '../../types';
import { getClinics } from '../../services/clinicService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const calculateDistance = (pos1: {lat: number; lng: number}, pos2: {lat: number; lng: number}): string => {
  const R = 6371;
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Custom clinic icon factory
const createClinicIcon = (type: string, isOpen: boolean, isSelected: boolean) => {
  const colors: Record<string, { bg: string; border: string }> = {
    pharmacy: { bg: '#51df8e', border: '#2ecc71' },
    emergency: { bg: '#F04438', border: '#c0392b' },
    default: { bg: '#a6c8ff', border: '#2E90FA' },
  };
  const color = type === 'pharmacy' ? colors.pharmacy : type === 'emergency' ? colors.emergency : colors.default;
  
  return L.divIcon({
    className: 'custom-clinic-marker',
    html: `
      <div style="
        width: 44px; height: 44px; 
        background: ${isOpen ? color.bg : '#404753'}; 
        border: 3px solid ${isSelected ? '#fff' : color.border};
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: all 0.3s;
        ${!isOpen ? 'opacity: 0.6;' : ''}
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          ${type === 'pharmacy' 
            ? '<path d="M6 19V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M9 9h6M12 6v6"/>'
            : type === 'emergency'
              ? '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
              : '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
          }
        </svg>
        ${!isOpen ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);border-radius:11px;display:flex;align-items:center;justify-content:center"><div style="width:70%;height:2px;background:white;transform:rotate(45deg)"/></div></div>' : ''}
      </div>
      <div style="
        width: 0; height: 0; 
        border-left: 6px solid transparent; 
        border-right: 6px solid transparent; 
        border-top: 10px solid ${isOpen ? color.bg : '#404753'};
        margin: -2px auto 0;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      "></div>
      ${isOpen ? `<div style="
        width: 10px; height: 10px; 
        background: ${color.bg}; 
        border-radius: 50%;
        position: absolute; bottom: 18px; right: -2px;
        border: 2px solid white;
        box-shadow: 0 0 10px ${color.bg};
      "></div>` : ''}
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 56],
    popupAnchor: [0, -56],
  });
};

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position:relative;width:24px;height:24px">
      <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(46,144,250,0.2);animation:pulse 2s infinite"></div>
      <div style="
        width:24px;height:24px;background:white;border-radius:50%;
        border:3px solid #2E90FA;display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 20px rgba(46,144,250,0.6);
      ">
        <div style="width:10px;height:10px;background:#2E90FA;border-radius:50%"></div>
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function ChangeView({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function ClinicsMap({
  clinics,
  selectedClinic,
  setSelectedClinic,
  userLocation,
  setCenter,
}: {
  clinics: (Clinic & { isOpen?: boolean })[];
  selectedClinic: (Clinic & { isOpen?: boolean }) | null;
  setSelectedClinic: (c: (Clinic & { isOpen?: boolean }) | null) => void;
  userLocation: { lat: number; lng: number };
  setCenter: (c: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse { 0%,100% { opacity:0.3;transform:scale(1) } 50% { opacity:0.1;transform:scale(1.5) } }
      .custom-clinic-marker, .user-location-marker { background: none !important; border: none !important; }
      .leaflet-popup-content-wrapper { border-radius: 16px !important; padding: 0 !important; overflow: hidden !important; }
      .leaflet-popup-content { margin: 0 !important; min-width: 300px !important; }
      .leaflet-popup-close-button { top: 8px !important; right: 8px !important; color: white !important; font-size: 20px !important; z-index: 10 !important; }
    `;
    map.getContainer().appendChild(style);
  }, [map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={userLocation} />
      
      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="p-3 text-center">
            <p className="text-sm font-bold">Tu ubicación</p>
          </div>
        </Popup>
      </Marker>

      {/* Clinic markers */}
      {clinics.map(clinic => (
        <Marker
          key={clinic.id}
          position={[clinic.location.lat, clinic.location.lng]}
          icon={createClinicIcon(clinic.type, clinic.isOpen ?? clinic.open24h, selectedClinic?.id === clinic.id)}
          eventHandlers={{
            click: () => setSelectedClinic(clinic),
          }}
        >
          <Popup>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                     style={{ background: clinic.type === 'emergency' ? 'rgba(240,68,56,0.1)' : 'rgba(81,223,142,0.1)' }}>
                  {clinic.type === 'emergency' ? <Activity className="w-5 h-5" style={{color: '#F04438'}} /> : <Pill className="w-5 h-5" style={{color: '#51df8e'}} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{clinic.name}</h3>
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {clinic.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold" style={{color: (clinic.isOpen ?? clinic.open24h) ? '#51df8e' : '#888'}}>
                  {(clinic.isOpen ?? clinic.open24h) ? 'Abierto' : 'Cerrado'}
                </span>
                <span className="text-sm font-bold">{calculateDistance(userLocation, clinic.location)}</span>
              </div>
              <button 
                onClick={() => setSelectedClinic(clinic)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                style={{background: clinic.type === 'emergency' ? '#F04438' : '#2E90FA'}}
              >
                Ver Detalles
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function HealthMap() {
  const { t } = useLanguage();
  const { isPremium } = useUser();
  const [clinics, setClinics] = useState<(Clinic & { isOpen?: boolean })[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<(Clinic & { isOpen?: boolean }) | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 12.1364, lng: -86.2514 }); // Default to Managua
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency'>('all');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [triageSummary, setTriageSummary] = useState<{
    urgency: string;
    description: string;
    condition: string;
  } | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<{clinics: any[]; summary: string} | null>(null);
  const [aiTriageResult, setAiTriageResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Real Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Geolocation permission denied or failed. Using default center.");
        }
      );
    }
  }, []);

  const userLocationContext = {
    lat: userLocation.lat,
    lng: userLocation.lng,
    city: 'Managua',
    country: 'Nicaragua'
  };

  const handleAISmartSearch = useCallback(async (query: string) => {
    if (!query.trim() || clinics.length === 0) return;
    setIsSearchingAI(true);
    setSearchQuery(query);
    try {
      const response = await fetch(`${API_URL}/api/gemini/smart-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: query, location: userLocationContext, clinics })
      });
      const results = await response.json();
      setAiSearchResults(results);
      
      const triageRes = await fetch(`${API_URL}/api/gemini/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: query, location: userLocationContext })
      });
      const triage = await triageRes.json();
      setAiTriageResult(triage);
      
      if (triage.urgency === 'emergency') {
        setIsEmergencyMode(true);
        setFilter('emergency');
      } else if (triage.urgency === 'high') {
        setFilter('emergency');
      }
    } catch (error) {
      console.error('AI Search Error:', error);
    } finally {
      setIsSearchingAI(false);
    }
  }, [clinics, userLocationContext]);

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
    const mockClinics: (Clinic & { isOpen?: boolean })[] = [
      { id: 'nic-1', name: 'Farmacia FarmaValue Carretera Masaya', type: 'pharmacy', sector: 'private', location: { lat: 12.1154, lng: -86.2354 }, address: 'Km 4.5 Carretera a Masaya, Managua', phone: '+505 2270 0000', inStock: true, open24h: true, isOpen: true },
      { id: 'nic-2', name: 'Farmacia Kielsa Altamira', type: 'pharmacy', sector: 'private', location: { lat: 12.1250, lng: -86.2540 }, address: 'Altamira d\'Este, Managua', phone: '+505 2278 1234', inStock: true, open24h: false, isOpen: true },
      { id: 'nic-3', name: 'Hospital Central Dr. César Amador Kühl', type: 'emergency', sector: 'public', location: { lat: 12.1360, lng: -86.2650 }, address: 'Managua, Nicaragua', phone: '+505 2277 1234', open24h: true, isOpen: true },
      { id: 'nic-vivian', name: 'Hospital Vivian Pellas', type: 'emergency', sector: 'private', location: { lat: 12.0950, lng: -86.2250 }, address: 'Km 9.5 Carretera a Masaya, Managua', phone: '+505 2255 6900', open24h: true, isOpen: true },
      { id: 'nic-4', name: 'Hospital Militar Dr. Alejandro Dávila Bolaños', type: 'emergency', sector: 'public', location: { lat: 12.1480, lng: -86.2750 }, address: 'Costado Oeste de Tiscapa, Managua', phone: '+505 2222 2100', open24h: true, isOpen: true },
      { id: 'nic-5', name: 'Centro de Salud Pedro Altamirano', type: 'clinic', sector: 'public', location: { lat: 12.1280, lng: -86.2420 }, address: 'Altamira, Managua', phone: '+505 2267 1111', open24h: false, isOpen: true },
    ];

    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        if (data.length > 5) {
          setClinics(data);
        } else {
          setClinics(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const uniqueMocks = mockClinics.filter(c => !existingIds.has(c.id));
            return [...prev, ...uniqueMocks];
          });
        }
      } catch (e) {
        setClinics(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const uniqueMocks = mockClinics.filter(c => !existingIds.has(c.id));
          return [...prev, ...uniqueMocks];
        });
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => {
    const matchesFilter = filter === 'all' || c.type === filter;
    const matchesTier = isPremium || c.sector === 'public';
    if (aiSearchResults?.clinics) {
      const recommendedIds = aiSearchResults.clinics
        .filter((sc: any) => sc.recommended)
        .map((sc: any) => sc.id);
      if (recommendedIds.length > 0 && !recommendedIds.includes(c.id)) return false;
    }
    return matchesFilter && matchesTier;
  });

  const sortedClinics = [...filteredClinics].sort((a, b) => {
    if (aiSearchResults?.clinics) {
      const aIndex = aiSearchResults.clinics.findIndex((sc: any) => sc.id === a.id);
      const bIndex = aiSearchResults.clinics.findIndex((sc: any) => sc.id === b.id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
    }
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Emergency Banner */}
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
        {/* Sidebar */}
        <aside className="w-full md:w-[420px] lg:w-[480px] bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-20 shadow-xl overflow-hidden relative">
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
                    <button onClick={() => { setIsNavigating(false); setRouteInfo(null); }}
                      className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 active:scale-95 transition-transform">
                      <RotateCcw className="w-3.5 h-3.5" /> Cancelar Ruta
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-secondary tracking-widest uppercase">En Camino</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-current shadow-xl bg-primary/10 text-primary">
                      <Hospital className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-display font-black text-on-surface leading-tight tracking-tight">{selectedClinic?.name || 'Centro Médico'}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline-variant uppercase">Distancia</span>
                          <span className="text-sm font-display font-bold text-on-surface">{routeInfo.distance}</span>
                        </div>
                        <div className="w-px h-6 bg-outline-variant/30" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline-variant uppercase">Tiempo</span>
                          <span className="text-sm font-display font-bold text-primary">{routeInfo.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-4">
                  <Navigation className="w-16 h-16 text-primary opacity-30" />
                  <p className="text-sm text-on-surface-variant">Usa Google Maps o Waze para navegación paso a paso</p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic?.location.lat},${selectedClinic?.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-14 bg-primary text-on-primary font-display font-black text-sm uppercase tracking-[0.15em] rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <Navigation className="w-5 h-5 fill-current" />
                    Abrir en Google Maps
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="flex flex-col h-full">
                <div className="p-6 bg-surface-container border-b border-outline-variant/30 shrink-0">
                  {isEmergencyMode ? (
                    <div className="mb-4 bg-error-container/10 rounded-2xl p-4 border border-error/20 flex gap-4">
                      <div className="bg-error/10 p-2 rounded-xl h-fit border border-error/20">
                        <Stethoscope className="w-5 h-5 text-error" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Resumen de Triaje IA</h4>
                        <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                          {aiTriageResult?.recommendation || triageSummary?.description || 'Dolor torácico agudo reportado. Posible compromiso cardiovascular. Prioridad Alta.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <Search className="w-4 h-4" />
                          </div>
                          <h2 className="text-xl font-display font-bold text-on-surface">Red de Salud</h2>
                        </div>
                        <div className="flex items-center gap-2">
                          {searchQuery && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => { setSearchQuery(''); setAiSearchResults(null); setAiTriageResult(null); }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all font-mono"
                            >
                              <span>{searchQuery.toUpperCase()}</span><X className="w-3 h-3" />
                            </motion.button>
                          )}
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                            isPremium ? 'bg-primary/20 text-primary border-primary/30' : 'bg-hospital-green/10 text-hospital-green border-hospital-green/20'
                          }`}>
                            {isPremium ? 'Red Total Premium' : 'Solo Red Pública'}
                          </span>
                        </div>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input') as HTMLInputElement; if (input?.value) handleAISmartSearch(input.value); }} className="relative">
                        <div className="relative flex items-center">
                          <Sparkles className="absolute left-4 w-4 h-4 text-secondary animate-pulse" />
                          <input type="text" placeholder="Describe tus síntomas o búsqueda..."
                            className="w-full h-12 pl-10 pr-24 bg-surface-container-high border border-outline-variant/30 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors" />
                          <button type="submit" disabled={isSearchingAI}
                            className="absolute right-2 h-9 px-4 bg-primary text-on-primary rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                            {isSearchingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}IA
                          </button>
                        </div>
                      </form>
                      {aiSearchResults && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-secondary-container/20 border border-secondary/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-secondary" />
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Análisis IA</span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{aiSearchResults.summary}</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {!isPremium && !isEmergencyMode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-5 bg-primary/5 rounded-[24px] border border-primary/20 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                        <ShieldAlert className="w-16 h-16 text-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nuestra Misión</span>
                        </div>
                        <h4 className="text-sm font-display font-black text-on-surface mb-2">{t('maps.social_mission.title')}</h4>
                        <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-80">{t('maps.social_mission.desc')}</p>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex gap-2 mt-6 md:mt-8 overflow-x-auto scrollbar-hide pb-1">
                    {[
                      { id: 'all', label: 'Todos', icon: Globe },
                      { id: 'pharmacy', label: 'Farmacias', icon: Pill },
                      { id: 'emergency', label: 'Urgencias', icon: Activity }
                    ].map((f) => (
                      <button key={f.id} onClick={() => setFilter(f.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shadow-sm font-mono ${
                          filter === f.id ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/40'
                        }`}>
                        <f.icon className="w-3.5 h-3.5" />{f.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 px-6 bg-surface-container-low border-b border-outline-variant/10">
                  <h3 className="text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] font-mono">Centros Cercanos Prioritarios</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {sortedClinics.map((clinic) => {
                    const aiRecommendation = aiSearchResults?.clinics.find((sc: any) => sc.id === clinic.id);
                    return (
                      <motion.div layout key={clinic.id} onClick={() => setSelectedClinic(clinic)}
                        className={`group relative bg-surface-container p-5 rounded-2xl border transition-all cursor-pointer ${
                          selectedClinic?.id === clinic.id ? 'border-primary ring-1 ring-primary/40 bg-surface-container-high' 
                          : isEmergencyMode && clinic.type === 'emergency' ? 'border-error/30 bg-error/5'
                          : aiRecommendation?.recommended ? 'border-secondary/40 bg-secondary/5 ring-1 ring-secondary/20'
                          : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high'
                        }`}>
                        {selectedClinic?.id === clinic.id && (
                          <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-full ${clinic.type === 'emergency' ? 'bg-error' : 'bg-primary'}`} />
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-current transition-colors ${clinic.type === 'emergency' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>
                              {clinic.type === 'emergency' ? <Activity className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="font-display font-bold text-lg leading-tight">{clinic.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                  clinic.sector === 'public' ? 'bg-hospital-green/10 text-hospital-green border-hospital-green/20' : 'bg-primary/10 text-primary border-primary/20'
                                }`}>{clinic.sector === 'public' ? t('maps.tag.public') : t('maps.tag.private')}</span>
                                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium italic opacity-70">
                                  <MapPin className="w-3 h-3" /> {clinic.address}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xl font-display font-bold leading-none">{calculateDistance(userLocation, clinic.location)}</span>
                            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-tighter mt-1">Cerca de ti</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {aiRecommendation?.recommended && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border bg-secondary-container text-secondary border-secondary-container">
                              <Sparkles className="w-3 h-3" /> Recomendado IA
                            </div>
                          )}
                          {clinic.open24h && (
                            <div className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-outline-variant/30">
                              <Clock className="w-3 h-3" /> 24 Horas
                            </div>
                          )}
                        </div>
                        <button onClick={() => { setSelectedClinic(clinic); setIsNavigating(true); }}
                          className={`w-full py-3.5 px-4 rounded-[18px] font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          selectedClinic?.id === clinic.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-highest text-on-surface border border-outline-variant/30 hover:bg-surface-container active:scale-[0.98]'}`}>
                          <Route className="w-4 h-4" /> Iniciar Navegación
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {isEmergencyMode && (
                  <div className="px-6 pb-6 pt-2 space-y-4">
                    <button onClick={() => setIsEmergencyMode(false)}
                      className="w-full py-3 text-[10px] font-bold text-outline-variant hover:text-error uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-dashed border-outline-variant/30 rounded-xl">
                      <X className="w-3.5 h-3.5" /> Finalizar Modo Emergencia
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Map Section - OpenStreetMap */}
        <section className="flex-1 relative bg-background overflow-hidden" style={{ zIndex: 1 }}>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            className="w-full h-full"
            style={{ background: '#0b1326' }}
          >
            <ClinicsMap
              clinics={sortedClinics}
              selectedClinic={selectedClinic}
              setSelectedClinic={setSelectedClinic}
              userLocation={userLocation}
              setCenter={() => {}}
            />
          </MapContainer>

          {/* Route Overlay */}
          <div className="hidden md:flex absolute top-6 right-6 p-6 glass-panel-elevated rounded-2xl w-[320px] flex-col gap-4 z-[1000] shadow-2xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-primary/20 text-primary border-primary/30">
                <Route className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface leading-tight">Ruta Activa</h3>
            </div>
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-3">
              <span className="text-xs text-on-surface-variant font-medium">Usa Google Maps</span>
              <span className="text-2xl font-display font-bold text-primary">--:--</span>
            </div>
            <div className="flex items-center gap-3 text-secondary-container">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono leading-tight">Mapa sin restricciones</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[1000]">
            <button onClick={() => {/* Leaflet handles this via ChangeView */}}
              className="w-12 h-12 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
              title="Centrar en mi ubicación">
              <Target className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary-fixed uppercase tracking-widest shadow-lg z-[1000]">
            OpenStreetMap • Sin API Key
          </div>
        </section>
      </div>
    </div>
  );
}