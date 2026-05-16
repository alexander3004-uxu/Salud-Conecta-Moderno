import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Stethoscope, 
  AlertTriangle, 
  Pill, 
  ArrowRight,
  ArrowLeft, 
  RotateCcw,
  Save, 
  Send,
  Bot,
  User as UserIcon,
  CheckCircle2,
  FileText,
  Clock,
  Calendar,
  Droplets,
  Store,
  Headphones,
  Search,
  Map as MapIcon,
  Zap,
  ChevronDown,
  Mic,
  MapPin,
  Compass,
  Navigation,
  Loader2
} from 'lucide-react';
import { getEnhancedTriageWithLocation } from '../../services/triageService';
import { useUser } from '../../contexts/UserContext';
import { auth } from '../../lib/firebase';
import { saveTriageRecord } from '../../services/triageService';

interface TriageResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  reasoning: string;
  medication?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
  locationInfo?: {
    nearestFacility: string;
    distanceKm: number;
    travelTime: string;
    isEmergency: boolean;
  };
  error?: boolean;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  chips?: string[];
  type?: 'text' | 'result' | 'typing';
}

export default function TriageChecker() {
  const { membership } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola. Soy su asistente de triaje inteligente. ¡Ahora puedo ayudarle a encontrar el centro de salud más cercano según su ubicación actual! Mi misión es guiarle hacia la mejor atención disponible, priorizando la Red Pública (MINSA) si tiene recursos limitados. Para dar la mejor recomendación, por favor permita el acceso a su ubicación. ¿Qué síntoma principal lo trae hoy aquí?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setResult(null);
    setIsTyping(true);
    setLocationStatus('loading');

    try {
      const triageResult = await getEnhancedTriageWithLocation(text, membership);
      
      if (!triageResult.error) {
        setResult(triageResult);
        
        if (triageResult.locationInfo?.isEmergency) {
          window.dispatchEvent(new CustomEvent('emergencyMode', { 
            detail: triageResult
          }));
        }
        
        setLocationStatus('success');
      }
    } catch (error) {
      console.error(error);
      setLocationStatus('error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleGoBack = () => {
    if (result) {
      setResult(null);
      setIsDetailsExpanded(false);
    } else {
      window.dispatchEvent(new CustomEvent('changeTab', { detail: 'home' }));
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToastMessage("Tu navegador no soporta búsqueda por voz.");
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hola. Soy su asistente de triaje inteligente. ¡Ahora con integración de geolocalización! Puedo analizar sus síntomas y encontrar el centro de salud más cercano. ¿Qué síntoma principal lo trae hoy aquí?',
        timestamp: new Date(),
      }
    ]);
    setResult(null);
    setInput('');
    setIsDetailsExpanded(false);
  };

  const handleSaveToHistory = async () => {
    if (!auth.currentUser || !result) return;
    setIsSaving(true);
    try {
      await saveTriageRecord({
        userId: auth.currentUser.uid,
        symptoms: messages.filter(m => m.role === 'user').map(m => m.content).join(' | '),
        urgency: result.severity,
        recommendation: result.recommendation,
        medication: result.medication?.name,
        dosage: result.medication?.dosage,
        frequency: result.medication?.frequency,
        duration: result.medication?.duration,
        instructions: ''
      });
      setToastMessage('Triaje guardado en tu historial de salud.');
      setToastType('success');
      setShowToast(true);
    } catch (e) {
      console.error(e);
      setToastMessage('Error al guardar el triaje. Intente de nuevo.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const getUrgencyColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-alert-red bg-alert-red/10 border-alert-red/20';
      case 'high': return 'text-tertiary-container bg-tertiary-container/10 border-tertiary-container/20';
      case 'medium': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-hospital-green bg-hospital-green/10 border-hospital-green/20';
    }
  };

  return (
    <div className="flex-1 w-full bg-background flex flex-col font-sans">
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col px-0 sm:px-4 md:px-6 sm:py-6">
        <div className="flex-1 flex flex-col lg:flex-row gap-0 lg:gap-8 relative overflow-hidden">
          
          {/* Left Side: Chat Interface */}
          <div className="flex-1 flex flex-col bg-surface-container-low/30 lg:rounded-[32px] border-x lg:border border-outline-variant/10 relative overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                        message.role === 'assistant' 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant'
                      }`}>
                        {message.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className={`px-5 py-3.5 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-sm ${
                          message.role === 'assistant'
                            ? 'bg-surface-container-low text-on-surface border border-outline-variant/20 rounded-tl-none whitespace-pre-wrap'
                            : 'bg-primary text-on-primary rounded-tr-none'
                        }`}>
                          {message.content}
                        </div>
                        
                        {/* Renderizar Chips de sugerencia */}
                        {message.role === 'assistant' && message.chips && messages.indexOf(message) === messages.length - 1 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.chips.map((chip) => (
                              <button
                                key={chip}
                                onClick={() => handleSend(chip)}
                                className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className={`text-[9px] font-bold text-on-surface-variant/40 px-1 uppercase tracking-wider ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-surface-container-low px-5 py-4 rounded-2xl rounded-tl-none border border-outline-variant/20 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest ml-2">Analizando...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-6 bg-surface-container-low border-t border-outline-variant/10">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe tus síntomas o dudas..."
                    disabled={isTyping}
                    className="w-full h-14 md:h-16 bg-surface-container rounded-2xl pl-6 pr-14 text-sm md:text-base text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/10 transition-all disabled:opacity-50"
                  />
                  <button 
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
                      isListening ? 'bg-error text-on-error animate-pulse' : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    <Mic size={20} />
                  </button>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-14 h-14 md:w-16 md:h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale shrink-0"
                >
                  <Send size={22} className={isTyping ? 'animate-pulse' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Result Summary / Proximity (Desktop) */}
          <div className="hidden lg:flex w-[400px] flex-col gap-6">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface-container-low border border-outline-variant/20 rounded-[32px] overflow-hidden flex flex-col shadow-xl"
              >
                <div className={`p-6 flex items-center gap-4 ${getUrgencyColor(result.severity)} border-b border-outline-variant/10`}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">Resultado de Triaje</h3>
                    <p className="text-sm font-bold opacity-80">Nivel de Urgencia: {result.severity.toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto scrollbar-none">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Stethoscope size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Recomendación</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-on-surface">
                      {result.recommendation}
                    </p>
                  </div>

                  {result.locationInfo && (
                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <Navigation size={18} />
                          <span className="text-xs font-black uppercase tracking-widest">Centro Cercano</span>
                        </div>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg border border-primary/20">
                          {result.locationInfo.distanceKm.toFixed(1)} KM
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-display font-black text-on-surface">{result.locationInfo.nearestFacility}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant">
                            <Clock size={14} className="text-primary/60" /> {result.locationInfo.travelTime}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-outline-variant" />
                          <div className="text-[11px] font-bold text-hospital-green">Disponible</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }))}
                        className="w-full h-12 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                      >
                        Ver en Mapa de Salud
                      </button>
                    </div>
                  )}

                  {result.medication && (
                    <div className="space-y-3 p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
                      <div className="flex items-center gap-2 text-secondary">
                        <Pill size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Medicamento</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">Nombre</span>
                          <span className="text-sm font-bold text-on-surface">{result.medication.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">Dosis</span>
                          <span className="text-sm font-bold text-on-surface">{result.medication.dosage}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-surface-container border-t border-outline-variant/10 flex gap-3">
                  <button 
                    onClick={handleSaveToHistory}
                    disabled={isSaving}
                    className="flex-1 h-12 bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-outline-variant/20 transition-all"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Guardar
                  </button>
                  <button 
                    onClick={handleReset}
                    className="flex-1 h-12 bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-outline-variant/20 transition-all"
                  >
                    <RotateCcw size={16} />
                    Reiniciar
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 border border-dashed border-outline-variant/30 rounded-[32px] flex flex-col items-center justify-center p-12 text-center opacity-50">
                <Bot size={48} className="text-primary/20 mb-4" />
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Esperando análisis</h3>
                <p className="text-xs text-on-surface-variant mt-2">Introduce tus síntomas para obtener una evaluación personalizada y encontrar el centro más cercano.</p>
              </div>
            )}
          </div>

          {/* Mobile Overlay for Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="lg:hidden fixed inset-x-0 bottom-0 z-[60] p-4 bg-gradient-to-t from-background via-background to-transparent pt-20 pointer-events-none"
              >
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-t-[40px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col pointer-events-auto">
                  <div className="flex justify-center py-3 border-b border-outline-variant/10">
                    <div className="w-12 h-1 bg-outline-variant/30 rounded-full" />
                  </div>
                  <div className="overflow-y-auto p-6 space-y-8">
                    <div className={`p-4 rounded-2xl ${getUrgencyColor(result.severity)} flex items-center gap-3`}>
                      <AlertTriangle size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">URGENCIA {result.severity.toUpperCase()}</span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-display font-black text-on-surface">{result.recommendation}</h4>
                      {result.locationInfo && (
                        <div className="p-5 bg-primary/10 rounded-[28px] border border-primary/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Centro Sugerido</span>
                            <span className="text-sm font-display font-black text-primary">{result.locationInfo.distanceKm.toFixed(1)} km</span>
                          </div>
                          <h5 className="text-xl font-display font-black text-on-surface leading-tight">{result.locationInfo.nearestFacility}</h5>
                          <p className="text-xs font-bold text-on-surface-variant opacity-70">Tiempo de viaje: {result.locationInfo.travelTime}</p>
                          <button 
                             onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }))}
                             className="w-full h-14 bg-primary text-on-primary rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30 flex items-center justify-center gap-3"
                          >
                            <Navigation size={18} /> Abrir Mapa de Salud
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 pb-4">
                      <button onClick={handleSaveToHistory} className="flex-1 h-14 bg-surface-container-highest rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface flex items-center justify-center gap-2">
                        <Save size={16} /> Guardar
                      </button>
                      <button onClick={handleReset} className="flex-1 h-14 bg-surface-container-highest rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface flex items-center justify-center gap-2">
                        <RotateCcw size={16} /> Nuevo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-24 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
              toastType === 'success' 
                ? 'bg-hospital-green/20 border-hospital-green/30 text-hospital-green' 
                : 'bg-error/20 border-error/30 text-error'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span className="text-xs font-black uppercase tracking-widest">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}