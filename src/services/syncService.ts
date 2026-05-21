/**
 * syncService.ts
 * 
 * Servicio de sincronización inteligente.
 * 
 * Procesa la cola de operaciones pendientes (syncQueue) cuando el usuario
 * recupera conexión a internet. Cada operación se intenta enviar a Firestore
 * y se marca como 'synced' o 'failed' según el resultado.
 * 
 * Flujo:
 * 1. Usuario crea/modifica dato → se guarda en IndexedDB
 * 2. Se agrega entrada a syncQueue con status 'pending'
 * 3. Al detectar 'online' → processSyncQueue() itera sobre pendientes
 * 4. Éxito → marca 'synced', Fallo → incrementa retries, marca 'failed' si > 3
 */

import {
  db,
  getPendingSyncItems,
  updateSyncItemStatus,
  clearSyncedItems,
  type SyncQueueItem,
} from '../lib/offlineDatabase';

import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db as firestoreDb, auth } from '../lib/firebase';

const MAX_RETRIES = 3;

// Estado global para evitar ejecuciones paralelas
let isSyncing = false;

/**
 * Procesa todas las operaciones pendientes en la cola de sincronización.
 * Se llama automáticamente cuando el usuario vuelve a estar online.
 * 
 * @returns Objeto con conteos de operaciones exitosas y fallidas
 */
export async function processSyncQueue(): Promise<{ synced: number; failed: number }> {
  if (isSyncing) {
    console.log('[Sync] Ya hay una sincronización en progreso, omitiendo...');
    return { synced: 0, failed: 0 };
  }

  isSyncing = true;
  let synced = 0;
  let failed = 0;

  try {
    const pendingItems = await getPendingSyncItems();

    if (pendingItems.length === 0) {
      console.log('[Sync] No hay operaciones pendientes.');
      return { synced: 0, failed: 0 };
    }

    console.log(`[Sync] Procesando ${pendingItems.length} operaciones pendientes...`);

    for (const item of pendingItems) {
      // Verificar que seguimos online antes de cada operación
      if (!navigator.onLine) {
        console.log('[Sync] Se perdió conexión durante la sincronización. Pausando...');
        break;
      }

      // Saltar items que superaron el máximo de reintentos
      if (item.retries >= MAX_RETRIES) {
        await updateSyncItemStatus(item.id!, 'failed', 'Máximo de reintentos alcanzado');
        failed++;
        continue;
      }

      try {
        await updateSyncItemStatus(item.id!, 'processing' as any);
        await processItem(item);
        await updateSyncItemStatus(item.id!, 'synced');
        synced++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`[Sync] Error procesando item #${item.id}:`, errorMsg);
        await updateSyncItemStatus(item.id!, 'failed', errorMsg);
        failed++;
      }
    }

    // Limpiar items ya sincronizados exitosamente
    await clearSyncedItems();

    console.log(`[Sync] Completado: ${synced} sincronizados, ${failed} fallidos`);
  } catch (error) {
    console.error('[Sync] Error general en la cola de sincronización:', error);
  } finally {
    isSyncing = false;
  }

  return { synced, failed };
}

/**
 * Procesa un item individual de la cola de sincronización.
 * Determina la acción (create/update/delete) y la ejecuta en Firestore.
 */
async function processItem(item: SyncQueueItem): Promise<void> {
  const payload = JSON.parse(item.payload);
  const collectionName = item.table;

  switch (item.action) {
    case 'create': {
      // Crear documento en Firestore
      const docData = {
        ...payload,
        updatedAt: serverTimestamp(),
        syncedFromOffline: true,
        syncedAt: new Date().toISOString(),
      };
      // Remover campos locales que no deben ir a Firestore
      delete docData.id;
      delete docData.syncStatus;
      delete docData.serverId;

      const docRef = await addDoc(collection(firestoreDb, collectionName), docData);

      // Actualizar el registro local con el ID del servidor
      if (item.localId) {
        await updateLocalRecordWithServerId(collectionName, item.localId, docRef.id);
      }

      console.log(`[Sync] Creado en ${collectionName}: ${docRef.id}`);
      break;
    }

    case 'update': {
      if (!payload.serverId) {
        throw new Error('No se puede actualizar sin serverId');
      }
      const docRef = doc(firestoreDb, collectionName, payload.serverId);
      const updateData = { ...payload, updatedAt: serverTimestamp() };
      delete updateData.id;
      delete updateData.syncStatus;
      delete updateData.serverId;

      await updateDoc(docRef, updateData);
      console.log(`[Sync] Actualizado en ${collectionName}: ${payload.serverId}`);
      break;
    }

    case 'delete': {
      if (!payload.serverId) {
        throw new Error('No se puede eliminar sin serverId');
      }
      const docRef = doc(firestoreDb, collectionName, payload.serverId);
      await deleteDoc(docRef);
      console.log(`[Sync] Eliminado de ${collectionName}: ${payload.serverId}`);
      break;
    }

    default:
      throw new Error(`Acción desconocida: ${item.action}`);
  }
}

/**
 * Actualiza un registro local en IndexedDB con el ID recibido de Firestore.
 * Esto vincula el registro local con su contraparte en el servidor.
 */
async function updateLocalRecordWithServerId(
  tableName: string,
  localId: number,
  serverId: string
): Promise<void> {
  try {
    switch (tableName) {
      case 'appointments':
        await db.appointments.update(localId, { serverId, syncStatus: 'synced' });
        break;
      case 'triages':
        await db.triageRecords.update(localId, { odId: serverId, syncStatus: 'synced' });
        break;
      default:
        console.warn(`[Sync] Tabla '${tableName}' no tiene handler de actualización local`);
    }
  } catch (e) {
    console.error(`[Sync] Error actualizando registro local ${tableName}#${localId}:`, e);
  }
}

/**
 * Encola una operación para sincronización futura.
 * Wrapper conveniente que construye el SyncQueueItem correctamente.
 */
export async function enqueueSyncOperation(
  action: 'create' | 'update' | 'delete',
  table: string,
  payload: Record<string, any>,
  localId?: number
): Promise<number> {
  const { addToSyncQueue } = await import('../lib/offlineDatabase');

  const queueId = await addToSyncQueue({
    action,
    table,
    localId,
    payload: JSON.stringify(payload),
    status: 'pending',
    retries: 0,
    createdAt: Date.now(),
  });

  console.log(`[Sync] Encolado: ${action} en ${table} (queue #${queueId})`);
  return queueId;
}

/**
 * Retorna el número de operaciones pendientes de sincronización.
 */
export async function getPendingCount(): Promise<number> {
  const { getSyncQueueCount } = await import('../lib/offlineDatabase');
  return await getSyncQueueCount();
}
