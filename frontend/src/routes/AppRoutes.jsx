import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';

import { LandingPage } from '../pages/LandingPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { AllTasksPage } from '../pages/AllTasksPage.jsx';
import { PendingTasksPage } from '../pages/PendingTasksPage.jsx';
import { CompletedTasksPage } from '../pages/CompletedTasksPage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { SettingsPage } from '../pages/SettingsPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';

export const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route
        path="/register"
        element={!loading && isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route
        path="/login"
        element={!loading && isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected Todo SaaS Workspace */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<AllTasksPage />} />
          <Route path="/tasks/pending" element={<PendingTasksPage />} />
          <Route path="/tasks/completed" element={<CompletedTasksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
