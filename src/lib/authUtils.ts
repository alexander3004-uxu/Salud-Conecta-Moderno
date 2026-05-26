import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export const syncUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || '',
      role: user.email === 'mcalebr04@gmail.com' ? 'admin' : 'patient',
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  } else if (user.email === 'mcalebr04@gmail.com' && userSnap.data()?.role !== 'admin') {
    // Ensure this specific user is always admin even if profile exists
    await setDoc(userRef, { role: 'admin' }, { merge: true });
  }
};
