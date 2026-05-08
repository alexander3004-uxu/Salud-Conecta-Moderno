import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  User, 
  Calendar, 
  MapPin, 
  Map, 
  ArrowLeft,
  Bell
} from 'lucide-react';

interface AppointmentSuccessProps {
  specialist: string;
  date: string;
  time: string;
  location: string;
  onFinish: () => void;
}

export default function AppointmentSuccess({ 
  specialist, 
  date, 
  time, 
  location, 
  onFinish 
}: AppointmentSuccessProps) {
  const [whatsappReminder, setWhatsappReminder] = React.useState(true);

  return (
    <div className="flex flex-col items-center text-center w-full animate-in fade-in zoom-in duration-500">
      {/* Success Animation Area */}
      <div className="flex flex-col items-center text-center mb-10 w-full">
        <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(81,223,142,0.15)]">
          <CheckCircle2 className="w-12 h-12 text-secondary fill-secondary/20" />
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-on-surface mb-3 tracking-tight">Cita Programada con Éxito</h1>
        <p className="text-lg text-on-surface-variant font-medium">Su cita ha sido confirmada en nuestro sistema.</p>
      </div>

      {/* Summary Card */}
      <div className="w-full bg-[#0F172A]/60 backdrop-blur-md rounded-2xl p-8 border border-[#1E293B] relative overflow-hidden border-l-4 border-l-primary mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Calendar className="w-32 h-32" />
        </div>
        
        <h2 className="text-xs font-bold text-primary mb-6 uppercase tracking-widest text-left">Detalles de la Cita</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 text-left relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-surface-container rounded-lg text-outline">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Especialista</p>
              <p className="font-bold text-on-surface">{specialist}</p>
              <p className="text-xs text-on-surface-variant">Consulta Médica</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-surface-container rounded-lg text-outline">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Fecha y Hora</p>
              <p className="font-bold text-on-surface">{date}</p>
              <p className="text-xs text-on-surface-variant">{time} hrs</p>
            </div>
          </div>

          <div className="flex items-start gap-4 sm:col-span-2 pt-6 border-t border-outline-variant/20">
            <div className="p-2 bg-surface-container rounded-lg text-outline">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Ubicación</p>
              <p className="font-bold text-on-surface">{location}</p>
              <p className="text-xs text-on-surface-variant">Hospital Metropolitano, Piso 3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders Section */}
      <div className="w-full bg-surface-container rounded-2xl p-8 border border-outline-variant flex flex-col mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-tertiary" />
          <h3 className="text-xl font-display font-bold text-on-surface">Recordatorios y Seguimiento</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 text-left">Configure cómo desea recibir las alertas previas a su cita médica.</p>
        
        <label className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl cursor-pointer border border-transparent hover:border-outline-variant transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold text-on-surface">Recibir recordatorios por WhatsApp</p>
              <p className="text-xs text-on-surface-variant">Notificaciones 24h y 2h antes</p>
            </div>
          </div>
          <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary">
            <input 
              type="checkbox" 
              checked={whatsappReminder}
              onChange={(e) => setWhatsappReminder(e.target.checked)}
              className="sr-only" 
            />
            <span 
              className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${whatsappReminder ? 'translate-x-5' : 'translate-x-0'}`} 
            />
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mt-2">
        <button className="flex-1 bg-surface-container text-primary font-display font-bold border border-primary-container hover:bg-surface-container-high py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3">
          <Map className="w-5 h-5" />
          Ver indicaciones en Mapa
        </button>
        <button 
          onClick={onFinish}
          className="flex-1 bg-primary text-on-primary font-display font-bold hover:brightness-110 py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Mis Citas
        </button>
      </div>
    </div>
  );
}
