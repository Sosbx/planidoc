import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Settings, Users, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './common/Logo';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo showText={true} className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            {user.roles.isUser && (
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500'
                  }`
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planning
              </NavLink>
            )}
            {user.roles.isAdmin && (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500'
                    }`
                  }
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration
                </NavLink>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500'
                    }`
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  Utilisateurs
                </NavLink>
              </>
            )}
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;