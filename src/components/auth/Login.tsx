import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  Chrome, 
  Activity,
  Heart,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { signInWithGoogle, signInWithGoogleRedirect } from '../../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Para simplificar, desabilitamos el login por email/password mock
    // y sugerimos usar Google para tener una sesión real de Firebase
    setTimeout(() => {
      setError("El inicio de sesión por correo está deshabilitado. Por favor usa 'Continuar con Google' para una experiencia completa y segura.");
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLogin();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogleRedirect();
    } catch (err: any) {
      setError(err.message || "Error al redireccionar");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Lado Izquierdo: Branding & Visuals */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="relative z-10 text-on-primary max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-display font-black leading-tight mb-6">
              {t('login.hero_title')}
            </h1>
            <p className="text-lg text-white/80 font-medium mb-12 leading-relaxed">
              {t('login.hero_desc')}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Stethoscope, label: t('login.feat.doctors') },
                { icon: Activity, label: t('login.feat.challenges') },
                { icon: Heart, label: t('login.feat.care') },
                { icon: ShieldCheck, label: t('login.feat.privacy') }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Decoración móvil */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-48 bg-primary rounded-b-[40px] -z-10 flex items-center justify-center px-6">
           <div className="text-center">
             <h2 className="text-on-primary text-2xl font-display font-black">Salud Conecta IA</h2>
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-surface-container rounded-[32px] p-8 md:p-10 shadow-2xl border border-outline-variant/30 mt-20 md:mt-0"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-display font-black text-on-surface mb-2">{t('login.welcome')}</h2>
            <p className="text-on-surface-variant font-medium">{t('login.subtitle')}</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-error leading-relaxed">
                  {error}
                </p>
                {error.includes("dominio") && (
                  <p className="text-[10px] text-error/70 mt-1">
                    Tip: Asegúrate de añadir el dominio actual (ais-dev-... o ais-pre-...) en la consola de Firebase {'>'} Authentication {'>'} Settings {'>'} Authorized Domains.
                  </p>
                )}
                {error.includes("bloqueada") && (
                  <button 
                    onClick={handleRedirectLogin}
                    className="text-[10px] font-black uppercase tracking-wider text-primary mt-2 border-b border-primary/30 pb-0.5 hover:border-primary transition-all"
                  >
                    Usar método de redirección
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">
                {t('login.email')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  {t('login.password')}
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">{t('login.forgot')}</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/40 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {t('login.btn')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-container px-4 text-on-surface-variant font-bold tracking-widest">{t('login.or')}</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-surface-container-high border border-outline-variant/40 text-on-surface py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                {t('login.google')}
              </>
            )}
          </button>

          <p className="mt-10 text-center text-sm text-on-surface-variant font-medium">
            {t('login.no_account')}{' '}
            <a href="#" className="text-primary font-bold hover:underline">{t('login.signup')}</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
