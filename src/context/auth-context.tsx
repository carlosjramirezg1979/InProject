
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { ProjectManager } from '@/types';
import { useRouter } from 'next/navigation';

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

const fetchUserProfile = async (firebaseUser: User): Promise<ProjectManager | null> => {
    try {
      const docRef = doc(db, "projectManagers", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...(docSnap.data() as Omit<ProjectManager, 'id'>)
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
  const router = useRouter();

  const reloadUserProfile = useCallback(async () => {
    if (auth.currentUser) {
        const profile = await fetchUserProfile(auth.currentUser);
        setUserProfile(profile);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const profile = await fetchUserProfile(currentUser);
        setUserProfile(profile);
        router.push('/dashboard');
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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
