import React from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom prompt if the user hasn't dismissed it this session
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-8 md:bottom-8 md:w-96"
        >
          <div className="bg-surface rounded-2xl shadow-2xl border border-primary/20 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Instalar Salud Conecta IA</h3>
                  <p className="text-sm text-on-surface-variant">Accede más rápido desde tu pantalla de inicio.</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
              >
                Ahora no
              </button>
              <button
                onClick={handleInstall}
                className="flex-[2] bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform active:scale-95"
              >
                Instalar App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
