import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TriageRecord, OperationType, FirestoreErrorInfo } from '../types';

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

export const saveTriageRecord = async (record: Omit<TriageRecord, 'id' | 'createdAt'>) => {
  const path = 'triages';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...record,
      createdAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserTriages = async (userId: string): Promise<TriageRecord[]> => {
  const path = 'triages';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TriageRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};
