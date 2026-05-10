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
  Check,
  ShieldCheck,
  Trophy,
  Ticket,
  Clock,
  Clock3,
  MessageCircle,
  Save,
  Activity,
  History,
  Timer
} from 'lucide-react';

interface SettingItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  checked: boolean;
  disabled?: boolean;
  critical?: boolean;
  onChange: (checked: boolean) => void;
}

function SettingItem({ title, description, icon: Icon, iconColor = "text-primary", checked, disabled, critical, onChange }: SettingItemProps) {
  return (
    <div className={`px-6 py-6 flex items-start justify-between gap-4 transition-all ${disabled ? 'opacity-70' : 'hover:bg-surface-container-high/40'} ${critical ? 'border-l-4 border-l-error' : ''}`}>
      <div className="flex gap-4">
        <div className={`p-3 rounded-2xl bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <h4 className="text-base font-bold text-on-surface mb-0.5">{title}</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-md">
            {description}
            {disabled && <span className="block mt-1 italic opacity-60 font-mono text-[9px] uppercase tracking-widest text-primary">Recomendado mantener activo</span>}
          </p>
        </div>
      </div>
      <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group shrink-0 mt-2`}>
        <input 
          type="checkbox" 
          checked={checked} 
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer" 
        />
        <div className="w-12 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-surface-variant after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary-container peer-checked:after:border-on-primary-container shadow-inner"></div>
      </label>
    </div>
  );
}

export function Settings() {
  const [notifs, setNotifs] = useState({
    critical: true,
    challenges: true,
    benefits: false,
    security: true,
    push: true,
    whatsapp: true,
    email: false,
    dailySummary: true,
    summaryTime: '06:00 PM'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

  const goBack = () => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'profile' }));
  };

  return (
    <div className="flex-1 w-full max-w-[900px] mx-auto px-4 md:px-6 py-10 pb-32 flex flex-col gap-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={goBack}
            className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant border border-outline-variant/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-4xl font-display font-black text-on-surface">Centro de Notificaciones</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-medium italic opacity-70">Gestiona cómo y cuándo recibes información importante sobre tu salud.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sections Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-surface-container-low rounded-[32px] border border-outline-variant/30 overflow-hidden shadow-xl">
            <div className="divide-y divide-on-surface/5">
              <SettingItem 
                title="Alertas Médicas (Críticas)"
                description="Recordatorios ineludibles de medicamentos y confirmaciones urgentes de citas."
                icon={Stethoscope}
                iconColor="text-error"
                checked={notifs.critical}
                disabled={true}
                critical={true}
                onChange={() => {}}
              />
              <SettingItem 
                title="Retos de Salud"
                description="Motivación diaria, recordatorios de pasos, hidratación y seguimiento de sueño."
                icon={Activity}
                iconColor="text-primary"
                checked={notifs.challenges}
                onChange={(v) => setNotifs({...notifs, challenges: v})}
              />
              <SettingItem 
                title="Beneficios Premium"
                description="Alertas de cupones próximos a vencer, nuevos descuentos y recompensas."
                icon={Ticket}
                iconColor="text-secondary"
                checked={notifs.benefits}
                onChange={(v) => setNotifs({...notifs, benefits: v})}
              />
              <SettingItem 
                title="Seguridad y Cuenta"
                description="Validación de identidad, nuevos inicios de sesión y cambios en tu perfil."
                icon={ShieldCheck}
                iconColor="text-on-surface"
                checked={notifs.security}
                disabled={true}
                onChange={() => {}}
              />
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Channels */}
          <section className="bg-surface-container-low rounded-[32px] border border-outline-variant/30 p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
              <Timer className="w-5 h-5 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Canales de Entrega</h3>
            </div>
            
            <div className="flex flex-col gap-5">
              {[
                { id: 'push', label: 'Push (App)', icon: Smartphone, color: 'text-primary' },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-secondary' },
                { id: 'email', label: 'Correo Electrónico', icon: Mail, color: 'text-on-surface-variant' }
              ].map((ch) => (
                <div key={ch.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform">
                      <ch.icon className={`w-5 h-5 ${ch.color}`} />
                    </div>
                    <span className="text-sm font-bold text-on-surface">{ch.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={(notifs as any)[ch.id]}
                      onChange={(e) => setNotifs({...notifs, [ch.id]: e.target.checked})}
                    />
                    <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-surface-variant after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Daily Summary */}
          <section className="bg-primary/5 rounded-[32px] border border-primary/20 p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <History className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Resumen Diario</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={notifs.dailySummary}
                    onChange={(v) => setNotifs({...notifs, dailySummary: v.target.checked})}
                  />
                  <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-surface-variant after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-70">
                Agrupa notificaciones de retos y beneficios en un solo envío diario para reducir distracciones.
              </p>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Hora de entrega</span>
                <div className="relative">
                  <select 
                    value={notifs.summaryTime}
                    disabled={!notifs.dailySummary}
                    onChange={(e) => setNotifs({...notifs, summaryTime: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm font-bold rounded-2xl p-4 appearance-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
                  >
                    <option>08:00 AM</option>
                    <option>12:00 PM</option>
                    <option>06:00 PM</option>
                    <option>09:00 PM</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant">
                    <Clock3 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container-low rounded-[32px] border border-outline-variant/30 mt-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl transition-all duration-500 ${saving ? 'bg-secondary/20 rotate-12 scale-110' : 'bg-primary/10'}`}>
            {saving ? <Check className="w-8 h-8 text-secondary" /> : <Bell className="w-8 h-8 text-primary" />}
          </div>
          <div>
            <p className="text-on-surface font-black text-lg">{saving ? '¡Cambios Sincronizados!' : 'Configuración de Alertas'}</p>
            <p className="text-xs text-on-surface-variant font-medium">Tus cambios se guardan automáticamente en tu bóveda segura.</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto bg-primary text-on-primary-fixed-variant px-10 py-5 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
        >
          {saving ? 'Procesando...' : (
            <>
              Guardar Cambios
              <Save className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
