import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storage, db, auth } from '../lib/firebase';

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

  // Use a unique filename with extension to avoid caching issues
  const ext = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `profile-photos/${userId}/avatar.${ext}`);
  
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
 * Saves the photoURL and profile fields to the user's Firestore document.
 * Maps local field names to what Firestore/rules expect.
 * Uses merge to avoid overwriting auth-managed fields (role, createdAt, etc.)
 */
export async function saveProfileToFirestore(userId: string, profileData: ProfileData): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  // Only send fields that Firestore rules allow to be updated
  // The rules check affectedKeys().hasOnly(['displayName', 'photoURL', 'phone', 'address', 'bloodType', 'allergies', 'dob', 'updatedAt'])
  const updatePayload: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  // Map 'name' to 'displayName' which is what Firestore expects
  if (profileData.name) updatePayload.displayName = profileData.name;
  if (profileData.photoURL) updatePayload.photoURL = profileData.photoURL;
  if (profileData.phone) updatePayload.phone = profileData.phone;
  if (profileData.address) updatePayload.address = profileData.address;
  if (profileData.bloodType) updatePayload.bloodType = profileData.bloodType;
  if (profileData.allergies) updatePayload.allergies = profileData.allergies;
  if (profileData.dob) updatePayload.dob = profileData.dob;

  await setDoc(userRef, updatePayload, { merge: true });
}

/**
 * Loads the user profile from Firestore.
 * Returns null if the document doesn't exist.
 */
export async function loadProfileFromFirestore(userId: string): Promise<ProfileData | null> {
  try {
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
  } catch (err) {
    console.warn('loadProfileFromFirestore failed:', err);
    return null;
  }
}
