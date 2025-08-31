
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { ProjectManager } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: ProjectManager | null;
  loading: boolean;
  reloadUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  reloadUserProfile: async () => {},
});

// Moved outside the component to ensure it's a stable function reference
const fetchUserProfile = async (firebaseUser: User): Promise<ProjectManager | null> => {
    try {
      const docRef = doc(db, "projectManagers", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
            ...docSnap.data(),
            id: docSnap.id
        } as ProjectManager;
      } else {
        console.warn("User profile not found in Firestore for UID:", firebaseUser.uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<ProjectManager | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const profile = await fetchUserProfile(currentUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const reloadUserProfile = useCallback(async () => {
    if (user) {
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, reloadUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
