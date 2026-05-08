import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, MonitorSmartphone, X, ShieldCheck, Asterisk, Activity } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthStep = 'initial' | 'scanning' | 'pin' | 'success';

export const BiometricModal: React.FC<BiometricModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStep('initial');
      setPin('');
    }
  }, [isOpen]);

  const handleStartScan = () => {
    setStep('scanning');
    // Simulate biometric scan delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm rounded-[32px] overflow-hidden bg-surface-container-low border border-outline-variant/30 shadow-2xl flex flex-col items-center text-center p-8 z-10"
        >
          {/* Glassy Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-outline-variant hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'initial' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center mb-8 border border-primary-container shadow-[0_0_30px_rgba(49,146,252,0.2)]">
                <Fingerprint className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-on-surface mb-3">
                Validación Biométrica
              </h2>
              <p className="text-sm font-medium text-on-surface-variant mb-10 px-4 leading-relaxed">
                Escanea tu huella o usa el reconocimiento facial para desbloquear la edición de datos sensibles.
              </p>
              
              <div className="w-full space-y-4">
                <button 
                  onClick={handleStartScan}
                  className="w-full py-4 px-6 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-container transition-all active:scale-[0.98]"
                >
                  Iniciar Escaneo
                </button>
                <button 
                  onClick={() => setStep('pin')}
                  className="w-full py-4 px-6 border border-outline-variant/30 text-on-surface font-bold text-sm rounded-2xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
                >
                  <MonitorSmartphone className="w-4 h-4" />
                  Usar PIN de seguridad
                </button>
              </div>
            </motion.div>
          )}

          {step === 'scanning' && (
            <div className="flex flex-col items-center py-10">
              <div className="relative w-24 h-24 mb-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-full border-4 border-primary/20"
                />
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    borderColor: ['#a6c8ff', '#3192fc', '#a6c8ff']
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-4 border-primary shadow-[0_0_20px_rgba(49,146,252,0.4)]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Fingerprint className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">Escaneando...</h3>
              <p className="text-xs font-mono font-bold text-primary uppercase tracking-[0.2em] animate-pulse">Verificando Biometría</p>
            </div>
          )}

          {step === 'pin' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6 border border-outline-variant/30">
                <Asterisk className="w-8 h-8 text-outline-variant" />
              </div>
              <h2 className="text-2xl font-display font-bold text-on-surface mb-2">Ingresar PIN</h2>
              <p className="text-sm font-medium text-on-surface-variant mb-10">Ingresa tu código de 4 dígitos</p>
              
              <form onSubmit={handlePinSubmit} className="w-full">
                <div className="flex justify-center gap-4 mb-10">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                        pin.length > i ? 'bg-primary-container border-primary text-on-primary-container' : 'bg-surface-container-high border-outline-variant/20'
                      }`}
                    >
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>
                
                <input 
                  type="text" 
                  autoFocus
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="absolute inset-0 opacity-0 cursor-default"
                />

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={pin.length !== 4}
                    className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-lg hover:bg-primary-container transition-all disabled:opacity-50"
                  >
                    Confirmar PIN
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep('initial')}
                    className="text-xs font-bold text-outline-variant uppercase tracking-widest hover:text-on-surface transition-colors p-2"
                  >
                    Volver a biometría
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center py-10">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-8 border border-secondary shadow-[0_0_30px_rgba(81,223,142,0.3)]"
              >
                <ShieldCheck className="w-12 h-12 text-secondary" />
              </motion.div>
              <h3 className="text-2xl font-display font-bold text-secondary mb-2">¡Validado!</h3>
              <p className="text-sm font-medium text-on-surface-variant italic">Identidad confirmada</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
