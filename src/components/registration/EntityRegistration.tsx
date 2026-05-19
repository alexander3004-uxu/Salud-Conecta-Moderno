import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Activity, 
  Clock, 
  MapPin, 
  Locate, 
  Save, 
  Info,
  ChevronLeft,
  Stethoscope,
  Hospital,
  FlaskConical,
  FileUp,
  GraduationCap,
  Phone,
  Shield,
  Briefcase,
  FileText,
  Upload,
  User,
  CheckCircle,
  RotateCw,
  Search,
  Timer,
  Compass,
  Scan,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveClinic } from '../../services/clinicService';
import { Clinic } from '../../types';

interface EntityRegistrationProps {
  onBack: () => void;
  onFinish?: () => void;
  initialType?: RegistrationType;
}

type RegistrationType = 'doctor' | 'clinic' | 'lab_pharmacy';

export default function EntityRegistration({ onBack, onFinish, initialType = 'lab_pharmacy' }: EntityRegistrationProps) {
  const [regType, setRegType] = useState<RegistrationType>(initialType);
  const [isValidating, setIsValidating] = useState(false);

  // --- Form States ---
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState(''); // Only for doctor
  const [selectedType, setSelectedType] = useState<Clinic['type']>('clinic');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [open24h, setOpen24h] = useState(false);
  const [lat, setLat] = useState(12.1328);
  const [lng, setLng] = useState(-86.2504);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        (err) => console.warn('Geolocation registration error:', err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // --- Leaflet Map Init ---
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lng], 14);

      const isDark = document.documentElement.classList.contains('dark');
      const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
      
      marker.on('dragend', (e: any) => {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }
  }, []);

  // Sync marker position when coords update from geo
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng]);
    }
  }, [lat, lng]);

  // --- Sync Default Subtypes when Primary Category Changes ---
  useEffect(() => {
    if (regType === 'doctor') {
      setSelectedType('clinic');
    } else if (regType === 'clinic') {
      setSelectedType('clinic');
    } else {
      setSelectedType('laboratory');
    }
  }, [regType]);

  const handleFinishRegistration = async () => {
    let finalName = '';
    if (regType === 'doctor') {
      finalName = `Dr. ${name} ${lastName}`.trim() || 'Médico Premium';
    } else {
      finalName = name || (regType === 'clinic' ? 'Clínica Privada Premium' : 'Establecimiento Premium');
    }

    const clinicToSave: Omit<Clinic, 'id'> = {
      name: finalName,
      type: regType === 'doctor' ? 'clinic' : selectedType,
      sector: 'private', // Registered premium clinics are always private
      location: { lat, lng },
      address: address || 'Dirección no especificada',
      phone: phone || '',
      open24h: open24h,
      rating: 5.0, // Pre-seeded premium doctor rating
      reviews: 1,  // Pre-seeded review
      wheelchairAccessible: true,
      description: regType === 'doctor' 
        ? 'Médico profesional premium verificado en la red de Salud Conecta IA.' 
        : 'Establecimiento de salud premium certificado.',
    };

    console.log('Persisting newly registered premium facility in Firestore:', clinicToSave);
    await saveClinic(clinicToSave);
    setIsValidating(true);
  };

  if (isValidating) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
        {/* Minimal Header */}
        <header className="w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-low shadow-sm px-6 h-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-primary">
            <Stethoscope className="w-6 h-6" style={{ strokeWidth: 3 }} />
            <span className="font-display font-black text-xl tracking-tight">Salud Conecta IA</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-10 mt-16 max-w-3xl mx-auto w-full gap-8">
          {/* Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl mb-4"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Progress Indicator */}
              <div className="relative w-32 h-32 mb-8">
                {/* Outer ring (pulsing) */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                {/* Spinner ring */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner circle with icon */}
                <div className="absolute inset-4 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant/30">
                  <Search className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>

              <h1 className="text-3xl font-display font-black mb-3 text-on-surface">Validación en Proceso</h1>
              <p className="text-sm text-on-surface-variant font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                Nuestra Inteligencia Artificial está analizando los documentos subidos de forma segura para verificar tus credenciales.
              </p>

              {/* Status Steps */}
              <div className="w-full max-w-xs bg-surface/50 border border-outline-variant/20 rounded-2xl p-6 mb-8 text-left">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-on-surface/50">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Recepción de documentos</span>
                  </li>
                  <li className="flex items-center gap-3 text-primary relative">
                    <div className="absolute -left-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                    <RotateCw className="w-5 h-5 animate-spin relative z-10" />
                    <span className="text-xs font-black uppercase tracking-widest">Analizando autenticidad...</span>
                  </li>
                  <li className="flex items-center gap-3 text-on-surface-variant/30">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Verificando Registro Sanitario</span>
                  </li>
                </ul>
              </div>

              {/* Estimation Tag */}
              <div className="inline-flex items-center gap-2 bg-surface-container-highest/50 text-on-surface px-5 py-2 rounded-full border border-outline-variant/30 text-[10px] font-black uppercase tracking-widest">
                <Timer className="w-3.5 h-3.5 text-primary" />
                Estimación: 2-5 minutos
              </div>
            </div>
          </motion.div>

          {/* Next Steps Section */}
          <div className="w-full mt-4">
            <h2 className="text-xl font-display font-black mb-6 text-on-surface flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              ¿Qué sigue?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { 
                  icon: <Hospital className="w-5 h-5 text-primary" />,
                  title: 'Triaje Avanzado',
                  desc: 'Acceso a herramientas de IA para pre-diagnóstico.'
                },
                { 
                  icon: <FileText className="w-5 h-5 text-secondary" />,
                  title: 'Recetas Digitales',
                  desc: 'Emisión segura de prescripciones electrónicas.'
                },
                { 
                  icon: <ShieldCheck className="w-5 h-5 text-tertiary" />,
                  title: 'Visibilidad Premium',
                  desc: 'Perfil profesional validado en nuestra red.'
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 hover:bg-surface-container-high transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1.5">{item.title}</h3>
                  <p className="text-[10px] text-on-surface-variant font-medium leading-normal">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-transparent border-2 border-primary/20 text-primary font-display font-black text-sm uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Compass className="w-5 h-5" />
              Explorar la red
            </button>
            {onFinish && (
              <button 
                onClick={onFinish}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-on-primary font-display font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                <Activity className="w-5 h-5" />
                Ver Dashboard (Demo)
              </button>
            )}
            <label className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors">
              <input defaultChecked className="w-5 h-5 rounded border-outline-variant bg-background text-primary focus:ring-primary" type="checkbox" />
              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Notificarme al terminar</span>
            </label>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md">
      {/* Emergency Triage Bar */}
      <div className="w-full bg-secondary-container text-on-secondary-container px-4 py-3 flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-sm">
        <Info className="w-4 h-4" />
        <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-center">
          Modo de Registro Activo - Ingreso de Nuevas Entidades
        </span>
      </div>

      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between bg-surface-container-low border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-primary">Registro de Entidad</h1>
        </div>
        <div className="hidden sm:block text-primary text-xl font-display font-bold">
          Salud Conecta IA
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="mb-4">
          <h2 className="text-2xl font-display font-black text-on-surface mb-1">
            {regType === 'doctor' ? 'Alta de Profesional' : regType === 'clinic' ? 'Registro Institucional' : 'Datos del Establecimiento'}
          </h2>
          <p className="text-sm text-on-surface-variant font-medium">
            {regType === 'doctor' 
              ? 'Complete sus credenciales para unirse a la red de atención médica potenciada por IA.' 
              : regType === 'clinic'
              ? 'Alta en la red nacional de emergencias y derivaciones.'
              : 'Complete la información requerida para registrar el laboratorio o farmacia en la red.'}
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-12 gap-8" onSubmit={(e) => e.preventDefault()}>
          {/* Left Column: Primary Details */}
          <div className="md:col-span-8 flex flex-col gap-8">
            {/* Identification Card */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                {regType === 'doctor' ? <User className="w-6 h-6 text-primary" /> : regType === 'clinic' ? <Hospital className="w-6 h-6 text-primary" /> : <Store className="w-6 h-6 text-primary" />}
                {regType === 'doctor' ? 'Identidad' : regType === 'clinic' ? 'Datos del Centro' : 'Identificación Oficial'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regType === 'doctor' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Nombre(s)</label>
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. Dra. Elena" 
                        type="text" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Apellidos</label>
                      <input 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. Silva Ramírez" 
                        type="text" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Teléfono de Contacto</label>
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. +505 8888 8888" 
                        type="tel" 
                      />
                    </div>
                  </>
                ) : regType === 'clinic' ? (
                  <>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Nombre de la Institución</label>
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. Hospital General San Martín" 
                        type="text" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tipo de Centro</label>
                      <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as Clinic['type'])}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium outline-none appearance-none cursor-pointer"
                      >
                        <option value="clinic">Clínica / Consultorio</option>
                        <option value="hospital">Hospital Privado</option>
                        <option value="emergency">Centro de Urgencias</option>
                        <option value="dental">Clínica Dental</option>
                        <option value="mental-health">Salud Mental</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Razón Social</label>
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. Laboratorios del Sur S.A." 
                        type="text" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tipo de Establecimiento</label>
                      <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as Clinic['type'])}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium outline-none appearance-none cursor-pointer"
                      >
                        <option value="laboratory">Laboratorio de Análisis Clínicos</option>
                        <option value="pharmacy">Farmacia / Dispensario</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">CUIT / Registro Sanitario</label>
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="30-XXXXXXXX-X" 
                        type="text" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Teléfono</label>
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium transition-all outline-none" 
                        placeholder="Ej. +505 8888 8888" 
                        type="tel" 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Specialized Fields for Doctors */}
            {regType === 'doctor' && (
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                  Credenciales Clínicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Especialidad Principal</label>
                    <select defaultValue="" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface px-5 py-3 font-medium outline-none appearance-none cursor-pointer">
                      <option value="" disabled>Seleccione una especialidad...</option>
                      <option>Cardiología</option>
                      <option>Neurología</option>
                      <option>Pediatría</option>
                      <option>Medicina General</option>
                      <option>Urgencias</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Matrícula Profesional</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface px-5 py-3 font-medium outline-none" placeholder="MP-000000" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Años de Experiencia</label>
                    <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface px-5 py-3 font-medium outline-none" placeholder="Ej. 10" type="number" />
                  </div>
                </div>
              </div>
            )}

            {/* Credential Validation for Doctors */}
            {regType === 'doctor' && (
              <div className="bg-surface-container/40 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                <div className="flex items-center gap-3 mb-2 border-b border-outline-variant/20 pb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-display font-black text-on-surface">Validación de Credenciales</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Matrícula Upload */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Carga de Matrícula Profesional</label>
                    <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-surface-container-low/40 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group/upload">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline-variant group-hover/upload:text-primary transition-colors">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-on-surface">Arrastre su archivo aquí</p>
                        <p className="text-[10px] text-on-surface-variant opacity-60 mt-1 uppercase tracking-wider">PDF, JPG, PNG (Máx 5MB)</p>
                      </div>
                      <button className="bg-surface-container-highest text-on-surface font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Subir archivo
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-tertiary uppercase tracking-widest mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                        <span>Pendiente de carga</span>
                      </div>
                    </div>
                  </div>

                  {/* Título Upload */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Título Médico Habilitante</label>
                    <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-surface-container-low/40 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group/upload">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline-variant group-hover/upload:text-primary transition-colors">
                        <GraduationCap className="w-10 h-10" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-on-surface">Arrastre su título aquí</p>
                        <p className="text-[10px] text-on-surface-variant opacity-60 mt-1 uppercase tracking-wider">Copia legalizada (Máx 10MB)</p>
                      </div>
                      <button className="bg-surface-container-highest text-on-surface font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Subir archivo
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-tertiary uppercase tracking-widest mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                        <span>Pendiente de carga</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Capacities Section for Clinics */}
            {regType === 'clinic' && (
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                  <Stethoscope className="w-6 h-6 text-secondary" />
                  Capacidades
                </h3>
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Especialidades Ofrecidas</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Emergentología', value: 'emergentology' },
                      { label: 'Terapia Intensiva', value: 'icu' },
                      { label: 'Cirugía General', value: 'surgery' },
                      { label: 'Pediatría', value: 'pediatrics' }
                    ].map((spec) => (
                      <label key={spec.value} className="flex items-center gap-2 bg-surface-container-highest/50 px-4 py-2 rounded-full cursor-pointer hover:bg-surface-bright transition-colors border border-outline-variant/30">
                        <input className="w-4 h-4 rounded border-outline-variant bg-background text-secondary focus:ring-secondary" type="checkbox" />
                        <span className="text-xs font-bold text-on-surface">{spec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Section for Clinics */}
            {regType === 'clinic' && (
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary" />
                <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                  <Phone className="w-6 h-6 text-tertiary" />
                  Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Teléfono de Emergencias (24hs)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-error" />
                      <input 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-low border border-error-container/50 rounded-xl focus:border-error focus:ring-1 focus:ring-error text-on-surface pl-12 pr-5 py-3 font-medium outline-none" 
                        placeholder="Ej. +54 11 4444-5555" 
                        type="tel" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Director Médico Responsable</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface pl-12 pr-5 py-3 font-medium outline-none" placeholder="Nombre completo" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Card for Establishments (Labs/Pharma) */}
            {regType === 'lab_pharmacy' && (
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
                <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-primary" />
                  Servicios Disponibles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Análisis Clínicos', sub: 'Extracciones, muestras' },
                    { title: 'Imágenes', sub: 'Rayos X, Ecografías' },
                    { title: 'Farmacia', sub: 'Despacho de medicamentos' }
                  ].map((service) => (
                    <label key={service.title} className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded-2xl bg-surface-container-low cursor-pointer hover:border-primary transition-all">
                      <input className="mt-1 w-4 h-4 rounded border-outline-variant/50 bg-background text-primary focus:ring-primary" type="checkbox" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">{service.title}</span>
                        <span className="text-[10px] text-on-surface-variant opacity-70 leading-tight mt-0.5">{service.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Hours Card */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
              <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-primary" />
                Horario de Atención
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Apertura</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium outline-none" type="time" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Cierre</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium outline-none" type="time" />
                </div>
              </div>
              <label className="flex items-center gap-3 mt-2 group cursor-pointer p-3 bg-secondary/5 border border-secondary/10 rounded-2xl">
                <input 
                  checked={open24h}
                  onChange={(e) => setOpen24h(e.target.checked)}
                  className="w-5 h-5 rounded border-secondary/30 bg-background text-secondary focus:ring-secondary" 
                  type="checkbox" 
                />
                <span className="text-xs font-black text-secondary uppercase tracking-widest">Atención 24 Horas (Guardia Activa)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Location & Actions */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
              <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                Ubicación
              </h3>
              
              {/* Interactive Google Map coordinates selector */}
              <div className="w-full h-64 bg-surface-container-low rounded-2xl border border-outline-variant/20 relative overflow-hidden mb-2 shadow-inner">
                <div ref={mapContainerRef} className="w-full h-full z-0" />
                
                {/* Float Locate Button */}
                <div className="absolute bottom-3 right-3 z-10">
                  <button 
                    className="bg-surface/90 border border-outline-variant/50 px-4 py-2 rounded-full font-display font-bold text-[10px] text-primary flex items-center gap-1.5 hover:bg-surface transition-all shadow-xl backdrop-blur-sm" 
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setLat(pos.coords.latitude);
                            setLng(pos.coords.longitude);
                          }
                        );
                      }
                    }}
                  >
                    <Locate className="w-3.5 h-3.5" />
                    Detectar Ubicación
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  {regType === 'doctor' ? 'Dirección Física / Consultorio' : regType === 'clinic' ? 'Dirección Institucional' : 'Dirección Completa'}
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-on-surface px-5 py-3 font-medium outline-none resize-none" 
                  placeholder={regType === 'doctor' ? 'Ej. Av. Principal 123, Consultorio 4B' : 'Calle, Número, Piso, Localidad'} 
                  rows={2}
                />
              </div>

              {/* Coordinates Indicator */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Latitud</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 text-xs font-mono text-on-surface-variant cursor-not-allowed" 
                    disabled 
                    value={lat.toFixed(6)} 
                    type="text" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Longitud</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 text-xs font-mono text-on-surface-variant cursor-not-allowed" 
                    disabled 
                    value={lng.toFixed(6)} 
                    type="text" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <button 
                onClick={handleFinishRegistration}
                className="w-full py-5 bg-primary text-on-primary font-display font-black text-lg rounded-2xl flex justify-center items-center gap-3 hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" 
                type="button"
              >
                <Save className="w-6 h-6" />
                {regType === 'doctor' ? 'Finalizar Registro' : regType === 'clinic' ? 'Registrar Institución' : 'Registrar Entidad'}
              </button>
              <button 
                onClick={onBack}
                className="w-full py-5 bg-transparent border-2 border-outline-variant text-on-surface-variant font-display font-black text-lg rounded-2xl flex justify-center items-center hover:bg-surface-container-low transition-all active:scale-[0.98]" 
                type="button"
              >
                Cancelar
              </button>
              <div className="flex items-center justify-center gap-2 text-outline-variant text-[10px] font-bold uppercase tracking-widest mt-2">
                <span>Información Encriptada</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
