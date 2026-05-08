import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Clinic, OperationType, FirestoreErrorInfo } from '../types';
import { auth } from '../lib/firebase';

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
  throw new Error(JSON.stringify(errInfo));
};

export const getClinics = async (): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const q = collection(db, path);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clinic));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const getClinicsByType = async (type: Clinic['type']): Promise<Clinic[]> => {
  const path = 'clinics';
  try {
    const q = query(collection(db, path), where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clinic));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};
