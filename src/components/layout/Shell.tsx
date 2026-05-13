import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Map as MapIcon, 
  Calendar, 
  MessageSquare, 
  User, 
  Menu, 
  X, 
  Activity, 
  Stethoscope, 
  Pill, 
  History,
  Globe,
  Radio,
  Store,
  Search as SearchIcon,
  Zap,
  Trophy,
  Flame,
  Bell
} from 'lucide-react';
import { auth, signInWithGoogle, handleRedirectResult } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { syncUserProfile } from '../../lib/authUtils';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Shell({ children, activeTab, setActiveTab }: ShellProps) {
  const { t } = useLanguage();
  const [user, setUser] = React.useState<any>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleUnauth = (e: any) => setUnauthorizedDomain(e.detail.domain);
    window.addEventListener('firebase-unauthorized-domain', handleUnauth);
    
    // Check for redirect result on mount
    handleRedirectResult().then(u => {
      if (u) {
        setUser(u);
        syncUserProfile(u);
      }
    });

    // Check for mock user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        syncUserProfile(u);
        localStorage.setItem('user', JSON.stringify({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL
        }));
      } else if (!localStorage.getItem('isLoggedIn')) {
        setUser(null);
      }
    });

    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };

    window.addEventListener('changeTab', handleTabChange);
    return () => {
      unsubscribe();
      window.removeEventListener('changeTab', handleTabChange);
      window.removeEventListener('firebase-unauthorized-domain', handleUnauth);
    };
  }, [setActiveTab]);

  const navItems = [
    { id: 'triage', label: t('nav.triage'), icon: Stethoscope },
    { id: 'pharmacy', label: t('nav.pharmacy'), icon: Store },
    { id: 'search', label: t('nav.search'), icon: SearchIcon },
    { id: 'rewards', label: t('nav.rewards'), icon: Trophy },
    { id: 'activity', label: t('nav.activity'), icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* TopAppBar */}
      {unauthorizedDomain && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-alert-red text-white p-2 text-center text-xs font-bold animate-pulse shadow-lg">
          DOMINIO NO AUTORIZADO: Añade "{unauthorizedDomain}" en Firebase Console &gt; Auth &gt; Settings &gt; Authorized Domains.
          <button 
            onClick={() => setUnauthorizedDomain(null)}
            className="ml-4 underline uppercase"
          >
            Cerrar
          </button>
        </div>
      )}
      <header className={`fixed ${unauthorizedDomain ? 'top-8' : 'top-0'} left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface-container-low border-b border-outline-variant/30 shadow-sm transition-all duration-200`}>
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-primary">Salud Conecta IA</h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('triage')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              activeTab === 'triage' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            title={t('nav.triage')}
          >
            <Stethoscope className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              activeTab === 'map' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            title={t('header.map')}
          >
            <Globe className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              activeTab === 'activity' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            title={t('header.activity')}
          >
            <Radio className="w-5 h-5" />
          </button>
          
          <div 
            className={`w-10 h-10 flex items-center justify-center rounded-full overflow-hidden ml-1 shadow-inner cursor-pointer border transition-all ${
              activeTab === 'profile' ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-outline-variant/50 hover:border-primary/40'
            }`}
            onClick={() => user ? setActiveTab('profile') : signInWithGoogle()}
          >
            {user ? (
              <img 
                src={user.photoURL || ''} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-5 h-5 text-on-surface-variant" />
            )}
          </div>
        </div>
      </header>

      {/* Desktop Side Nav Links (conceptually integrated into main area) */}
      <div className="hidden md:flex fixed top-16 left-0 w-full bg-surface-container/50 backdrop-blur-md border-b border-outline-variant/30 justify-center gap-8 py-2 z-40 shadow-sm overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id === 'map_view' ? 'map' : item.id)}
            className={`flex items-center gap-2 px-6 py-2 font-display font-bold text-sm transition-all duration-300 relative ${
              (activeTab === item.id || (activeTab === 'map' && (item.id === 'map' || item.id === 'map_view')))
                ? 'text-primary' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <item.icon className={`w-4 h-4 ${(activeTab === item.id || (activeTab === 'map' && (item.id === 'map' || item.id === 'map_view'))) ? 'fill-primary/20' : ''}`} />
            <span>{item.label}</span>
            {(activeTab === item.id || (activeTab === 'map' && (item.id === 'map' || item.id === 'map_view'))) && (
              <motion.div 
                layoutId="navAction"
                className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-primary rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className={`flex-grow pt-16 pb-20 md:pt-[104px] md:pb-0 flex flex-col items-center w-full max-w-7xl mx-auto`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-surface-container-high/95 backdrop-blur-lg border-t border-outline-variant/20 shadow-[0_-4px_16px_rgba(0,0,0,0.4)] rounded-t-[32px] pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] h-full transition-all duration-300 ${
              activeTab === item.id 
                ? item.id === 'search' ? 'text-on-secondary-container' : 'text-primary' 
                : 'text-on-surface-variant'
            }`}
          >
            <div className={`w-12 h-8 flex items-center justify-center rounded-2xl mb-1 transition-all ${
              activeTab === item.id 
                ? item.id === 'search' ? 'bg-secondary shadow-lg shadow-secondary/30 scale-110' : 'bg-primary/20 scale-110' 
                : ''
            }`}>
              <item.icon className={`w-6 h-6 transition-all ${activeTab === item.id ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Global Footer (Desktop Only) */}
      <footer className="hidden md:block w-full border-t border-outline-variant/10 py-16 mt-12 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-primary">Salud Conecta IA</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer.system')}</h4>
              <ul className="text-sm text-on-surface-variant space-y-2">
                <li>{t('footer.system.triage')}</li>
                <li>{t('footer.system.pharmacy')}</li>
                <li>{t('footer.system.pwa')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">{t('footer.legal')}</h4>
              <ul className="text-sm text-on-surface-variant space-y-2">
                <li>{t('footer.legal.privacy')}</li>
                <li>{t('footer.legal.terms')}</li>
                <li>{t('footer.legal.acc')}</li>
              </ul>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
             <div className="flex items-center gap-2 text-alert-red font-black mb-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-alert-red" />
                {t('status.emergency')}: 911
             </div>
             <p className="text-xs text-on-surface-variant leading-relaxed">
               {t('footer.emergency.desc')}
             </p>
          </div>
        </div>
      </footer>
    </div>

  );
}
