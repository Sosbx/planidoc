import React, { useState } from 'react';
import { Calendar, Clock, Percent, Save, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlanningConfig } from '../context/PlanningContext';
import ConfigurationDisplay from '../components/ConfigurationDisplay';
import UserStatusList from '../components/users/UserStatusList';
import { useUsers } from '../context/UserContext';
import { exportPlanningToExcel } from '../utils/excelExport';
import { exportPlanningToPDF } from '../utils/pdfExport';
import { getDesiderata } from '../lib/firebase/desiderata';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { config, updateConfig, resetConfig } = usePlanningConfig();
  const { users } = useUsers();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    deadline: '',
    primaryDesiderataLimit: config.primaryDesiderataLimit || 0,
    secondaryDesiderataLimit: config.secondaryDesiderataLimit || 0,
  });

  // Filtrer les utilisateurs qui ont le rôle 'isUser'
  const usersList = users.filter(user => user.roles.isUser);

  const handleDownloadPlanning = async (userId: string, format: 'excel' | 'pdf') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        console.error('User not found');
        return;
      }

      const desiderata = await getDesiderata(userId);
      if (!desiderata?.selections) {
        console.error('No planning data found');
        return;
      }

      if (!config.isConfigured) {
        console.error('Planning not configured');
        return;
      }

      const exportOptions = {
        userName: `${user.lastName}_${user.firstName}`,
        startDate: config.startDate,
        endDate: config.endDate,
        selections: desiderata.selections
      };

      if (format === 'excel') {
        exportPlanningToExcel(exportOptions);
      } else {
        exportPlanningToPDF(exportOptions);
      }
    } catch (error) {
      console.error('Error downloading planning:', error);
    }
  };

  const handlePreviewPlanning = (userId: string) => {
    navigate(`/planning/${userId}`);
  };

  const handleSendReminder = (userId: string) => {
    console.log(`Envoi d'un rappel à l'utilisateur ${userId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      deadline: new Date(formData.deadline),
      primaryDesiderataLimit: formData.primaryDesiderataLimit,
      secondaryDesiderataLimit: formData.secondaryDesiderataLimit,
      isConfigured: true,
    });
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
      resetConfig();
      setFormData({
        startDate: '',
        endDate: '',
        deadline: '',
        primaryDesiderataLimit: 0,
        secondaryDesiderataLimit: 0,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Configuration du Planning</h1>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Paramètres</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Période</label>
                <div className="mt-1 flex space-x-4">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date limite de réponse
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage Desiderata Primaires ({formData.primaryDesiderataLimit}%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.primaryDesiderataLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryDesiderataLimit: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex items-center gap-2 min-w-[4rem] px-2 py-1 bg-red-50 rounded-md">
                    <Percent className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">{formData.primaryDesiderataLimit}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage Desiderata Secondaires ({formData.secondaryDesiderataLimit}%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.secondaryDesiderataLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryDesiderataLimit: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex items-center gap-2 min-w-[4rem] px-2 py-1 bg-orange-50 rounded-md">
                    <Percent className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700">{formData.secondaryDesiderataLimit}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Valider la configuration
              </button>
            </div>
          </form>
        </div>

        <ConfigurationDisplay config={config} />
      </div>

      <UserStatusList
        users={usersList}
        onDownloadPlanning={handleDownloadPlanning}
        onPreviewPlanning={handlePreviewPlanning}
        onSendReminder={handleSendReminder}
      />
    </div>
  );
};

export default AdminPage;