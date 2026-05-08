import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  Activity, 
  FileText, 
  Pill,
  Download,
  ShieldCheck,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Appointment, TriageRecord } from '../../types';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { getUserAppointments, cancelAppointment } from '../../services/appointmentService';
import { getUserTriages } from '../../services/triageService';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Appointments() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [triages, setTriages] = useState<TriageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'appointments' | 'passport'>('appointments');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchAllData(u.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async (uid: string) => {
    setIsLoading(true);
    try {
      const [appts, trgs] = await Promise.all([
        getUserAppointments(uid),
        getUserTriages(uid)
      ]);
      setAppointments(appts);
      setTriages(trgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      await cancelAppointment(id);
      if (user) fetchAllData(user.uid);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background min-h-[60vh]">
        <div className="max-w-md w-full bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary opacity-40" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-on-surface">Acceso Reservado</h2>
          <p className="text-on-surface-variant mb-8 text-body-md leading-relaxed">
            Para ver tu historial médico y pasaporte de salud, por favor inicia sesión de forma segura.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Sincronizar Pasaporte
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-outline-variant/20 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-on-surface">Pasaporte de Salud</h1>
          <p className="text-on-surface-variant font-medium mt-1 uppercase tracking-[0.2em] text-[10px] font-mono">Realon™ Health Systems • V.2.0</p>
        </div>
        <div className="flex bg-surface-container p-1.5 rounded-2xl border border-outline-variant/30 shadow-inner">
          <button 
            onClick={() => setTab('appointments')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'appointments' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Calendar className="w-4 h-4" />
            Agenda
          </button>
          <button 
            onClick={() => setTab('passport')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'passport' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Activity className="w-4 h-4" />
            Historial
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-medical-blue/20 border-t-medical-blue rounded-full animate-spin" />
          <p className="text-sm font-bold text-on-surface-variant">Sincronizando con el sistema central...</p>
        </div>
      ) : tab === 'appointments' ? (
        appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary/30 transition-all"
              >
                <div className="flex flex-wrap justify-between gap-4 items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-lg flex flex-col items-center justify-center border border-primary/10">
                      <span className="text-[10px] font-bold uppercase text-primary/60">Mes</span>
                      <span className="text-lg font-bold text-primary leading-none">
                        {new Date(appt.date).toLocaleDateString('es-ES', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">{appt.serviceType}</h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(appt.date).toLocaleString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      appt.status === 'confirmed' ? 'bg-hospital-green/10 text-hospital-green border-hospital-green/20' :
                      appt.status === 'pending' ? 'bg-medical-blue/10 text-medical-blue border-medical-blue/20' :
                      'bg-alert-red/10 text-alert-red border-alert-red/20'
                    }`}>
                      {appt.status === 'confirmed' ? 'Confirmada' : 
                       appt.status === 'pending' ? 'Pendiente' : 
                       appt.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                    </span>
                    {appt.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleCancel(appt.id)}
                        className="p-2 text-on-surface-variant hover:text-alert-red hover:bg-alert-red/5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-surface-container rounded-lg text-xs font-medium text-on-surface-variant border border-outline-variant/30">
                  <AlertCircle className="w-4 h-4 text-medical-blue" />
                  Presente su documento de identidad 15 minutos antes.
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
            <Calendar className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No hay citas</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">Comienza a cuidar tu salud agendando tu próxima atención.</p>
          </div>
        )
      ) : (
        /* HEALTH PASSPORT (TRIAGE HISTORY) */
        <div className="space-y-10 pb-20">
          <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-8 shadow-md group">
            <div className="w-[160px] h-[160px] bg-white rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative shadow-lg ring-4 ring-primary/5">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvkKb-B6UGbxmcGivrsLMJ3sk4ZdcUapwAkRvYg6n8XA5HyDSH-ciNXWPbMkNTFryHap-zIox94qdwPmkJtacB45LyYa4g52BopHKlXLuSlaldPnp99y8NlzAct1IlvqXpVM49520ChqHZZOf9Ly2qI1tknxhtsq7TNUXzOHZMrU8UijHB85qSmENkMztweEzC_01dWsgLaXJK883DGdRbUjoMElU25T72hCh8cQf-tEsttPIhZpnHbc3NPHQlFWoIXCXAvO0q8Q" 
                alt="Pasaporte QR" 
                className="w-4/5 h-4/5 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4 fill-primary text-background" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">DATOS ENCRIPTADOS Y SEGUROS</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-on-surface">Acceso Médico Seguro</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-1">
                Presenta este código al personal de salud para compartir tu resumen clínico de forma inmediata y sin conexión.
              </p>
              <button className="w-full sm:w-auto bg-primary text-on-primary font-display font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg">
                <Download className="w-4 h-4" />
                Exportar Resumen Médico (PDF)
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4 mb-8">
              <h2 className="text-xl font-display font-bold text-on-surface">Historial de Triajes</h2>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-2.5 py-1 rounded-lg">Sincronización Cloud-IA</span>
            </div>

            {triages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {triages.map((triage) => (
                  <motion.article
                    key={triage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all relative overflow-hidden group shadow-sm flex flex-col gap-5"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      triage.urgency === 'emergency' ? 'bg-alert-red shadow-[0_0_15px_#F04438]' :
                      triage.urgency === 'high' ? 'bg-tertiary-container' :
                      triage.urgency === 'medium' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    
                    <div className="flex flex-col gap-4 pl-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <time className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 opacity-60">
                            {new Date(triage.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} • {new Date(triage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </time>
                          <h3 className="text-xl font-display font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                            {triage.symptoms.length > 60 ? triage.symptoms.substring(0, 60) + '...' : triage.symptoms}
                          </h3>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0 shadow-sm border ${
                          triage.urgency === 'emergency' ? 'bg-alert-red/10 text-alert-red border-alert-red/20' :
                          triage.urgency === 'high' ? 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' :
                          triage.urgency === 'medium' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20'
                        }`}>
                          {triage.urgency === 'emergency' && <AlertCircle className="w-3 h-3" />}
                          {triage.urgency === 'emergency' ? 'EMERGENCIA' : 
                           triage.urgency === 'high' ? 'ALTA PRIORIDAD' : 
                           triage.urgency === 'medium' ? 'CONSULTA CLÍNICA' : 'OBSERVACIÓN'}
                        </div>
                      </div>

                      <div className="pt-5 border-t border-on-surface/10 space-y-4">
                        <p className="text-on-surface text-sm leading-relaxed font-sans">
                          <span className="font-mono font-bold text-[10px] text-primary uppercase block mb-1">PROTOCOLO DE ACCIÓN:</span>
                          <span className="italic font-medium">"{triage.recommendation}"</span>
                        </p>
                        
                        {triage.medication && (
                          <div className="flex items-center gap-3 bg-surface-container-high/50 p-3 rounded-xl border border-outline-variant/20 shadow-inner">
                            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                              <Pill className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                               <span className="text-[10px] font-bold text-primary uppercase font-mono block">Medicamento Sugerido</span>
                               <p className="text-xs font-bold text-on-surface">{triage.medication} {triage.dosage && `(${triage.dosage})`}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
                <button className="w-full py-4 bg-transparent border border-outline-variant/30 text-on-surface-variant font-display font-bold text-sm rounded-2xl hover:bg-surface-container transition-all uppercase tracking-widest">
                  Cargar Historial Anterior
                </button>
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container-low rounded-[32px] border border-dashed border-outline-variant/30">
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-outline-variant animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3">Expediente Digital Vacío</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed">
                  Realiza tu primer triaje inteligente para comenzar a construir tu pasaporte de salud global.
                </p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'triage' }))}
                  className="mt-8 bg-primary text-on-primary px-8 py-3.5 rounded-2xl font-display font-bold shadow-xl hover:scale-105 transition-all"
                >
                  Iniciar Evaluación IA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
