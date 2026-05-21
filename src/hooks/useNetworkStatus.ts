/**
 * useNetworkStatus.ts
 * 
 * Hook reutilizable para detectar el estado de conexión a internet.
 * Usa la API del navegador (navigator.onLine) + eventos 'online'/'offline'.
 * 
 * Uso:
 *   const { isOnline, wasOffline } = useNetworkStatus();
 * 
 * - isOnline: true si hay conexión actualmente
 * - wasOffline: true si el usuario estuvo offline al menos una vez en esta sesión
 *              (útil para mostrar "Conexión restaurada" después de reconexión)
 */

import { useState, useEffect, useRef } from 'react';

export interface NetworkStatusResult {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatusResult {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const wasOfflineRef = useRef(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Si estuvimos offline, marcarlo para mostrar feedback de reconexión
      if (wasOfflineRef.current) {
        setWasOffline(true);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      wasOfflineRef.current = true;
      setWasOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar estado inicial
    if (!navigator.onLine) {
      wasOfflineRef.current = true;
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
