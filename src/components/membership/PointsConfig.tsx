import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Footprints, 
  Droplets, 
  Activity, 
  Stethoscope, 
  FlaskConical, 
  Flame, 
  Calendar, 
  Save, 
  Trash2, 
  RefreshCcw,
  Zap,
  TestTube2,
  TrendingUp,
  Info,
  Smartphone,
  History,
  CheckCircle2
} from 'lucide-react';

interface ActivityRule {
  id: string;
  label: string;
  icon: any;
  color: string;
  points: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export default function PointsConfig() {
  const [rules, setRules] = useState<ActivityRule[]>([
    { id: 'steps', label: 'Daily Steps Target', icon: Footprints, color: 'text-secondary', points: 50, unit: 'pts / 10k', min: 10, max: 100, step: 5 },
    { id: 'hydration', label: 'Hydration Logging', icon: Droplets, color: 'text-primary', points: 15, unit: 'pts / log', min: 5, max: 50, step: 1 },
    { id: 'vitals', label: 'Vital Signs Entry', icon: Activity, color: 'text-secondary', points: 30, unit: 'pts / day', min: 10, max: 100, step: 5 },
    { id: 'teleconsult', label: 'Teleconsult Completion', icon: Stethoscope, color: 'text-secondary', points: 100, unit: 'pts / session', min: 50, max: 500, step: 10 },
    { id: 'labs', label: 'Lab Results Review', icon: TestTube2, color: 'text-secondary', points: 75, unit: 'pts / review', min: 25, max: 200, step: 5 },
  ]);

  const [multipliers, setMultipliers] = useState({
    streak: { enabled: true, value: 1.5, label: 'Streak Bonus', sub: '7+ consecutive days active', color: 'text-tertiary', icon: Flame },
    weekend: { enabled: true, value: 1.2, label: 'Weekend Warrior', sub: 'Activities logged Sat/Sun', color: 'text-primary', icon: Calendar }
  });

  const [saving, setSaving] = useState(false);

  const projectedEarnings = useMemo(() => {
    // Highly Active Profile Simulation
    const base = [
      { label: '12,500 Steps', val: Math.round(rules.find(r => r.id === 'steps')!.points * 1.25) },
      { label: 'Hydration (3 logs)', val: rules.find(r => r.id === 'hydration')!.points * 3 },
      { label: 'Vitals Logged', val: rules.find(r => r.id === 'vitals')!.points }
    ];
    const subtotal = base.reduce((acc, curr) => acc + curr.val, 0);
    const bonusValue = multipliers.streak.enabled ? Math.round(subtotal * (multipliers.streak.value - 1)) : 0;
    
    return {
      items: base,
      subtotal,
      bonus: bonusValue,
      total: subtotal + bonusValue
    };
  }, [rules, multipliers]);

  const goBack = () => {
    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'settings' }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-10 pb-32 flex flex-col gap-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={goBack}
            className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant border border-outline-variant/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-4xl font-display font-black text-on-surface">Points Configuration</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-medium opacity-70 italic">Adjust rule thresholds and multipliers for patient health activities.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 rounded-2xl border-2 border-outline-variant/30 text-on-surface-variant font-display font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-high transition-all">
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-display font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Rules & Multipliers */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Base Activities Card */}
          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-10 flex flex-col shadow-xl relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary transition-all duration-500 group-hover:w-3" />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <h3 className="text-2xl font-display font-black text-on-surface mb-10 flex items-center gap-3 relative z-10">
              <Zap className="w-6 h-6 text-primary" />
              Base Activities
            </h3>
            
            <div className="flex flex-col gap-10 relative z-10">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="group/item">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant/10 shadow-inner group-hover/item:scale-110 transition-transform">
                        <rule.icon className={`w-6 h-6 ${rule.color}`} />
                      </div>
                      <span className="text-base font-display font-black text-on-surface">{rule.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-surface-container shadow-inner border border-outline-variant/20 rounded-2xl px-4 py-2 group-focus-within/item:border-primary transition-all">
                        <input 
                          type="number" 
                          value={rule.points}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setRules(rules.map(r => r.id === rule.id ? { ...r, points: val } : r));
                          }}
                          className="w-16 bg-transparent border-none p-0 text-right font-mono font-bold text-secondary focus:ring-0"
                        />
                        <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{rule.unit}</span>
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={rule.min}
                    max={rule.max}
                    step={rule.step}
                    value={rule.points}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setRules(rules.map(r => r.id === rule.id ? { ...r, points: val } : r));
                    }}
                    className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary hover:accent-primary transition-all shadow-inner"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Multipliers Card */}
          <section className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-10 flex flex-col shadow-xl relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary transition-all duration-500 group-hover:w-3" />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <h3 className="text-2xl font-display font-black text-on-surface mb-10 flex items-center gap-3 relative z-10">
              <TrendingUp className="w-6 h-6 text-secondary" />
              Dynamic Multipliers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {(Object.entries(multipliers) as [keyof typeof multipliers, any][]).map(([key, m]) => (
                <div key={key} className="bg-surface-container-high/40 rounded-[32px] p-8 border border-outline-variant/30 hover:border-primary/30 transition-all group/card shadow-lg backdrop-blur-md">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-surface-container flex items-center justify-center shadow-inner group-hover/card:scale-110 transition-transform`}>
                        <m.icon className={`w-6 h-6 ${m.color}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-display font-black text-on-surface">{m.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 font-mono">{m.sub}</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={m.enabled}
                        onChange={(e) => setMultipliers({ ...multipliers, [key]: { ...m, enabled: e.target.checked } })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-surface-variant after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-4 bg-surface-container rounded-2xl p-4 shadow-inner border border-outline-variant/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Multiplier</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-secondary text-lg">x</span>
                      <input 
                        type="number" 
                        step="0.1"
                        value={m.value}
                        disabled={!m.enabled}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 1;
                          setMultipliers({ ...multipliers, [key]: { ...m, value: val } });
                        }}
                        className="w-16 bg-transparent border-none p-0 text-right font-mono font-bold text-secondary text-lg focus:ring-0 disabled:opacity-30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Simulator Sidebar */}
        <div className="xl:col-span-4 flex flex-col h-full">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[40px] p-8 flex flex-col sticky top-10 h-fit shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant/10 relative z-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-black text-on-surface">Daily Simulator</h3>
            </div>
            
            <p className="text-xs font-medium text-on-surface-variant mb-8 leading-relaxed opacity-70 relative z-10 italic">
              Projected earnings for a 'Highly Active' patient profile based on current settings.
            </p>

            <div className="flex flex-col gap-5 relative z-10">
              {projectedEarnings.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center group/sim text-sm">
                  <span className="font-display font-black text-on-surface-variant group-hover/sim:text-on-surface transition-colors">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-secondary">+{item.val}</span>
                    <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase">pts</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-6 border-t border-outline-variant/10 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-display font-black text-on-surface opacity-60">Subtotal</span>
                  <span className="font-mono font-bold text-on-surface text-lg">{projectedEarnings.subtotal} pts</span>
                </div>
                
                {multipliers.streak.enabled && (
                  <div className="flex justify-between items-center group/sim">
                    <span className="text-sm font-display font-black text-tertiary flex items-center gap-2">
                      <Flame className="w-4 h-4 fill-tertiary/20" />
                      Streak (x{multipliers.streak.value})
                    </span>
                    <span className="font-mono font-bold text-tertiary">+{projectedEarnings.bonus} pts</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 bg-surface-container rounded-[32px] p-10 border border-outline-variant/20 flex flex-col items-center justify-center text-center shadow-inner relative z-10 group/earn">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/earn:opacity-100 transition-opacity rounded-[32px]" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-4">Projected Daily Earn</span>
              <span className="text-7xl font-display font-black text-secondary tracking-tighter drop-shadow-md">{projectedEarnings.total}</span>
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-4 opacity-70">Health Points</span>
            </div>

            <button className="w-full mt-10 py-5 bg-surface-container-high/50 hover:bg-surface-container-high border-2 border-outline-variant/30 rounded-[24px] font-display font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-3">
              <History className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
