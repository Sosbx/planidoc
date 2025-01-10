import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/users';
import { getUsers, updateUser, deleteUser } from '../lib/firebase/users';
import { createUser } from '../lib/firebase/auth/userCreation';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (userData: Omit<User, 'id' | 'hasValidatedPlanning'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (error: any) {
        console.error('Error loading users:', error);
        setError(error.message || 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const contextValue: UserContextType = {
    users,
    loading,
    error,
    addUser: async (userData) => {
      setLoading(true);
      setError(null);
      try {
        const newUser = await createUser(userData);
        setUsers(prev => [...prev, newUser]);
      } catch (error: any) {
        console.error('Error adding user:', error);
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    updateUser: async (id, userData) => {
      setError(null);
      try {
        await updateUser(id, userData);
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...userData } : user
        ));
      } catch (error: any) {
        console.error('Error updating user:', error);
        setError(error.message);
        throw error;
      }
    },
    deleteUser: async (id) => {
      setError(null);
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(user => user.id !== id));
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError(error.message);
        throw error;
      }
    },
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};