import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

export const getDesiderata = async (userId: string) => {
  try {
    const docRef = doc(db, 'desiderata', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting desiderata:', error);
    throw error;
  }
};

export const saveDesiderata = async (
  userId: string, 
  selections: Record<string, 'primary' | 'secondary' | null>
) => {
  try {
    const docRef = doc(db, 'desiderata', userId);
    
    if (Object.keys(selections).length === 0) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        userId,
        selections,
        updatedAt: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving desiderata:', error);
    throw error;
  }
};

export const validateDesiderata = async (
  userId: string, 
  selections: Record<string, 'primary' | 'secondary' | null>
) => {
  try {
    const docRef = doc(db, 'desiderata', userId);
    await setDoc(docRef, {
      userId,
      selections,
      validatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error validating desiderata:', error);
    throw error;
  }
};