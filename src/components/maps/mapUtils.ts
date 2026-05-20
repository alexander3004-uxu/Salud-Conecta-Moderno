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
  /** Términos de búsqueda para Google Places textSearch */
  searchTerms: string[];
  /** Tipos de lugar de Google Places para refinar resultados (opcional) */
  googleTypes?: string[];
}

const TYPE_CONFIG: Record<string, TypeDetails> = {
  'hospital-national': {
    label: 'Hospital Nacional',
    labelShort: 'H. Nacional',
    icon: Building2,
    colorClasses: 'bg-red-500/10 text-red-600 border border-red-500/20',
    markerColors: { bg: '#DC2626', border: '#991b1b' },
    searchTerms: ['hospital nacional'],
    googleTypes: ['hospital'],
  },
  'hospital-regional': {
    label: 'Hospital Regional',
    labelShort: 'H. Regional',
    icon: Building2,
    colorClasses: 'bg-orange-500/10 text-orange-600 border border-orange-500/20',
    markerColors: { bg: '#EA580C', border: '#c2410c' },
    searchTerms: ['hospital regional'],
    googleTypes: ['hospital'],
  },
  'hospital-primary': {
    label: 'Hospital Primario',
    labelShort: 'H. Primario',
    icon: Hospital,
    colorClasses: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    markerColors: { bg: '#D97706', border: '#b45309' },
    searchTerms: ['hospital primario'],
    googleTypes: ['hospital'],
  },
  'hospital': {
    label: 'Hospital',
    labelShort: 'Hospital',
    icon: Hospital,
    colorClasses: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    markerColors: { bg: '#2563EB', border: '#1d4ed8' },
    searchTerms: ['hospital'],
    googleTypes: ['hospital'],
  },
  'emergency': {
    label: 'Emergencia',
    labelShort: 'Emergencia',
    icon: ShieldAlert,
    colorClasses: 'bg-red-500/10 text-red-600 border border-red-500/20',
    markerColors: { bg: '#EF4444', border: '#b91c1c' },
    searchTerms: ['emergencia médica', 'sala de emergencias', 'urgencias médicas'],
    googleTypes: ['hospital', 'health'],
  },
  'health-center': {
    label: 'Centro de Salud',
    labelShort: 'C. Salud',
    icon: Cross,
    colorClasses: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    markerColors: { bg: '#059669', border: '#047857' },
    searchTerms: ['centro de salud', 'MINSA', 'centro médico público'],
    googleTypes: ['health', 'doctor'],
  },
  'health-post': {
    label: 'Puesto de Salud',
    labelShort: 'Puesto',
    icon: MapPin,
    colorClasses: 'bg-teal-500/10 text-teal-600 border border-teal-500/20',
    markerColors: { bg: '#0D9488', border: '#0f766e' },
    searchTerms: ['puesto de salud', 'puesto médico', 'dispensario médico'],
    googleTypes: ['health'],
  },
  'pharmacy': {
    label: 'Farmacia',
    labelShort: 'Farmacia',
    icon: Pill,
    colorClasses: 'bg-green-500/10 text-green-600 border border-green-500/20',
    markerColors: { bg: '#16A34A', border: '#15803d' },
    searchTerms: ['farmacia', 'droguería', 'farmacia y droguería'],
    googleTypes: ['pharmacy'],
  },
  'clinic': {
    label: 'Clínica',
    labelShort: 'Clínica',
    icon: Stethoscope,
    colorClasses: 'bg-violet-500/10 text-violet-600 border border-violet-500/20',
    markerColors: { bg: '#7C3AED', border: '#6d28d9' },
    searchTerms: ['clínica médica', 'clínica privada', 'consultorio médico'],
    googleTypes: ['doctor', 'health'],
  },
  'laboratory': {
    label: 'Laboratorio',
    labelShort: 'Lab.',
    icon: Activity,
    colorClasses: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    markerColors: { bg: '#F59E0B', border: '#d97706' },
    searchTerms: ['laboratorio clínico', 'laboratorio médico', 'laboratorio de análisis'],
    googleTypes: ['health'],
  },
  'dental': {
    label: 'Clínica Dental',
    labelShort: 'Dental',
    icon: SmilePlus,
    colorClasses: 'bg-pink-500/10 text-pink-600 border border-pink-500/20',
    markerColors: { bg: '#DB2777', border: '#be185d' },
    searchTerms: ['clínica dental', 'dentista', 'odontología', 'consultorio dental'],
    googleTypes: ['dentist'],
  },
  'mental-health': {
    label: 'Salud Mental',
    labelShort: 'S. Mental',
    icon: Brain,
    colorClasses: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20',
    markerColors: { bg: '#4F46E5', border: '#4338ca' },
    searchTerms: ['salud mental', 'psicología', 'psiquiatría', 'psicólogo'],
    googleTypes: ['doctor', 'health'],
  },
  default: {
    label: 'Ubicación',
    labelShort: 'Lugar',
    icon: MapPin,
    colorClasses: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/20',
    markerColors: { bg: '#6B7280', border: '#4B5563' },
    searchTerms: [],
  },
};

