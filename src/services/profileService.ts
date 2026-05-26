import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

// ── Profile Photo Upload ──────────────────────────────────────────────

/**
 * Uploads a profile photo to Firebase Storage and returns the download URL.
 * Photos are stored at: profile-photos/{userId}
 * Each user has a single photo slot — uploading a new one overwrites the old.
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  // Validate file before upload
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('La imagen es demasiado grande. Máximo 5MB.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato no soportado. Usa JPG, PNG, WebP o GIF.');
  }

  const storageRef = ref(storage, `profile-photos/${userId}`);
  
  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
    },
  };

  await uploadBytes(storageRef, file, metadata);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// ── Profile Data Persistence (Firestore) ──────────────────────────────

export interface ProfileData {
  name: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string;
  dob: string;
  photoURL: string;
}

/**
 * Saves profile data to Firestore under /users/{userId}.
 * Uses merge to avoid overwriting fields managed by other parts of the app (role, createdAt, etc.)
 */
export async function saveProfileToFirestore(userId: string, profileData: Partial<ProfileData>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...profileData,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

/**
 * Loads the user profile from Firestore.
 * Returns null if the document doesn't exist.
 */
export async function loadProfileFromFirestore(userId: string): Promise<ProfileData | null> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) return null;
  
  const data = snap.data();
  return {
    name: data.displayName || data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    address: data.address || '',
    bloodType: data.bloodType || '',
    allergies: data.allergies || '',
    dob: data.dob || '',
    photoURL: data.photoURL || '',
  };
}
