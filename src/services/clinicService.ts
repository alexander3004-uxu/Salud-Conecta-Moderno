import { collection, getDocs, doc, getDoc, query, where, setDoc, writeBatch } from 'firebase/firestore';
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

const staticClinics: Clinic[] = [
  ...NICARAGUA_HOSPITALS.map((h, i) => ({ ...h, id: `static-h-${i}` })),
  ...PUBLIC_HEALTH_NETWORK.map((h, i) => ({ ...h, id: `static-p-${i}` }))
];

export const getClinics = async (): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const q = collection(db, path);
    const snapshot = await getDocs(q);
    const dbClinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clinic));
    
    // Merge static hospitals with DB clinics, avoiding duplicates by name
    const allClinics = [...dbClinics];
    staticClinics.forEach(sc => {
      if (!allClinics.find(ac => ac.name === sc.name)) {
        allClinics.push(sc);
      }
    });
    
    return allClinics;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return staticClinics;
  }
};

export const getClinicsByType = async (type: Clinic['type']): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const q = query(collection(db, path), where('type', '==', type));
    const snapshot = await getDocs(q);
    const dbClinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clinic));
    
    const allClinics = [...dbClinics];
    staticClinics.filter(sc => sc.type === type).forEach(sc => {
      if (!allClinics.find(ac => ac.name === sc.name)) {
        allClinics.push(sc);
      }
    });
    
    return allClinics;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return staticClinics.filter(sc => sc.type === type);
  }
};

/**
 * Seeds the clinics collection with the public health network data.
 * This should ideally be called by an admin.
 */
export const seedPublicClinics = async () => {
  const batch = writeBatch(db);
  const clinicsRef = collection(db, 'clinics');
  
  for (const clinicData of PUBLIC_HEALTH_NETWORK) {
    // Use a derived ID from the name to avoid duplicates
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
