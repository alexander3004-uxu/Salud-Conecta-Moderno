import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Bed, 
  Hospital, 
  Users, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Brain,
  Ambulance,
  Stethoscope,
  Baby,
  Activity,
  Maximize2,
  ChevronRight
} from 'lucide-react';

export default function CenterDashboard() {
  const stats = [
    { label: 'Camas Libres', value: '12', total: '45', icon: Bed, color: 'text-on-surface-variant' },
    { label: 'Quirófanos', value: '2', total: '5', icon: Hospital, color: 'text-on-surface-variant' },
    { label: 'En Triaje', value: '24', icon: Users, color: 'text-primary', highlight: true },
    { label: 'Críticos', value: '3', icon: AlertCircle, color: 'text-error', critical: true },
  ];

  const triagePatients = [
    { 
      id: 'RO', 
      name: 'Roberto O.', 
      age: 64, 
      condition: 'Sospecha IAM, dolor torácico irradiado, diaforesis.', 
      level: 'CÓDIGO ROJO', 
      wait: '12 min', 
      ia: 'Severo',
      color: 'bg-error',
      tagColor: 'bg-error-container/20 text-error border-error/20'
    },
    { 
      id: 'ML', 
      name: 'María L.', 
      age: 28, 
      condition: 'Trauma extremidad inferior, posible fractura cerrada.', 
      level: 'CÓDIGO AMARILLO', 
      wait: '45 min', 
      color: 'bg-tertiary',
      tagColor: 'bg-tertiary-container/20 text-tertiary border-tertiary/20'
    },
    { 
      id: 'JP', 
      name: 'Juan P.', 
      age: 45, 
      condition: 'Cuadro febril, malestar general, síntomas respiratorios altos.', 
      level: 'CÓDIGO VERDE', 
      wait: '1h 20m', 
      color: 'bg-secondary',
      tagColor: 'bg-secondary-container/20 text-secondary border-secondary/20'
    },
  ];

  const staff = [
    { name: 'Dr. A. Gómez', specialty: 'Cirugía General', icon: Stethoscope, online: true },
    { name: 'Dra. S. Ruiz', specialty: 'Pediatría', icon: Baby, online: true },
    { name: 'Dr. J. Silva', specialty: 'Anestesiología', icon: Brain, online: false },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-8">
      {/* Emergency Alert Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-error-container text-on-error-container px-6 py-4 flex items-center justify-center gap-3 rounded-2xl border border-error/20 shadow-lg"
      >
        <AlertTriangle className="w-6 h-6 animate-bounce" />
        <span className="text-sm font-black uppercase tracking-widest text-center">
          ALERTA CRÍTICA: 3 Pacientes Código Rojo en Espera - Derivación Inmediata Requerida
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-surface-container-low border rounded-3xl p-5 flex flex-col gap-2 relative overflow-hidden shadow-sm ${
                  stat.critical ? 'border-error/30' : 'border-outline-variant/30'
                }`}
              >
                {stat.highlight && <div className="absolute inset-0 bg-primary/5 pointer-events-none" />}
                {stat.critical && <div className="absolute inset-0 bg-error/5 pointer-events-none" />}
                
                <div className={`flex justify-between items-center relative z-10 ${stat.highlight ? 'text-primary' : stat.critical ? 'text-error' : 'text-on-surface-variant'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  <stat.icon className="w-4 h-4" />
                </div>
                
                <div className="relative z-10 flex items-baseline gap-1">
                  <span className={`text-3xl font-display font-black ${stat.highlight ? 'text-primary' : stat.critical ? 'text-error' : 'text-on-surface'}`}>
                    {stat.value}
                  </span>
                  {stat.total && (
                    <span className="text-xs font-bold text-on-surface-variant opacity-60">/{stat.total}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Triage List */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/30">
              <h2 className="text-xl font-display font-black text-on-surface">Pacientes en Triaje de Emergencia</h2>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                Ver todos
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex flex-col">
              {triagePatients.map((patient, idx) => (
                <div key={idx} className="flex items-center gap-4 p-6 border-b border-outline-variant/10 hover:bg-surface-container transition-colors relative group cursor-pointer">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${patient.color}`} />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-lg ${patient.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                    {patient.id}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-display font-black text-on-surface group-hover:text-primary transition-colors">
                        {patient.name} - {patient.age}a
                      </h3>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${patient.tagColor}`}>
                        {patient.level}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant line-clamp-1 mb-3">{patient.condition}</p>
                    <div className="flex gap-4">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {patient.wait} espera
                      </span>
                      {patient.ia && (
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          IA Nivel: {patient.ia}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Derivations Map */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col relative h-80 shadow-sm group">
            <div className="absolute inset-0 z-0">
              {/* Simulated Map Texture */}
              <div className="w-full h-full bg-surface-container relative opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Ambulance className="w-12 h-12 text-primary opacity-20" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
            </div>
            
            <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-surface-container-low/80 to-transparent">
              <h2 className="text-xl font-display font-black text-on-surface">Derivaciones Activas</h2>
              <button className="bg-surface/50 backdrop-blur-md p-2 rounded-xl text-primary hover:bg-primary hover:text-on-primary transition-all">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative z-10 mt-auto p-6">
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-surface-container-high/90 backdrop-blur-md border border-primary/20 rounded-2xl p-4 flex items-center gap-4 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Ambulance className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-on-surface uppercase tracking-widest">Unidad M-04 (ETA: 4 min)</p>
                  <p className="text-[10px] font-medium text-on-surface-variant">Traslado crítico desde Hosp. Norte</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Staff on Call */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container/30">
              <h2 className="text-[10px] font-black text-on-surface uppercase tracking-widest">Personal de Guardia</h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {staff.map((person, idx) => (
                <div key={idx} className={`flex items-center justify-between ${!person.online ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      <person.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{person.name}</p>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{person.specialty}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${person.online ? 'bg-secondary animate-pulse shadow-[0_0_8px_rgba(81,223,142,0.6)]' : 'bg-outline-variant'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Button */}
          <button className="w-full py-5 bg-surface-container-highest border border-outline-variant/30 rounded-3xl text-sm font-black text-on-surface uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-3">
            <Activity className="w-5 h-5" />
            Configurar Gestión de Camas
          </button>
        </div>
      </div>
    </div>
  );
}
