import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AddUserForm } from './AddUserForm';
import { BulkAddUserForm } from './BulkAddUserForm';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter des utilisateurs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('single')}
                className={`${
                  activeTab === 'single'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Ajout individuel
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`${
                  activeTab === 'bulk'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Ajout en masse
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'single' ? (
          <AddUserForm onSuccess={onClose} />
        ) : (
          <BulkAddUserForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
};