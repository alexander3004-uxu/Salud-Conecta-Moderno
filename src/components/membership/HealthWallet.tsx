import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Trophy, 
  Activity, 
  History, 
  ArrowUpRight, 
  Gift, 
  Video, 
  FlaskConical, 
  Zap, 
  ChevronRight,
  TrendingUp,
  HeartPulse,
  ShoppingBag,
  Info,
  Flame,
  CheckCircle2,
  Stethoscope,
  Search,
  Gift as Redeem,
  Settings as SettingsIcon
} from 'lucide-react';

export default function HealthWallet() {
  const navigateToConfig = () => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'points-config' }));
  };

  const rewards = [
    {
      title: 'Teleconsulta Prioritaria',
      desc: 'Acceso inmediato a un médico general sin tiempo de espera. Válido 24/7.',
      points: 5000,
      icon: Video,
      img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Análisis de Laboratorio',
      desc: 'Panel completo de biomarcadores avanzados. Incluye perfil lipídico y metabólico.',
      points: 12000,
      icon: FlaskConical,
      img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80',
      color: 'secondary'
    },
    {
      title: 'Sesión de Fisioterapia',
      desc: '1 hora de evaluación y tratamiento con un especialista certificado en recuperación física.',
      points: 25000,
      icon: HeartPulse,
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
      locked: true,
      needed: 12550
    }
  ];

  const transactions = [
    { label: 'Login Diario (Día 5)', val: '+10 pts', sub: 'Hoy, 08:30 AM', icon: Activity, color: 'text-secondary' },
    { label: 'Desafío: 10k Pasos', val: '+30 pts', sub: 'Ayer, 18:45 PM', icon: TrendingUp, color: 'text-secondary' },
    { label: 'Teleconsulta Canjeada', val: '-5,000 pts', sub: '12 Oct, 10:00 AM', icon: Gift, color: 'text-error' },
  ];

  const bonuses = [
    { title: 'Registro de Vitales', sub: 'Diario', pts: '+15 pts', icon: HeartPulse, color: 'text-primary' },
    { title: 'Desafío Diario Completo', sub: '1/1 completado hoy', pts: '+30 pts', icon: CheckCircle2, color: 'text-primary' },
    { title: 'Uso del Buscador Clínico', sub: 'Semanal', pts: '+50 pts', icon: Search, color: 'text-primary' },
  ];

  const weekDays = [
    { day: 'L', completed: true },
    { day: 'M', completed: true },
    { day: 'M', completed: true },
    { day: 'J', completed: true },
    { day: 'V', completed: true, active: true },
    { day: 'S', completed: false, disabled: true },
    { day: 'D', completed: false, disabled: true },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-10 pb-12 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-display font-black text-primary tracking-tight">Puntos de Salud</h1>
          <p className="text-on-surface-variant font-medium text-lg max-w-2xl">Recompensas por uso frecuente y hábitos saludables. Mantén tus metas al día y canjea beneficios exclusivos.</p>
        </div>
        <button 
          onClick={navigateToConfig}
          className="p-4 rounded-3xl bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-all shadow-xl group"
        >
          <SettingsIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Primary Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
        >
          {/* Subtle Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between lg:items-center gap-10 h-full">
            <div className="flex flex-col gap-4">
              <div className="font-display font-black text-[12px] text-on-surface-variant uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                <Star className="w-4 h-4 fill-primary text-primary" />
                Balance Actual
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-display font-black text-on-surface tracking-tighter drop-shadow-sm">12,450</span>
                <span className="text-2xl font-display font-black text-primary opacity-60">pts</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 font-display font-black text-[10px] uppercase tracking-widest w-fit shadow-sm">
                <TrendingUp className="w-4 h-4" />
                +850 pts este mes
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <button className="bg-primary text-on-primary-fixed-variant px-10 py-5 rounded-[24px] font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Star className="w-5 h-5" />
                Canjear Puntos
              </button>
              <button className="bg-surface-container-high/50 border-2 border-primary/20 backdrop-blur-md text-primary px-10 py-5 rounded-[24px] font-display font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                <History className="w-5 h-5" />
                Ver Historial
              </button>
            </div>
          </div>
        </motion.div>

        {/* Daily Streaks Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-surface-container-low border-2 border-secondary/30 rounded-[40px] p-10 flex flex-col justify-center relative shadow-2xl overflow-hidden group"
        >
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-display font-black text-on-surface uppercase tracking-tight">Rachas Diarias</h3>
            <div className="p-3 bg-secondary/20 rounded-2xl text-secondary animate-pulse-slow">
              <Flame className="w-6 h-6 fill-secondary/20" />
            </div>
          </div>

          <div className="flex items-end gap-3 mb-10">
            <span className="text-6xl font-display font-black text-secondary tracking-tighter">5</span>
            <span className="text-sm font-display font-black text-on-surface-variant pb-2 uppercase tracking-widest opacity-60">Días seguidos</span>
          </div>

          <div className="flex justify-between items-center gap-2">
            {weekDays.map((wd, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  wd.active 
                    ? 'bg-secondary text-on-secondary-fixed shadow-[0_0_20px_rgba(81,223,142,0.4)] scale-110' 
                    : wd.completed 
                    ? 'bg-secondary/20 border-2 border-secondary/40 text-secondary' 
                    : 'bg-surface-container-highest/50 border-2 border-outline-variant/30 text-on-surface-variant opacity-40'
                }`}>
                  {wd.completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{wd.day}</span>}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest font-mono ${wd.active ? 'text-secondary' : 'text-on-surface-variant'}`}>{wd.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center bg-secondary/5 py-3 rounded-2xl border border-secondary/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">+50 pts bono de racha</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Frequent Use Bonuses */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <h3 className="text-2xl font-display font-black text-on-surface flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Bonos de Uso Frecuente
          </h3>
          <div className="space-y-4">
            {bonuses.map((bonus, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-6 rounded-[28px] bg-surface-container-low/50 hover:bg-surface-container-high transition-all border border-outline-variant/30 group shadow-lg"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    <bonus.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-display font-black text-on-surface">{bonus.title}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 font-mono">{bonus.sub}</div>
                  </div>
                </div>
                <div className="text-lg font-display font-black text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">{bonus.pts}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent History */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-black text-on-surface flex items-center gap-3">
              <History className="w-6 h-6 text-on-surface-variant opacity-60" />
              Historial Reciente
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline bg-primary/5 px-4 py-2 rounded-xl">Ver todo</button>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] overflow-hidden shadow-2xl divide-y divide-outline-variant/10">
            {transactions.map((tx, i) => (
              <div key={i} className="p-8 flex items-center justify-between hover:bg-surface-container-high transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-outline-variant/20 shadow-sm">
                    <tx.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-display font-black text-on-surface group-hover:text-primary transition-colors">{tx.label}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50 font-mono">{tx.sub}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-display font-black ${tx.color} drop-shadow-sm`}>{tx.val}</span>
                  {tx.color.includes('secondary') && (
                    <span className="text-[9px] font-black text-secondary-container bg-secondary-container/10 px-2 py-1 rounded-full border border-secondary/20">+5 XP</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Redeem Rewards Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">Recompensas Premium</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rewards.map((reward, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-surface-container-low border border-outline-variant/30 rounded-[40px] overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300 shadow-2xl relative ${reward.locked ? 'opacity-70' : ''}`}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              
              <div className="h-48 w-full bg-surface-container-high relative overflow-hidden">
                <img 
                  src={reward.img} 
                  alt={reward.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
                />
                <div className="absolute top-6 right-6 bg-surface/90 backdrop-blur-xl px-4 py-2 rounded-2xl font-display font-black text-[10px] text-primary flex items-center gap-2 border border-outline-variant/30 shadow-2xl">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  {reward.points.toLocaleString()} PTS
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col gap-4">
                <h4 className="text-2xl font-display font-black text-on-surface group-hover:text-primary transition-colors leading-tight">
                  {reward.title}
                </h4>
                <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-70 flex-1">{reward.desc}</p>
                <button 
                  disabled={reward.locked}
                  className={`w-full mt-6 py-5 rounded-[24px] font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all border shadow-lg ${
                    reward.locked 
                    ? 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30 cursor-not-allowed' 
                    : 'bg-primary/5 hover:bg-primary text-primary hover:text-on-primary-fixed-variant border-primary/20'
                  }`}
                >
                  {reward.locked ? `Faltan ${reward.needed?.toLocaleString()} pts` : 'Canjear Reward'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
