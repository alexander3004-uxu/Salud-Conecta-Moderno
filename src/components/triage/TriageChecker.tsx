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
  ChevronDown
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
          ? 'No hemos podido procesar tu informe de síntomas automáticamente. Por favor, intenta describirlos con más detalle o consulta con un médico profesional para una evaluación segura.'
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
    <div className="flex-1 flex flex-col w-full max-w-[800px] mx-auto px-4 md:px-0 bg-background min-h-screen">
      {/* Status Banner / Context Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-6 mb-6 px-2"
      >
        {result ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-mono text-[10px] font-bold uppercase tracking-wider w-max shadow-sm border border-secondary/20">
                <CheckCircle2 className="w-3 h-3 fill-on-secondary-container" />
                {result.urgency === 'low' ? 'Condición Leve Identificada' : 
                 result.urgency === 'medium' ? 'Atención Clínica Sugerida' : 
                 result.urgency === 'high' ? 'Prioridad Alta Detectada' : 'Emergencia Crítica'}
              </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-on-surface-variant hover:text-error uppercase tracking-widest transition-colors font-mono hover:bg-error/5 rounded-lg"
                title="Reiniciar Triaje"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
              <button 
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors font-mono hover:bg-primary/5 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ir atrás
              </button>
            </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-on-surface">Diagnóstico IA</h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              Basado en su reporte, esta es la acción más segura y recomendada por nuestro motor de triaje.
            </p>
          </div>
        ) : (
          <div className="w-full bg-surface-container-lowest shadow-sm rounded-2xl p-4 flex items-center justify-between border border-outline-variant">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-secondary w-6 h-6" />
              <div>
                <h2 className="font-display font-bold text-on-surface text-sm">Evaluación en curso</h2>
                <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">Protocolo Realon™ IA Activo</p>
              </div>
            </div>
            <div className="bg-surface-container px-3 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-on-surface-variant">IA CONECTADA</span>
            </div>
            <button 
              onClick={handleReset}
              className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error/5"
              title="Reiniciar conversación"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-64 scrollbar-hide px-2">
        <div className="flex justify-center my-2">
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-mono text-[10px] font-bold shadow-sm border border-outline-variant uppercase tracking-widest">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
          <motion.div
            layout
            key={message.id}
            initial={{ opacity: 0, y: message.role === 'assistant' ? 20 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier "Out"
              opacity: { duration: 0.3 }
            }}
            className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex gap-3 max-w-[95%] ${message.role === 'user' ? 'flex-row-reverse' : 'items-end'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 border border-primary/20 shadow-sm overflow-hidden">
                   <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                   >
                    <Bot className="w-5 h-5 text-on-primary-container" />
                   </motion.div>
                </div>
              )}
              <div className={`p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-primary-container text-on-primary-container rounded-tr-none border border-primary/30 shadow-md w-fit self-end' 
                  : 'bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/50 shadow-sm w-full'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                
                {message.type === 'result' && result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
                    className="mt-6 flex flex-col gap-5 pt-6 border-t border-on-surface/10"
                  >
                    {/* Urgency Indicator - More Refined */}
                    <div className={`overflow-hidden rounded-[24px] border-2 ${getUrgencyColor(result.urgency)} shadow-lg`}>
                      <div className="px-5 py-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 font-mono mb-1">Prioridad de Atención</span>
                          <h3 className="text-2xl font-display font-black tracking-tighter">
                            {result.urgency === 'emergency' ? 'EMERGENCIA INMEDIATA' : 
                             result.urgency === 'high' ? 'URGENCIA MÉDICA' : 
                             result.urgency === 'medium' ? 'CONSULTA CLÍNICA' : 'CUIDADO EN CASA'}
                          </h3>
                        </div>
                        <div className="p-2 rounded-full border border-current/20">
                          <AlertTriangle className="w-6 h-6 animate-pulse" />
                        </div>
                      </div>
                      <div className="bg-current/10 px-5 py-3 border-t border-current/10">
                        <p className="text-[11px] font-medium leading-tight opacity-90 italic">
                          "Su condición requiere {result.urgency === 'emergency' ? 'atención hospitalaria inmediata' : 'seguimiento cuidadoso de las instrucciones que se detallan a continuación'}."
                        </p>
                      </div>
                    </div>
                    
                    {/* Integrated Diagnosis & Medication Card */}
                    <div className="bg-surface-container-lowest rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-outline-variant/30 overflow-hidden">
                       <div className="bg-primary/5 p-6 border-b border-outline-variant/20 flex flex-col gap-4">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">Plan Terapéutico IA</span>
                              <h3 className="text-xl font-display font-bold text-on-surface">
                                 {result.medication || 'Manejo de Síntomas'}
                              </h3>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 rotate-3">
                              <Pill className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          
                          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20">
                             <p className="text-xs text-on-surface-variant font-medium leading-relaxed italic">
                                "{result.recommendation}"
                             </p>
                             {result.medication && (
                               <motion.button 
                                 whileHover={{ scale: 1.01 }}
                                 whileTap={{ scale: 0.99 }}
                                 onClick={() => {
                                   window.dispatchEvent(new CustomEvent('medicationSearch', { detail: { medication: result.medication } }));
                                   window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }));
                                 }}
                                 className="mt-4 w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-secondary text-on-secondary rounded-2xl font-display font-bold text-[11px] uppercase tracking-[0.1em] shadow-[0_8px_20px_rgba(81,223,142,0.25)] hover:shadow-[0_12px_24px_rgba(81,223,142,0.35)] transition-all border border-secondary-container/20 group"
                               >
                                 <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                 Localizar {result.medication} en cercanías
                               </motion.button>
                             )}
                          </div>
                       </div>

                       {/* Detailed Analysis & Instructions - Collapsible */}
                       <div className="p-6 pt-0 space-y-4">
                          <button
                            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                            className="w-full flex items-center justify-between p-4 bg-surface-container-high/30 rounded-2xl border border-primary/10 hover:bg-surface-container-high/50 transition-all text-[10px] font-bold text-on-surface uppercase tracking-widest font-mono group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <span>{isDetailsExpanded ? 'Ocultar Detalles' : 'Ver Análisis y Cuidados'}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: isDetailsExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isDetailsExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-6 pt-2">
                                  {/* AI Reasoning Section */}
                                  <div className="bg-surface-container-low/50 rounded-2xl p-5 border border-outline-variant/10">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="p-1 bg-secondary/10 rounded-md">
                                        <Bot className="w-3.5 h-3.5 text-secondary" />
                                      </div>
                                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Análisis Detallado</span>
                                    </div>
                                    <p className="text-xs text-on-surface font-medium leading-relaxed">
                                      {result.reasoning}
                                    </p>
                                  </div>

                                  {/* Dosage & Timing Grid */}
                                  {result.medication && (
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 flex flex-col gap-1 shadow-sm">
                                          <div className="flex items-center gap-2 text-primary opacity-60 mb-1">
                                            <Droplets className="w-4 h-4" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Dosis</span>
                                          </div>
                                          <span className="text-sm font-bold text-on-surface">{result.dosage || 'Sujeto a peso/edad'}</span>
                                       </div>
                                       <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 flex flex-col gap-1 shadow-sm">
                                          <div className="flex items-center gap-2 text-primary opacity-60 mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Frecuencia</span>
                                          </div>
                                          <span className="text-sm font-bold text-on-surface">{result.frequency || 'Cada 8 horas'}</span>
                                       </div>
                                    </div>
                                  )}

                                  {/* Detailed Instructions */}
                                  {result.instructions && (
                                    <div className="bg-surface-container-high/20 rounded-2xl p-5 border border-primary/5 relative">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="p-1 bg-primary/20 rounded-md">
                                          <Stethoscope className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Guía de Cuidados</span>
                                      </div>
                                      <p className="text-xs text-on-surface-variant font-medium leading-relaxed pl-3 border-l-2 border-primary/30">
                                        {result.instructions}
                                      </p>
                                      <div className="mt-4 flex items-center gap-2 p-2.5 bg-on-surface/5 rounded-xl border border-on-surface/5">
                                        <Calendar className="w-4 h-4 text-primary opacity-60" />
                                        <span className="text-[10px] font-bold text-on-surface-variant">Duración Sugerida: <span className="text-on-surface">{result.duration || 'Hasta remisión de síntomas'}</span></span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>

                       <div className="p-6 bg-surface-container-highest/20 border-t border-outline-variant/20 flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                             <button
                               onClick={() => {
                                 if (result.medication) {
                                   window.dispatchEvent(new CustomEvent('medicationSearch', { detail: { medication: result.medication } }));
                                 }
                                 window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }));
                               }}
                               className="flex-1 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                             >
                               <Search className="w-4 h-4" />
                               Buscar en Farmacias
                             </button>
                             <button
                               className="flex-1 h-11 bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-surface-container transition-all"
                             >
                               <Headphones className="w-4 h-4" />
                               Teleconsulta IA
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: isSaving || !result ? 1 : 1.02 }}
                        whileTap={{ scale: isSaving || !result ? 1 : 0.98 }}
                        onClick={handleSaveToHistory}
                        disabled={isSaving || !result}
                        className="w-full h-12 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-secondary/20 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                      >
                        {isSaving ? (
                          <Activity className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        )}
                        {isSaving ? 'Guardando...' : 'Guardar en Historial'}
                      </motion.button>

                      <button
                        onClick={handleGoBack}
                        disabled={isSaving}
                        className="w-full h-12 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Ir atrás
                      </button>
                    </div>

                    {/* Safety Alert - More Stylized */}
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-error-container/10 rounded-3xl p-5 border border-error/20 flex items-start gap-4 shadow-sm"
                    >
                      <div className="bg-error/10 p-2 rounded-xl border border-error/20 shrink-0">
                        <AlertTriangle className="w-5 h-5 text-error" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-[10px] font-bold text-error uppercase tracking-widest font-mono">Seguridad Médica Obligatoria</h4>
                        <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed opacity-80">
                          Esta sugerencia es <span className="text-error font-bold">orientativa</span>. No suplante el juicio de un profesional. Ante taquicardia, falta de aire o dolor agudo, llame emergencias.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="flex items-end gap-3 max-w-[80%] self-start"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="bg-surface-container-high px-4 py-3 rounded-2xl rounded-tl-none border border-outline-variant/30 shadow-sm flex items-center gap-1.5">
                <motion.span 
                  animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 bg-primary rounded-full" 
                />
                <motion.span 
                  animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-primary rounded-full" 
                />
                <motion.span 
                  animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-primary rounded-full" 
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-primary/60 uppercase tracking-widest ml-1">
                Realon™ IA Analizando
              </span>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[800px] px-4 md:px-0 z-40">
        <div className="bg-surface-container/95 backdrop-blur-xl rounded-2xl p-4 border border-outline-variant shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {['Dolor de cabeza', 'Fiebre', 'Náuseas', 'Mareos', 'Tos'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-xs font-bold hover:border-primary transition-all text-on-surface-variant hover:text-primary shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escriba un síntoma..."
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-medium transition-all shadow-inner"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
               onClick={() => {
                 if (result) {
                    if (result.urgency === 'emergency') {
                      window.dispatchEvent(new CustomEvent('emergencyMode', { detail: result }));
                    }
                    window.dispatchEvent(new CustomEvent('changeTab', { detail: 'map' }));
                 } else {
                    handleSend('Finalizar evaluación');
                 }
               }}
               className={`w-full h-12 font-display font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all border group ${
                 result?.urgency === 'emergency' 
                   ? 'bg-error text-on-error border-error shadow-error/30 animate-pulse' 
                   : 'bg-primary text-on-primary border-primary/50 hover:bg-primary-container'
               }`}
            >
               <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               {result 
                 ? result.urgency === 'emergency' ? 'Ver centros de urgencia' : 'Ver centros cercanos' 
                 : 'Finalizar y ver diagnóstico'}
            </button>
          </div>
          
          <p className="text-[9px] text-center text-on-surface-variant mt-3 uppercase tracking-widest font-mono font-bold flex items-center justify-center gap-2 opacity-60">
            <AlertTriangle className="w-3 h-3 text-tertiary-container" />
            Solo informativo • Llama al 911 en emergencias reales
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%', transition: { duration: 0.2 } }}
            className="fixed bottom-[240px] left-1/2 z-[100] min-w-[280px]"
          >
            <div className={`backdrop-blur-md border rounded-2xl p-4 shadow-2xl flex items-center gap-3 ${
              toastType === 'success' 
                ? 'bg-surface-bright/95 border-secondary/30' 
                : 'bg-error-container/20 border-error/30'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                toastType === 'success' 
                  ? 'bg-secondary/10 border-secondary/30' 
                  : 'bg-error/10 border-error/30'
              }`}>
                {toastType === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-error" />
                )}
              </div>
              <p className={`text-xs font-bold ${
                toastType === 'success' ? 'text-on-surface' : 'text-error'
              }`}>{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

