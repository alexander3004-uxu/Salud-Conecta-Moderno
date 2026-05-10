import React from 'react';
import { motion } from 'motion/react';
import { 
  Footprints, 
  Flame, 
  Timer, 
  TrendingUp, 
  CheckCircle2, 
  MoreVertical, 
  Flag,
  Droplets,
  Water,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Wallet,
  MapPin,
  Stethoscope,
  Settings,
  History,
  TrendingDown,
  Activity,
  SelfImprovement
} from 'lucide-react';

export default function ActivityLogs() {
  const stats = [
    {
      title: 'Pasos Totales',
      value: '42,850',
      change: '+12% vs sem. ant.',
      trend: 'up',
      icon: Footprints,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Calorías Activas',
      value: '3,240',
      change: 'kcal estimadas',
      trend: 'neutral',
      icon: Flame,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10'
    },
    {
      title: 'Min. de Actividad',
      value: '315',
      change: 'Meta alcanzada',
      trend: 'success',
      icon: Activity,
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    }
  ];

  const chartData = [
    { day: 'L', value: 40, label: '4k' },
    { day: 'M', value: 65, label: '6.5k' },
    { day: 'M', value: 85, label: '8.5k', active: true },
    { day: 'J', value: 100, label: '10k+', active: true, success: true },
    { day: 'V', value: 30, label: '3k' },
    { day: 'S', value: 50, label: '5k' },
    { day: 'D', value: 45, label: '4.5k' },
  ];

  const challenges = [
    {
      title: 'Reto de 10k Pasos Diarios',
      subtitle: 'Día 4 de 7 consecutivos',
      points: '+500 pts',
      icon: Flag,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      progress: 85,
      current: '8,500',
      target: '10,000',
      milestones: [25, 50, 75]
    },
    {
      title: 'Hidratación Óptima',
      subtitle: 'Bebe 2L diarios (Semana)',
      points: '+200 pts',
      icon: Droplets,
      color: 'text-primary',
      bg: 'bg-primary/10',
      progress: 60,
      current: '1.2L',
      target: '2.0L'
    }
  ];

  const recentActivity = [
    {
      title: 'Caminata matutina',
      time: 'Hoy, 07:30 AM • 45 min',
      points: '+50 pts',
      icon: Footprints,
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    },
    {
      title: 'Sesión de hidratación',
      time: 'Hoy, 10:15 AM • 500ml',
      points: '+10 pts',
      icon: Droplets,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Registro de Presión',
      time: 'Ayer, 08:00 PM • 120/80',
      points: '+20 pts',
      icon: Activity,
      color: 'text-on-surface',
      bg: 'bg-surface-variant'
    },
    {
      title: 'Meditación guiada',
      time: 'Ayer, 07:00 AM • 15 min',
      points: '+30 pts',
      icon: Heart, // I'll use Activity or something if Heart is not available
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
      opacity: 'opacity-70'
    },
    {
      title: 'Trote ligero',
      time: 'Mar, 06:45 PM • 30 min',
      points: '+60 pts',
      icon: Activity, // Using Activity as generic run
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      opacity: 'opacity-70'
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">Registros de Actividad</h2>
          <p className="text-lg text-on-surface-variant mt-1 font-medium opacity-70">Tu progreso de salud y retos completados esta semana.</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-1 shadow-sm">
          <button className="px-6 py-2 rounded-xl bg-surface-container-highest text-on-surface font-display font-black text-[10px] uppercase tracking-widest shadow-sm">Semana</button>
          <button className="px-6 py-2 rounded-xl text-on-surface-variant hover:text-on-surface font-display font-black text-[10px] uppercase tracking-widest transition-all">Mes</button>
        </div>
      </div>

      {/* Accumulated Stats Panel (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/20 rounded-[32px] p-8 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-24 h-24 text-on-surface" />
            </div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border border-outline-variant/10`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{stat.title}</h3>
            </div>
            <div className="mt-auto relative z-10">
              <span className="text-5xl font-display font-black text-on-surface block mb-2">{stat.value}</span>
              <div className={`flex items-center gap-2 ${stat.trend === 'up' ? 'text-secondary' : stat.trend === 'success' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                {stat.trend === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Challenges */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          {/* Chart Section */}
          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-display font-black text-on-surface">Progreso Diario</h3>
              <button className="text-on-surface-variant hover:bg-surface-container-high p-3 rounded-full transition-all">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-end justify-between gap-3 h-56 relative pt-8">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                <div className="border-t border-outline-variant/10 w-full h-0" />
                <div className="border-t border-outline-variant/10 w-full h-0" />
                <div className="border-t border-outline-variant/10 w-full h-0" />
                <div className="border-t border-outline-variant/30 w-full h-0" />
              </div>

              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-3 z-10 w-full group">
                  <div className="w-full relative flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${d.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className={`w-full rounded-t-2xl transition-all relative ${
                        d.success ? 'bg-secondary shadow-[0_0_20px_rgba(81,223,142,0.3)]' : 
                        d.active ? 'bg-primary shadow-[0_0_20px_rgba(49,146,252,0.3)]' : 
                        'bg-surface-container-highest'
                      }`}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 border border-outline-variant/30">
                      {d.label}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${d.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Active Challenges */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <Flag className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-display font-black text-on-surface">Retos Activos</h3>
            </div>

            <div className="flex flex-col gap-6">
              {challenges.map((challenge, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 border-l-8 border-l-primary flex flex-col gap-8 shadow-xl hover:border-primary/40 transition-all group"
                  style={{ borderLeftColor: challenge.color.includes('secondary') ? 'var(--secondary)' : 'var(--primary)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`p-5 rounded-[24px] ${challenge.bg} ${challenge.color} border border-outline-variant/10 shadow-inner group-hover:scale-110 transition-transform`}>
                        <challenge.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-display font-black text-on-surface">{challenge.title}</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mt-1.5 font-mono">{challenge.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${challenge.color} block bg-white/5 px-3 py-1.5 rounded-full border border-current/20`}>
                        {challenge.points}
                      </span>
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter block mt-2 opacity-40">Recompensa</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest font-mono">
                      <span className="text-on-surface-variant">Progreso Actual</span>
                      <span className={`${challenge.color}`}>{challenge.current} / {challenge.target}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-4 rounded-full overflow-hidden relative shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${challenge.progress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`${challenge.color.includes('secondary') ? 'bg-secondary' : 'bg-primary'} h-full rounded-full relative`}
                      >
                        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                      
                      {challenge.milestones && challenge.milestones.map((m, i) => (
                        <div key={i} className="absolute top-0 h-full w-[2px] bg-background/30" style={{ left: `${m}%` }} />
                      ))}
                    </div>
                    {challenge.milestones && (
                      <div className="flex justify-between text-[8px] font-black text-on-surface-variant font-mono uppercase tracking-tighter opacity-40">
                        <span>2.5k</span>
                        <span>5k</span>
                        <span>7.5k</span>
                        <span>Meta</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="col-span-1 flex flex-col">
          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col h-full shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            
            <h3 className="text-xl font-display font-black text-on-surface mb-8 pb-4 border-b border-outline-variant/10 flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              Actividad Reciente
            </h3>
            
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {recentActivity.map((activity, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-4 p-4 hover:bg-surface-container-high/60 rounded-2xl transition-all cursor-pointer group ${activity.opacity || ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${activity.bg} flex items-center justify-center ${activity.color} shrink-0 group-hover:scale-110 transition-transform shadow-sm border border-outline-variant/10`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-on-surface truncate uppercase tracking-tight">{activity.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant font-mono opacity-60">{activity.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${activity.color}`}>
                      {activity.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 border-2 border-outline-variant/30 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-center gap-2">
              Ver historial completo
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// Extra icons for the activity feed
function Heart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
