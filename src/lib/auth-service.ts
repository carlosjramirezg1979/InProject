
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { SignUpFormValues, SignInFormValues, ForgotPasswordFormValues } from '@/types';

function getFirebaseAuthErrorMessage(error: any): string {
    console.error("Firebase Auth Error:", error);
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No se encontró ningún usuario con este correo electrónico.';
        case 'auth/wrong-password':
          return 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.';
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
        case 'auth/invalid-email':
          return 'El formato del correo electrónico no es válido.';
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        default:
          return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
      }
    }
    return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
  }
  

export const signUp = async ({ firstName, lastName, email, password, phone, country, department, city }: SignUpFormValues) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
    });

    // Create a document in Firestore 'projectManagers' collection
    await setDoc(doc(db, "projectManagers", user.uid), {
        firstName,
        lastName,
        phone: phone || '',
        country,
        department,
        city,
        companyIds: [],
    });
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseAuthErrorMessage(error as AuthError) };
  }
};

export const signIn = async ({ email, password }: SignInFormValues) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseAuthErrorMessage(error as AuthError) };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getFirebaseAuthErrorMessage(error as AuthError) };
  }
};

export const resetPassword = async ({ email }: ForgotPasswordFormValues) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getFirebaseAuthErrorMessage(error as AuthError) };
  }
};