export const getClinicTypeDetails = (type: string, t?: any): TypeDetails => {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.default;
  if (!t) return config;
  
  // Try to translate label and labelShort if t is provided
  const transKey = type.replace('-', '_');
  const label = t(`maps.utils.${transKey}_label`) !== `maps.utils.${transKey}_label` ? t(`maps.utils.${transKey}_label`) : config.label;
  const labelShort = t(`maps.utils.${transKey}_short`) !== `maps.utils.${transKey}_short` ? t(`maps.utils.${transKey}_short`) : config.labelShort;
  
  return { ...config, label, labelShort };
};

const FILTER_OPTIONS_BASE: { value: FilterType; label: string; labelShort: string }[] = [
  { value: 'all',               label: 'Todos',             labelShort: 'Todos'      },
  { value: 'hospital-national', label: 'Hospital Nacional',  labelShort: 'H. Nacional'},
  { value: 'emergency',         label: 'Emergencia',         labelShort: 'Emergencia' },
  { value: 'health-center',     label: 'Centro de Salud',    labelShort: 'C. Salud'  },
  { value: 'pharmacy',          label: 'Farmacia',           labelShort: 'Farmacia'  },
  { value: 'clinic',            label: 'Clínica',            labelShort: 'Clínica'   },
  { value: 'laboratory',        label: 'Laboratorio',        labelShort: 'Lab.'      },
  { value: 'hospital-regional', label: 'Hospital Regional',  labelShort: 'H. Regional'},
  { value: 'hospital-primary',  label: 'Hospital Primario',  labelShort: 'H. Primario'},
  { value: 'health-post',       label: 'Puesto de Salud',    labelShort: 'Puesto'    },
  { value: 'dental',            label: 'Clínica Dental',     labelShort: 'Dental'    },
  { value: 'mental-health',     label: 'Salud Mental',       labelShort: 'S. Mental' },
];

export const getFilterOptions = (t?: any): { value: FilterType; label: string; labelShort: string }[] => {
  return FILTER_OPTIONS_BASE.map(opt => {
    if (!t) return opt;
    const transKey = opt.value.replace('-', '_');
    const label = t(`maps.utils.${transKey}_label`) !== `maps.utils.${transKey}_label` ? t(`maps.utils.${transKey}_label`) : opt.label;
    const labelShort = t(`maps.utils.${transKey}_short`) !== `maps.utils.${transKey}_short` ? t(`maps.utils.${transKey}_short`) : opt.labelShort;
    return { ...opt, label, labelShort };
  });
};

export const FILTER_OPTIONS = FILTER_OPTIONS_BASE;

/**
 * Todos los search terms expandidos por tipo, listos para dispararse
 * en paralelo a la Google Places Text Search API.
 * No incluye 'default' (no tiene términos de búsqueda).
 */
export const ALL_SEARCH_TERMS: Array<{ term: string; type: string; googleTypes?: string[] }> =
  Object.entries(TYPE_CONFIG)
    .filter(([key]) => key !== 'default')
    .flatMap(([type, details]) =>
      details.searchTerms.map(term => ({
        term,
        type,
        googleTypes: details.googleTypes,
      }))
    );