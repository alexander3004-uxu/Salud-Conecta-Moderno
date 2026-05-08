import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
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
  X
} from 'lucide-react';
import { Clinic } from '../../types';
import { getClinics } from '../../services/clinicService';
import { motion } from 'motion/react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function ClinicMarker({ clinic, onClick }: { clinic: Clinic, onClick: (c: Clinic) => void, key?: any }) {
  const [markerRef] = useAdvancedMarkerRef();
  
  const getColor = () => {
    switch (clinic.type) {
      case 'pharmacy': return '#12B76A'; // Green
      case 'emergency': return '#F04438'; // Red
      default: return '#2E90FA'; // Blue
    }
  };

  return (
    <AdvancedMarker
      ref={markerRef}
      position={clinic.location}
      onClick={() => onClick(clinic)}
      title={clinic.name}
    >
      <Pin background={getColor()} borderColor="#ffffff33" glyphColor="#fff">
        {clinic.type === 'pharmacy' ? <Pill className="w-3 h-3" /> : clinic.type === 'emergency' ? <Activity className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
      </Pin>
    </AdvancedMarker>
  );
}

export default function HealthMap() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [center] = useState({ lat: -33.4489, lng: -70.6693 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pharmacy' | 'emergency'>('all');

  useEffect(() => {
    const handleMedicationSearch = (e: any) => {
      const medication = e.detail?.medication;
      if (medication) {
        setSearchTerm(medication);
        setFilter('pharmacy');
      }
    };

    window.addEventListener('medicationSearch', handleMedicationSearch);
    return () => window.removeEventListener('medicationSearch', handleMedicationSearch);
  }, []);

  useEffect(() => {
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'Farmacia Central MSP',
        type: 'pharmacy',
        location: { lat: -33.45, lng: -70.66 },
        address: 'Av. Salud Pública 452',
        phone: '+56 9 1234 5678',
        inStock: true,
        open24h: true,
      },
      {
        id: '2',
        name: 'FarmaVida Norte',
        type: 'pharmacy',
        location: { lat: -33.46, lng: -70.67 },
        address: 'Calle Bienestar 890',
        phone: '+56 9 8765 4321',
        inStock: true,
        open24h: false,
      },
      {
        id: '3',
        name: 'Urgencia Sanitaria 24h',
        type: 'emergency',
        location: { lat: -33.44, lng: -70.65 },
        address: 'Av. Gran Hospital 10',
        phone: '911',
        open24h: true,
      },
      {
        id: '4',
        name: 'Hospital Regional',
        type: 'emergency',
        location: { lat: -33.435, lng: -70.645 },
        address: 'Calle Medicina 77',
        phone: '911',
        open24h: true,
      }
    ];

    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        if (data.length > 0) setClinics(data);
        else setClinics(mockClinics);
      } catch (e) {
        setClinics(mockClinics);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => {
    const matchesFilter = filter === 'all' || c.type === filter;
    // For demo purposes, we show all pharmacies if searching for medication
    return matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* Sidebar: Logistical Clarity */}
      <aside className="w-full md:w-[420px] lg:w-[480px] bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-20 shadow-xl overflow-hidden relative">
        
        {/* Context Header */}
        <div className="p-6 bg-surface-container border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold text-on-surface">Red de Salud</h2>
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
          
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide pb-1">
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
                  : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high'
              }`}
            >
              {selectedClinic?.id === clinic.id && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-full" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium italic">
                    <MapPin className="w-3 h-3" /> {clinic.address}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-display font-bold text-primary">1.2 km</span>
                  <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-tighter">Aprox. 5 min</span>
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
                    <Clock className="w-3 h-3" /> Abierto 24/7
                  </div>
                )}
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedClinic?.id === clinic.id
                  ? 'bg-primary text-on-primary shadow-lg'
                  : 'bg-surface-container-highest text-on-surface border border-outline-variant/30 hover:bg-primary shadow-sm'
              }`}>
                <Route className="w-4 h-4" />
                Trazar Ruta Óptima
              </button>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Map Section */}
      <section className="flex-1 relative bg-background overflow-hidden">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={center}
              defaultZoom={13}
              mapId="DARK_MODE_MAP"
              className="w-full h-full"
              gestureHandling="greedy"
              disableDefaultUI
            >
              {clinics.map(clinic => (
                <ClinicMarker 
                  key={clinic.id} 
                  clinic={clinic} 
                  onClick={setSelectedClinic} 
                />
              ))}

              {selectedClinic && (
                <InfoWindow
                  position={selectedClinic.location}
                  onCloseClick={() => setSelectedClinic(null)}
                >
                  <div className="p-1 min-w-[200px]">
                    <h4 className="font-display font-bold text-primary">{selectedClinic.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">{selectedClinic.address}</p>
                    <div className="mt-3 pt-3 border-t border-outline-variant/30 flex gap-2">
                       <button className="flex-1 bg-primary text-on-primary py-1.5 rounded-lg text-xs font-bold shadow-md">Llegar</button>
                       <a href={`tel:${selectedClinic.phone}`} className="w-10 h-8 flex items-center justify-center bg-surface-container rounded-lg border border-outline-variant/30">
                          <Phone className="w-4 h-4" />
                       </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-cover bg-center grayscale opacity-60 mix-blend-screen" 
               style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr1biyQAoYA3-Hq4qI8fOnXgkDERfbtqJkhE-oG7uZ4-nBBThi8jcCdIv0NgUFbXo3y-ZgwB_s_1I-5wAnm4FvBemeWNmid3vACTSYEsbzGZBuGoR5bXL2UudJAMv0AWlhvwFnKwgmGd5DOvNAdY8rTU1fkU19OHPwJpJD9sffZaPnlLUf3ZKASDhmvchKGnkH0COXzxRyi9GhwHgSlHa9ab-IfkSp-uJRxlwfm70XGgys-UtZ2YPaMWxQInl8Pz-lQNgr3E_C5g')` }}
          />
        )}

        {/* Route Overlay: Desktop only floating panel */}
        <div className="hidden md:flex absolute top-6 right-6 p-6 glass-panel-elevated rounded-2xl w-[320px] flex-col gap-4 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Route className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-on-surface leading-tight">Ruta Activa</h3>
          </div>
          
          <div className="flex justify-between items-end border-b border-outline-variant/20 pb-3">
            <span className="text-xs text-on-surface-variant font-medium">Llegada estimada</span>
            <span className="text-2xl font-display font-bold text-primary">14:35</span>
          </div>

          <div className="flex items-center gap-3 text-secondary-container">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono leading-tight">Stock Reservado Temporalmente</p>
          </div>

          {!hasValidKey && (
            <div className="p-3 bg-alert-red/10 border border-alert-red/20 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-alert-red shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-alert-red leading-tight">Configuración de API Key requerida para navegación real.</p>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
           <button className="w-12 h-12 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-all active:scale-95">
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
  );
}
