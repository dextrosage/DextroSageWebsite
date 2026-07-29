import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProfile } from './pages/admin/Profile';
import { SuperAdminDashboard } from './pages/sadmin/Dashboard';
import { SuperAdminMemberSessions } from './pages/sadmin/MemberSessions';
import { SuperAdminProfile } from './pages/sadmin/Profile';
import { UserDashboard } from './pages/user/Dashboard';
import { UserProfile } from './pages/user/Profile';
import { PublicLayout } from './layouts/PublicLayout';
import { Landing } from './pages/Landing';
import { Announcements } from './pages/Announcements';
import { ScrollToTop } from './components/ScrollToTop';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes with persistent 3D Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Super Admin Routes */}
            <Route
              path="/sadmin"
              element={
                <ProtectedRoute allowedRole="SADMIN">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SuperAdminDashboard />} />
              <Route path="member/:userId" element={<SuperAdminMemberSessions />} />
              <Route path="profile" element={<SuperAdminProfile />} />
              <Route path="announcements" element={<Announcements />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="announcements" element={<Announcements />} />
            </Route>

            {/* Standard User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRole="USER">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="announcements" element={<Announcements />} />
            </Route>

            {/* Catch-all fallback redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
