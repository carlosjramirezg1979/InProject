
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
    
    const batch = writeBatch(db);

    const companyRef = doc(collection(db, "companies"));

    const newCompany = {
        ...companyData,
        id: companyRef.id,
        projectIds: [projectId],
        ownerId: projectManagerId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    
    batch.set(companyRef, newCompany);

    const projectRef = doc(db, "projects", projectId);
    batch.update(projectRef, { companyId: companyRef.id });

    const projectManagerRef = doc(db, "projectManagers", projectManagerId);
    batch.update(projectManagerRef, {
        companyIds: arrayUnion(companyRef.id)
    });

    await batch.commit();

    return { companyId: companyRef.id };
};
