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
  Navigation
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
          
          <div className="flex-1 flex