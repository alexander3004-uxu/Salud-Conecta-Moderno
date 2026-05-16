import { Pill, ShieldAlert, Hospital, Stethoscope, Activity, MapPin } from 'lucide-react';

export const getClinicTypeDetails = (type: string) => {
  const details: Record<string, { label: string; icon: React.ElementType; colorClasses: string; markerColors: { bg: string; border: string } }> = {
    hospital: { label: 'Hospital', icon: Hospital, colorClasses: 'bg-blue-100 text-blue-700', markerColors: { bg: '#2E90FA', border: '#1a73e8' } },
    pharmacy: { label: 'Farmacia', icon: Pill, colorClasses: 'bg-green-100 text-green-700', markerColors: { bg: '#51df8e', border: '#2ecc71' } },
    emergency: { label: 'Emergencia', icon: ShieldAlert, colorClasses: 'bg-red-100 text-red-700', markerColors: { bg: '#F04438', border: '#c0392b' } },
    'health-center': { label: 'Centro de Salud', icon: Stethoscope, colorClasses: 'bg-purple-100 text-purple-700', markerColors: { bg: '#9334E6', border: '#7c3aed' } },
    clinic: { label: 'Clínica', icon: Stethoscope, colorClasses: 'bg-indigo-100 text-indigo-700', markerColors: { bg: '#a6c8ff', border: '#2E90FA' } },
    laboratory: { label: 'Laboratorio', icon: Activity, colorClasses: 'bg-amber-100 text-amber-700', markerColors: { bg: '#F59E0B', border: '#d97706' } },
    default: { label: 'Ubicación', icon: MapPin, colorClasses: 'bg-gray-100 text-gray-700', markerColors: { bg: '#404753', border: '#2d3436' } },
  };
  
  return details[type] || details.default;
};