import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  AuthError
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Handle cross-origin isolation and popup issues
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google Sign-In with Popup...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Success! User signed in:", result.user.email);
    return result.user;
  } catch (error: any) {
    const authError = error as AuthError;
    
    console.error("Firebase Auth Error occurred:", {
      code: authError.code,
      message: authError.message,
    });

    if (authError.code === 'auth/popup-closed-by-user' || authError.code === 'auth/cancelled-popup-request') {
      return null;
    }

    if (authError.code === 'auth/unauthorized-domain') {
       const domain = typeof window !== 'undefined' ? window.location.hostname : 'domain';
       const message = `Error de Autorización: El dominio "${domain}" no está en la lista de permitidos en Firebase Console.`;
       console.error(message);
       throw new Error(message);
    } 
    
    if (authError.code === 'auth/popup-blocked') {
       const message = "Ventana emergente bloqueada. Por favor, permite los popups o intenta usar el método de redirección.";
       console.error(message);
       throw new Error(message);
    }

    // Default to trying redirect for other persistent errors, or just throw
    console.warn("Popup sign-in failed, suggesting redirect fallback.");
    throw error;
  }
};

export const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google Redirect:", error);
    throw error;
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    return null;
  }
};
