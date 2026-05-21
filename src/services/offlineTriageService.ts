/**
 * offlineTriageService.ts
 * 
 * Wrapper offline-aware para el servicio de triaje médico.
 * 
 * Estrategia:
 * 1. El triaje con IA (Gemini) requiere internet — si está offline, usa el
 *    fallback local que ya existe en triageService.ts (base de datos de Granada)
 * 2. Los resultados SIEMPRE se guardan en IndexedDB
 * 3. Si hay internet, también se envían a Firestore
 * 4. Si no hay internet, se encolan para sincronización posterior
 */

import {
  saveTriageLocal,
  getTriagesByUser,
  type TriageRecordLocal,
} from '../lib/offlineDatabase';
import { enqueueSyncOperation } from './syncService';
import { saveTriageRecord, getUserTriages, getEnhancedTriageWithLocation } from './triageService';
import type { TriageRecord } from '../types';
import type { TriageWithLocationResult } from './triageService';

/**
 * Ejecutar un triaje inteligente con soporte offline.
 * 
 * Si hay internet: usa Gemini AI + geolocalización
 * Si NO hay internet: usa la base de datos local de Granada
 * 
 * En ambos casos, el resultado se guarda en IndexedDB.
 */
export async function runTriageOffline(
  symptoms: string,
  userId: string,
  membership: 'free' | 'premium' = 'free'
): Promise<{ result: TriageWithLocationResult; localId: number; isOffline: boolean }> {
  // 1. Ejecutar el triaje (el propio getEnhancedTriageWithLocation ya tiene
  //    fallback local cuando Gemini no está disponible)
  let result: TriageWithLocationResult;
  let isOffline = !navigator.onLine;

  try {
    result = await getEnhancedTriageWithLocation(symptoms, membership);
  } catch (e) {
    console.error('[OfflineTriage] Error en triaje, usando fallback genérico:', e);
    isOffline = true;
    result = {
      severity: 'medium',
      recommendation: 'No se pudo completar el análisis. Consulte con un profesional de salud si sus síntomas persisten o empeoran.',
      reasoning: 'Triaje ejecutado en modo offline sin coincidencia local.',
      error: true,
    };
  }

  // 2. Guardar resultado en IndexedDB
  const localId = await saveTriageLocal({
    userId,
    symptoms,
    urgency: result.severity,
    recommendation: result.recommendation,
    medication: result.medication?.name,
    dosage: result.medication?.dosage,
    frequency: result.medication?.frequency,
    duration: result.medication?.duration,
    instructions: result.reasoning,
    locationInfo: result.locationInfo ? JSON.stringify(result.locationInfo) : undefined,
    createdAt: Date.now(),
    syncStatus: 'local',
  });

  // 3. Intentar guardar en Firestore
  if (navigator.onLine && !result.error) {
    try {
      const firestoreRecord: Omit<TriageRecord, 'id' | 'createdAt'> = {
        userId,
        symptoms,
        urgency: result.severity,
        recommendation: result.recommendation,
        medication: result.medication?.name,
        dosage: result.medication?.dosage,
        frequency: result.medication?.frequency,
        duration: result.medication?.duration,
        instructions: result.reasoning,
      };

      const serverId = await saveTriageRecord(firestoreRecord);
      if (serverId) {
        // Actualizar el registro local con el ID del servidor
        const { db } = await import('../lib/offlineDatabase');
        await db.triageRecords.update(localId, { odId: serverId, syncStatus: 'synced' });
      }
    } catch (e) {
      console.warn('[OfflineTriage] Firestore falló, encolando para sync:', e);
      await enqueueSyncOperation('create', 'triages', {
        userId,
        symptoms,
        urgency: result.severity,
        recommendation: result.recommendation,
        medication: result.medication?.name,
        dosage: result.medication?.dosage,
        frequency: result.medication?.frequency,
        duration: result.medication?.duration,
        instructions: result.reasoning,
      }, localId);
    }
  } else if (!navigator.onLine) {
    // 4. Encolar para sync posterior
    await enqueueSyncOperation('create', 'triages', {
      userId,
      symptoms,
      urgency: result.severity,
      recommendation: result.recommendation,
      medication: result.medication?.name,
      dosage: result.medication?.dosage,
      frequency: result.medication?.frequency,
      duration: result.medication?.duration,
      instructions: result.reasoning,
    }, localId);
  }

  return { result, localId, isOffline };
}

/**
 * Obtener historial de triajes del usuario.
 * Combina datos locales con datos del servidor.
 */
export async function getTriageHistoryOffline(userId: string): Promise<TriageRecordLocal[]> {
  // 1. Siempre obtener datos locales
  const localTriages = await getTriagesByUser(userId);

  // 2. Si hay internet, intentar obtener del servidor y cachear nuevos
  if (navigator.onLine) {
    try {
      const serverTriages = await getUserTriages(userId);

      for (const triage of serverTriages) {
        // Verificar si ya existe localmente
        const existsLocally = localTriages.some(lt => lt.odId === triage.id);

        if (!existsLocally) {
          await saveTriageLocal({
            odId: triage.id,
            userId: triage.userId,
            symptoms: triage.symptoms,
            urgency: triage.urgency,
            recommendation: triage.recommendation,
            medication: triage.medication,
            dosage: triage.dosage,
            frequency: triage.frequency,
            duration: triage.duration,
            instructions: triage.instructions,
            createdAt: new Date(triage.createdAt).getTime(),
            syncStatus: 'synced',
          });
        }
      }

      // Re-obtener la lista actualizada
      return await getTriagesByUser(userId);
    } catch (e) {
      console.warn('[OfflineTriage] No se pudo obtener del servidor, usando datos locales:', e);
    }
  }

  return localTriages;
}

/**
 * Guardar un mensaje de chat en IndexedDB.
 * Los chats se guardan SOLO localmente (no se sincronizan con Firestore).
 */
export async function saveChatMessageOffline(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, any>
): Promise<number> {
  const { saveChatMessage } = await import('../lib/offlineDatabase');
  return await saveChatMessage({
    sessionId,
    role,
    content,
    timestamp: Date.now(),
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });
}
