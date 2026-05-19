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
import { Clinic } from '../../types';

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
        return 'bg-error/10 border-error/20 text-error';
      case 'high': 
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'medium': 
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      default: 
        return 'bg-secondary/10 border-secondary/20 text-secondary';
    }
  };

  return (
    <div className="flex-1 w-full bg-background flex flex-col font-sans relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
              toastType === 'success' 
                ? 'bg-secondary/15 border-secondary/35 text-secondary' 
                : 'bg-error/15 border-error/35 text-error'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1300px] mx-auto w-full flex-1 flex flex-col p-4 md:p-6 lg:p-8 relative">
        
        {/* Header Block */}
        <div className="bg-surface-container/80 backdrop-blur-md border border-outline-variant/30 rounded-[24px] p-4 mb-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-on-surface flex items-center gap-1.5">
                Triaje Médico con Inteligencia Artificial
              </span>
              <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
                Interoperable • Georeferenciado ({membership.toUpperCase()})
              </p>
            </div>
          </div>
          {triageResult && (
            <button 
              onClick={handleReset}
              className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              title="Reiniciar consulta"
            >
              <RotateCcw className="w-4 h-4"/>
            </button>
          )}
        </div>

        {/* Core Layout Grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 relative overflow-hidden min-h-0">
          
          {/* Left Column: Conversational Chat */}
          <div className="flex-1 bg-surface-container-low/40 backdrop-blur-sm border border-outline-variant/30 rounded-[32px] overflow-hidden flex flex-col shadow-sm relative min-h-[450px]">
            
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
                        ? 'bg-primary/10 border-primary/20 text-primary' 
                        : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant'
                    }`}>
                      {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className={`px-4.5 py-3 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                        m.role === 'assistant'
                          ? 'bg-surface border-outline-variant/20 text-on-surface rounded-tl-none'
                          : 'bg-primary text-on-primary border-primary rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                      <span className="text-[8px] font-bold text-on-surface-variant/60 px-1 uppercase tracking-wider self-end mt-0.5">
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
                      <div className="w-8 h-8 rounded-lg border bg-primary/10 border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Bot size={16} className="animate-pulse" />
                      </div>
                      <div className="bg-surface border border-outline-variant/20 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest ml-2 animate-pulse">Analizando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <div className="p-4 md:p-5 bg-surface border-t border-outline-variant/20 shrink-0">
              <div className="flex gap-2 max-w-3xl mx-auto items-center">
                <div className="flex-1 relative">
                  <input 
                    className="w-full h-12 pl-4 pr-12 rounded-xl border border-outline-variant/30 bg-surface-container-low text-xs md:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50" 
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
                        ? 'bg-error text-on-error animate-pulse' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-primary hover:brightness-110 text-on-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/15 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
                className="bg-surface border border-outline-variant/30 rounded-[32px] overflow-hidden flex flex-col shadow-lg flex-1 min-h-[450px]"
              >
                {/* Result header showing severity */}
                <div className={`p-5 flex items-center gap-3 border-b border-outline-variant/20 ${getSeverityBadgeStyles(triageResult.severity)}`}>
                  <div className="w-10 h-10 rounded-xl bg-surface/20 flex items-center justify-center border border-surface/30">
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
                    <Zap className="w-5 h-5 text-error ml-auto animate-bounce shrink-0" />
                  )}
                </div>

                {/* Body scroll */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none">
                  
                  {/* AI Recommendation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Bot size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Recomendación IA</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold leading-relaxed text-on-surface bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
                      {triageResult.recommendation}
                    </p>
                  </div>

                  {/* Clinical Reasoning */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <AlertTriangle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Justificación Médica</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed pl-1 whitespace-pre-wrap">
                      {triageResult.reasoning}
                    </p>
                  </div>

                  {/* Over-the-counter Medication if suggested */}
                  {triageResult.medication?.name && (
                    <div className="space-y-2 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                      <div className="flex items-center gap-1.5 text-secondary">
                        <Pill size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sugerencia Farmacéutica (Venta Libre)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1.5">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase">Medicamento</span>
                          <span className="text-xs font-bold text-on-surface">{triageResult.medication.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase">Dosis</span>
                          <span className="text-xs font-bold text-on-surface">{triageResult.medication.dosage}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase">Toma</span>
                          <span className="text-xs text-on-surface-variant">{triageResult.medication.frequency} • {triageResult.medication.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Proximity facility geolocation cards */}
                  {triageResult.locationInfo && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-1">
                        Centros Asistenciales Recomendados 📍
                      </div>
                      
                      {/* Nearest Hospital Card */}
                      {triageResult.locationInfo.closestHospital && (
                        <div className="p-4 bg-error/5 rounded-2xl border border-error/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-error">
                              <MapPin size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Hospital Más Cercano</span>
                            </div>
                            <span className="text-[9px] font-black bg-error/10 text-error px-2 py-0.5 rounded-lg border border-error/20">
                              {triageResult.locationInfo.closestHospitalDistanceKm?.toFixed(1)} KM
                            </span>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-on-surface leading-tight">
                              {triageResult.locationInfo.closestHospital.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                                <Clock size={12} className="text-error" /> {triageResult.locationInfo.closestHospitalTravelTime}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-outline-variant" />
                              <span className="text-[10px] font-bold text-secondary">Urgencias 24h</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewOnMap(triageResult.locationInfo?.closestHospital)}
                            className="w-full h-10 bg-error hover:brightness-110 text-on-error rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-error/10"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            Ruta al Hospital en Google Maps
                          </button>
                        </div>
                      )}

                      {/* Nearest Health Center Card */}
                      {triageResult.locationInfo.closestCenter && (
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-primary">
                              <MapPin size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Centro de Salud Más Cercano</span>
                            </div>
                            <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20">
                              {triageResult.locationInfo.closestCenterDistanceKm?.toFixed(1)} KM
                            </span>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-on-surface leading-tight">
                              {triageResult.locationInfo.closestCenter.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                                <Clock size={12} className="text-primary" /> {triageResult.locationInfo.closestCenterTravelTime}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-outline-variant" />
                              <span className="text-[10px] font-bold text-secondary">Disponible</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewOnMap(triageResult.locationInfo?.closestCenter)}
                            className="w-full h-10 bg-primary hover:brightness-110 text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
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
                <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex gap-2 shrink-0">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-11 bg-surface hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {isSaving ? <Loader2 size={14} className="animate-spin text-primary" /> : <Save size={14} />}
                    Guardar
                  </button>
                  <button 
                    onClick={handleReset}
                    className="flex-1 h-11 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <RotateCcw size={14} />
                    Nuevo
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-outline-variant/30 rounded-[32px] flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/20 min-h-[450px]">
                <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/40 mb-4 shadow-sm">
                  <Bot size={28} />
                </div>
                <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Esperando Síntomas</h4>
                <p className="text-[11px] text-on-surface-variant/60 mt-2 max-w-[280px] leading-relaxed">
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