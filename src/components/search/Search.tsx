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
  ShieldCheck,
  Activity
} from 'lucide-react';

interface SearchProps {
  onOpenRegistration: (type?: 'doctor' | 'clinic' | 'lab_pharmacy') => void;
}

export default function Search({ onOpenRegistration }: SearchProps) {
  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0">
      {/* Search & Filters Hero */}
      <section className="bg-surface-container border border-outline-variant/30 rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2 tracking-tight">
              Búsqueda Global
            </h1>
            <p className="text-on-surface-variant text-base font-medium opacity-70 mb-8">
              Encuentra especialistas, clínicas y servicios médicos al instante.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-[2] group/search">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/search:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder="Buscar doctor, especialidad, síntomas..." 
                type="text"
              />
            </div>
            <div className="relative flex-1 group/location">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within/location:text-primary transition-colors w-5 h-5" />
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                placeholder="Localidad..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: Stethoscope, label: 'Doctores', variant: 'primary' },
              { icon: Hospital, label: 'Clínicas' },
              { icon: Store, label: 'Farmacias' },
              { icon: FlaskConical, label: 'Laboratorios' }
            ].map((filter, index) => (
              <button 
                key={index}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-display font-medium text-xs transition-colors border ${
                  filter.variant === 'primary' 
                    ? 'bg-primary text-on-primary-fixed-variant border-primary shadow-lg shadow-primary/10' 
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40 hover:border-primary/50'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Results */}
        <div className="flex-1 flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <Star className="w-6 h-6 text-secondary fill-secondary" />
                Resultados Destacados
              </h2>
              <span className="text-[10px] font-mono font-black text-outline px-3 py-1 border border-outline-variant rounded-full bg-surface-container-low tracking-widest uppercase">
                Premium
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card 1 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-surface-container border-l-4 border-l-secondary border-y border-r border-y-outline-variant/30 border-r-outline-variant/30 rounded-r-2xl rounded-l-md p-6 flex flex-col gap-6 relative overflow-hidden shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-bright overflow-hidden shrink-0 border-2 border-surface-container-high shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200" 
                      alt="Dr. Alejandro Martínez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="text-lg font-display font-bold text-on-surface">Dr. Alejandro Martínez</h3>
                    <p className="text-primary text-sm font-medium mb-1">Cardiología Intervencionista</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <span className="flex items-center text-secondary gap-1">
                        <Star className="w-3.5 h-3.5 fill-secondary" /> 4.9
                      </span>
                      <span className="flex items-center gap-1 opacity-70">
                        <MapPin className="w-3.5 h-3.5" /> 2.4 km
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                  <span className="bg-secondary/15 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Disponible Ahora
                  </span>
                  <button className="bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container px-5 py-2 rounded-xl text-xs font-bold transition-all border border-primary/30">
                    Agendar
                  </button>
                </div>
              </motion.div>

              {/* Profile Card 2 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-6 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-bright overflow-hidden shrink-0 border-2 border-surface-container-high shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200" 
                      alt="Dra. Valentina Silva"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="text-lg font-display font-bold text-on-surface">Dra. Valentina Silva</h3>
                    <p className="text-primary text-sm font-medium mb-1">Neurología Clínica</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <span className="flex items-center text-secondary gap-1">
                        <Star className="w-3.5 h-3.5 fill-secondary" /> 4.8
                      </span>
                      <span className="flex items-center gap-1 opacity-70">
                        <MapPin className="w-3.5 h-3.5" /> 3.1 km
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                  <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Mañana, 09:00
                  </span>
                  <button className="bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container px-5 py-2 rounded-xl text-xs font-bold transition-all border border-primary/30">
                    Ver Perfil
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Registration Banner */}
          <section className="bg-gradient-to-r from-surface-container to-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex-1 relative z-10 flex flex-col gap-2">
              <h3 className="text-2xl font-display font-bold text-on-surface flex items-center gap-3">
                <PlusSquare className="w-6 h-6 text-primary" />
                Únete a la Red
              </h3>
              <p className="text-on-surface-variant text-base font-medium opacity-70 max-w-md leading-relaxed">
                Amplía tu alcance. Conecta con pacientes que buscan atención de calidad en tu especialidad o zona.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
              <button 
                onClick={() => onOpenRegistration('doctor')}
                className="px-8 py-4 bg-surface-container-highest text-on-surface font-display font-bold text-sm rounded-2xl hover:bg-surface-bright transition-all border border-outline-variant/50 shadow-lg"
              >
                ¿Eres Doctor? Regístrate
              </button>
              <button 
                onClick={() => onOpenRegistration('clinic')}
                className="px-8 py-4 bg-primary-container text-on-primary-container font-display font-bold text-sm rounded-2xl hover:bg-primary transition-all shadow-xl shadow-primary/20"
              >
                ¿Tienes una clínica? Únete
              </button>
            </div>
          </section>
        </div>

        {/* Right column: Map */}
        <aside className="w-full lg:w-96 shrink-0 h-[400px] lg:h-auto min-h-[500px] rounded-[32px] overflow-hidden border border-outline-variant bg-surface-container relative group shadow-2xl">
          <div className="absolute inset-0 bg-surface-container-lowest">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
              alt="Map View" 
              className="w-full h-full object-cover opacity-20 contrast-[1.2] grayscale mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-[10s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-90" />
            
            {/* Simulated Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-2xl border-2 border-surface">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 p-6 flex flex-col h-full justify-between pointer-events-none">
            <div className="flex justify-end pointer-events-auto">
              <button className="bg-surface/80 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-all shadow-xl">
                <Navigation className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface/90 backdrop-blur-2xl border border-outline-variant/30 rounded-3xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-on-surface">Clínica Santa Clara</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-mono font-black text-secondary uppercase tracking-widest">Guardia Activa</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-surface-container-high rounded-xl text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all">
                  Ver Detalles
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
