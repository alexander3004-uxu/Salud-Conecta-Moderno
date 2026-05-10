import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy,
  RefreshCw as Sync,
  Droplets,
  Moon,
  Trees as NaturePeople,
  CheckCircle2 as Verified,
  Flame,
  LayoutList as Leaderboard,
  ChevronRight,
  User,
  Activity,
  Footprints,
  Bell,
  Star
} from 'lucide-react';

export default function HealthChallenges() {
  const availableChallenges = [
    {
      title: 'Héroe de la Hidratación',
      desc: 'Registra 2 litros de agua diarios por 5 días consecutivos.',
      points: 150,
      icon: Droplets,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Sueño Reparador',
      desc: 'Duerme al menos 7 horas cada noche durante toda la semana.',
      points: 100,
      icon: Moon,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10'
    },
    {
      title: 'Fin de Semana Activo',
      desc: 'Realiza 60 minutos de actividad física al aire libre este fin de semana.',
      points: 250,
      icon: NaturePeople,
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    }
  ];

  const ranking = [
    { rank: 1, name: 'Ana Martínez', level: 42, pts: '14,200', current: false },
    { rank: 2, name: 'Carlos G.', level: 38, pts: '13,850', current: false },
    { rank: 3, name: 'Elena S.', level: 35, pts: '12,100', current: false },
    { rank: 15, name: 'Tú Perfil', level: 12, pts: '4,350', current: true },
  ];

  return (
    <div className="w-full flex-grow flex flex-col gap-12 py-8 px-4 md:px-0">
      {/* Header Section */}
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-display font-black text-on-surface">Retos de Salud Semanales</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-medium">
          Completa hábitos saludables para ganar puntos extra y mejorar tu bienestar general. Participa con la comunidad y alcanza nuevas metas.
        </p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Challenges */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Current Challenge Banner */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 border-l-4 border-l-secondary relative overflow-hidden shadow-sm group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Footprints className="w-48 h-48 text-secondary" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/20">Reto Actual</span>
                  <span className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Trophy className="w-3.5 h-3.5 fill-primary/10" /> +200 pts
                  </span>
                </div>
                <h2 className="text-3xl font-display font-black text-on-surface">10k Pasos Diarios</h2>
                <p className="text-sm font-medium text-on-surface-variant max-w-md">Mantén un promedio de 10,000 pasos durante toda la semana.</p>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Progress Ring */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-surface-container-highest" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="8" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 * (1 - 0.74) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-secondary" 
                      cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="264" strokeLinecap="round" strokeWidth="8" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-black text-on-surface">74%</span>
                  </div>
                </div>

                <div className="flex-grow md:max-w-[200px]">
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 flex justify-between">
                    <span>Progreso</span>
                    <span className="text-on-surface">7,450 / 10,000</span>
                  </div>
                  <button className="w-full bg-surface-container-high hover:bg-surface-bright text-primary py-3 px-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest transition-all flex justify-center items-center gap-2 border border-outline-variant/10">
                    <Sync className="w-3.5 h-3.5" /> Sincronizar
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Available Challenges Grid */}
          <section className="flex flex-col gap-6">
            <h3 className="text-xl font-display font-black text-on-surface">Retos Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableChallenges.map((challenge, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-6 flex flex-col justify-between group hover:border-primary/50 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${challenge.bg} ${challenge.color} flex items-center justify-center border border-outline-variant/10 group-hover:scale-110 transition-transform`}>
                        <challenge.icon className="w-7 h-7" />
                      </div>
                      <span className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <Trophy className="w-3 h-3" /> +{challenge.points} pts
                      </span>
                    </div>
                    <h4 className="text-lg font-display font-black text-on-surface mb-2">{challenge.title}</h4>
                    <p className="text-xs font-medium text-on-surface-variant mb-6 leading-relaxed opacity-70">{challenge.desc}</p>
                  </div>
                  <button className="w-full bg-primary text-on-primary-fixed-variant py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10">
                    Unirse al Reto
                  </button>
                </motion.div>
              ))}
              
              {/* Reminder/Coming Soon Placeholder */}
              <div className="bg-surface-container-low/50 border border-dashed border-outline-variant/30 rounded-[32px] p-6 flex flex-col items-center justify-center text-center opacity-60">
                <Bell className="w-8 h-8 text-on-surface-variant mb-3 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Próximos retos en 3 días</p>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="flex flex-col gap-6">
            <h3 className="text-xl font-display font-black text-on-surface">Logros Recientes</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 px-5 py-4 rounded-2xl opacity-80 group hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Verified className="w-5 h-5 text-secondary fill-secondary/20" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Semana Perfecta</p>
                  <p className="text-[9px] font-medium text-on-surface-variant uppercase tracking-tighter opacity-60">Completado ayer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 px-5 py-4 rounded-2xl opacity-80 group hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-tertiary fill-tertiary/20" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Racha 5 Días</p>
                  <p className="text-[9px] font-medium text-on-surface-variant uppercase tracking-tighter opacity-60">Hace 3 días</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 flex flex-col h-full border-t-4 border-t-primary-container shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-black text-on-surface flex items-center gap-3">
                <Leaderboard className="w-5 h-5 text-primary" />
                Ranking Global
              </h3>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver todos</button>
            </div>
            
            <div className="flex flex-col gap-4 flex-grow">
              {ranking.map((user, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center p-4 rounded-2xl border transition-all ${
                    user.current 
                      ? 'bg-primary/5 border-primary/30 relative overflow-hidden' 
                      : 'bg-surface-container/30 border-outline-variant/10 hover:bg-surface-container/50'
                  }`}
                >
                  {user.current && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                  <div className={`w-8 text-center text-xs font-black ${user.rank <= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>{user.rank}</div>
                  <div className="w-11 h-11 rounded-full bg-surface-container overflow-hidden mx-3 flex-shrink-0 flex items-center justify-center border border-outline-variant/10">
                    {user.current ? (
                      <span className="text-[10px] font-black text-primary">TÚ</span>
                    ) : (
                      <User className="w-5 h-5 opacity-40" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-bold ${user.current ? 'text-on-surface' : 'text-on-surface-variant'}`}>{user.name}</p>
                    <p className="text-[10px] font-medium text-on-surface-variant opacity-60 uppercase tracking-widest">Nivel {user.level}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-display font-black ${user.current ? 'text-on-surface' : 'text-secondary'}`}>{user.pts}</p>
                    <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase">pts</p>
                  </div>
                </div>
              ))}
              
              <div className="h-px bg-outline-variant/10 my-2" />
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-3">
                <span>Sig. Nivel: Platinum</span>
                <span>Faltan 850 pts</span>
              </div>
              <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-primary h-full rounded-full" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
