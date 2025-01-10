import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { PlanningConfig, defaultConfig } from '../types/planning';

interface PlanningContextType {
  config: PlanningConfig;
  updateConfig: (newConfig: PlanningConfig) => Promise<void>;
  resetConfig: () => Promise<void>;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

const PLANNING_CONFIG_DOC = 'planning_config';

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PlanningConfig>(defaultConfig);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', PLANNING_CONFIG_DOC), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setConfig({
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          deadline: data.deadline.toDate(),
          isConfigured: true,
        });
      } else {
        setConfig(defaultConfig);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: PlanningConfig) => {
    const configRef = doc(db, 'config', PLANNING_CONFIG_DOC);
    await setDoc(configRef, {
      ...newConfig,
      startDate: newConfig.startDate,
      endDate: newConfig.endDate,
      deadline: newConfig.deadline,
    });
  };

  const resetConfig = async () => {
    try {
      // 1. Supprimer la configuration actuelle au lieu de la réinitialiser
      const configRef = doc(db, 'config', PLANNING_CONFIG_DOC);
      await deleteDoc(configRef);

      // 2. Supprimer tous les desideratas existants
      const desiderataRef = collection(db, 'desiderata');
      const snapshot = await getDocs(desiderataRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // 3. Réinitialiser le statut de validation pour tous les utilisateurs
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const updatePromises = usersSnapshot.docs.map(doc => 
        setDoc(doc.ref, { hasValidatedPlanning: false }, { merge: true })
      );
      await Promise.all(updatePromises);

      // 4. Réinitialiser l'état local
      setConfig(defaultConfig);
    } catch (error) {
      console.error('Error resetting planning:', error);
      throw error;
    }
  };

  return (
    <PlanningContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanningConfig = () => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanningConfig must be used within a PlanningProvider');
  }
  return context;
};