/**
 * offlineDatabase.ts
 * 
 * Base de datos local con Dexie.js (IndexedDB) para persistencia offline.
 * 
 * Tablas:
 * - chatMessages:  Historial de conversaciones con la IA
 * - triageRecords: Resultados de triaje almacenados localmente
 * - appointments:  Citas médicas (cacheadas del servidor + creadas offline)
 * - formDrafts:    Borradores de formularios (registro, perfil, etc.)
 * - userCache:     Datos del usuario para acceso inmediato sin red
 * - syncQueue:     Cola de operaciones pendientes de sincronización
 */

import Dexie, { type EntityTable } from 'dexie';

// ─── Interfaces de las tablas ────────────────────────────────────────────────

export interface ChatMessage {
  id?: number;
  sessionId: string;       // Agrupa mensajes de una misma conversación
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;       // Date.now()
  metadata?: string;       // JSON serializado con datos extra (ej: triaje asociado)
}

export interface TriageRecordLocal {
  id?: number;
  odId?: string;           // ID del servidor (Firestore) si ya fue sincronizado
  userId: string;
  symptoms: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendation: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  locationInfo?: string;   // JSON serializado con datos de ubicación
  createdAt: number;       // timestamp
  syncStatus: 'local' | 'synced' | 'pending';
}

export interface AppointmentLocal {
  id?: number;
  serverId?: string;       // ID de Firestore si ya fue sincronizado
  userId: string;
  clinicId: string;
  clinicName?: string;
  date: string;            // ISO string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  serviceType: string;
  doctorName?: string;
  location?: string;
  notes?: string;
  updatedAt: number;       // timestamp
  syncStatus: 'local' | 'synced' | 'pending';
}

export interface FormDraft {
  id?: number;
  formType: string;        // 'entity_registration' | 'profile_edit' | 'medical_form' etc.
  formId?: string;         // Identificador del formulario específico
  userId: string;
  data: string;            // JSON serializado del contenido del formulario
  updatedAt: number;       // timestamp
}

export interface UserCacheEntry {
  userId: string;          // Primary key
  email: string;
  displayName: string;
  photoURL?: string;
  membership: 'free' | 'premium';
  role?: 'patient' | 'admin' | 'provider';
  cachedAt: number;        // timestamp
}

export type SyncAction = 'create' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'processing' | 'synced' | 'failed';

export interface SyncQueueItem {
  id?: number;
  action: SyncAction;
  table: string;           // Nombre de la colección en Firestore
  localId?: number;        // ID local del registro en IndexedDB
  payload: string;         // JSON serializado de los datos a sincronizar
  status: SyncStatus;
  retries: number;         // Contador de reintentos
  errorMessage?: string;   // Último mensaje de error
  createdAt: number;       // timestamp
  processedAt?: number;    // timestamp de último intento
}

// ─── Clase de la Base de Datos ───────────────────────────────────────────────

class SaludConectaDB extends Dexie {
  chatMessages!: EntityTable<ChatMessage, 'id'>;
  triageRecords!: EntityTable<TriageRecordLocal, 'id'>;
  appointments!: EntityTable<AppointmentLocal, 'id'>;
  formDrafts!: EntityTable<FormDraft, 'id'>;
  userCache!: EntityTable<UserCacheEntry, 'userId'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('SaludConectaDB');

    this.version(1).stores({
      // Índices: primera columna = primary key (++ = autoincrement)
      // Las demás columnas son índices secundarios para queries rápidas
      chatMessages:  '++id, sessionId, role, timestamp',
      triageRecords: '++id, userId, urgency, createdAt, syncStatus',
      appointments:  '++id, serverId, userId, clinicId, date, status, syncStatus',
      formDrafts:    '++id, formType, userId, updatedAt',
      userCache:     'userId, email, membership',
      syncQueue:     '++id, action, table, status, createdAt',
    });
  }
}

// ─── Instancia Singleton ─────────────────────────────────────────────────────

export const db = new SaludConectaDB();

// ─── Helpers de Chat ─────────────────────────────────────────────────────────

export async function saveChatMessage(msg: Omit<ChatMessage, 'id'>): Promise<number> {
  return await db.chatMessages.add(msg as ChatMessage);
}

export async function getChatSession(sessionId: string): Promise<ChatMessage[]> {
  return await db.chatMessages
    .where('sessionId')
    .equals(sessionId)
    .sortBy('timestamp');
}

