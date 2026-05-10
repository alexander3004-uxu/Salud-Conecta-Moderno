import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Zap, 
  Video, 
  FolderPlus, 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  Globe, 
  CheckCircle
} from 'lucide-react';
import PremiumBenefits from './PremiumBenefits';
import Checkout from './Checkout';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
  color: string;
}

export default function Membership() {
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  if (isPremium) {
    return <PremiumBenefits />;
  }

  if (selectedPlan) {
    return (
      <Checkout 
        plan={selectedPlan} 
        onBack={() => setSelectedPlan(null)} 
        onComplete={() => {
          setSelectedPlan(null);
          setIsPremium(true);
        }} 
      />
    );
  }

  const tiers: Plan[] = [
    {
      name: 'Gratuito',
      price: '$0',
      description: 'Acceso esencial para pacientes y consultas básicas.',
      features: [
        'Triaje estándar por IA',
        'Historial médico básico',
        'Búsqueda de medicamentos'
      ],
      buttonText: 'Plan Actual',
      highlighted: false,
      color: 'bg-outline-variant',
    },
    {
      name: 'Profesional',
      price: '$49',
      description: 'Ideal para médicos individuales y especialistas.',
      features: [
        'Prioridad en triaje algorítmico',
        'Telemedicina HD (1 a 1)',
        'Almacenamiento ilimitado docs.',
        'Reportes clínicos avanzados'
      ],
      buttonText: 'Actualizar a Profesional',
      highlighted: true,
      color: 'bg-primary-container',
    },
    {
      name: 'Institucional',
      price: '$199',
      description: 'Para clínicas, farmacias y equipos médicos enteros.',
      features: [
        'Todo lo de Profesional',
        'Cuentas para hasta 10 médicos',
        'API de integración clínica',
        'Soporte técnico 24/7 dedicado'
      ],
      buttonText: 'Contactar Ventas',
      highlighted: false,
      color: 'bg-secondary-container',
    }
  ];

  const features = [
    {
      title: 'Triaje Prioritario',
      desc: 'Algoritmos de IA procesan casos críticos con latencia cero, asegurando atención inmediata.',
      icon: Zap
    },
    {
      title: 'Telemedicina HD',
      desc: 'Consultas encriptadas de alta definición, vital para diagnósticos visuales precisos.',
      icon: Video
    },
    {
      title: 'Almacenamiento Infinito',
      desc: 'Guarde estudios, radiografías y expedientes sin límites de cuota, bajo estrictos protocolos de seguridad.',
      icon: FolderPlus
    }
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-16 py-12 px-4 md:px-0">
      {/* Hero Section */}
      <section className="text-center flex flex-col gap-6 items-center relative overflow-hidden py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background opacity-50 pointer-events-none" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-black max-w-4xl leading-tight"
        >
          Potencia tu Práctica con <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Salud Conecta IA Premium</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium"
        >
          Herramientas avanzadas de triaje, telemedicina en alta definición y gestión de pacientes diseñadas para profesionales e instituciones médicas de alto rendimiento.
        </motion.p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
        {tiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx }}
            className={`bg-surface-container-low border rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden transition-all duration-300 ${
              tier.highlighted 
                ? 'border-primary/50 shadow-2xl shadow-primary/10 md:-translate-y-6 z-10' 
                : 'border-outline-variant/30 shadow-sm'
            }`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${tier.color}`} />
            
            {tier.highlighted && (
              <div className="absolute top-6 right-6 bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                Recomendado
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className={`text-2xl font-display font-black ${tier.highlighted ? 'text-primary' : 'text-on-surface'}`}>{tier.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-black text-on-surface">{tier.price}</span>
                <span className="text-sm font-medium text-on-surface-variant">/ mes</span>
              </div>
            </div>

            <p className="text-sm font-medium text-on-surface-variant h-12 leading-relaxed">{tier.description}</p>

            <ul className="flex flex-col gap-4 flex-grow py-4 border-t border-outline-variant/10">
              {tier.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-primary' : 'text-on-surface-variant opacity-60'}`} />
                  <span className="text-sm font-medium text-on-surface">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setSelectedPlan(tier)}
              className={`w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest transition-all ${
              tier.highlighted 
                ? 'bg-primary text-on-primary-fixed-variant shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]' 
                : 'border-2 border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
            }`}>
              {tier.buttonText}
            </button>
          </motion.div>
        ))}
      </section>

      {/* Feature Comparison */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 flex gap-6 items-start hover:bg-surface-container transition-colors group"
          >
            <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:scale-110 transition-transform">
              <feature.icon className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-black text-on-surface uppercase tracking-widest">{feature.title}</h4>
              <p className="text-xs font-medium text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Trust Quote */}
      <section className="bg-surface-container-high/50 border border-outline-variant/30 rounded-[40px] p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
        
        <ShieldCheck className="w-12 h-12 text-secondary opacity-60" />
        <p className="text-xl md:text-3xl font-display font-black text-on-surface max-w-3xl leading-relaxed italic">
          "La eficiencia del triaje IA ha permitido a mi clínica reducir los tiempos de espera críticos en un 40%."
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-primary">Dr. Marcelo Rossi</div>
          <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">Director Médico - Centro de Salud Metropolitano</div>
        </div>
      </section>
    </div>
  );
}

