import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { TriageWithLocationResult } from '../../services/triageService';

interface LocationResultDisplayProps {
  result: TriageWithLocationResult;
  memberId: string;
  onReset: () => void;
}

const warningEmoji: Record<string, string> = {
  emergency: '🚑🔴',
  high: '⚠️🟠',
  medium: '⚠️🟡',
  low: '💚🟢'
};

const severityLabels: Record<string, string> = {
  emergency: 'EMERGENCIA - BUSQUE ATENCIÓN INMEDIATA',
  high: 'ALTA PRIORIDAD - ATENCIÓN URGENTE',
  medium: 'MEDIA PRIORIDAD',
  low: 'BAJA PRIORIDAD'
};

export default function LocationResultDisplay({ result, memberId, onReset }: LocationResultDisplayProps) {
  const errorEmoji = result.error ? '🤖' : warningEmoji[result.severity];

  return (
    <div className="bg-surface-container rounded-2xl shadow-lg border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-on-surface">Resultado de la Consulta</h3>
          <p className="text-sm text-on-surface-variant">Análisis basado en IA con geolocalización</p>
        </div>
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
          aria-label="Reiniciar"
        >
          <Navigation size={20} className="text-on-surface-variant" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Urgency Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${result.severity === 'emergency' ? 'bg-error text-on-error animate-pulse' :
              result.severity === 'high' ? 'bg-amber-500 text-white' :
                result.severity === 'medium' ? 'bg-amber-400 text-white' :
                  'bg-secondary text-on-secondary'
            }`}>
            <span>{errorEmoji}</span>
            {severityLabels[result.severity]}
          </span>
        </div>

        {/* Recommendation */}
        <div className="bg-surface rounded-xl p-4 border-l-4 border-primary shadow-sm">
          <h4 className="text-sm font-semibold text-on-surface mb-1 flex items-center gap-2">
            <Navigation size={16} />
            RECOMENDACIÓN
          </h4>
          <p className="text-on-surface">{result.recommendation}</p>
        </div>

        {/* Location Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl p-4 border-l-4 border-secondary shadow-sm">
            <h4 className="text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <MapPin size={16} />
              CENTRO DE SALUD MÁS CERCANO
            </h4>
            <p className="text-on-surface font-medium">{result.locationInfo?.nearestFacility}</p>
            {result.locationInfo && (
              <>
                <p className="text-sm text-on-surface-variant">{result.locationInfo?.distanceKm} km de distancia</p>
                <p className="text-sm text-on-surface-variant">{result.locationInfo?.travelTime} de viaje aproximado</p>
              </>
            )}
          </div>

          <div className="bg-surface rounded-xl p-4 border-l-4 border-tertiary shadow-sm">
            <h4 className="text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
              <MapPin size={16} />
              ANÁLISIS DE CÁMARA
            </h4>
            <p className="text-on-surface-variant text-sm">{result.reasoning}</p>
          </div>
        </div>

        {/* Location Status */}
        {memberId === 'free' ? (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-on-surface">
              <span className="font-semibold">¡Red Pública (MINSA) activada!</span> - Sus síntomas requieren asistencia de urgencia. Los centros de salud públicos de MINSA están disponibles sin costo.
            </p>
          </div>
        ) : (
          <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
            <p className="text-sm text-on-surface">
              <span className="font-semibold">Red Premium activada</span> - Acceso a las mejores instituciones disponibles según su ubicación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}