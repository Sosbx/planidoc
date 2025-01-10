import { z } from 'zod';
import { SYSTEM_ADMIN_EMAIL } from '../lib/firebase/config';

const emailSchema = z.string().email().refine(
  (email) => {
    // Vérifier si c'est l'email admin du système
    if (email === SYSTEM_ADMIN_EMAIL) {
      return true;
    }

    // Pour les autres emails, vérifier le format prenom.nom@h24scm.com
    const [localPart] = email.split('@');
    return email.endsWith('@h24scm.com') && 
           localPart.includes('.') &&
           localPart.split('.').length === 2;
  },
  { message: "L'email doit être au format prenom.nom@h24scm.com ou être l'email administrateur autorisé" }
);

export const generateCredentials = (email: string) => {
  try {
    const validatedEmail = emailSchema.parse(email);

    // Si c'est l'email admin du système, utiliser des valeurs spécifiques
    if (validatedEmail === SYSTEM_ADMIN_EMAIL) {
      return {
        email: validatedEmail.toLowerCase(),
        firstName: 'Secrétariat',
        lastName: 'RD',
        login: 'SECR',
        password: 'SECR33',
        roles: {
          isAdmin: true,
          isUser: false
        }
      };
    }

    // Pour les autres utilisateurs, générer les credentials normalement
    const [firstName, lastName] = validatedEmail.split('@')[0].split('.');
    
    return {
      email: validatedEmail.toLowerCase(),
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      login: lastName.slice(0, 4).toUpperCase(),
      password: `${firstName.slice(0, 4).toUpperCase()}33`,
      roles: {
        isAdmin: false,
        isUser: true
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};