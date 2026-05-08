import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  Stethoscope, 
  Pill, 
  AlertTriangle, 
  Store, 
  Navigation, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Check
} from 'lucide-react';

interface SettingItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function SettingItem({ title, description, icon: Icon, iconColor = "text-primary", checked, disabled, onChange }: SettingItemProps) {
  return (
    <div className={`px-6 py-5 flex items-start justify-between gap-4 transition-all ${disabled ? 'opacity-70' : 'hover:bg-surface-container-high/40'}`}>
      <div className="flex gap-4">
        <div className={`p-2 rounded-xl bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-on-surface mb-0.5">{title}</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {description}
            {disabled && <span className="block mt-1 italic opacity-60 font-mono text-[9px] uppercase tracking-widest text-primary">Recomendado mantener activo</span>}
          </p>
        </div>
      </div>
      <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group shrink-0`}>
        <input 
          type="checkbox" 
          checked={checked} 
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-on-surface-variant after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary-container peer-checked:after:border-on-primary-container shadow-inner"></div>
      </label>
    </div>
  );
}

export function Settings() {
  const [notifs, setNotifs] = useState({
    triage: true,
    meds: true,
    emergency: true,
    stock: false,
    routes: true,
    push: true,
    email: true,
    sms: false
  });

  const goBack = () => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'profile' }));
  };

  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-6 py-10 pb-32 flex flex-col gap-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-4"
      >
        <button 
          onClick={goBack}
          className="p-3 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant border border-outline-variant/30"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold text-on-surface">Configuración de Notificaciones</h2>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Gestiona cómo y cuándo recibes información importante de salud.</p>
        </div>
      </motion.div>

      {/* Health Alerts Section */}
      <section className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="bg-surface-container-high px-6 py-4 border-b border-on-surface/10 flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-tertiary" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-on-surface">Alertas de Salud</h3>
        </div>
        <div className="divide-y divide-on-surface/10">
          <SettingItem 
            title="Triaje Automático"
            description="Notificaciones sobre resultados preliminares y cambios en nivel de prioridad."
            icon={Bell}
            checked={notifs.triage}
            onChange={(v) => setNotifs({...notifs, triage: v})}
          />
          <SettingItem 
            title="Recordatorios de Medicamentos"
            description="Avisos programados para toma de medicinas según prescripción activa."
            icon={Pill}
            checked={notifs.meds}
            onChange={(v) => setNotifs({...notifs, meds: v})}
          />
          <SettingItem 
            title="Avisos de Emergencia"
            description="Alertas críticas del sistema de salud local."
            icon={AlertTriangle}
            iconColor="text-tertiary"
            checked={notifs.emergency}
            disabled={true}
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Pharmaceutical Availability Section */}
      <section className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="bg-surface-container-high px-6 py-4 border-b border-on-surface/10 flex items-center gap-3">
          <Store className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-on-surface">Disponibilidad Farmacéutica</h3>
        </div>
        <div className="divide-y divide-on-surface/10">
          <SettingItem 
            title="Alertas de Stock"
            description="Avisos cuando medicamentos buscados recientemente están disponibles cerca."
            icon={Pill}
            checked={notifs.stock}
            onChange={(v) => setNotifs({...notifs, stock: v})}
          />
          <SettingItem 
            title="Cambios en Rutas Dinámicas"
            description="Actualizaciones sobre disponibilidad en rutas hacia centros de salud o farmacias."
            icon={Navigation}
            checked={notifs.routes}
            onChange={(v) => setNotifs({...notifs, routes: v})}
          />
        </div>
      </section>

      {/* Notification Channels Section */}
      <section className="bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="bg-surface-container-high px-6 py-4 border-b border-on-surface/10 flex items-center gap-3">
          <Navigation className="w-5 h-5 text-secondary rotate-90" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-on-surface">Canales de Envío</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'push', label: 'Push (App)', icon: Smartphone },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'sms', label: 'SMS', icon: MessageSquare }
          ].map((ch) => (
            <label 
              key={ch.id}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                (notifs as any)[ch.id] 
                  ? 'bg-primary/10 border-primary shadow-inner' 
                  : 'bg-surface-container-high border-outline-variant/30 hover:border-primary/40'
              }`}
            >
              <input 
                type="checkbox" 
                checked={(notifs as any)[ch.id]}
                onChange={(e) => setNotifs({...notifs, [ch.id]: e.target.checked})}
                className="w-4 h-4 rounded border-outline-variant/30 bg-surface text-primary focus:ring-primary focus:ring-offset-background"
              />
              <div className="flex items-center gap-2">
                <ch.icon className={`w-4 h-4 ${ (notifs as any)[ch.id] ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${(notifs as any)[ch.id] ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {ch.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Global Action Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container-high/30 rounded-3xl border border-outline-variant/20 mt-4">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/20 p-3 rounded-2xl">
            <Check className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-on-surface font-bold text-sm">Preferencia Guardada</p>
            <p className="text-xs text-on-surface-variant">Los cambios se sincronizan en Realon™ Vault.</p>
          </div>
        </div>
        <button 
          onClick={goBack}
          className="w-full md:w-auto bg-primary text-on-primary px-8 py-4 rounded-2xl font-display font-bold text-sm shadow-xl hover:bg-primary-container transition-all active:scale-95"
        >
          Volver al Perfil
        </button>
      </div>
    </div>
  );
}
