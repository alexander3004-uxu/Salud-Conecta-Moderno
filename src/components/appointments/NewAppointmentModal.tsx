import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Stethoscope, 
  FlaskConical, 
  Brain, 
  Search, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  ArrowRight,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import { TriageRecord } from '../../types';
import { createAppointment } from '../../services/appointmentService';
import AppointmentSuccess from './AppointmentSuccess';
import { useLanguage } from '../../contexts/LanguageContext';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  latestTriage?: TriageRecord;
}

type ServiceType = string;

export default function NewAppointmentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userId,
  latestTriage 
}: NewAppointmentModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [serviceType, setServiceType] = useState<ServiceType>(t('appointment.modal.medical_consultation'));
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate() + 1);
  const [selectedTime, setSelectedTime] = useState('09:30 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [finalDetails, setFinalDetails] = useState({
    specialist: '',
    date: '',
    time: '',
    location: ''
  });

  const handleImportTriage = () => {
    if (latestTriage) {
      const imported = t('appointment.modal.imported_from_ai')
        .replace('{symptoms}', latestTriage.symptoms || '')
        .replace('{recommendation}', latestTriage.recommendation || '');
      setNotes(imported);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const date = new Date(2024, 10, selectedDate); // Consistency with mock November 2024
      // Simple time parsing for the mockup
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let finalHours = hours;
      if (period === 'PM' && hours !== 12) finalHours += 12;
      if (period === 'AM' && hours === 12) finalHours = 0;
      date.setHours(finalHours, minutes, 0, 0);

      const specialist = search || (serviceType === t('appointment.modal.medical_consultation') ? t('appointment.modal.doctor_name') : t('appointment.modal.lab_name'));
      const location = t('appointment.modal.hospital_name');

      await createAppointment({
        userId,
        clinicId: 'hospital-central', // Mock clinic ID
        date: date.toISOString(),
        status: 'pending',
        serviceType,
        doctorName: specialist,
        location: location,
        notes
      });

      setFinalDetails({
        specialist,
        date: date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: selectedTime,
        location
      });

      setStep('success');
      onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
        >
          {step === 'form' ? (
            <>
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#1E293B] flex justify-between items-center sticky top-0 bg-[#0F172A] z-10">
                <div>
                  <h1 className="text-2xl font-display font-bold text-[#D5E3FF]">{t('appointment.modal.title')}</h1>
                  <p className="text-sm text-[#C0C7D5] mt-1">{t('appointment.modal.subtitle')}</p>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-[#222A3D] text-[#C0C7D5] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

          {/* Scrollable Content */}
          <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
            {/* Tipo de Servicio */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-[#8A919E] tracking-widest uppercase">{t('appointment.modal.service_type_label')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: t('appointment.modal.medical_consultation'), icon: Stethoscope, label: t('appointment.modal.medical_consultation') },
                  { id: t('appointment.modal.lab_analysis'), icon: FlaskConical, label: t('appointment.modal.lab_analysis') },
                  { id: t('appointment.modal.specialty'), icon: Brain, label: t('appointment.modal.specialty') },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setServiceType(option.id as ServiceType)}
                    className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all gap-3 ${
                      serviceType === option.id 
                      ? 'border-[#A6C8FF] bg-[#3192FC]/10' 
                      : 'border-[#1E293B] hover:border-[#404753] hover:bg-[#222A3D]'
                    }`}
                  >
                    <option.icon className={`w-8 h-8 ${serviceType === option.id ? 'text-[#A6C8FF]' : 'text-[#C0C7D5]'}`} />
                    <span className={`text-sm font-medium text-center ${serviceType === option.id ? 'text-[#A6C8FF]' : 'text-[#C0C7D5]'}`}>
                      {option.label}
                    </span>
                    {serviceType === option.id && (
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#A6C8FF]" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Centro o Profesional */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-[#8A919E] tracking-widest uppercase">{t('appointment.modal.location_professional_label')}</h2>
              <div className="bg-[#0B1326] border border-[#1E293B] rounded-xl overflow-hidden focus-within:border-[#A6C8FF] focus-within:ring-1 focus-within:ring-[#A6C8FF] transition-all">
                <div className="flex items-center px-4 py-3">
                  <Search className="w-5 h-5 text-[#8A919E] mr-3" />
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none w-full text-[#DAE2FD] focus:ring-0 placeholder-[#404753] p-0" 
                    placeholder={t('appointment.modal.search_placeholder')} 
                    type="text"
                  />
                </div>
                {/* Suggestions */}
                <div className="border-t border-[#1E293B] p-3 bg-[#0F172A]/50">
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center bg-[#222A3D] rounded-full px-3 py-1.5 border border-transparent hover:border-[#404753] transition-colors">
                      <MapPin className="text-[#51DF8E] w-3.5 h-3.5 mr-2" />
                      <span className="text-xs font-bold text-[#DAE2FD]">{t('appointment.modal.nearest')}</span>
                    </button>
                    <button 
                      onClick={() => setSearch(t('appointment.modal.doctor_name'))}
                      className="flex items-center bg-[#222A3D] rounded-full px-3 py-1.5 border border-transparent hover:border-[#404753] transition-colors"
                    >
                      <Star className="text-[#A6C8FF] w-3.5 h-3.5 mr-2 fill-current" />
                      <span className="text-xs font-bold text-[#DAE2FD]">{t('appointment.modal.doctor_name')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Fecha y Hora */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-[#8A919E] tracking-widest uppercase">{t('appointment.modal.date_time_label')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Simplified Calendar */}
                <div className="bg-[#0B1326] border border-[#1E293B] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <button className="text-[#C0C7D5] hover:text-[#DAE2FD] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-sm font-bold text-[#DAE2FD]">{t('appointment.modal.november_2024')}</span>
                    <button className="text-[#C0C7D5] hover:text-[#DAE2FD] transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {[
                      t('appointment.modal.days.mon'), 
                      t('appointment.modal.days.tue'), 
                      t('appointment.modal.days.wed'), 
                      t('appointment.modal.days.thu'), 
                      t('appointment.modal.days.fri'), 
                      t('appointment.modal.days.sat'), 
                      t('appointment.modal.days.sun')
                    ].map((day, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-[#404753]">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDate === day;
                      const isToday = day === 8;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(day)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                            ? 'bg-[#A6C8FF] text-[#001C3B] shadow-lg scale-110' 
                            : isToday ? 'border border-[#A6C8FF] text-[#A6C8FF]' : 'text-[#DAE2FD] hover:bg-[#222A3D]'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="bg-[#0B1326] border border-[#1E293B] rounded-xl p-6 flex flex-col">
                  <span className="text-xs font-bold text-[#8A919E] mb-4 block">
                    {t('appointment.modal.available_times_prefix')}{selectedDate}{t('appointment.modal.available_times_suffix')}
                  </span>
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
                    {[
                      '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM',
                      '12:00 PM', '02:00 PM', '03:30 PM', '04:30 PM'
                    ].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-4 rounded-xl border transition-all text-xs font-bold ${
                          selectedTime === time
                          ? 'border-[#A6C8FF] bg-[#3192FC]/10 text-[#A6C8FF]'
                          : 'border-[#1E293B] text-[#C0C7D5] hover:border-[#A6C8FF] hover:text-[#A6C8FF]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Notas / Síntomas */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-xs font-bold text-[#8A919E] tracking-widest uppercase">{t('appointment.modal.notes_label')}</h2>
                <button 
                  onClick={handleImportTriage}
                  className="text-xs font-bold text-[#A6C8FF] flex items-center hover:underline transition-all"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  {t('appointment.modal.import_triage')}
                </button>
              </div>
              <div className="bg-[#0B1326] border border-[#1E293B] rounded-xl focus-within:border-[#A6C8FF] focus-within:ring-1 focus-within:ring-[#A6C8FF] transition-all">
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-transparent border-none text-[#DAE2FD] p-4 focus:ring-0 placeholder-[#404753] resize-none min-h-[100px]" 
                  placeholder={t('appointment.modal.notes_placeholder')} 
                />
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-[#1E293B] bg-[#0F172A] flex justify-end gap-4 sticky bottom-0">
            <button 
              onClick={handleClose}
              className="px-6 py-3 font-display font-bold text-[#A6C8FF] hover:bg-[#3192FC]/10 rounded-xl transition-all"
            >
              {t('appointment.modal.cancel')}
            </button>
            <button 
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#3192FC] text-white rounded-xl font-display font-bold transition-all shadow-[0_4px_20px_rgba(49,146,252,0.3)] hover:brightness-110 active:scale-95 flex items-center disabled:opacity-50 disabled:scale-100"
            >
              {isSubmitting ? t('appointment.modal.scheduling') : t('appointment.modal.confirm')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
          </>
          ) : (
            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <AppointmentSuccess 
                specialist={finalDetails.specialist}
                date={finalDetails.date}
                time={finalDetails.time}
                location={finalDetails.location}
                onFinish={handleClose}
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
