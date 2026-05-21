import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { registerSW } from 'virtual:pwa-register';

// ── Renderizar la App ─────────────────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

// ── Registrar Service Worker (PWA offline-first) ──────────────────────────────
// vite-plugin-pwa genera el SW automáticamente con Workbox.
// registerSW() lo registra y maneja actualizaciones.
const updateSW = registerSW({
  onNeedRefresh() {
    // El SW detectó una nueva versión de la app disponible
    const shouldUpdate = confirm(
      '🔄 Nueva versión de Salud Conecta disponible.\n¿Deseas actualizar ahora?'
    );
    if (shouldUpdate) {
      updateSW(true); // Forzar actualización del SW
    }
  },
  onOfflineReady() {
    // La app está completamente cacheada y lista para funcionar offline
    console.log('✅ [PWA] Salud Conecta está lista para funcionar sin conexión');
  },
  onRegistered(registration) {
    console.log('📦 [PWA] Service Worker registrado:', registration);
  },
  onRegisterError(error) {
    console.error('❌ [PWA] Error registrando Service Worker:', error);
  },
});
