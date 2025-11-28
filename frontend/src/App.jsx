import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import AreaDetail from './pages/area/AreaDetail';
import SchoolDetail from './pages/school/SchoolDetail';
import AddAsset from './pages/forms/AddAsset';
import EditAsset from './pages/forms/EditAsset';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/area/:id" 
          element={
            <ProtectedRoute>
              <AreaDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/school/:id" 
          element={
            <ProtectedRoute>
              <SchoolDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/school/:id/add" 
          element={
            <ProtectedRoute>
              <AddAsset />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/school/:schoolId/asset/:assetId/edit" 
          element={
            <ProtectedRoute>
              <EditAsset />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;