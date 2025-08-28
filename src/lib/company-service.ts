
'use server';

import { collection, doc, writeBatch, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { CompanyFormData } from '@/types';

/**
 * Creates a new company document in Firestore and associates it with a project and a project manager.
 * This function performs a batch write to ensure atomicity.
 * 
 * @param companyData - The data for the new company, conforming to the CompanyFormData type.
 * @param projectManagerId - The UID of the project manager creating the company.
 * @param projectId - The ID of the project to associate with the new company.
 */
export const addCompanyAndAssociateWithProject = async (
    companyData: CompanyFormData,
    projectManagerId: string,
    projectId: string
) => {
    if (!projectManagerId || !projectId) {
        throw new Error("Project manager ID and project ID are required.");
    }
    
    // Get a new write batch
    const batch = writeBatch(db);

    // 1. Create a reference for a new company document
    const companyRef = doc(collection(db, "companies"));

    // 2. Set the data for the new company document in the batch
    batch.set(companyRef, {
        ...companyData,
        id: companyRef.id,
        projectIds: arrayUnion(projectId),
        ownerId: projectManagerId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    // 3. Create a reference to the project document
    const projectRef = doc(db, "projects", projectId);
    
    // 4. Update the project document with the new company's ID in the batch
    batch.update(projectRef, { companyId: companyRef.id });

    // 5. Create a reference to the project manager document
    const projectManagerRef = doc(db, "projectManagers", projectManagerId);
    
    // 6. Update the project manager's companyIds array in the batch
    batch.update(projectManagerRef, {
        companyIds: arrayUnion(companyRef.id)
    });

    // Commit the batch
    await batch.commit();

    return { companyId: companyRef.id };
};
