// Firebase Integration for DEBUGGING UNIVERSE With Kapil (Powered By SarlaYash Mission)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection 
} from 'firebase/firestore';

// Official Configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyAW90f2FXNWS42eLc5HOsVvutcal79r7A4",
  authDomain: "debugging-universe-with-kapil.firebaseapp.com",
  projectId: "debugging-universe-with-kapil",
  storageBucket: "debugging-universe-with-kapil.firebasestorage.app",
  messagingSenderId: "140286912116",
  appId: "1:140286912116:web:fbed28499eb2fea3f3d321",
  measurementId: "G-5VJE6J63LS"
};

// Initialize Firebase App singleton safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Provider
export const auth = getAuth(app);
export { onAuthStateChanged };
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

/**
 * Sign in with Google Popup via Firebase
 */
export async function signInWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const profile = {
      uid: user.uid,
      name: user.displayName || 'Google Verified Learner',
      email: user.email,
      photo: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'User')}&backgroundColor=0f172a&textColor=ffffff`,
      authProvider: 'Google OAuth 2.0 (Firebase)',
      googleId: user.uid,
      verifiedAt: new Date().toISOString()
    };

    // Sync to Firestore
    try {
      const userRef = doc(db, 'learners', user.uid);
      await setDoc(userRef, {
        profile,
        lastActive: new Date().toISOString()
      }, { merge: true });
    } catch (fsError) {
      console.warn('Firestore learner profile sync notice:', fsError.message);
    }

    return { success: true, profile };
  } catch (error) {
    console.error('Firebase Google Auth error:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
}

/**
 * Sign out of Firebase
 */
export async function logOutFirebase() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase sign out error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync Learner State (Scores, Badges, Assessment) to Cloud Firestore
 */
export async function syncLearnerStateToFirestore(uid, stateData) {
  if (!uid) return;
  try {
    const userRef = doc(db, 'learners', uid);
    await setDoc(userRef, {
      ...stateData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore state sync notice:', error.message);
  }
}

/**
 * Fetch Learner State from Cloud Firestore
 */
export async function fetchLearnerStateFromFirestore(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'learners', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.warn('Firestore fetch notice:', error.message);
    return null;
  }
}
