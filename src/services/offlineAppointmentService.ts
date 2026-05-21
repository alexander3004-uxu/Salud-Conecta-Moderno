/**
 * offlineAppointmentService.ts
 * 
 * Wrapper offline-aware para el servicio de citas médicas.
 * 
 * Estrategia offline-first:
 * 1. SIEMPRE guardar en IndexedDB primero (respuesta instantánea al usuario)
 * 2. Si hay internet → intentar enviar a Firestore inmediatamente
 * 3. Si no hay internet o Firestore falla → encolar para sincronización posterior
 * 4. Las lecturas priorizan IndexedDB (datos locales + cacheados del servidor)
 */

import {
  saveAppointmentLocal,
  getAppointmentsByUser,
  updateAppointmentSync,
  type AppointmentLocal,
} from '../lib/offlineDatabase';
import { enqueueSyncOperation } from './syncService';
import { createAppointment, getUserAppointments, cancelAppointment } from './appointmentService';
import type { Appointment } from '../types';
import { db as offlineDb } from '../lib/offlineDatabase';

/**
 * Crear una cita médica con soporte offline.
 * Guarda localmente primero, luego intenta sincronizar con Firestore.
 */
export async function createAppointmentOffline(
  appointment: Omit<Appointment, 'id' | 'updatedAt'>
): Promise<{ localId: number; serverId?: string; isOffline: boolean }> {
  // 1. Guardar siempre en IndexedDB primero
  const localId = await saveAppointmentLocal({
    userId: appointment.userId,
    clinicId: appointment.clinicId,
    date: appointment.date,
    status: appointment.status,
    serviceType: appointment.serviceType,
    doctorName: appointment.doctorName,
    location: appointment.location,
    notes: appointment.notes,
    updatedAt: Date.now(),
    syncStatus: 'local',
  });

  // 2. Si hay internet, intentar enviar a Firestore
  if (navigator.onLine) {
    try {
      const serverId = await createAppointment(appointment);
      if (serverId) {
        await updateAppointmentSync(localId, serverId);
        return { localId, serverId, isOffline: false };
      }
    } catch (e) {
      console.warn('[OfflineAppt] Firestore falló, encolando para sync:', e);
    }
  }

  // 3. Encolar para sincronización posterior
  await enqueueSyncOperation('create', 'appointments', {
    ...appointment,
    updatedAt: new Date().toISOString(),
  }, localId);

  return { localId, isOffline: true };
}

/**
 * Obtener citas del usuario combinando datos locales con datos del servidor.
 * Prioriza datos frescos de Firestore si hay internet, pero siempre
 * incluye citas locales no sincronizadas.
 */
export async function getAppointmentsOffline(userId: string): Promise<AppointmentLocal[]> {
  // 1. Obtener citas locales siempre
  const localAppointments = await getAppointmentsByUser(userId);

  // 2. Si hay internet, intentar obtener del servidor y cachear
  if (navigator.onLine) {
    try {
      const serverAppointments = await getUserAppointments(userId);

      // Cachear las citas del servidor en IndexedDB
      for (const appt of serverAppointments) {
        // Verificar si ya existe localmente
        const existingLocal = localAppointments.find(
          la => la.serverId === appt.id
        );

        if (!existingLocal) {
          // Nueva cita del servidor, guardar localmente
          await saveAppointmentLocal({
            serverId: appt.id,
            userId: appt.userId,
            clinicId: appt.clinicId,
            date: appt.date,
            status: appt.status,
            serviceType: appt.serviceType,
            doctorName: appt.doctorName,
            location: appt.location,
            notes: appt.notes,
            updatedAt: Date.now(),
            syncStatus: 'synced',
          });
        }
      }

      // Re-obtener la lista completa actualizada
      return await getAppointmentsByUser(userId);
    } catch (e) {
      console.warn('[OfflineAppt] No se pudo obtener del servidor, usando datos locales:', e);
    }
  }

  return localAppointments;
}

/**
 * Cancelar una cita con soporte offline.
 */
export async function cancelAppointmentOffline(
  localId: number,
  serverId?: string
): Promise<void> {
  // 1. Actualizar estado local inmediatamente
  await offlineDb.appointments.update(localId, {
    status: 'cancelled',
    updatedAt: Date.now(),
    syncStatus: serverId ? 'pending' : 'local',
  });

  // 2. Si hay internet y existe en el servidor, cancelar allá también
  if (navigator.onLine && serverId) {
    try {
      await cancelAppointment(serverId);
      await offlineDb.appointments.update(localId, { syncStatus: 'synced' });
      return;
    } catch (e) {
      console.warn('[OfflineAppt] Error cancelando en servidor, encolando...', e);
    }
  }

  // 3. Encolar para sync si tiene serverId
  if (serverId) {
    await enqueueSyncOperation('update', 'appointments', {
      serverId,
      status: 'cancelled',
    }, localId);
  }
}