export async function getAllChatSessions(): Promise<string[]> {
  const messages = await db.chatMessages.orderBy('timestamp').reverse().toArray();
  const seen = new Set<string>();
  const sessions: string[] = [];
  for (const msg of messages) {
    if (!seen.has(msg.sessionId)) {
      seen.add(msg.sessionId);
      sessions.push(msg.sessionId);
    }
  }
  return sessions;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await db.chatMessages.where('sessionId').equals(sessionId).delete();
}

// ─── Helpers de Triaje ───────────────────────────────────────────────────────

export async function saveTriageLocal(record: Omit<TriageRecordLocal, 'id'>): Promise<number> {
  return await db.triageRecords.add(record as TriageRecordLocal);
}

export async function getTriagesByUser(userId: string): Promise<TriageRecordLocal[]> {
  return await db.triageRecords
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('createdAt');
}

export async function getPendingTriages(): Promise<TriageRecordLocal[]> {
  return await db.triageRecords
    .where('syncStatus')
    .anyOf(['local', 'pending'])
    .toArray();
}

// ─── Helpers de Citas ────────────────────────────────────────────────────────

export async function saveAppointmentLocal(appt: Omit<AppointmentLocal, 'id'>): Promise<number> {
  return await db.appointments.add(appt as AppointmentLocal);
}

export async function getAppointmentsByUser(userId: string): Promise<AppointmentLocal[]> {
  return await db.appointments
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('updatedAt');
}

export async function updateAppointmentSync(localId: number, serverId: string): Promise<void> {
  await db.appointments.update(localId, { serverId, syncStatus: 'synced' });
}

export async function getPendingAppointments(): Promise<AppointmentLocal[]> {
  return await db.appointments
    .where('syncStatus')
    .anyOf(['local', 'pending'])
    .toArray();
}

// ─── Helpers de Formularios ──────────────────────────────────────────────────

export async function saveFormDraft(draft: Omit<FormDraft, 'id'>): Promise<number> {
  // Si ya existe un borrador del mismo tipo y usuario, actualizar
  const existing = await db.formDrafts
    .where(['formType', 'userId'])
    .equals([draft.formType, draft.userId])
    .first();

  if (existing?.id) {
    await db.formDrafts.update(existing.id, { ...draft, updatedAt: Date.now() });
    return existing.id;
  }
  return await db.formDrafts.add(draft as FormDraft);
}

export async function getFormDraft(formType: string, userId: string): Promise<FormDraft | undefined> {
  return await db.formDrafts
    .where('formType')
    .equals(formType)
    .and(d => d.userId === userId)
    .first();
}

export async function deleteFormDraft(id: number): Promise<void> {
  await db.formDrafts.delete(id);
}

// ─── Helpers de Usuario Cache ────────────────────────────────────────────────

export async function cacheUser(user: UserCacheEntry): Promise<void> {
  await db.userCache.put(user);
}

export async function getCachedUser(userId: string): Promise<UserCacheEntry | undefined> {
  return await db.userCache.get(userId);
}

// ─── Helpers de Cola de Sync ─────────────────────────────────────────────────

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<number> {
  return await db.syncQueue.add(item as SyncQueueItem);
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return await db.syncQueue
    .where('status')
    .equals('pending')
    .toArray();
}

export async function updateSyncItemStatus(
  id: number,
  status: SyncStatus,
  errorMessage?: string
): Promise<void> {
  const update: Partial<SyncQueueItem> = {
    status,
    processedAt: Date.now(),
  };
  if (errorMessage) update.errorMessage = errorMessage;
  if (status === 'failed') {
    const item = await db.syncQueue.get(id);
    if (item) update.retries = (item.retries || 0) + 1;
  }
  await db.syncQueue.update(id, update);
}

export async function getSyncQueueCount(): Promise<number> {
  return await db.syncQueue
    .where('status')
    .equals('pending')
    .count();
}

export async function clearSyncedItems(): Promise<void> {
  await db.syncQueue.where('status').equals('synced').delete();
}

// ─── Limpieza de datos antiguos (30 días) ────────────────────────────────────

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function cleanOldData(): Promise<void> {
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  await db.chatMessages.where('timestamp').below(cutoff).delete();
  await db.syncQueue
    .where('status')
    .equals('synced')
    .and(item => (item.processedAt || 0) < cutoff)
    .delete();

  console.log('[OfflineDB] Datos antiguos limpiados (>30 días)');
}
