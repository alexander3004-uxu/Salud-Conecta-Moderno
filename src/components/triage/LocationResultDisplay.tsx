import React from 'react';
import { apPinXcompass, Navigation } from 'lucide-react';
import { TriageWithLocationResult } from '../../services/triageService';

interface LocationResultDisplayProps {
  result: TriageWithLocationResult;
  memberId: string;
  onReset: () => void;
}

const warningEmoji = {
  critical: '🚑🔴',
  high: '⚠️🟠', 
  medium: '⚠️🟡',
  low: '💚🟢'
};

const severityLabels = {
  critical: 'CRÍTICO - SALVAJES INMEDIATAMENTE',
  high: 'ALTA PRIORIDAD - ATENCIÓN URGENTE',
  medium: 'MEDIA PRIORIDAD',
  low: 'BAJA PRIORIDAD'
};

export default function LocationResultDisplay({result, memberId, onReset}: LocationResultDisplayProps) {
  const { emergencyInfo, facility } = result;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-300 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Resultado del Triaje</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Análisis basado en IA con geolocalización</p>
        </div>
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          aria-label="Reiniciar"
        >
          <Navigation size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Urgency Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
            result.severity === 'critical' ? 'bg-red-500 text-white animate-pulse' :
            result.severity === 'high' ? 'bg-orange-500 text-white' :
            result.severity === 'medium' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            <span>{warningEmoji[result.severity]}</span>
            {severityLabels[result.severity]}
          </span>
        </div>

        {/* Recommendation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
            <Navigation size={16} />
            RECOMENDACIÓN
          </h4>
          <p className="text-slate-800 dark:text-slate-200">{result.recommendation}</p>
        </div>

        {/* Location Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-l-4 border-green-500 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
              <apPinXcompass size={16} />
              CENTRO DE SALUD MÁS CERCANO
            </h4>
            <p className="text-slate-800 dark:text-slate-200 font-medium">{result.locationInfo?.nearestFacility}</p>
            {result.locationInfo && (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-400">{result.locationInfo?.distanceKm} km de distancia</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{result.locationInfo?.travelTime} de viaje aproximado</p>
              </>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-l-4 border-purple-500 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
              <apPinXcompass size={16} />
              ANÁLISIS DE CÁMARA
            </h4>
            <p className="text-slate-800 dark:text-slate-200 text-sm">{result.reasoning}</p>
          </div>
        </div>

        {/* Location Status */}
        {memberId === 'free' ? (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">¡Red Pública (MINSA) activada!</span> - Sus síntomas requieren asistencia de urgencia. Los centros de salud públicos de MINSA están disponibles sin costo.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <p className="text-sm text-green-800 dark:text-green-300">
              <span className="font-semibold">Red Premium activada</span> - Acceso a las mejores instituciones disponibles según su ubicación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationResultDisplay({result, memberId}: LocationResultDisplayProps) {
  const errorEmoji = result.error ? '🤖' : warningEmoji[result.severity];
  const severityLabels = {
    critical: 'CRÍTICO - 🚑 SOS INMEDIATO',
    high: 'ALTA PRIORIDAD - ⚠️ Atención Urgente',
    medium: 'MEDIA PRIORIDAD - 🤒 Atención Médica',
    low: 'BAJA PRIORIDAD - 🌿 Cuidado General'
  };

  if (result.error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4">
        <p className="text-red-700 dark:text-red-400">
          ❌ Error al procesar su caso. Por favor intente describir sus síntomas con más detalle.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${
        result.severity === 'critical' ? 'bg-red-500' :
        result.severity === 'high' ? 'bg-orange-500' :
        result.severity === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">{errorEmoji