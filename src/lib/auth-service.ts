
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { SignUpFormValues, SignInFormValues, ForgotPasswordFormValues } from '@/types';

function getFirebaseAuthErrorMessage(error: any): string {
    console.error("Firebase Auth Error:", error);
    if (error && typeof error.code === 'string') {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No se encontró ningún usuario con este correo electrónico.';
        case 'auth/wrong-password':
          return 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.';
        case 'auth/invalid-credential':
          return 'Las credenciales son inválidas. Por favor, revisa tu correo y contraseña.';
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
        case 'auth/invalid-email':
          return 'El formato del correo electrónico no es válido.';
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres.';
        case 'auth/too-many-requests':
            return 'Se ha excedido la cuota de intentos de inicio de sesión. Por favor, inténtalo más tarde.';
        default:
          return 'Ocurrió un error inesperado durante la autenticación. Por favor, inténtalo de nuevo.';
      }
    }
    return 'Ocurrió un error desconocido. Por favor, inténtalo de nuevo.';
  }
  

export const signUp = async ({ firstName, lastName, email, password, phone, country, department, city }: SignUpFormValues) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfileData = {
        firstName,
        lastName,
        email: user.email,
        phone: phone || '',
        country,
        department,
        city,
        companyIds: [],
    };
    
    await setDoc(doc(db, "projectManagers", user.uid), userProfileData);
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseAuthErrorMessage(error) };
  }
};

export const signIn = async ({ email, password }: SignInFormValues) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseAuthErrorMessage(error) };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getFirebaseAuthErrorMessage(error) };
  }
};

export const resetPassword = async ({ email }: ForgotPasswordFormValues) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: getFirebaseAuthErrorMessage(error) };
  }
};
