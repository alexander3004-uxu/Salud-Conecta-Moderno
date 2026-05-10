import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, HeartPulse, Activity, Stethoscope } from 'lucide-react';

interface HeroProps {
  onStartAssistant: () => void;
  onViewMap: () => void;
  onOpenRegistration: (type?: 'doctor' | 'clinic' | 'lab_pharmacy') => void;
}

export default function Hero({ onStartAssistant, onViewMap, onOpenRegistration }: HeroProps) {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2070" 
            alt="Healthcare professionals" 
            className="w-full h-full object-cover opacity-40 mix-blend-soft-light"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
               <span className="w-2 h-2 rounded-full bg-hospital-green animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">SISTEMA DE SALUD PÚBLICA INTEGRAL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Eficiencia <span className="text-secondary-fixed">Empática</span> al servicio de tu salud.
            </h1>
            <p className="text-xl md:text-2xl text-primary-fixed mb-10 leading-relaxed font-medium">
              Transformamos la incertidumbre en rutas de acción verificadas. Triaje por IA, mapas de stock y pasaporte digital de salud.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={onStartAssistant}
                className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-xl hover:scale-105 hover:bg-surface shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transition-all flex items-center gap-3"
              >
                Iniciar Triaje IA
                <Stethoscope className="w-6 h-6" />
              </button>
              <button 
                onClick={onViewMap}
                className="bg-primary-container/20 text-white border-2 border-white/40 px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all flex items-center gap-3"
              >
                Protocolo Realon™
                <MapPin className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Servicios Integrales</h2>
            <div className="w-20 h-1 bg-medical-blue mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Confiabilidad Institucional',
                desc: 'Información verificada directamente de fuentes oficiales de salud pública.',
                color: 'text-medical-blue'
              },
              {
                icon: HeartPulse,
                title: 'Eficiencia Empática',
                desc: 'Diseñado para reducir tu carga mental en momentos de necesidad.',
                color: 'text-secondary'
              },
              {
                icon: Activity,
                title: 'Acceso Universal',
                desc: 'Interfaz optimizada para máxima legibilidad y facilidad de uso.',
                color: 'text-tertiary'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bento-card bg-surface-container-low"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
                <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Status */}
      <section className="py-12 bg-surface-container-lowest border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap justify-around gap-8 text-center text-on-surface-variant uppercase tracking-[0.2em] text-[10px] font-bold font-mono">
            <div className="flex items-center gap-2">RED DE SALUD: <span className="text-hospital-green flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-hospital-green animate-pulse" /> ACTIVA</span></div>
            <div>FARMACIAS 24H: <span className="text-primary">42 DISPONIBLES</span></div>
            <div>EMERGENCIAS: <span className="text-alert-red font-black">LLAMAR 911</span></div>
            <div>SISTEMA IA: <span className="text-hospital-green">ONLINE</span></div>
        </div>
      </section>

      {/* Professional CTA */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary-container/10 border border-primary/20 rounded-[48px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-display font-black text-on-surface mb-6 leading-tight">
                ¿Eres un profesional de la salud o regente de farmacia?
              </h2>
              <p className="text-lg text-on-surface-variant font-medium leading-relaxed opacity-80">
                Únete a la red interoperable <span className="text-primary font-bold">Salud Conecta™</span>. Registra tu laboratorio, clínica o farmacia para aparecer en el mapa de stock y disponibilidad en tiempo real.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onOpenRegistration('doctor')}
                className="group bg-surface border-2 border-primary/20 text-on-surface px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4"
              >
                Soy Profesional
                <Stethoscope className="w-5 h-5 text-primary" />
              </button>
              <button 
                onClick={() => onOpenRegistration('clinic')}
                className="group bg-primary text-on-primary px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-4 text-center"
              >
                Centro de Salud
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onOpenRegistration('lab_pharmacy')}
                className="group bg-surface border-2 border-secondary/20 text-on-surface px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4"
              >
                Laboratorio/Farmacia
                <ArrowRight className="w-5 h-5 text-secondary" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
