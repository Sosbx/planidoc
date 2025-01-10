import React from 'react';
import { Download, Bell, Eye, FileText } from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import { User } from '../../types/users';

interface UserStatusListProps {
  users: User[];
  onDownloadPlanning: (userId: string, format: 'excel' | 'pdf') => void;
  onPreviewPlanning: (userId: string) => void;
  onSendReminder: (userId: string) => void;
}

const UserStatusList: React.FC<UserStatusListProps> = ({
  users,
  onDownloadPlanning,
  onPreviewPlanning,
  onSendReminder,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mt-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">État des réponses</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div key={user.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <StatusIndicator validated={user.hasValidatedPlanning} />
              <span className="text-sm font-medium text-gray-900">
                {user.lastName} {user.firstName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {user.hasValidatedPlanning && (
                <>
                  <button
                    onClick={() => onPreviewPlanning(user.id)}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Aperçu du planning"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDownloadPlanning(user.id, 'excel')}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Télécharger en Excel"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDownloadPlanning(user.id, 'pdf')}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Télécharger en PDF"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </>
              )}
              {!user.hasValidatedPlanning && (
                <button
                  onClick={() => onSendReminder(user.id)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  title="Envoyer un rappel"
                >
                  <Bell className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatusList;