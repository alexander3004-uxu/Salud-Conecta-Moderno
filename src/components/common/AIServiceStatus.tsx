import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, ShieldCheck, Zap, Globe, Lock, Unlock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { getDailyHealthTip } from '../../lib/gemini';

export const AIServiceStatus: React.FC = () => {
  const { t, language } = useLanguage();
  const { membership, isPremium } = useUser();
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoading(true);
      const dailyTip = await getDailyHealthTip(language, membership);
      setTip(dailyTip);
      setIsLoading(false);
    };
    fetchTip();
  }, [language, membership]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status Card - Gemini */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-on-primary border border-primary/20 rounded-[32px] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
            <Zap className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-on-primary/10 rounded-2xl border border-on-primary/20">
              <Zap className="w-6 h-6 text-on-primary" />
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              isPremium ? 'bg-on-primary/20 text-on-primary border-on-primary/30' : 'bg-on-primary/10 text-on-primary/80 border-on-primary/20'
            }`}>
              {isPremium ? 'PREMIUM' : t('ai.status.active')}
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-display font-black text-on-primary mb-1">
              {t('ai.status.title')}
            </h3>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-on-primary/70 uppercase tracking-wider">
                {isPremium ? 'Gemini 3 Pro + Search' : t('ai.status.model')}
              </span>
              <span className="text-[10px] font-mono font-bold text-on-primary/70 uppercase tracking-wider">
                {t('ai.status.latency')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status Card - Google Maps Tiered */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary text-on-primary border border-primary/20 rounded-[32px] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
            <Globe className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="p-3 bg-on-primary/10 rounded-2xl border border-on-primary/20">
              <Globe className="w-6 h-6 text-on-primary" />
            </div>
            <div className="flex items-center gap-2">
              {isPremium ? <Unlock className="w-3 h-3 text-on-primary" /> : <Lock className="w-3 h-3 text-on-primary/50" />}
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isPremium ? 'bg-on-primary/20 text-on-primary border-on-primary/30' : 'bg-on-primary/10 text-on-primary/80 border-on-primary/20'
              }`}>
                {isPremium ? 'FULL ACCESS' : 'PUBLIC ONLY'}
              </span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-display font-black text-on-primary mb-1">
              {t('maps.status.title')}
            </h3>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-on-primary/70 uppercase tracking-wider">
                {isPremium ? 'Public + Private Network' : 'Public Institutions Only'}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isPremium ? 'text-on-primary font-black' : 'text-on-primary/60'}`}>
                {isPremium ? 'PREMIUM ACCESS ENABLED' : 'UPGRADE FOR PRIVATE CLINICS'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Daily Tip Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-primary text-on-primary rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                {t('ai.tip.title')}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <p className="text-lg font-medium opacity-70 italic">
                  {t('ai.tip.loading')}
                </p>
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl md:text-2xl font-bold leading-relaxed mb-4 max-w-2xl"
              >
                "{tip}"
              </motion.p>
            )}

            <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest opacity-60">
              <ShieldCheck className="w-4 h-4" />
              Verificado por Salud Conecta Protocol 3.1
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
