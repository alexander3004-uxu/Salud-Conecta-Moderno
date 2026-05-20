import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Mail, Lock, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { auth } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? t('login.error_invalid') 
        : t('login.error_general'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onLogin) onLogin();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(t('login.error_google'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-low p-8 rounded-3xl border border-outline-variant/30 shadow-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-on-surface">{t('login.welcome')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('login.subtitle')}</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error text-[10px] font-bold"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
              {t('profile.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-surface-container rounded-2xl pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 transition-all"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                {t('login.password')}
              </label>
              <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                {t('login.forgot')}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-surface-container rounded-2xl pl-12 pr-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/20 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-on-primary rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t('login.btn')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-container-low px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {t('login.or')}
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-surface-container-high border border-outline-variant/30 rounded-2xl flex items-center justify-center gap-3 text-on-surface font-black text-[11px] uppercase tracking-widest hover:bg-surface-container-highest transition-all shadow-sm disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>
        </form>
      </motion.div>
    </div>
  );
}