import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon,
  ShieldCheck,
  Download,
  AlertCircle,
  Activity,
  FileText,
  Pill,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Clock,
  Dumbbell,
  IdCard,
  AlertTriangle,
  FlaskConical,
  ChevronDown,
  Scan,
  Camera,
  Sparkles,
  Verified
} from 'lucide-react';
import { TriageRecord } from '../../types';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { getUserTriages } from '../../services/triageService';
import { onAuthStateChanged } from 'firebase/auth';
import DocumentScanner from './DocumentScanner';

export default function History() {
  const [user, setUser] = useState<any>(null);
  const [triages, setTriages] = useState<TriageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrepGuide, setShowPrepGuide] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOrderValidated, setIsOrderValidated] = useState(false);
  const [validatedOrderId, setValidatedOrderId] = useState<string | null>(null);
  const [prepChecks, setPrepChecks] = useState({
    fasting: false,
    hydration: false,
    exercise: false,
    docs: false
  });

  const allChecked = Object.values(prepChecks).every(v => v);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchTriages(u.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTriages = async (uid: string) => {
    setIsLoading(true);
    try {
      const trgs = await getUserTriages(uid);
      setTriages(trgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background min-h-[60vh]">
        <div className="max-w-md w-full bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="w-10 h-10 text-primary opacity-40" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-on-surface">Historial Reservado</h2>
          <p className="text-on-surface-variant mb-8 text-body-md leading-relaxed">
            Para ver tu pasaporte de salud y registros médicos, por favor inicia sesión.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Ver Mi Pasaporte
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-10">
      <div className="flex flex-col gap-2 border-b border-outline-variant/20 pb-8">
        <h1 className="text-4xl font-display font-bold text-on-surface">Pasaporte de Salud</h1>
        <p className="text-on-surface-variant font-medium uppercase tracking-[0.2em] text-[10px] font-mono">Realon™ Health Systems • Sincronización Cloud-IA</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant font-mono">Sincronizando Expediente...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* QR PASSPORT SECTION */}
          <section className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-10 shadow-lg group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="w-[180px] h-[180px] bg-white rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative shadow-2xl ring-4 ring-primary/5 z-10 transition-transform group-hover:scale-105">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REALON-HEALTH-${user.uid}`}
                alt="Pasaporte QR" 
                className="w-4/5 h-4/5 object-contain"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col gap-5 w-full text-center sm:text-left z-10">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">DATOS ENCRIPTADOS END-TO-END</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-on-surface leading-tight">Acceso Médico Seguro</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-2 opacity-80">
                Presente este código al personal de salud para compartir su resumen clínico, alergias y triajes recientes de forma inmediata.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="flex-1 sm:flex-none bg-primary text-on-primary font-display font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-xl"
                >
                  <Scan className="w-4 h-4" />
                  Digitalizar Orden
                </button>
                <button className="flex-1 sm:flex-none bg-surface-container-highest border border-outline-variant/30 text-on-surface px-6 py-3.5 rounded-2xl font-display font-bold text-sm hover:bg-surface-bright transition-all">
                  <Download className="w-4 h-4 mr-2 inline" />
                  PDF
                </button>
              </div>
            </div>
          </section>

          {/* PREPARATION GUIDES SECTION */}
          <section className="space-y-6">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
              <h2 className="text-2xl font-display font-bold text-on-surface">Guías de Preparación</h2>
              <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/20 uppercase tracking-widest">
                1 Pendiente
              </span>
            </div>

            <div className="bg-surface-container rounded-[32px] border border-outline-variant/20 overflow-hidden shadow-lg transition-all hover:border-primary/20">
              {/* Card Header (Always visible) */}
              <div 
                onClick={() => setShowPrepGuide(!showPrepGuide)}
                className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner border border-secondary/20">
                    <FlaskConical className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-[0.2em]">Cita Próxima</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-on-surface">Análisis de Sangre</h3>
                    <p className="text-on-surface-variant text-sm font-medium opacity-70 mt-1">
                      {isOrderValidated ? `Validado con Orden Médica ${validatedOrderId}` : 'Panel Metabólico Completo • 15 Nov, 08:30 AM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!allChecked && (
                    <span className="px-4 py-1.5 rounded-full bg-error/10 text-error text-[10px] font-black uppercase tracking-widest border border-error/20 flex items-center gap-2 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Requiere Atención
                    </span>
                  )}
                  {allChecked && (
                    <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Listo para Cita
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: showPrepGuide ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {showPrepGuide && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                    className="overflow-hidden border-t border-outline-variant/10"
                  >
                    <div className="p-8 space-y-8 bg-surface-container-low/30">
                      {/* Scan Order Card - NEW */}
                      <div className={`bg-surface-container border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg relative overflow-hidden group transition-all ${isOrderValidated ? 'border-secondary/30' : 'border-primary/30'}`}>
                        <div className={`absolute top-0 right-0 w-48 h-48 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700 ${isOrderValidated ? 'bg-secondary/5' : 'bg-primary/5'}`}></div>
                        <div className="flex-1 flex flex-col gap-4 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isOrderValidated ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                              <Scan className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-on-surface">Escaneo de Orden Médica</h3>
                          </div>
                          
                          {isOrderValidated ? (
                            <>
                              <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-md">
                                Validado con Orden Médica <span className="text-secondary font-bold font-mono">{validatedOrderId}</span>. Su guía ha sido actualizada.
                              </p>
                              <div className="flex items-center gap-3 text-secondary font-mono text-[10px] font-black uppercase tracking-widest bg-secondary/10 px-6 py-3 rounded-full w-fit border border-secondary/20 shadow-sm shadow-secondary/10">
                                <CheckCircle2 className="w-3.5 h-3.5 fill-secondary text-on-secondary" />
                                <span>Orden Validada</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-md">
                                Escanee su orden para que la IA valide los requisitos específicos de su estudio y personalice esta guía automáticamente.
                              </p>
                              <button 
                                onClick={() => setIsScannerOpen(true)}
                                className="mt-2 w-fit bg-primary text-on-primary font-mono text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-full flex items-center gap-3 hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/20"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Escanear Orden Médica</span>
                              </button>
                            </>
                          )}
                        </div>
                        <div className={`w-full md:w-56 aspect-[4/3] rounded-2xl border-2 border-dashed bg-surface-container-low flex flex-col items-center justify-center transition-all ${isOrderValidated ? 'border-secondary/50 text-secondary' : 'border-outline-variant text-on-surface-variant/40 hover:border-primary/30'}`}>
                          {isOrderValidated ? (
                            <>
                              <FileText className="w-12 h-12 mb-2" />
                              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-center">Documento Procesado</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-10 h-10 opacity-20" />
                              <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Vista previa</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* IA Personalization Banner */}
                      {isOrderValidated && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full bg-secondary-container/10 border border-secondary/30 rounded-2xl p-4 flex items-center justify-center gap-3 backdrop-blur-sm"
                        >
                          <Verified className="text-secondary w-5 h-5 shrink-0" />
                          <span className="text-sm font-medium text-secondary">
                            Las siguientes instrucciones han sido personalizadas según los requisitos de su orden médica.
                          </span>
                        </motion.div>
                      )}

                      {/* Critical Alert Bar */}
                      <div className="bg-error-container/10 border-l-4 border-error rounded-r-2xl p-6 flex items-start gap-5 backdrop-blur-md">
                        <AlertTriangle className="text-error w-6 h-6 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-display font-bold text-error text-lg mb-1">Aviso Crítico: Medicamentos Habituales</h4>
                          <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
                            Consulte inmediatamente con su médico tratante si debe suspender alguna medicación antes de la extracción. 
                            <strong> No suspenda ninguna medicación por su cuenta</strong> sin autorización profesional.
                          </p>
                        </div>
                      </div>

                      {/* Bento Grid Instructions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Ayuno Estricto */}
                        <div className="md:col-span-2 bg-surface-container-high rounded-3xl p-8 border border-outline-variant/20 flex flex-col gap-5 relative overflow-hidden group hover:border-primary/40 transition-all shadow-sm">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12 pointer-events-none transition-transform group-hover:scale-125 duration-500" />
                          <div className="flex justify-between items-center sm:items-start">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Clock className="w-7 h-7" />
                              </div>
                              <div>
                                <h5 className="font-display font-bold text-on-surface text-2xl">Ayuno Estricto</h5>
                                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em] opacity-60">Requerimiento Vital</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              {isOrderValidated && (
                                <span className="bg-secondary/10 text-secondary-fixed px-3 py-1 rounded-full font-mono font-bold text-[9px] flex items-center gap-1.5 border border-secondary/20 uppercase tracking-widest">
                                  <Sparkles className="w-3 h-3" />
                                  Confirmado por IA
                                </span>
                              )}
                              <span className="bg-primary/20 text-primary-fixed px-3 py-1 rounded-lg font-mono font-bold text-[9px] border border-primary/30 uppercase tracking-widest">OBLIGATORIO</span>
                            </div>
                          </div>
                          <p className="text-on-surface-variant text-base leading-relaxed font-medium pl-0 sm:pl-19">
                            {isOrderValidated ? `Validado con Orden Médica ${validatedOrderId}` : 'Requiere un ayuno ininterrumpido de 8 a 12 horas antes de la extracción. No ingiera alimentos sólidos ni líquidos que no sean agua.'}
                          </p>
                          <div className="flex justify-end mt-2">
                            <label className="flex items-center gap-4 cursor-pointer group/label">
                              <span className="text-xs font-bold text-on-surface-variant font-mono uppercase tracking-widest group-hover/label:text-on-surface transition-colors">Entendido</span>
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPrepChecks(prev => ({ ...prev, fasting: !prev.fasting }));
                                }}
                                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                  prepChecks.fasting 
                                    ? 'bg-secondary border-secondary text-on-secondary shadow-lg shadow-secondary/20' 
                                    : 'border-outline-variant hover:border-primary/50'
                                }`}
                              >
                                {prepChecks.fasting && <CheckCircle2 className="w-6 h-6" />}
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Hidratación */}
                        <div className="bg-surface-container-high rounded-3xl p-6 border border-outline-variant/20 flex flex-col gap-4 hover:border-secondary/30 transition-all group">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 group-hover:scale-110 transition-transform">
                                <Droplets className="w-5 h-5" />
                              </div>
                              <h5 className="font-display font-bold text-on-surface text-lg">Hidratación Adecuada</h5>
                            </div>
                            {isOrderValidated && (
                              <span className="bg-secondary/10 text-secondary-fixed px-3 py-1 rounded-full font-mono font-bold text-[9px] flex items-center gap-1.5 border border-secondary/20 uppercase tracking-widest w-fit mt-1">
                                <Sparkles className="w-3 h-3" />
                                Confirmado por IA
                              </span>
                            )}
                          </div>
                          <p className="text-on-surface-variant text-sm leading-relaxed font-medium flex-grow">
                            {isOrderValidated ? `Validado con Orden Médica ${validatedOrderId}` : 'Se permite y recomienda beber únicamente agua. Evite jugos, té, café incluso sin azúcar o gaseosas.'}
                          </p>
                          <label className="flex items-center gap-3 cursor-pointer self-end">
                            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-widest">Revisado</span>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrepChecks(prev => ({ ...prev, hydration: !prev.hydration }));
                              }}
                              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                prepChecks.hydration 
                                  ? 'bg-secondary border-secondary text-on-secondary shadow-md shadow-secondary/10' 
                                  : 'border-outline-variant hover:border-primary/50'
                              }`}
                            >
                              {prepChecks.hydration && <CheckCircle2 className="w-5 h-5" />}
                            </div>
                          </label>
                        </div>

                        {/* Ejercicio */}
                        <div className="bg-surface-container-high rounded-3xl p-6 border border-outline-variant/20 flex flex-col gap-4 hover:border-tertiary/30 transition-all group">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20 group-hover:scale-110 transition-transform">
                                <Dumbbell className="w-5 h-5" />
                              </div>
                              <h5 className="font-display font-bold text-on-surface text-lg">Evitar Ejercicio</h5>
                            </div>
                            {isOrderValidated && (
                              <span className="bg-secondary/10 text-secondary-fixed px-3 py-1 rounded-full font-mono font-bold text-[9px] flex items-center gap-1.5 border border-secondary/20 uppercase tracking-widest w-fit mt-1">
                                <Sparkles className="w-3 h-3" />
                                Confirmado por IA
                              </span>
                            )}
                          </div>
                          <p className="text-on-surface-variant text-sm leading-relaxed font-medium flex-grow">
                            {isOrderValidated ? `Validado con Orden Médica ${validatedOrderId}` : 'Absténgase de realizar ejercicio físico intenso durante las 24 horas previas al estudio para evitar alteraciones metabólicas.'}
                          </p>
                          <label className="flex items-center gap-3 cursor-pointer self-end">
                            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-widest">Revisado</span>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrepChecks(prev => ({ ...prev, exercise: !prev.exercise }));
                              }}
                              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                prepChecks.exercise 
                                  ? 'bg-secondary border-secondary text-on-secondary shadow-md shadow-secondary/10' 
                                  : 'border-outline-variant hover:border-primary/50'
                              }`}
                            >
                              {prepChecks.exercise && <CheckCircle2 className="w-5 h-5" />}
                            </div>
                          </label>
                        </div>

                        {/* Documentación */}
                        <div className="md:col-span-2 bg-surface-container-high/40 rounded-3xl p-8 border border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-6">
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-on-surface/10 flex items-center justify-center text-on-surface border border-outline-variant/20">
                                <IdCard className="w-6 h-6" />
                              </div>
                              <div>
                                <h5 className="font-display font-bold text-on-surface text-xl">Documentación Identidad</h5>
                                <p className="text-sm text-on-surface-variant opacity-70">
                                  {isOrderValidated ? `Validado con Orden Médica ${validatedOrderId}` : 'Es imprescindible presentar su DNI y la orden médica al presentarse.'}
                                </p>
                              </div>
                             </div>
                             {isOrderValidated && (
                              <span className="bg-secondary/10 text-secondary-fixed px-3 py-1 rounded-full font-mono font-bold text-[9px] flex items-center gap-1.5 border border-secondary/20 uppercase tracking-widest w-fit ml-18 mt-1">
                                <Sparkles className="w-3 h-3" />
                                Confirmado por IA
                              </span>
                             )}
                           </div>
                           <label className="flex items-center gap-4 cursor-pointer bg-surface-container p-4 rounded-2xl border border-outline-variant/20 shadow-sm hover:border-primary/30 transition-colors">
                            <span className="text-[10px] font-bold text-on-surface-variant font-mono uppercase tracking-widest">Preparado</span>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrepChecks(prev => ({ ...prev, docs: !prev.docs }));
                              }}
                              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                prepChecks.docs 
                                  ? 'bg-secondary border-secondary text-on-secondary shadow-md shadow-secondary/10' 
                                  : 'border-outline-variant hover:border-primary/50'
                              }`}
                            >
                              {prepChecks.docs && <CheckCircle2 className="w-5 h-5" />}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Final Confirmation Button */}
                      <div className="flex justify-center pt-4">
                        <button 
                          disabled={!allChecked}
                          className={`group flex items-center gap-4 px-12 py-5 rounded-full font-display font-bold text-base shadow-2xl transition-all active:scale-95 ${
                            allChecked 
                              ? 'bg-secondary text-on-secondary hover:brightness-110 shadow-secondary/30' 
                              : 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed border border-outline-variant/30'
                          }`}
                        >
                          <CheckCircle2 className={`w-6 h-6 transition-transform ${allChecked ? 'group-hover:scale-110' : ''}`} />
                          Confirmar Preparación Finalizada
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* TRIAGE HISTORY */}
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
              <h2 className="text-2xl font-display font-bold text-on-surface">Historial de Triajes</h2>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/30">
                {triages.length} Registros
              </span>
            </div>

            {triages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {triages.map((triage) => (
                  <motion.article
                    key={triage.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-surface-container rounded-[32px] p-8 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all relative overflow-hidden group shadow-sm flex flex-col gap-6"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                      triage.urgency === 'emergency' ? 'bg-error shadow-[0_0_20px_#ffb4ab]' :
                      triage.urgency === 'high' ? 'bg-tertiary shadow-[0_0_15px_#ffb4aa]' :
                      triage.urgency === 'medium' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex flex-col gap-1.5">
                          <time className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest block opacity-60">
                            {new Date(triage.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} • {new Date(triage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                          <h3 className="text-2xl font-display font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                            {triage.symptoms}
                          </h3>
                        </div>
                        <div className={`px-5 py-2 rounded-full text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-2 shrink-0 shadow-sm border ${
                          triage.urgency === 'emergency' ? 'bg-error/10 text-error border-error/20' :
                          triage.urgency === 'high' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                          triage.urgency === 'medium' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                        }`}>
                          {triage.urgency === 'emergency' && <AlertCircle className="w-3.5 h-3.5 animate-pulse" />}
                          {triage.urgency === 'emergency' ? 'EMERGENCIA' : 
                           triage.urgency === 'high' ? 'ALTA PRIORIDAD' : 
                           triage.urgency === 'medium' ? 'CONSULTA CLÍNICA' : 'OBSERVACIÓN'}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-on-surface/5 space-y-5">
                        <div className="flex flex-col gap-2 bg-surface-container-high/30 p-5 rounded-2xl border border-primary/5">
                          <span className="font-mono font-bold text-[10px] text-primary uppercase block tracking-widest">Protocolo Sugerido por IA:</span>
                          <p className="text-on-surface text-sm leading-relaxed font-sans italic font-medium">
                            "{triage.recommendation}"
                          </p>
                        </div>
                        
                        {triage.medication && (
                          <div className="flex items-center gap-4 bg-surface-container-high/50 p-4 rounded-2xl border border-outline-variant/10 shadow-inner">
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                              <Pill className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                               <span className="text-[10px] font-bold text-primary uppercase font-mono block tracking-wider">Tratamiento Recomendado</span>
                               <p className="text-sm font-bold text-on-surface">{triage.medication} {triage.dosage && `(${triage.dosage})`}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container-low rounded-[32px] border border-dashed border-outline-variant/30">
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Activity className="w-10 h-10 text-outline-variant/40 animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3 tracking-tight">Expediente Digital Vacío</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mb-10">
                  Realiza tu primer triaje inteligente para comenzar a construir tu pasaporte de salud global seguro.
                </p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'triage' }))}
                  className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-display font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Iniciar Evaluación IA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isScannerOpen && (
          <DocumentScanner 
            onClose={() => setIsScannerOpen(false)}
            onCapture={(data) => {
              console.log('Document Captured:', data);
              setIsOrderValidated(true);
              setValidatedOrderId('#SC-4582');
              // In a real app, we'd save this to Firestore
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
