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
  Radio
} from 'lucide-react';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { syncUserProfile } from '../../lib/authUtils';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Shell({ children, activeTab, setActiveTab }: ShellProps) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        syncUserProfile(u);
      }
    });

    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };

    window.addEventListener('changeTab', handleTabChange);
    return () => {
      unsubscribe();
      window.removeEventListener('changeTab', handleTabChange);
    };
  }, [setActiveTab]);

  const navItems = [
    { id: 'triage', label: 'Triaje', icon: Stethoscope },
    { id: 'messages', label: 'IA Chat', icon: MessageSquare },
    { id: 'search', label: 'Buscar', icon: Globe },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'appointments', label: 'Citas', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface-container-low border-b border-outline-variant/30 shadow-sm transition-colors duration-200">
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
          <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <Globe className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
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
              Ecosistema de salud pública inteligente desarrollado para maximizar la eficiencia y empatía en la atención médica nacional.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">Sistema</h4>
              <ul className="text-sm text-on-surface-variant space-y-2">
                <li>Triaje Avanzado</li>
                <li>Red de Farmacias</li>
                <li>Pasaporte PWA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="text-sm text-on-surface-variant space-y-2">
                <li>Privacidad</li>
                <li>Términos</li>
                <li>Accesibilidad</li>
              </ul>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
             <div className="flex items-center gap-2 text-alert-red font-black mb-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-alert-red" />
                EMERGENCIAS: 911
             </div>
             <p className="text-xs text-on-surface-variant leading-relaxed">
               Si siente que su vida está en peligro o tiene síntomas críticos, no use esta herramienta y llame de inmediato al 911.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
