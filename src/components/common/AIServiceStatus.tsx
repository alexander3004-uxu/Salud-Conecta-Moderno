import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { getDailyHealthTip } from '../../lib/gemini';

export const AIServiceStatus: React.FC = () => {
  const { t, language } = useLanguage();
  const { membership } = useUser();
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
      {/* Daily Tip Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-primary text-on-primary rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
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
            Verificado por Salud Conecta IA Protocol 3.1
          </div>
        </div>
      </motion.div>
    </div>
  );
};
