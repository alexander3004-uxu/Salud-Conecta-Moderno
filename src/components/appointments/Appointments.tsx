import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Plus,
  Stethoscope,
  FlaskConical,
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  MapPin,
  X,
  Phone,
  Headphones,
  History as HistoryIcon
} from 'lucide-react';
import { Appointment, TriageRecord } from '../../types';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { getUserAppointments, cancelAppointment } from '../../services/appointmentService';
import { getUserTriages } from '../../services/triageService';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import NewAppointmentModal from './NewAppointmentModal';

interface AppointmentsProps {
  initialTab?: 'appointments' | 'history';
}

export default function Appointments({ initialTab = 'appointments' }: AppointmentsProps) {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [triages, setTriages] = useState<TriageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'doctors' | 'labs' | 'clinics'>('all');
  const [activeTab, setActiveTab] = useState<'appointments' | 'history'>(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState<string | null>(null);

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

  const handleCancel = (id: string) => {
    setIsConfirmingCancel(id);
  };

  const confirmCancellation = async () => {
    if (isConfirmingCancel) {
      await cancelAppointment(isConfirmingCancel);
      if (user) fetchAllData(user.uid);
      setIsConfirmingCancel(null);
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
            Para gestionar tus citas y ver tu historial médico, por favor inicia sesión de forma segura.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Sincronizar Datos
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'all') return true;
    if (filter === 'doctors') return appt.serviceType.toLowerCase().includes('médico') || appt.serviceType.toLowerCase().includes('cardio');
    if (filter === 'labs') return appt.serviceType.toLowerCase().includes('laboratorio') || appt.serviceType.toLowerCase().includes('sangre');
    if (filter === 'clinics') return appt.serviceType.toLowerCase().includes('clínica');
    return true;
  });

  const today = new Date();
  const currentMonthName = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startOffset = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // Días vacíos antes del día 1

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
      {/* Header & Primary Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-display font-bold text-on-surface tracking-tight">Gestión de Citas</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Administre sus próximas consultas y revise su historial médico sincronizado por IA.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2.5 bg-primary text-on-primary px-8 py-3.5 rounded-full font-display font-bold text-sm hover:brightness-110 transition-all shadow-[0_8px_20px_rgba(49,146,252,0.3)] active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (Left/Top) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'Todos', icon: Activity },
              { id: 'doctors', label: 'Médicos', icon: Stethoscope },
              { id: 'labs', label: 'Laboratorios', icon: FlaskConical },
              { id: 'clinics', label: 'Clínicas', icon: Building2 },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full border font-display font-bold text-xs transition-all ${
                  filter === btn.id 
                  ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:border-primary/20'
                }`}
              >
                <btn.icon className="w-3.5 h-3.5" />
                {btn.label}
              </button>
            ))}
          </div>

          {/* Upcoming Appointments */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-on-surface">Próximas Citas</h2>
              <span className="text-[10px] font-mono font-bold text-primary/60 bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                {filteredAppointments.length} Programadas
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-surface-container/30 rounded-3xl border border-dashed border-outline-variant/30">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold text-on-surface-variant font-mono">Sincronizando Agenda...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredAppointments.map((appt) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 flex flex-col md:flex-row gap-6 justify-between hover:border-primary/30 transition-all shadow-sm group"
                  >
                    <div className="flex gap-6 items-start">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                        appt.serviceType.toLowerCase().includes('sangre') || appt.serviceType.toLowerCase().includes('lab')
                        ? 'bg-primary/5 text-primary border-primary/20'
                        : 'bg-secondary/5 text-secondary border-secondary/20'
                      }`}>
                        {appt.serviceType.toLowerCase().includes('médico') || appt.serviceType.toLowerCase().includes('cardio') ? (
                          <Stethoscope className="w-7 h-7" />
                        ) : appt.serviceType.toLowerCase().includes('lab') || appt.serviceType.toLowerCase().includes('sangre') ? (
                          <FlaskConical className="w-7 h-7" />
                        ) : (
                          <Building2 className="w-7 h-7" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/30 uppercase tracking-wider">
                            {appt.serviceType}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            appt.status === 'confirmed' ? 'bg-secondary' : 'bg-primary'
                          } animate-pulse`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            appt.status === 'confirmed' ? 'text-secondary' : 'text-primary'
                          }`}>
                            {appt.status === 'confirmed' ? 'Confirmada' : 'Programada'}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-on-surface group-hover:text-primary transition-colors">
                          {appt.doctorName || appt.serviceType}
                        </h3>
                        <p className="text-sm text-on-surface-variant flex items-center gap-1.5 opacity-80">
                          <MapPin className="w-3.5 h-3.5" />
                          {appt.location || 'Hospital Central, Ala Norte'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-6 md:min-w-[140px]">
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-display font-bold text-primary">
                          {new Date(appt.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '')}
                        </p>
                        <p className="text-sm font-bold text-on-surface-variant font-mono opacity-70">
                          {new Date(appt.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all" title="Añadir al calendario">
                          <CalendarPlus className="w-5 h-5" />
                        </button>
                        {appt.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(appt.id)}
                            className="p-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 hover:bg-error/5 transition-all" 
                            title="Cancelar cita"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container-low rounded-[32px] border border-dashed border-outline-variant/30">
                <Calendar className="w-20 h-20 text-outline-variant/20 mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3">Agenda Vacía</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mb-8">
                  No tiene citas programadas en este momento. Inicie una solicitud para agendar su próxima atención.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-on-primary px-8 py-3.5 rounded-2xl font-display font-bold shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  Programar Nueva Cita
                </button>
              </div>
            )}
          </section>

          {/* Past Appointments History - Simplified list on main view */}
          <section className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-on-surface">Historial Reciente</h2>
              <button 
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Ver todo el historial
              </button>
            </div>
            <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
              {triages.slice(0, 3).map((triage, idx) => (
                <div 
                  key={triage.id}
                  className={`p-5 flex justify-between items-center hover:bg-surface-container-high cursor-pointer transition-all ${
                    idx !== 2 ? 'border-b border-outline-variant/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shadow-inner border border-white/5">
                      {triage.medication ? <Pill className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">
                        {triage.symptoms.length > 40 ? triage.symptoms.substring(0, 40) + '...' : triage.symptoms}
                      </p>
                      <p className="text-xs font-bold text-on-surface-variant opacity-60 font-mono mt-0.5">
                        {new Date(triage.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    triage.urgency === 'emergency' ? 'bg-error/10 text-error border-error/20' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                  }`}>
                    {triage.urgency === 'emergency' ? 'EMERGENCIA' : 'COMPLETADA'}
                  </span>
                </div>
              ))}
              {triages.length === 0 && (
                <div className="p-12 text-center text-on-surface-variant text-sm font-medium opacity-60">
                  No hay registros de historial recientes.
                </div>
              )}
              <button 
                onClick={() => setActiveTab('history')}
                className="w-full py-4 bg-surface-container-high/30 text-center text-primary font-display font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all border-t border-outline-variant/10"
              >
                Ver Pasaporte de Salud Completo
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Mini Calendar Mockup */}
          <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-on-surface capitalize">{currentMonthName}</h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold text-on-surface-variant mb-3 opacity-60">
              <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-2.5 text-center font-sans font-bold text-xs">
              {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasAppt = filteredAppointments.some(a => {
                  const d = new Date(a.date);
                  return d.getDate() === day && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                });
                const isToday = day === today.getDate();
                return (
                  <div 
                    key={i}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all relative ${
                      hasAppt 
                      ? 'bg-primary/10 text-primary font-black border border-primary/30 shadow-sm' 
                      : isToday
                      ? 'bg-primary text-on-primary shadow-lg'
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    {day}
                    {hasAppt && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-sm" />}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(81,223,142,0.4)]" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Médico General</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(49,146,252,0.4)]" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">Laboratorio</span>
              </div>
            </div>
          </div>

          {/* Quick Action Card (Support Agent) */}
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-3xl border border-outline-variant/30 p-8 relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Headphones className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            
            <div className="flex items-center gap-3 mb-4 text-primary relative z-10">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold leading-tight">¿Necesitas ayuda?</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 opacity-80 font-medium relative z-10">
              Si tienes problemas para encontrar una cita o requieres asistencia técnica, contacta a nuestro equipo de atención al paciente.
            </p>
            <button className="w-full flex items-center justify-center gap-3 bg-surface-container-highest border border-outline-variant/30 text-on-surface px-6 py-4 rounded-2xl font-display font-bold text-sm hover:bg-surface-bright transition-all shadow-lg active:scale-95 relative z-10">
              <Phone className="w-5 h-5 text-primary" />
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => user && fetchAllData(user.uid)}
        userId={user.uid}
        latestTriage={triages[0]}
      />

      <AnimatePresence>
        {isConfirmingCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container rounded-3xl p-6 max-w-sm w-full border border-outline-variant/30 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">Confirmar Cancelación</h3>
              <p className="text-sm text-on-surface-variant mb-6">¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setIsConfirmingCancel(null)} className="px-4 py-2 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  Mantener Cita
                </button>
                <button onClick={confirmCancellation} className="px-4 py-2 rounded-xl font-bold text-sm bg-error text-on-error hover:bg-error/90 transition-colors shadow-sm">
                  Sí, Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
