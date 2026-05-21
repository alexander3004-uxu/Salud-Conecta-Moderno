/**
 * OfflineBanner.tsx
 * 
 * Indicador visual del estado de conexión que aparece en la parte superior
 * de la aplicación. Muestra diferentes estados:
 * 
 * 1. OFFLINE:      Banner rojo/ámbar con "Sin conexión — Modo offline"
 * 2. RECONNECTED:  Banner verde con "Conexión restaurada — Sincronizando..."
 * 3. SYNCING:      Indicador de progreso de sincronización
 * 4. ONLINE:       Oculto (no se muestra)
 * 
 * Se integra con NetworkContext para reaccionar automáticamente.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw, CloudOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNetwork } from '../../contexts/NetworkContext';

export function OfflineBanner() {
  const { isOnline, justReconnected, isSyncing, pendingSyncCount } = useNetwork();

  const showBanner = !isOnline || justReconnected || (isSyncing && pendingSyncCount > 0);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden w-full z-[60]"
        >
          {/* ── ESTADO OFFLINE ────────────────────────────────────── */}
          {!isOnline && (
            <div className="relative overflow-hidden">
              {/* Fondo con gradiente animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-amber-900/80 to-red-900/90 animate-gradient-x" />
              
              {/* Patrón de fondo sutil */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                }}
              />

              <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                {/* Ícono con pulso */}
                <div className="relative">
                  <WifiOff className="w-5 h-5 text-red-300" />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Sin conexión
                  </span>
                  <span className="text-xs text-red-200/80 font-medium">
                    Modo offline activado · Tus datos se guardan localmente
                  </span>
                </div>

                {pendingSyncCount > 0 && (
                  <div className="hidden sm:flex items-center gap-1.5 ml-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <CloudOff className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-xs text-amber-200 font-semibold">
                      {pendingSyncCount} pendiente{pendingSyncCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ESTADO RECONECTADO / SINCRONIZANDO ─────────────── */}
          {isOnline && justReconnected && (
            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 ${isSyncing ? 'bg-gradient-to-r from-blue-900/85 via-cyan-900/80 to-blue-900/85' : 'bg-gradient-to-r from-emerald-900/85 via-green-900/80 to-emerald-900/85'} transition-colors duration-500`} />
              
              <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-blue-300 animate-spin" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">
                        Sincronizando datos...
                      </span>
                      <span className="text-xs text-blue-200/80 font-medium">
                        {pendingSyncCount > 0 ? `${pendingSyncCount} operación${pendingSyncCount !== 1 ? 'es' : ''} en cola` : 'Verificando...'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">
                        Conexión restaurada
                      </span>
                      <span className="text-xs text-emerald-200/80 font-medium">
                        Todos tus datos están sincronizados
                      </span>
                    </div>
                    <Wifi className="w-4 h-4 text-emerald-400 ml-1 animate-pulse" />
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Indicador compacto para mostrar el estado de sincronización
 * en la barra de navegación o header. Muestra solo un punto/ícono.
 */
export function SyncStatusIndicator() {
  const { isOnline, pendingSyncCount, isSyncing } = useNetwork();

  if (isOnline && pendingSyncCount === 0 && !isSyncing) return null;

  return (
    <div className="flex items-center gap-1.5" title={
      !isOnline 
        ? 'Sin conexión' 
        : isSyncing 
          ? 'Sincronizando...' 
          : `${pendingSyncCount} pendientes`
    }>
      {!isOnline ? (
        <div className="flex items-center gap-1 text-red-400">
          <WifiOff className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Offline</span>
        </div>
      ) : isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
      ) : pendingSyncCount > 0 ? (
        <div className="flex items-center gap-1 text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">{pendingSyncCount}</span>
        </div>
      ) : null}
    </div>
  );
}
