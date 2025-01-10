import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config';
import { getAuthErrorMessage } from './errors';
import { getUserByLogin } from '../users';
import type { User } from '../../../types/users';

export const signInUser = async (login: string, password: string): Promise<User> => {
  try {
    // Récupérer l'utilisateur par son login
    const userData = await getUserByLogin(login);
    
    if (!userData) {
      throw new Error('Identifiants invalides');
    }
    
    // Se connecter avec l'email et le mot de passe
    await signInWithEmailAndPassword(auth, userData.email, password);
    return userData;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Une erreur est survenue lors de la déconnexion');
  }
};

export const resetPassword = async (login: string): Promise<void> => {
  try {
    const userData = await getUserByLogin(login);
    if (!userData) {
      throw new Error('Aucun compte trouvé avec cet identifiant');
    }
    
    await sendPasswordResetEmail(auth, userData.email);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};