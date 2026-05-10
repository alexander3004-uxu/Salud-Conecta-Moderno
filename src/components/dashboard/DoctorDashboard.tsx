import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Calendar, 
  AlertCircle,
  Pill,
  FileText,
  Video,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export default function DoctorDashboard() {
  const stats = [
    { label: 'Pacientes Hoy', value: '42', change: '+12% vs ayer', icon: Users, color: 'text-primary' },
    { label: 'Turnos Pendientes', value: '18', change: 'Próximo en 5 min', icon: Calendar, color: 'text-primary' },
    { label: 'Alertas Triaje', value: '3', change: 'Atención urgente', icon: AlertCircle, color: 'text-error' },
  ];

  const patients = [
    { 
      id: 'MR', 
      name: 'María Rodríguez', 
      age: 65, 
      condition: 'Dolor torácico agudo', 
      level: 'Nivel 1 - Resucitación', 
      time: '10:00 AM',
      color: 'border-l-error',
      tagColor: 'bg-error-container/20 text-error border-error/30'
    },
    { 
      id: 'JL', 
      name: 'Juan López', 
      age: 42, 
      condition: 'Dificultad respiratoria moderada', 
      level: 'Nivel 2 - Emergencia', 
      time: '10:15 AM',
      color: 'border-l-secondary',
      tagColor: 'bg-secondary-container/20 text-secondary border-secondary/30'
    },
    { 
      id: 'AS', 
      name: 'Ana Silva', 
      age: 55, 
      condition: 'Control de presión arterial', 
      level: 'Nivel 4 - Menor', 
      time: '10:30 AM',
      color: 'border-l-tertiary',
      tagColor: 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
    },
  ];

  const shortcuts = [
    { title: 'Recetas Digitales', sub: 'Emitir o renovar', icon: Pill },
    { title: 'Historial Clínico', sub: 'Buscar registros', icon: FileText },
    { title: 'Telemedicina', sub: 'Iniciar videoconsulta', icon: Video },
  ];

  const weeklyData = [
    { day: 'L', value: 40 },
    { day: 'M', value: 60 },
    { day: 'X', value: 90, highlighted: true, label: '24' },
    { day: 'J', value: 50 },
    { day: 'V', value: 70 },
    { day: 'S', value: 20 },
    { day: 'D', value: 10 },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-8 px-4 md:px-0">
      {/* Emergency Triage Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-error-container text-on-error-container rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between border-l-4 border-error shadow-lg gap-4"
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-6 h-6 text-error" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-black text-error">Alerta Crítica: 3 Pacientes Triaje IA</h2>
            <p className="text-xs md:text-sm font-medium opacity-80">Atención inmediata requerida. Riesgo elevado detectado por algoritmos de IA.</p>
          </div>
        </div>
        <button className="w-full md:w-auto px-6 py-3 bg-error text-on-error font-display font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2">
          Ver Detalles
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 flex flex-col justify-between h-40 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <div className="flex flex-col relative z-10">
              <span className={`text-4xl md:text-5xl font-display font-black ${stat.label === 'Alertas Triaje' ? 'text-error' : 'text-on-surface'}`}>{stat.value}</span>
              <span className={`text-[10px] font-bold mt-1 ${stat.label === 'Alertas Triaje' ? 'text-error/80' : 'text-secondary'}`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: Patient List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black text-on-surface">Próximos Turnos & Triaje</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver Agenda Completa
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {patients.map((patient, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`bg-surface-container border border-outline-variant/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border-l-4 ${patient.color} hover:bg-surface-container-high transition-colors cursor-pointer group shadow-sm`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center font-display font-black text-lg ${patient.color.replace('border-l-', 'text-')}`}>
                    {patient.id}
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-black text-on-surface group-hover:text-primary transition-colors">{patient.name}</h4>
                    <p className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                       {patient.condition} <span className="opacity-40">•</span> Edad: {patient.age}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${patient.tagColor}`}>
                    {patient.level}
                  </span>
                  <div className="flex items-center gap-2 min-w-20 justify-end">
                    <Clock className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />
                    <span className="text-sm font-display font-black text-on-surface">{patient.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Actions & Charts */}
        <div className="flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-black text-on-surface mb-6">Accesos Directos</h3>
            <div className="flex flex-col gap-3">
              {shortcuts.map((action, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-transparent hover:border-primary/30 hover:bg-surface-container-high transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-on-surface uppercase tracking-widest">{action.title}</span>
                    <span className="block text-[10px] font-medium text-on-surface-variant opacity-70">{action.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-lg font-display font-black text-on-surface">Actividad Semanal</h3>
              <TrendingUp className="w-5 h-5 text-secondary opacity-80" />
            </div>

            <div className="flex items-end justify-between h-40 mt-4 relative z-10 px-2">
              {weeklyData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 w-8">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-700 relative group/bar ${
                      data.highlighted 
                        ? 'bg-primary shadow-[0_0_20px_rgba(49,146,252,0.4)]' 
                        : 'bg-primary/20 hover:bg-primary/40'
                    }`}
                    style={{ height: `${data.value}%` }}
                  >
                    {data.label && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright text-primary font-display font-black text-[10px] px-2 py-1 rounded border border-outline-variant/30 shadow-xl pointer-events-none">
                        {data.label}
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white/20 rounded-t-lg pointer-events-none" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${data.highlighted ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Network Status */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm border-b-4 border-b-secondary flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Nivel de Red</span>
                <span className="text-sm font-display font-black text-on-surface">Validación Profesional Completa</span>
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-secondary opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
