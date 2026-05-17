import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Settings2, 
  CreditCard, 
  LineChart, 
  Brain, 
  Headset, 
  Pill, 
  ChevronRight, 
  ArrowRight,
  Clock,
  QrCode,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import PharmacyDiscounts from './PharmacyDiscounts';

export default function PremiumBenefits() {
  const [currentView, setCurrentView] = useState<'benefits' | 'pharmacy'>('benefits');

  if (currentView === 'pharmacy') {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <button 
            onClick={() => setCurrentView('benefits')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Beneficios
          </button>
        </div>
        <PharmacyDiscounts />
      </div>
    );
  }

  const activeServices = [
    {
      id: 'diagnosis',
      title: 'IA de Diagnóstico Avanzado',
      desc: 'Acceso prioritario a nuestros modelos de lenguaje médico más recientes para análisis de síntomas complejos y recomendaciones de triaje precisas.',
      icon: Brain,
      color: 'border-l-primary',
      iconColor: 'text-primary',
      bgIcon: 'bg-primary/10'
    },
    {
      id: 'support',
      title: 'Soporte Médico 24/7',
      desc: 'Conexión directa e inmediata con profesionales de la salud certificados para consultas de urgencia y orientación a cualquier hora.',
      icon: Headset,
      color: 'border-l-secondary',
      iconColor: 'text-secondary',
      bgIcon: 'bg-secondary/10'
    },
    {
      id: 'pharmacy',
      title: 'Descuentos en Farmacias',
      desc: 'Hasta un 30% de descuento en medicamentos recetados a través de nuestra red de farmacias aliadas a nivel nacional.',
      icon: Pill,
      color: 'border-l-tertiary',
      iconColor: 'text-tertiary',
      bgIcon: 'bg-tertiary/10'
    }
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-12 py-8 px-4 md:px-0">
      {/* Header Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary/20" />
          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Estado de Cuenta</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-on-surface">Beneficios Premium</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-medium">
          Gestiona tus servicios exclusivos y saca el máximo provecho de tu suscripción a Salud Conecta IA.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Subscription Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex flex-col gap-2 z-10">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Suscripción Actual</span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-display font-black text-on-surface">Premium Pro</h2>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold border border-secondary/20 uppercase tracking-widest">Activo</span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 opacity-60" />
              Próxima renovación: 15 de Noviembre, 2024
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <button className="flex-1 bg-primary text-on-primary font-display font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20">
              <Settings2 className="w-4 h-4" />
              Gestionar Plan
            </button>
            <button className="flex-1 border-2 border-outline-variant/30 text-on-surface font-display font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
              <CreditCard className="w-4 h-4" />
              Métodos de Pago
            </button>
          </div>
        </motion.div>

        {/* AI Usage Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LineChart className="w-24 h-24 text-primary" />
          </div>
          
          <div className="flex flex-col gap-2 z-10">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Uso de IA de Diagnóstico</span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-4xl font-display font-black text-on-surface">42</h3>
              <span className="text-lg font-display font-black text-on-surface-variant opacity-40">/ 50</span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">Consultas avanzadas este mes</p>
          </div>

          <div className="mt-6 z-10 w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '84%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(49,146,252,0.4)]" 
            />
          </div>
        </motion.div>

        {/* Active Services Bento Blocks */}
        {activeServices.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            onClick={() => {
              if (service.id === 'pharmacy') setCurrentView('pharmacy');
            }}
            className={`md:col-span-4 bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col gap-6 border-l-4 ${service.color} hover:-translate-y-1 transition-all duration-300 shadow-sm group cursor-pointer`}
          >
            <div className={`w-14 h-14 rounded-2xl ${service.bgIcon} flex items-center justify-center border border-outline-variant/10 ${service.iconColor} group-hover:scale-110 transition-transform`}>
              <service.icon className="w-7 h-7" />
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-xl font-display font-black text-on-surface">{service.title}</h4>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed opacity-80">
                {service.desc}
              </p>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-outline-variant/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {service.id === 'pharmacy' ? 'Ver Beneficios' : 'Incluido en tu plan'}
              </span>
              <button className={`${service.iconColor} hover:brightness-125 transition-all`}>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
