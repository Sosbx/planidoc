import React, { useState, useEffect } from 'react';
import { Calendar, Save } from 'lucide-react';
import PlanningTable from '../components/PlanningTable';
import { usePlanningConfig } from '../context/PlanningContext';
import ConfigurationDisplay from '../components/ConfigurationDisplay';
import Countdown from '../components/Countdown';
import { useAuth } from '../hooks/useAuth';
import { useDesiderata } from '../hooks/useDesiderata';
import Toast from '../components/Toast';
import DownloadButton from '../components/planning/DownloadButton';
import { getDesiderata } from '../lib/firebase/desiderata';

const UserPage: React.FC = () => {
  const { config } = usePlanningConfig();
  const { user } = useAuth();
  const { validateDesiderata, isSaving } = useDesiderata();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);
  const [planningRef, setPlanningRef] = useState<{ saveSelections: () => Promise<void> } | null>(null);
  const [currentSelections, setCurrentSelections] = useState<Record<string, 'primary' | 'secondary' | null>>({});

  useEffect(() => {
    const loadSelections = async () => {
      if (user) {
        const desiderata = await getDesiderata(user.id);
        if (desiderata?.selections) {
          setCurrentSelections(desiderata.selections);
        }
      }
    };
    loadSelections();
  }, [user]);

  useEffect(() => {
    const checkDeadline = () => {
      if (config.deadline) {
        setIsDeadlineExpired(new Date() > config.deadline);
      }
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 1000);
    return () => clearInterval(interval);
  }, [config.deadline]);

  const handleValidate = async () => {
    if (!user || !planningRef) return;
    
    try {
      await planningRef.saveSelections();
      const success = await validateDesiderata(user.id);
      if (success) {
        setToast({
          visible: true,
          message: 'Planning validé avec succès',
          type: 'success'
        });
      } else {
        setToast({
          visible: true,
          message: 'Erreur lors de la validation',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        visible: true,
        message: 'Erreur lors de la validation',
        type: 'error'
      });
    }
  };

  if (!user?.roles.isUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Accès non autorisé</h2>
          <p className="text-yellow-700">
            En tant qu'administrateur uniquement, vous n'avez pas accès au planning des desiderata.
            Seuls les utilisateurs peuvent remplir leurs desiderata.
          </p>
        </div>
      </div>
    );
  }

  if (!config.isConfigured) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Planning non configuré</h2>
          <p className="text-yellow-700">
            Veuillez attendre que l'administrateur configure le planning.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast 
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ConfigurationDisplay config={config} className="flex-1" />
        <Countdown deadline={config.deadline} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Planning</h2>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleValidate}
              disabled={isDeadlineExpired || isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                user.hasValidatedPlanning ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Validation...' : 'Valider'}
            </button>
            <DownloadButton
              userName={`${user.lastName}_${user.firstName}`}
              startDate={config.startDate}
              endDate={config.endDate}
              selections={currentSelections}
              disabled={!user.hasValidatedPlanning}
            />
          </div>
        </div>

        <PlanningTable 
          ref={setPlanningRef}
          startDate={config.startDate} 
          endDate={config.endDate}
          primaryLimit={config.primaryDesiderataLimit}
          secondaryLimit={config.secondaryDesiderataLimit}
          isDeadlineExpired={isDeadlineExpired}
        />
      </div>
    </div>
  );
};

export default UserPage;