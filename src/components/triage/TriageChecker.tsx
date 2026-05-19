import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Send, 
  RotateCcw, 
  Save, 
  MapPin, 
  Compass, 
  Zap,
  Bot,
  User,
  Loader2,
  AlertTriangle,
  Pill,
  Clock,
  Mic,
  CheckCircle2,
  HeartPulse
} from 'lucide-react';
import { getEnhancedTriageWithLocation } from '../../services/triageService';
import { saveTriageRecord } from '../../services/triageService';
import { useUser } from '../../contexts/UserContext';
import { auth } from '../../lib/firebase';
import { TriageWithLocationResult } from '../../services/triageService';

interface Message { 
  id: string; 
  role: 'assistant' | 'user'; 
  content: string; 
  timestamp: Date; 
}

export default function TriageChecker() {
  const { membership } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hola. Soy su asistente de triaje inteligente con geolocalización. Analizaré sus síntomas para guiarle al centro de salud público (MINSA) o privado más cercano según su ubicación. ¿Qué síntoma o molestia principal siente hoy?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [triageResult, setTriageResult] = useState<TriageWithLocationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: text, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTriageResult(null);
    setIsTyping(true);

    try {
      const result = await getEnhancedTriageWithLocation(text, membership);
      
      setTriageResult(result);
      
      // Agregar la respuesta de la IA al historial del chat para mantener el flujo conversacional
      const assistantResponse = result.error
        ? `He calculado su evaluación preliminar usando nuestro sistema de respaldo local debido a contingencia en el servidor:\n\n**Recomendación:** ${result.recommendation}\n\n**Justificación:** ${result.reasoning}`
        : `He analizado sus síntomas. Aquí está mi evaluación preliminar:\n\n**Recomendación:** ${result.recommendation}\n\n**Justificación clínica:** ${result.reasoning}`;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      }]);

      if (result.error) {
        triggerToast("Cálculo realizado con contingencia local (GPS y Centros).", "error");
      } else if (result.severity === 'emergency') {
        window.dispatchEvent(new CustomEvent('emergencyMode', { 
          detail: result 
        }));
        triggerToast("¡Síntoma de urgencia detectado! Mantenga la calma.", "error");
      } else {
        triggerToast("Evaluación de triaje completada con éxito.", "success");
      }
    } catch (e) { 
      console.error(e); 
      triggerToast("Error de conexión. Intente de nuevo.", "error");
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => { 
    setMessages([
      { 
        id: '1', 
        role: 'assistant', 
        content: 'Hola. He reiniciado la consulta de triaje. ¿Qué síntoma o malestar siente hoy?', 
        timestamp: new Date() 
      }
    ]); 
    setTriageResult(null); 
    setInput(''); 
  };

  const handleSave = async () => {
    if (!auth.currentUser || !triageResult) {
      triggerToast("Inicia sesión para guardar tu historial médico.", "error");
      return;
    }
    setIsSaving(true);
    const symptomsText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' | ');

    try {
      await saveTriageRecord({ 
        userId: auth.currentUser.uid, 
        symptoms: symptomsText || 'Consulta de síntomas', 
        urgency: triageResult.severity, 
        recommendation: triageResult.recommendation, 
        medication: triageResult.medication?.name || '', 
        dosage: triageResult.medication?.dosage || '', 
        frequency: triageResult.medication?.frequency || '', 
        duration: triageResult.medication?.duration || '', 
        instructions: triageResult.reasoning || '' 
      });
      triggerToast("Triaje guardado exitosamente en tu historial clínico.", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Error al guardar en el servidor Firestore.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewOnMap = (clinicToNavigate?: Clinic) => {
    const targetClinic = clinicToNavigate || triageResult?.locationInfo?.clinic;
    if (!targetClinic?.location) {
      triggerToast("No hay información de ubicación disponible.", "error");
      return;
    }

    const { userLat, userLng } = triageResult?.locationInfo || {};
    const destLat = targetClinic.location.lat;
    const destLng = targetClinic.location.lng;
    const originLat = userLat || 11.93749;
    const originLng = userLng || -85.968;

    const universalUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

    window.open(universalUrl, '_blank');
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("Tu navegador no soporta búsqueda por voz.", "error");
      return;
    }
    
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      triggerToast("Escuchando... Habla ahora", "success");
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

  const getSeverityBadgeStyles = (severity: string) => {
    switch (severity) {
      case 'emergency': 
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'high': 
        return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
      case 'medium': 
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default: 
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col font-sans relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
              toastType === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-500/15 border-red-500/35 text-red-600 dark:text-red-400'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1300px] mx-auto w-full flex-1 flex flex-col p-4 md:p-6 lg:p-8 relative">
        
        {/* Header Block */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-4 mb-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                Triaje Médico con Inteligencia Artificial
              </span>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                Interoperable • Georeferenciado ({membership.toUpperCase()})
              </p>
            </div>
          </div>
          {triageResult && (
            <button 
              onClick={handleReset}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Reiniciar consulta"
            >
              <RotateCcw className="w-4 h-4"/>
            </button>
          )}
        </div>

        {/* Core Layout Grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 relative overflow-hidden min-h-0">
          
          {/* Left Column: Conversational Chat */}
          <div className="flex-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative min-h-[450px]">
            
            {/* Chat message space */}
            <div className="flex-grow overflow-y-auto p-5 md:p-6 space-y-5 scrollbar-none">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm ${
                      m.role === 'assistant' 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' 
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`px-4.5 py-3 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                        m.role === 'assistant'
                          ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800 rounded-tl-none'
                          : 'bg-blue-500 text-white border-blue-600 rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 px-1 uppercase tracking-wider self-end mt-0.5">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loader "Thinking..." Bubble */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                        <Bot size={16} className="animate-pulse" />
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-2 animate-pulse">Analizando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <div className="p-4 md:p-5 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 shrink-0">
              <div className="flex gap-2 max-w-3xl mx-auto items-center">
                <div className="flex-1 relative">
                  <input 
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs md:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 transition-all disabled:opacity-50" 
                    placeholder="Escribe tus síntomas aquí (ej: dolor de garganta y fiebre)..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={isTyping}
                  />
                  <button 
                    onClick={toggleListening}
                    disabled={isTyping}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Diagnostic Result and Actions (Desktop) */}
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6">
            {triageResult ? (
              <motion.div 
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-lg flex-1 min-h-[450px]"
              >
                {/* Result header showing severity */}
                <div className={`p-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 ${getSeverityBadgeStyles(triageResult.severity)}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Resultado Clínico</span>
                    <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      Severidad: {triageResult.severity}
                      {triageResult.error && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500 text-white font-black uppercase tracking-wider shrink-0 animate-pulse">
                          Respaldo
                        </span>
                      )}
                    </h4>
                  </div>
                  {triageResult.severity === 'emergency' && (
                    <Zap className="w-5 h-5 text-red-500 ml-auto animate-bounce shrink-0" />
                  )}
                </div>

                {/* Body scroll */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none">
                  
                  {/* AI Recommendation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <Bot size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Recomendación IA</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {triageResult.recommendation}
                    </p>
                  </div>

                  {/* Clinical Reasoning */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <AlertTriangle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Justificación Médica</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1 whitespace-pre-wrap">
                      {triageResult.reasoning}
                    </p>
                  </div>

                  {/* Over-the-counter Medication if suggested */}
                  {triageResult.medication?.name && (
                    <div className="space-y-2 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Pill size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sugerencia Farmacéutica (Venta Libre)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1.5">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Medicamento</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{triageResult.medication.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Dosis</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{triageResult.medication.dosage}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Toma</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{triageResult.medication.frequency} • {triageResult.medication.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proximity facility geolocation cards */}
                  {triageResult.locationInfo && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        Centros Asistenciales Recomendados 📍
                      </div>
                      
                      {/* Nearest Hospital Card */}
                      {triageResult.locationInfo.closestHospital && (
                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-red-505 dark:text-red-400">
                              <MapPin size={16} className="text-red-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Hospital Más Cercano</span>
                            </div>
                            <span className="text-[9px] font-black bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-lg border border-red-500/20">
                              {triageResult.locationInfo.closestHospitalDistanceKm?.toFixed(1)} KM
                            </span>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                              {triageResult.locationInfo.closestHospital.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                <Clock size={12} className="text-red-500" /> {triageResult.locationInfo.closestHospitalTravelTime}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Urgencias 24h</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewOnMap(triageResult.locationInfo?.closestHospital)}
                            className="w-full h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/20"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            Ruta al Hospital en Google Maps
                          </button>
                        </div>
                      )}

                      {/* Nearest Health Center Card */}
                      {triageResult.locationInfo.closestCenter && (
                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-blue-505 dark:text-blue-400">
                              <MapPin size={16} className="text-blue-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Centro de Salud Más Cercano</span>
                            </div>
                            <span className="text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg border border-blue-500/20">
                              {triageResult.locationInfo.closestCenterDistanceKm?.toFixed(1)} KM
                            </span>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                              {triageResult.locationInfo.closestCenter.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                <Clock size={12} className="text-blue-500" /> {triageResult.locationInfo.closestCenterTravelTime}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Disponible</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewOnMap(triageResult.locationInfo?.closestCenter)}
                            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            Ruta al Centro en Google Maps
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Bottom Card Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex gap-2 shrink-0">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-11 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin text-blue-500" /> : <Save size={14} />}
                    Guardar
                  </button>
                  <button 
                    onClick={handleReset}
                    className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <RotateCcw size={14} />
                    Nuevo
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-slate-900/10 min-h-[450px]">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4 shadow-sm">
                  <Bot size={28} />
                </div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Esperando Síntomas</h4>
                <p className="text-[11px] text-slate-400 mt-2 max-w-[280px] leading-relaxed">
                  Describa lo que siente en el chat de la izquierda para recibir un análisis de urgencia, recomendaciones de autocuidado y mapas de centros de salud.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}