
'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { ProjectManager } from '@/types';

type UserProfileUpdateData = Omit<ProjectManager, 'id' | 'companyIds'>;

export const updateUserProfile = async (uid: string, data: Partial<UserProfileUpdateData>) => {
    try {
        const userDocRef = doc(db, "projectManager", uid);
        await updateDoc(userDocRef, {
            ...data
        });
        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: "Failed to update user profile." };
    }
};
