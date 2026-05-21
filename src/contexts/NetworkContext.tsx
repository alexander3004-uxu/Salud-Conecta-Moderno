/**
 * NetworkContext.tsx
 * 
 * React Context que gestiona el estado de conexión a internet para toda la app.
 * 
 * Responsabilidades:
 * - Detecta online/offline en tiempo real
 * - Mantiene conteo de operaciones pendientes de sync
 * - Dispara sincronización automática cuando vuelve internet
 * - Limpia datos antiguos de IndexedDB periódicamente
 * 
 * Uso:
 *   const { isOnline, pendingSyncCount, isSyncing } = useNetwork();
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { processSyncQueue, getPendingCount } from '../services/syncService';
import { cleanOldData, getSyncQueueCount } from '../lib/offlineDatabase';

interface NetworkContextType {
  /** true si el navegador tiene conexión a internet */
  isOnline: boolean;
  /** Número de operaciones pendientes en la cola de sincronización */
  pendingSyncCount: number;
  /** true si se está ejecutando una sincronización actualmente */
  isSyncing: boolean;
  /** true si el usuario estuvo offline y acaba de reconectarse */
  justReconnected: boolean;
  /** Forzar una sincronización manual */
  forceSync: () => Promise<void>;
  /** Refrescar el conteo de pendientes */
  refreshPendingCount: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Delay antes de iniciar sync automático después de reconexión (ms)
const SYNC_DELAY_MS = 2000;
// Tiempo que se muestra el banner de "reconectado" (ms)
const RECONNECTED_DISPLAY_MS = 4000;

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  const wasOfflineRef = useRef(false);
  const reconnectedTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const syncTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Refrescar conteo de pendientes ──────────────────────────────────────
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getSyncQueueCount();
      setPendingSyncCount(count);
    } catch (e) {
      console.error('[Network] Error obteniendo conteo de sync:', e);
    }
  }, []);

  // ── Sincronización forzada ──────────────────────────────────────────────
  const forceSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await processSyncQueue();
      console.log(`[Network] Sync manual: ${result.synced} ok, ${result.failed} fallidos`);
    } catch (e) {
      console.error('[Network] Error en sync manual:', e);
    } finally {
      setIsSyncing(false);
      await refreshPendingCount();
    }
  }, [isSyncing, refreshPendingCount]);

  // ── Handlers de eventos online/offline ──────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      if (wasOfflineRef.current) {
        // El usuario volvió de estar offline
        setJustReconnected(true);

        // Limpiar el banner de reconexión después de unos segundos
        reconnectedTimerRef.current = setTimeout(() => {
          setJustReconnected(false);
        }, RECONNECTED_DISPLAY_MS);

        // Iniciar sincronización automática con un pequeño delay
        syncTimerRef.current = setTimeout(async () => {
          setIsSyncing(true);
          try {
            const result = await processSyncQueue();
            console.log(`[Network] Auto-sync: ${result.synced} ok, ${result.failed} fallidos`);
          } catch (e) {
            console.error('[Network] Error en auto-sync:', e);
          } finally {
            setIsSyncing(false);
            await refreshPendingCount();
          }
        }, SYNC_DELAY_MS);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
      wasOfflineRef.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estado inicial
    if (!navigator.onLine) {
      wasOfflineRef.current = true;
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectedTimerRef.current) clearTimeout(reconnectedTimerRef.current);
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [refreshPendingCount]);

  // ── Refresh periódico del conteo + limpieza de datos viejos ─────────────
  useEffect(() => {
    refreshPendingCount();

    // Limpiar datos >30 días al montar el provider
    cleanOldData().catch(e => console.warn('[Network] Error limpiando datos antiguos:', e));

    // Refresh del conteo cada 30 segundos
    const interval = setInterval(refreshPendingCount, 30_000);
    return () => clearInterval(interval);
  }, [refreshPendingCount]);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        pendingSyncCount,
        isSyncing,
        justReconnected,
        forceSync,
        refreshPendingCount,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

/**
 * Hook para consumir el NetworkContext.
 * Debe usarse dentro de un <NetworkProvider>.
 */
export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork debe usarse dentro de un <NetworkProvider>');
  }
  return context;
};
