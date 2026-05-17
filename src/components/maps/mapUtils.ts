import { 
  Pill, ShieldAlert, Hospital, Stethoscope, Activity, MapPin, 
  Building2, Cross, Brain, SmilePlus
} from 'lucide-react';

export type FacilityType =
  | 'hospital-national'
  | 'hospital-regional'
  | 'hospital-primary'
  | 'hospital'
  | 'emergency'
  | 'health-center'
  | 'health-post'
  | 'pharmacy'
  | 'clinic'
  | 'laboratory'
  | 'dental'
  | 'mental-health';

export type FilterType = 'all' | FacilityType;

interface TypeDetails {
  label: string;
  labelShort: string;
  icon: React.ElementType;
  colorClasses: string;
  markerColors: { bg: string; border: string };
  searchTerms: string[];  // términos para Google Places API
}

const TYPE_CONFIG: Record<string, TypeDetails> = {
  'hospital-national': {
    label: 'Hospital Nacional',
    labelShort: 'H. Nacional',
    icon: Building2,
    colorClasses: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    markerColors: { bg: '#DC2626', border: '#991b1b' },
    searchTerms: ['hospital nacional'],
  },
  'hospital-regional': {
    label: 'Hospital Regional',
    labelShort: 'H. Regional',
    icon: Building2,
    colorClasses: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    markerColors: { bg: '#EA580C', border: '#c2410c' },
    searchTerms: ['hospital regional'],
  },
  'hospital-primary': {
    label: 'Hospital Primario',
    labelShort: 'H. Primario',
    icon: Hospital,
    colorClasses: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    markerColors: { bg: '#D97706', border: '#b45309' },
    searchTerms: ['hospital primario'],
  },
  'hospital': {
    label: 'Hospital',
    labelShort: 'Hospital',
    icon: Hospital,
    colorClasses: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    markerColors: { bg: '#2563EB', border: '#1d4ed8' },
    searchTerms: ['hospital'],
  },
  'emergency': {
    label: 'Emergencia',
    labelShort: 'Emergencia',
    icon: ShieldAlert,
    colorClasses: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    markerColors: { bg: '#EF4444', border: '#b91c1c' },
    searchTerms: ['emergencia médica', 'sala de emergencias'],
  },
  'health-center': {
    label: 'Centro de Salud',
    labelShort: 'C. Salud',
    icon: Cross,
    colorClasses: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    markerColors: { bg: '#059669', border: '#047857' },
    searchTerms: ['centro de salud'],
  },
  'health-post': {
    label: 'Puesto de Salud',
    labelShort: 'Puesto',
    icon: MapPin,
    colorClasses: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    markerColors: { bg: '#0D9488', border: '#0f766e' },
    searchTerms: ['puesto de salud', 'puesto médico'],
  },
  'pharmacy': {
    label: 'Farmacia',
    labelShort: 'Farmacia',
    icon: Pill,
    colorClasses: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    markerColors: { bg: '#16A34A', border: '#15803d' },
    searchTerms: ['farmacia'],
  },
  'clinic': {
    label: 'Clínica',
    labelShort: 'Clínica',
    icon: Stethoscope,
    colorClasses: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    markerColors: { bg: '#7C3AED', border: '#6d28d9' },
    searchTerms: ['clínica médica', 'clínica privada'],
  },
  'laboratory': {
    label: 'Laboratorio',
    labelShort: 'Lab.',
    icon: Activity,
    colorClasses: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    markerColors: { bg: '#F59E0B', border: '#d97706' },
    searchTerms: ['laboratorio clínico', 'laboratorio médico'],
  },
  'dental': {
    label: 'Clínica Dental',
    labelShort: 'Dental',
    icon: SmilePlus,
    colorClasses: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    markerColors: { bg: '#DB2777', border: '#be185d' },
    searchTerms: ['clínica dental', 'dentista', 'odontología'],
  },
  'mental-health': {
    label: 'Salud Mental',
    labelShort: 'S. Mental',
    icon: Brain,
    colorClasses: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    markerColors: { bg: '#4F46E5', border: '#4338ca' },
    searchTerms: ['salud mental', 'psicología', 'psiquiatría'],
  },
  default: {
    label: 'Ubicación',
    labelShort: 'Lugar',
    icon: MapPin,
    colorClasses: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    markerColors: { bg: '#6B7280', border: '#4B5563' },
    searchTerms: [],
  },
};

export const getClinicTypeDetails = (type: string): TypeDetails =>
  TYPE_CONFIG[type] ?? TYPE_CONFIG.default;

/** Lista ordenada de todos los filtros con sus etiquetas */
export const FILTER_OPTIONS: { value: FilterType; label: string; labelShort: string }[] = [
  { value: 'all',               label: 'Todos',           labelShort: 'Todos'      },
  { value: 'hospital-national', label: 'Hospital Nacional', labelShort: 'H. Nacional' },
  { value: 'emergency',         label: 'Emergencia',      labelShort: 'Emergencia' },
  { value: 'health-center',     label: 'Centro de Salud', labelShort: 'C. Salud'   },
  { value: 'pharmacy',          label: 'Farmacia',        labelShort: 'Farmacia'   },
  { value: 'clinic',            label: 'Clínica',         labelShort: 'Clínica'    },
  { value: 'laboratory',        label: 'Laboratorio',     labelShort: 'Lab.'       },
  { value: 'hospital-regional', label: 'Hospital Regional', labelShort: 'H. Regional' },
  { value: 'hospital-primary',  label: 'Hospital Primario', labelShort: 'H. Primario' },
  { value: 'health-post',       label: 'Puesto de Salud', labelShort: 'Puesto'     },
  { value: 'dental',            label: 'Clínica Dental',  labelShort: 'Dental'     },
  { value: 'mental-health',     label: 'Salud Mental',    labelShort: 'S. Mental'  },
];

/** Todos los search terms agrupados para una sola búsqueda en Places */
export const ALL_SEARCH_TERMS = Object.entries(TYPE_CONFIG)
  .filter(([key]) => key !== 'default')
  .flatMap(([type, details]) =>
    details.searchTerms.map(term => ({ term, type }))
  );