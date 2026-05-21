import { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Offline mode — create a mock user
      setUser({ uid: 'offline-' + Date.now(), displayName: 'GHOST', isAnonymous: true, offline: true });
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginAnonymous = async (displayName) => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'offline-' + Date.now(), displayName: displayName || 'GHOST', isAnonymous: true, offline: true });
      return;
    }
    try {
      const cred = await signInAnonymously(auth);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Fallback to offline
      setUser({ uid: 'offline-' + Date.now(), displayName: displayName || 'GHOST', isAnonymous: true, offline: true });
    }
  };

  const loginEmail = async (email, password, displayName) => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'offline-' + Date.now(), displayName: displayName || email.split('@')[0], isAnonymous: false, offline: true });
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
         await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw err;
      }
    }
  };

  const loginGoogle = async () => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'offline-google-' + Date.now(), displayName: 'GHOST_GOOGLE', isAnonymous: false, offline: true });
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Auth error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAnonymous, loginEmail, loginGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
