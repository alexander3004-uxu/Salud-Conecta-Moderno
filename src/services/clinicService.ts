import { collection, getDocs, doc, query, writeBatch, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Clinic, OperationType, FirestoreErrorInfo } from '../types';
import { auth } from '../lib/firebase';
import { NICARAGUA_HOSPITALS } from '../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../data/nicaraguaPublicHealthNetwork';

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
};

// ── MINSA Reference Names ──────────────────────────────────────────────────
// Used ONLY to tag Google Places results as sector:'public' — NOT as location source.

const normalizeStr = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

let _minsaNameCache: Set<string> | null = null;

/**
 * Returns a Set of normalized MINSA facility names.
 * Used to tag Google Places results as public sector — NOT as primary data source.
 */
export const getMinsaReferenceNames = (): Set<string> => {
  if (_minsaNameCache) return _minsaNameCache;
  _minsaNameCache = new Set([
    ...NICARAGUA_HOSPITALS.map(h => normalizeStr(h.name)),
    ...PUBLIC_HEALTH_NETWORK.map(h => normalizeStr(h.name)),
  ]);
  return _minsaNameCache;
};

/**
 * Returns supplementary metadata from static MINSA files for a given name.
 * Only phone, services, description — NEVER location.
 */
export const getMinsaMetadata = (name: string) => {
  const normalized = normalizeStr(name);
  return (
    [...NICARAGUA_HOSPITALS, ...PUBLIC_HEALTH_NETWORK].find(
      h => normalizeStr(h.name) === normalized
    ) ?? null
  );
};

// ── Clinic CRUD ────────────────────────────────────────────────────────────

/**
 * Fetches clinics saved to Firestore (by Google Places sync).
 * Static MINSA data is NOT merged here — Google Places is the sole location source.
 */
export const getClinics = async (): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => {
      const data = d.data();
      let loc = data.location;
      // Normalize Firestore GeoPoint → { lat, lng }
      if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        loc = { lat: loc.latitude, lng: loc.longitude };
      }
      return { id: d.id, ...data, location: loc } as Clinic;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getClinicsByType = async (type: Clinic['type']): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs
      .map(d => {
        const data = d.data();
        let loc = data.location;
        if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
          loc = { lat: loc.latitude, lng: loc.longitude };
        }
        return { id: d.id, ...data, location: loc } as Clinic;
      })
      .filter(c => c.type === type);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

/**
 * Seeds Firestore with MINSA static data.
 * Only call this from an admin action — it uses verified MINSA coordinates
 * as a one-time bootstrap, after which Google Places takes over as source of truth.
 */
export const seedPublicClinics = async () => {
  const batch = writeBatch(db);
  const clinicsRef = collection(db, 'clinics');

  for (const clinicData of PUBLIC_HEALTH_NETWORK) {
    const id = clinicData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const docRef = doc(clinicsRef, id);
    batch.set(docRef, clinicData, { merge: true });
  }

  try {
    await batch.commit();
    console.log('Public health network successfully seeded to Firestore.');
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'clinics/batch-seed');
    throw error;
  }
};
