import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, HeartPulse, Activity, Stethoscope, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AIServiceStatus } from '../common/AIServiceStatus';

interface HeroProps {
  onStartAssistant: () => void;
  onViewPublicHealth: () => void;
  onViewAppointments: () => void;
  onOpenRegistration: (type?: 'doctor' | 'clinic' | 'lab_pharmacy') => void;
}

export default function Hero({ onStartAssistant, onViewPublicHealth, onViewAppointments, onOpenRegistration }: HeroProps) {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2070" 
            alt="Healthcare professionals" 
            className="w-full h-full object-cover opacity-10 mix-blend-soft-light grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 w-full mt-10 flex justify-center" style={{ perspective: "1200px" }}>
          <motion.div 
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ rotateX: 3, rotateY: -3, scale: 1.02 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-surface-container-low/40 backdrop-blur-2xl border border-primary/20 shadow-2xl rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 w-full text-center overflow-hidden group hover:border-primary/40 transition-colors"
          >
            {/* Efectos de iluminación (Glow) de fondo */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/30 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 backdrop-blur-md rounded-full border border-primary/20 shadow-sm">
                 <span className="w-2 h-2 rounded-full bg-hospital-green animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-on-surface leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {language === 'es' ? 'Eficiencia Empática' : 'Empathetic Efficiency'}
                </span>
                <br className="hidden sm:block" />
                {' '}
                {language === 'es' ? 'al servicio de tu salud.' : "at your health's service."}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-on-surface-variant font-medium max-w-3xl mx-auto leading-relaxed opacity-90">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto justify-center flex-wrap">
                <button 
                  onClick={onStartAssistant}
                  className="bg-primary text-on-primary px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 hover:brightness-110 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  {t('hero.cta.primary')}
                  <Stethoscope className="w-5 h-5" />
                </button>
                <button 
                  onClick={onViewPublicHealth}
                  className="bg-primary text-on-primary px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 hover:brightness-110 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  Salud Pública
                  <Building2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onViewAppointments}
                  className="bg-primary text-on-primary px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 hover:brightness-110 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  Mis Citas
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AIServiceStatus />

      {/* Features Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t('features.title')}</h2>
            <div className="w-20 h-1 bg-medical-blue mx-auto rounded-full" />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: ShieldCheck,
                title: t('features.1.title'),
                desc: t('features.1.desc'),
                color: 'text-medical-blue'
              },
              {
                icon: HeartPulse,
                title: t('features.2.title'),
                desc: t('features.2.desc'),
                color: 'text-secondary'
              },
              {
                icon: Activity,
                title: t('features.3.title'),
                desc: t('features.3.desc'),
                color: 'text-tertiary'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bento-card bg-surface-container-low border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm rounded-3xl p-8"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
                <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Status */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap justify-around gap-8 text-center text-on-surface-variant uppercase tracking-[0.2em] text-[10px] font-bold font-mono">
            <div className="flex items-center gap-2">{t('status.network')}: <span className="text-hospital-green flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-hospital-green animate-pulse" /> {t('status.active')}</span></div>
            <div>{t('status.pharmacies')}: <span className="text-primary">42 {t('status.available')}</span></div>
            <div>{t('status.emergency')}: <span className="text-alert-red font-black">{t('status.call')} 128</span></div>
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
                {t('cta.professional.title')}
              </h2>
              <p className="text-lg text-on-surface-variant font-medium leading-relaxed opacity-80">
                {t('cta.professional.desc').replace('{brand}', 'Salud Conecta™')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onOpenRegistration('doctor')}
                className="group bg-primary text-on-primary px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 hover:brightness-110 transition-all flex items-center gap-4"
              >
                {t('cta.professional.doctor')}
                <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => onOpenRegistration('clinic')}
                className="group bg-primary text-on-primary px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 hover:brightness-110 transition-all flex items-center gap-4 text-center"
              >
                {t('cta.professional.clinic')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onOpenRegistration('lab_pharmacy')}
                className="group bg-primary text-on-primary px-8 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 hover:brightness-110 transition-all flex items-center gap-4"
              >
                {t('cta.professional.business')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
