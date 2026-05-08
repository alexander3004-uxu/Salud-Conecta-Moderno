import React from 'react';
import { motion } from 'motion/react';
import { 
  Search as SearchIcon, 
  Stethoscope, 
  Hospital, 
  Store, 
  FlaskConical, 
  Star, 
  MapPin, 
  Calendar,
  PlusSquare,
  Navigation,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Search() {
  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      {/* Search & Filters Hero */}
      <section className="relative overflow-hidden group bg-surface-container border border-outline-variant/30 rounded-[32px] p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-4 tracking-tight">
              Búsqueda Global
            </h1>
            <p className="text-on-surface-variant text-lg font-medium opacity-70 mb-8">
              Encuentra especialistas, clínicas y servicios médicos al instante con el respaldo de Salud Conecta IA.
            </p>
          </motion.div>

          <div className="relative mb-8 group/search">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within/search:text-primary transition-colors w-5 h-5" />
            <input 
              className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 font-normal text-lg rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner" 
              placeholder="Buscar doctor, especialidad, síntomas..." 
              type="text"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
              <kbd className="px-2 py-1 bg-surface-container-highest rounded-md text-[10px] font-bold text-on-surface-variant border border-outline-variant/30">⌘ K</kbd>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: Stethoscope, label: 'Doctores', active: true },
              { icon: Hospital, label: 'Clínicas' },
              { icon: Store, label: 'Farmacias' },
              { icon: FlaskConical, label: 'Laboratorios' }
            ].map((filter, index) => (
              <motion.button 
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full flex items-center gap-3 font-display font-bold text-sm transition-all border ${
                  filter.active 
                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:border-primary/50'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content: Results */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6 mb-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-display font-black text-on-surface flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                  <Star className="w-6 h-6 fill-secondary" />
                </div>
                Resultados Destacados
              </h2>
              <p className="text-on-surface-variant text-sm font-medium opacity-60 ml-13">Profesionales y centros con mayor nivel de respuesta</p>
            </div>
            <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-secondary/10 border border-secondary/20 shadow-lg shadow-secondary/5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[12px] font-mono font-black text-secondary tracking-[0.2em] uppercase">Premium Access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Doctor 1 - Premium style */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-surface-container border-l-8 border-l-secondary border-y border-r border-y-outline-variant/30 border-r-outline-variant/30 rounded-r-[32px] rounded-l-lg p-8 flex flex-col gap-6 relative overflow-hidden group shadow-2xl backdrop-blur-3xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-bl-full pointer-events-none -mr-10 -mt-10 blur-2xl" />
              <div className="flex items-start gap-6">
                <div className="relative group/avatar">
                  <div className="w-24 h-24 rounded-3xl bg-surface-bright overflow-hidden border-4 border-surface-container-high group-hover/avatar:border-secondary transition-all duration-700 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300" 
                      alt="Dr. Martinez"
                      className="w-full h-full object-cover scale-110 group-hover/avatar:scale-100 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-secondary text-on-secondary p-2 rounded-2xl border-4 border-surface-container shadow-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-grow pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-display font-black text-on-surface group-hover:text-primary transition-colors tracking-tight">Dr. Alejandro Martínez</h3>
                  </div>
                  <p className="text-secondary text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Cardiología Intervencionista
                  </p>
                  <div className="flex items-center gap-6 text-sm font-bold text-on-surface-variant">
                    <span className="flex items-center text-secondary gap-1.5 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                      <Star className="w-4 h-4 fill-secondary" /> 4.9
                    </span>
                    <span className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-help">
                      <MapPin className="w-4 h-4 text-primary" /> 2.4 km
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 py-2">
                {['Consulta Digital', 'Pruebas Esfuerzo', 'ECG 24h'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-lg text-[10px] font-bold text-on-surface-variant/70 border border-outline-variant/20 uppercase tracking-widest">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-outline-variant uppercase tracking-widest">Próxima Cita</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">Disponible Ahora</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-on-surface font-display font-bold text-sm hover:border-primary hover:text-primary transition-all">
                    Ver Perfil
                  </button>
                  <button className="px-8 py-3 rounded-2xl bg-primary text-on-primary font-display font-black text-sm hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-95">
                    Agendar
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Clinic - Premium style */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-surface-container border border-outline-variant/20 rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full pointer-events-none -mb-10 -mr-10 blur-2xl" />
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-3xl bg-surface-bright overflow-hidden border-4 border-surface-container-high shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300" 
                    alt="Centro Medico"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow pt-2">
                  <h3 className="text-2xl font-display font-black text-on-surface group-hover:text-primary transition-colors tracking-tight">Centro Médico Sanitas</h3>
                  <p className="text-primary text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                    <Hospital className="w-4 h-4" />
                    Centro de Especialidades
                  </p>
                  <div className="flex items-center gap-6 text-sm font-bold text-on-surface-variant">
                    <span className="flex items-center text-secondary gap-1.5 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                      <Star className="w-4 h-4 fill-secondary" /> 4.7
                    </span>
                    <span className="flex items-center gap-1.5 opacity-80">
                      <MapPin className="w-4 h-4 text-primary" /> 1.1 km
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 py-2">
                {['Urgencias 24h', 'Farmacia', 'Radiología'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-lg text-[10px] font-bold text-on-surface-variant/70 border border-outline-variant/20 uppercase tracking-widest">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-outline-variant uppercase tracking-widest">Estatus Guardia</span>
                  <div className="flex items-center gap-2 text-warning">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">Activa - Baja espera</span>
                  </div>
                </div>
                <button className="px-10 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant font-display font-bold text-sm hover:border-primary hover:text-primary transition-all active:scale-95">
                  Ver Disponibilidad
                </button>
              </div>
            </motion.div>
          </div>

          {/* Join Network Banner */}
          <section className="bg-gradient-to-r from-surface-container-high to-surface-container-highest border border-outline-variant/20 rounded-[40px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex-1 relative z-10 flex flex-col gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-2 shadow-lg">
                <PlusSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-on-surface tracking-tight">¿Eres un profesional de la salud?</h3>
              <p className="text-on-surface-variant text-base font-medium opacity-70 max-w-lg leading-relaxed">
                Únete a la red médica más avanzada e inteligente. Amplía tu alcance y conecta con pacientes de forma digitalizada.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
              <button className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-display font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95">
                Registrar Clínica
              </button>
              <button className="px-8 py-4 bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-2xl font-display font-bold text-sm hover:bg-surface-bright transition-all active:scale-95">
                Soy Doctor
              </button>
            </div>
          </section>
        </div>

        {/* Right Content: Map Aside */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 h-[500px] lg:h-auto min-h-[400px] rounded-[40px] overflow-hidden border border-outline-variant/20 bg-surface-container relative group shadow-2xl">
          {/* Simulated Map View */}
          <div className="absolute inset-0 bg-surface-container-lowest">
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f6dbc0f?auto=format&fit=crop&q=80&w=1000" 
              alt="Map View" 
              className="w-full h-full object-cover opacity-20 contrast-[1.2] grayscale mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-[20s] ease-linear"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-90" />
            
            {/* Simulated Pins */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg border-2 border-surface shadow-primary/50">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/4">
               <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-lg border-2 border-surface shadow-secondary/50">
                  <Hospital className="w-3 h-3" />
                </div>
            </div>
          </div>

          {/* Map Overlay UI */}
          <div className="relative z-10 p-6 flex flex-col h-full justify-between pointer-events-none">
            <div className="flex justify-end pointer-events-auto">
              <button className="bg-surface/80 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all shadow-xl active:scale-95">
                <Navigation className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 pointer-events-auto">
              {/* Floating Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface/90 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-primary/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-on-surface leading-tight">Clínica Santa Clara</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-secondary uppercase tracking-widest">Guardia Activa</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-surface-container-highest rounded-xl text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all">
                  Ver Detalles
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

              <div className="bg-secondary/15 border border-secondary/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                <Navigation className="w-4 h-4 text-secondary" />
                <p className="text-[10px] font-mono font-bold text-secondary uppercase tracking-widest">
                  Estás a 15 min de la zona médica
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
