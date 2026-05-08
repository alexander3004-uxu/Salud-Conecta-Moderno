import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Scan, 
  Camera, 
  CheckCircle2, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';

interface DocumentScannerProps {
  onClose: () => void;
  onCapture: (data: any) => void;
}

export default function DocumentScanner({ onClose, onCapture }: DocumentScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [status, setStatus] = useState<'searching' | 'detected' | 'capturing' | 'success'>('searching');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Simulate finding a document after 2 seconds
    const timer = setTimeout(() => {
      setStatus('detected');
    }, 2000);

    // Scanning line animation logic via CSS, but let's keep progress state if needed
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    setStatus('capturing');
    // Simulate processing
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onCapture({
          id: Date.now().toString(),
          type: 'Orden Médica',
          title: 'Análisis de Sangre - Panel Metabólico',
          date: new Date().toLocaleDateString(),
          status: 'pending'
        });
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Viewfinder Background (Simulated) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center brightness-[0.4] contrast-[1.2] grayscale"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600')",
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Noise/Grain Overlay */}
          <div className="absolute inset-0 bg-[#0B1326]/40 backdrop-blur-[1px]" />
        </div>
      </div>

      {/* Top Actions */}
      <header className="relative z-10 w-full p-6 flex justify-between items-start">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-surface-container-low/60 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 rounded-full bg-surface-container-low/60 backdrop-blur-md border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
          <Zap className="w-6 h-6" />
        </button>
      </header>

      {/* Scanning Reticle */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-sm aspect-[3/4] relative">
          {/* Corners */}
          <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl transition-colors duration-500 ${status !== 'searching' ? 'border-secondary shadow-[0_0_15px_rgba(81,223,142,0.5)]' : 'border-outline opacity-40'}`} />
          <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl transition-colors duration-500 ${status !== 'searching' ? 'border-secondary shadow-[0_0_15px_rgba(81,223,142,0.5)]' : 'border-outline opacity-40'}`} />
          <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl transition-colors duration-500 ${status !== 'searching' ? 'border-secondary shadow-[0_0_15px_rgba(81,223,142,0.5)]' : 'border-outline opacity-40'}`} />
          <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl transition-colors duration-500 ${status !== 'searching' ? 'border-secondary shadow-[0_0_15px_rgba(81,223,142,0.5)]' : 'border-outline opacity-40'}`} />

          {/* Scanning Line */}
          {status !== 'success' && status !== 'capturing' && (
            <motion.div 
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={`absolute left-4 right-4 h-0.5 z-20 shadow-[0_0_10px] transition-colors duration-500 ${status !== 'searching' ? 'bg-secondary text-secondary' : 'bg-primary text-primary opacity-30'}`}
            />
          )}

          {/* Central Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none gap-4">
            <Scan className={`w-24 h-24 transition-colors duration-500 ${status !== 'searching' ? 'text-secondary' : 'text-on-surface'}`} />
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-center max-w-[200px]">
              {status === 'searching' ? 'Buscando Bordes...' : 'Ajuste el documento al marco'}
            </p>
          </div>

          {/* Capturing/Success Overlay */}
          <AnimatePresence>
            {(status === 'capturing' || status === 'success') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-surface-container-low/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-outline-variant/30"
              >
                {status === 'capturing' ? (
                  <>
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                    <h3 className="text-xl font-display font-bold text-on-surface mb-2">Procesando Orden</h3>
                    <p className="text-sm text-on-surface-variant">Extrayendo datos con IA...</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-on-surface mb-2">¡Completado!</h3>
                    <p className="text-sm text-on-surface-variant">Orden identificada y guardada.</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls Area */}
      <footer className="relative z-10 w-full flex flex-col items-center pb-12 pt-10 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent gap-8">
        {/* Real-time Status Pill */}
        <AnimatePresence mode="wait">
          {status === 'searching' ? (
            <motion.div 
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface-container-high/60 backdrop-blur-md border border-outline-variant text-on-surface-variant px-6 py-2 rounded-full flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">Buscando Documento</span>
            </motion.div>
          ) : status === 'detected' ? (
            <motion.div 
              key="detected"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-secondary-container/90 backdrop-blur-md border border-secondary text-on-secondary-container px-6 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-secondary/10"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">Documento detectado</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Capture Button */}
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={handleCapture}
            disabled={status !== 'detected'}
            className="w-24 h-24 rounded-full border-4 border-outline-variant p-1.5 flex items-center justify-center bg-transparent focus:outline-none focus:border-primary transition-all disabled:opacity-30 disabled:scale-90 group"
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all shadow-xl ${status === 'detected' ? 'bg-primary shadow-primary/20 hover:brightness-110 active:scale-90' : 'bg-outline-variant'}`}>
              <Camera className={`w-10 h-10 transition-colors ${status === 'detected' ? 'text-on-primary' : 'text-on-surface-variant'}`} />
            </div>
          </button>
          <span className="font-mono text-[9px] font-black text-on-surface-variant uppercase tracking-[.3em] opacity-60">Capturar</span>
        </div>
      </footer>
    </motion.div>
  );
}
