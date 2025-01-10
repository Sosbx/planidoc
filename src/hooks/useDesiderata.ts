import { useState, useCallback } from 'react';
import { getDesiderata, saveDesiderata, validateDesiderata } from '../lib/firebase/desiderata';
import { useAuth } from './useAuth';
import { useUsers } from '../context/UserContext';

export const useDesiderata = () => {
  const { user } = useAuth();
  const { updateUser } = useUsers();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveUserDesiderata = useCallback(async (selections: Record<string, 'primary' | 'secondary' | null>) => {
    if (!user) return false;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await saveDesiderata(user.id, selections);
      if (Object.keys(selections).length === 0) {
        await updateUser(user.id, { hasValidatedPlanning: false });
      }
      return true;
    } catch (err) {
      console.error('Error saving desiderata:', err);
      setError('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, updateUser]);

  const validateUserDesiderata = useCallback(async (userId: string) => {
    if (!user) return false;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const desiderata = await getDesiderata(userId);
      if (!desiderata?.selections) {
        throw new Error('Aucun desiderata trouvé');
      }
      
      await validateDesiderata(userId, desiderata.selections);
      await updateUser(userId, { hasValidatedPlanning: true });
      return true;
    } catch (err) {
      console.error('Error validating desiderata:', err);
      setError('Erreur lors de la validation');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, updateUser]);

  return {
    isSaving,
    error,
    saveDesiderata: saveUserDesiderata,
    validateDesiderata: validateUserDesiderata
  };
};