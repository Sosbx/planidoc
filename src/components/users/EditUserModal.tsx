import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User } from '../../types/users';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, roles: { isAdmin: boolean; isUser: boolean }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [roles, setRoles] = useState({ isAdmin: false, isUser: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setRoles(user.roles);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(user.id, roles);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifier les rôles</h2>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôles
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roles.isAdmin}
                  onChange={(e) => setRoles(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Administrateur</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roles.isUser}
                  onChange={(e) => setRoles(prev => ({ ...prev, isUser: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">Utilisateur</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!roles.isAdmin && !roles.isUser)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;