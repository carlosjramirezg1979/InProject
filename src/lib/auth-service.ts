
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { auth } from './firebase';
import type { SignInFormValues, SignUpFormValues, ForgotPasswordFormValues } from '@/types';
import { projectManagers } from './data';

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
  

export const signUp = async ({ firstName, lastName, email, password, phone }: SignUpFormValues) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    try {
        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`,
        });
    } catch (updateError) {
        console.error("Error updating profile:", updateError);
        // Even if profile update fails, we can still consider the user created.
        // You might want to handle this differently, e.g., by deleting the user.
    }

    // Add user to the mock data array. In a real app, this would be an API call to your backend.
    const newUser = {
        id: userCredential.user.uid,
        firstName,
        lastName,
        email,
        phone,
        companyIds: [], // Start with no companies
    };
    projectManagers.push(newUser);
    
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
