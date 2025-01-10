import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import UsersManagementPage from './pages/UsersManagementPage';
import PlanningPreviewPage from './pages/PlanningPreviewPage';
import ProtectedRoute from './components/ProtectedRoute';
import { PlanningProvider } from './context/PlanningContext';
import { UserProvider } from './context/UserContext';
import { ConnectionStatus } from './components/common/ConnectionStatus';

const App: React.FC = () => {
  return (
    <UserProvider>
      <PlanningProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <Routes>
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requiredRoles={['isAdmin']}>
                            <AdminPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/users" 
                        element={
                          <ProtectedRoute requiredRoles={['isAdmin']}>
                            <UsersManagementPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/planning/:userId" 
                        element={
                          <ProtectedRoute requiredRoles={['isAdmin']}>
                            <PlanningPreviewPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/user" 
                        element={
                          <ProtectedRoute requiredRoles={['isUser']}>
                            <UserPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/" element={<Navigate to="/user" replace />} />
                    </Routes>
                    <ConnectionStatus />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PlanningProvider>
    </UserProvider>
  );
};

export default App;