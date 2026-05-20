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
  History as HistoryIcon,
  Search
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
import { useLanguage } from '../../contexts/LanguageContext';

export default function Appointments({ initialTab = 'appointments' }: AppointmentsProps) {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [triages, setTriages] = useState<TriageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'doctors' | 'labs' | 'clinics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
      setAppointments(appts || []);
      setTriages(trgs || []);
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
          <h2 className="text-3xl font-display font-bold mb-4 text-on-surface">{t('appointments.access_reserved')}</h2>
          <p className="text-on-surface-variant mb-8 text-body-md leading-relaxed">
            {t('appointments.login_prompt')}
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {t('appointments.sync_data')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const filteredAppointments = (appointments || []).filter(appt => {
    // Filtrar por tipo (Pestañas)
    if (filter !== 'all') {
      const type = (appt?.serviceType || '').toLowerCase();
      if (filter === 'doctors' && !(type.includes('médico') || type.includes('cardio'))) return false;
      if (filter === 'labs' && !(type.includes('laboratorio') || type.includes('sangre') || type.includes('lab'))) return false;
      if (filter === 'clinics' && !type.includes('clínica')) return false;
    }
    
    // Filtrar por texto (Buscador)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const docName = (appt?.doctorName || '').toLowerCase();
      const service = (appt?.serviceType || '').toLowerCase();
      const loc = (appt?.location || '').toLowerCase();
      if (!docName.includes(q) && !service.includes(q) && !loc.includes(q)) return false;
    }
    
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
          <h1 className="text-4xl font-display font-bold text-on-surface tracking-tight">{t('appointments.title')}</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {t('appointments.desc')}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2.5 bg-primary text-on-primary px-8 py-3.5 rounded-full font-display font-bold text-sm hover:brightness-110 transition-all shadow-[0_8px_20px_rgba(49,146,252,0.3)] active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {t('appointments.new_appointment')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (Left/Top) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-on-surface-variant" />
              </div>
              <input
                type="text"
                placeholder={t('appointments.search_ph')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm hover:border-primary/40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'all', label: t('appointments.filter.all'), icon: Activity },
                { id: 'doctors', label: t('appointments.filter.doctors'), icon: Stethoscope },
                { id: 'labs', label: t('appointments.filter.labs'), icon: FlaskConical },
                { id: 'clinics', label: t('appointments.filter.clinics'), icon: Building2 },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full border font-display font-bold text-xs transition-all ${
                    filter === btn.id 
                    ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                    : 'bg-surface-container-low border-primary/20 text-on-surface-variant hover:bg-primary/5 hover:text-primary hover:border-primary/40'
                  }`}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-on-surface">{t('appointments.upcoming')}</h2>
              <span className="text-[10px] font-mono font-bold text-primary/60 bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                {filteredAppointments.length} {t('appointments.scheduled')}
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-primary/5 rounded-3xl border border-dashed border-primary/30">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold text-on-surface-variant font-mono">{t('appointments.syncing')}</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="flex flex-col gap-4">
            {filteredAppointments.map((appt) => {
              const sType = (appt?.serviceType || '').toLowerCase();
              const isLab = sType.includes('sangre') || sType.includes('lab') || sType.includes('laboratorio');
              const isDoc = sType.includes('médico') || sType.includes('cardio');
              const apptDate = appt?.date ? new Date(appt.date) : null;
              const isValidDate = apptDate && !isNaN(apptDate.getTime());
              
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl border p-6 flex flex-col md:flex-row gap-6 justify-between transition-all shadow-sm group ${
                    appt.status === 'confirmed'
                    ? 'bg-gradient-to-br from-surface-container to-secondary/5 border-secondary/20 hover:border-secondary/40'
                    : 'bg-gradient-to-br from-surface-container to-primary/5 border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <div className="flex gap-6 items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                      isLab
                      ? 'bg-primary/5 text-primary border-primary/20'
                      : 'bg-secondary/5 text-secondary border-secondary/20'
                    }`}>
                      {isDoc ? (
                          <Stethoscope className="w-7 h-7" />
                      ) : isLab ? (
                        <FlaskConical className="w-7 h-7" />
                        ) : (
                          <Building2 className="w-7 h-7" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/30 uppercase tracking-wider">
                            {appt.serviceType}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                            appt.status === 'confirmed' 
                            ? 'bg-secondary/10 text-secondary border-secondary/30 shadow-[0_0_10px_rgba(81,223,142,0.1)]' 
                            : 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(49,146,252,0.1)]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              appt.status === 'confirmed' ? 'bg-secondary' : 'bg-primary'
                            } animate-pulse`} />
                            {appt.status === 'confirmed' ? t('appointments.completed') : t('appointments.scheduled')}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-on-surface group-hover:text-primary transition-colors">
                      {appt.doctorName || appt.serviceType || t('appointments.default_medical')}
                        </h3>
                        <p className="text-sm text-on-surface-variant flex items-center gap-1.5 opacity-80">
                          <MapPin className="w-3.5 h-3.5" />
                          {appt.location || t('appointments.default_location')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-6 md:min-w-[140px]">
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-display font-bold text-primary">
                      {isValidDate ? apptDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '') : t('appointments.pending')}
                        </p>
                        <p className="text-sm font-bold text-on-surface-variant font-mono opacity-70">
                      {isValidDate ? apptDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all" title={t('appointments.add_calendar')}>
                          <CalendarPlus className="w-5 h-5" />
                        </button>
                        {appt.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(appt.id)}
                            className="p-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 hover:bg-error/5 transition-all" 
                            title={t('appointments.cancel_appt')}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
              );
            })}
              </div>
            ) : (
              <div className="text-center py-24 bg-primary/5 rounded-[32px] border border-dashed border-primary/30">
                <Calendar className="w-20 h-20 text-outline-variant/20 mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold text-on-surface mb-3">{t('appointments.empty_title')}</h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm leading-relaxed mb-8">
                  {t('appointments.empty_desc')}
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-on-primary px-8 py-3.5 rounded-2xl font-display font-bold shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  {t('appointments.schedule_new')}
                </button>
              </div>
            )}
          </section>

          {/* Past Appointments History - Simplified list on main view */}
          <section className="mt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-on-surface">{t('appointments.recent_history')}</h2>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'history' }))}
                className="text-xs font-bold text-primary hover:underline"
              >
                {t('appointments.view_all_history')}
              </button>
            </div>
            <div className="bg-surface-container rounded-2xl border border-primary/20 overflow-hidden shadow-sm hover:border-primary/40 transition-colors">
              {(triages || []).slice(0, 3).map((triage, idx) => (
                <div 
                  key={triage.id}
                  className={`p-5 flex justify-between items-center hover:bg-primary/5 cursor-pointer transition-all ${
                    idx !== 2 ? 'border-b border-primary/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant shadow-inner border border-white/5">
                      {triage.medication ? <Pill className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">
                      {(triage.symptoms || '').length > 40 ? triage.symptoms.substring(0, 40) + '...' : (triage.symptoms || t('appointments.no_symptoms'))}
                      </p>
                      <p className="text-xs font-bold text-on-surface-variant opacity-60 font-mono mt-0.5">
                      {triage.createdAt ? new Date(triage.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : t('appointments.date_unavailable')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    triage.urgency === 'emergency' ? 'bg-error/10 text-error border-error/20' : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30'
                  }`}>
                    {triage.urgency === 'emergency' ? t('appointments.emergency') : t('appointments.completed')}
                  </span>
                </div>
              ))}
              {(!triages || triages.length === 0) && (
                <div className="p-12 text-center text-on-surface-variant text-sm font-medium opacity-60">
                  {t('appointments.no_history')}
                </div>
              )}
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'history' }))}
                className="w-full py-4 bg-surface-container-high/30 text-center text-primary font-display font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all border-t border-outline-variant/10"
              >
                {t('appointments.view_passport')}
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Mini Calendar Mockup */}
          <div className="bg-surface-container rounded-3xl border border-primary/20 hover:border-primary/40 transition-colors p-6 shadow-md">
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
                  if (!a?.date) return false;
                  const d = new Date(a.date);
                  if (isNaN(d.getTime())) return false;
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
            <div className="mt-8 pt-6 border-t border-primary/20 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(81,223,142,0.4)]" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">{t('appointments.general_doctor')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(49,146,252,0.4)]" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">{t('appointments.laboratory')}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Card (Support Agent) */}
          <div className="bg-gradient-to-br from-surface-container to-primary/10 rounded-3xl border border-primary/20 p-8 relative overflow-hidden shadow-xl group hover:border-primary/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Headphones className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            
            <div className="flex items-center gap-3 mb-4 text-primary relative z-10">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold leading-tight">{t('appointments.need_help')}</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 opacity-80 font-medium relative z-10">
              {t('appointments.help_desc')}
            </p>
            <button className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary px-6 py-4 rounded-2xl font-display font-bold text-sm hover:brightness-110 transition-all shadow-lg active:scale-95 relative z-10">
              <Phone className="w-5 h-5 text-on-primary" />
              {t('appointments.contact_support')}
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
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">{t('appointments.confirm_cancel')}</h3>
              <p className="text-sm text-on-surface-variant mb-6">{t('appointments.cancel_warning')}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setIsConfirmingCancel(null)} className="px-4 py-2 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  {t('appointments.keep_appt')}
                </button>
                <button onClick={confirmCancellation} className="px-4 py-2 rounded-xl font-bold text-sm bg-error text-on-error hover:bg-error/90 transition-colors shadow-sm">
                  {t('appointments.yes_cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
