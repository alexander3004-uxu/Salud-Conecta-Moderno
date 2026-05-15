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
  Mic
} from 'lucide-react';
import { getSmartTriage } from '../../lib/gemini';
import { useUser } from '../../contexts/UserContext';
import { auth } from '../../lib/firebase';
import { saveTriageRecord } from '../../services/triageService';

interface TriageResult {
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendation: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  reasoning: string;
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
      content: 'Hola. Soy su asistente de triaje inteligente. Mi misión es ayudarle a encontrar la mejor atención disponible, priorizando la Red Pública (MINSA) si tiene recursos limitados. ¿Qué síntoma principal lo trae hoy aquí?',
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

    try {
      const triageResult = await getSmartTriage(text, membership);
      
      if (!triageResult.error) {
        setResult(triageResult);
        
        if (triageResult.urgency === 'emergency') {
          window.dispatchEvent(new CustomEvent('emergencyMode', { 
            detail: triageResult 
          }));
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: triageResult.error 
          ? (triageResult.recommendation || 'No hemos podido procesar tu informe de síntomas automáticamente. Por favor, consulta con un médico profesional.')
          : (triageResult.urgency === 'emergency' 
            ? 'He analizado sus síntomas y mi evaluación indica una posible EMERGENCIA MÉDICA.' 
            : 'He completado su evaluación de salud. A continuación le presento mi análisis y las recomendaciones sugeridas.'),
        timestamp: new Date(),
        type: triageResult.error ? 'text' : 'result'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Lo sentimos, tuvimos un problema al procesar tu solicitud. Por favor, intenta de nuevo describiendo tus síntomas o consulta con un profesional de la salud si te sientes mal.',
        timestamp: new Date()
      }]);
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
        content: 'Hola. Soy su asistente de triaje inteligente. Puedo analizar sus síntomas para darle una recomendación de salud, sugerir medicación básica y localizar el centro médico más cercano según su urgencia. ¿Qué síntoma principal lo trae hoy aquí?',
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
        urgency: result.urgency,
        recommendation: result.recommendation,
        medication: result.medication,
        dosage: result.dosage,
        frequency: result.frequency,
        duration: result.duration,
        instructions: result.instructions
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-alert-red bg-alert-red/10 border-alert-red/20';
      case 'high': return 'text-tertiary-container bg-tertiary-container/10 border-tertiary-container/20';
      case 'medium': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-hospital-green bg-hospital-green/10 border-hospital-green/20';
    }
  };

  return (
    <div className="flex-1 w-full bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] relative">
          
          <div className="flex-1 flex flex-col min-w-0 bg-surface-container-low/30 rounded-[32px] border border-outline-variant/20 overflow-hidden backdrop-blur-sm shadow-inner relative">
            <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container/50 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm overflow-hidden">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-on-surface text-base">Asistente Realon™</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-hospital-green animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">En línea • Triaje Activo</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2.5 text-on-surface-variant hover:text-error transition-all rounded-xl hover:bg-error/10 border border-transparent hover:border-error/20"
                  title="Reiniciar conversación"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-8 scroll-smooth pb-40">
              <div className="flex justify-center mb-4">
                <span className="bg-surface-container-high/50 text-on-surface-variant px-4 py-1.5 rounded-full font-mono text-[10px] font-bold border border-outline-variant/30 uppercase tracking-[0.2em] shadow-sm">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    layout
                    key={message.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'items-start'}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                        message.role === 'user' 
                          ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                          : 'bg-primary/10 border-primary/20 text-primary'
                      }`}>
                        {message.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className={`px-5 py-3.5 rounded-[24px] shadow-sm ${
                          message.role === 'user' 
                            ? 'bg-primary text-on-primary rounded-tr-none border border-primary/20' 
                            : 'bg-surface-container-highest/80 text-on-surface rounded-tl-none border border-outline-variant/30'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-widest px-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className="lg:hidden">
                          {message.type === 'result' && result && renderAnalysisBoard()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-4 self-start"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-surface-container-highest/50 px-5 py-3 rounded-[24px] rounded-tl-none border border-outline-variant/30 flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span 
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 bg-primary rounded-full" 
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface-container-low to-transparent shrink-0 z-20">
              <div className="w-full bg-surface-container/95 backdrop-blur-xl rounded-[28px] p-2 border border-outline-variant/50 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all focus-within:border-primary/50 focus-within:shadow-[0_12px_48px_rgba(46,144,250,0.2)]">
                <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide px-2 pt-2">
                  {['Dolor de cabeza', 'Fiebre', 'Náuseas', 'Mareos', 'Tos'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="whitespace-nowrap px-4 py-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low text-[10px] font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all text-on-surface-variant shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 px-2 pb-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={isListening ? "Escuchando..." : "Describe tus síntomas detalladamente..."}
                      className={`w-full h-12 pl-4 pr-24 rounded-2xl bg-surface-container-lowest/50 border transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 ${
                        isListening 
                          ? 'border-error/50 ring-error/30 bg-error/5 animate-pulse' 
                          : 'border-outline-variant/20 focus:ring-primary/30'
                      }`}
                    />
                    <div className="absolute right-1.5 top-1.5 flex items-center gap-1.5">
                      <button
                        onClick={toggleListening}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isListening 
                            ? 'bg-error text-on-error shadow-[0_0_15px_rgba(240,68,56,0.4)] animate-pulse' 
                            : 'bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/20'
                        }`}
                        title="Búsqueda por voz"
                      >
                        <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                        className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {result && (
                     <button
                      onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }))}
                      className="h-12 px-5 rounded-2xl bg-secondary text-on-secondary flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all shrink-0"
                    >
                      <MapIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Ver Centros</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[9px] text-center text-on-surface-variant/40 mt-3 uppercase tracking-[0.2em] font-mono font-bold">
                Uso informativo • En emergencias llame al 911
              </p>
            </div>
          </div>

          {/* Right Column: Live Analysis Board (Desktop Only) */}
          <div className="hidden lg:flex w-[420px] flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6">
            {result ? (
              renderAnalysisBoard()
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-container-low/30 rounded-[32px] border border-outline-variant/10 border-dashed">
                <div className="w-20 h-20 rounded-full bg-surface-container-high/50 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
                  <Activity className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-xl font-display font-bold text-on-surface-variant mb-2 text-center">Esperando Reporte</h3>
                <p className="text-sm text-on-surface-variant/60 text-center leading-relaxed">
                  Describe tus síntomas en el chat para activar el motor de triaje inteligente Realon™ IA.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                  {[
                    { icon: Stethoscope, label: 'Diagnóstico' },
                    { icon: Pill, label: 'Medicación' },
                    { icon: Clock, label: 'Dosis' },
                    { icon: Store, label: 'Farmacias' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center p-4 bg-surface-container-high/20 rounded-2xl border border-outline-variant/10 opacity-40">
                      <item.icon className="w-5 h-5 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tips / Info Section */}
            <div className="p-6 bg-primary-container/10 rounded-[28px] border border-primary/20">
               <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4" />
                 ¿Cómo funciona?
               </h4>
               <ul className="space-y-4">
                 {[
                   'Análisis por Redes Neuronales Médicas',
                   'Priorización según Red Pública (MINSA)',
                   'Sugerencia de medicación básica aprobada',
                   'Localización en tiempo real de stock'
                 ].map((tip, i) => (
                   <li key={i} className="flex items-start gap-3 text-[11px] text-on-surface-variant font-medium leading-tight">
                     <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] min-w-[320px]"
          >
            <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-center gap-4 ${
              toastType === 'success' 
                ? 'bg-surface-bright/95 border-secondary/30' 
                : 'bg-error-container/20 border-error/30'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                toastType === 'success' 
                  ? 'bg-secondary/10 border-secondary/30' 
                  : 'bg-error/10 border-error/30'
              }`}>
                {toastType === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-error" />
                )}
              </div>
              <p className="text-xs font-bold text-on-surface">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Helper to render the Analysis Board (used in both columns depending on screen size)
  function renderAnalysisBoard() {
    if (!result) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* Urgency Card */}
        <div className={`overflow-hidden rounded-[28px] border-2 ${getUrgencyColor(result.urgency)} shadow-2xl relative`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-24 h-24 rotate-12" />
          </div>
          <div className="px-6 py-5 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 font-mono mb-2 block">Estado de Triaje</span>
            <h3 className="text-2xl font-display font-black tracking-tighter mb-1">
              {result.urgency === 'emergency' ? 'EMERGENCIA CRÍTICA' : 
               result.urgency === 'high' ? 'URGENCIA MÉDICA' : 
               result.urgency === 'medium' ? 'CONSULTA CLÍNICA' : 'AUTOCUIDADO'}
            </h3>
            <p className="text-[11px] font-medium leading-relaxed opacity-90 max-w-[90%]">
              {result.urgency === 'emergency' ? 'Requiere atención inmediata en el hospital más cercano.' : 'Siga las recomendaciones de cuidado y monitoree sus síntomas.'}
            </p>
          </div>
          <div className="bg-current/10 px-6 py-3 border-t border-current/10 backdrop-blur-md flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Protocolo Realon™ IA</span>
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {/* Diagnostic Details */}
        <div className="bg-surface-container-high/40 backdrop-blur-sm rounded-[32px] border border-outline-variant/30 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono mb-1">Análisis Clínico</span>
              <h4 className="text-lg font-display font-bold text-on-surface">Detalles del Cuadro</h4>
            </div>
            <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h5 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-secondary" />
                Razonamiento IA
              </h5>
              <div className="bg-surface-container-lowest/50 p-4 rounded-2xl border border-outline-variant/10">
                <p className="text-xs text-on-surface font-medium leading-relaxed italic">
                  "{result.reasoning}"
                </p>
              </div>
            </div>

            {result.medication && (
              <div className="space-y-4">
                <h5 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <Pill className="w-3.5 h-3.5 text-primary" />
                  Manejo sugerido
                </h5>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <span className="text-sm font-bold text-primary block mb-2">{result.medication}</span>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/10">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase block mb-1">Dosis</span>
                      <span className="text-[11px] font-bold">{result.dosage || 'Sujeto a peso'}</span>
                    </div>
                    <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/10">
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase block mb-1">Frecuencia</span>
                      <span className="text-[11px] font-bold">{result.frequency || 'Cada 8h'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.instructions && (
              <div className="p-4 bg-hospital-green/5 rounded-2xl border border-hospital-green/20">
                <div className="flex items-center gap-2 mb-2 text-hospital-green">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Instrucciones Críticas</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {result.instructions}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-surface-container-highest/30 border-t border-outline-variant/20 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (result.medication) {
                  window.dispatchEvent(new CustomEvent('medicationSearch', { detail: { medication: result.medication } }));
                }
                window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }));
              }}
              className="h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Search className="w-4 h-4" />
              Stock
            </button>
            <button
              onClick={handleSaveToHistory}
              disabled={isSaving}
              className="h-11 bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>

        {/* Safety Footer */}
        <div className="bg-error-container/10 rounded-2xl p-4 border border-error/20 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-error shrink-0" />
          <p className="text-[10px] font-medium text-on-surface-variant leading-snug">
            Esta evaluación es generada por IA. No sustituye el diagnóstico médico profesional. En caso de síntomas graves, busque atención médica de inmediato.
          </p>
        </div>
      </motion.div>
    );
  }
}
