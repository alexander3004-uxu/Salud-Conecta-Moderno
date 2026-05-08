import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Appointment, OperationType, FirestoreErrorInfo } from '../types';

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

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'updatedAt'>) => {
  const path = 'appointments';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...appointment,
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  const path = 'appointments';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  const path = `appointments/${appointmentId}`;
  try {
    const docRef = doc(db, 'appointments', appointmentId);
    await updateDoc(docRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
