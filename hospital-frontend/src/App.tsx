import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { LoginPage } from '@/pages/login/LoginPage';
import { OpdQueueReceptionist } from '@/pages/opd-queue/OpdQueueReceptionist';
import { OpdQueueDoctor } from '@/pages/opd-queue/OpdQueueDoctor';
import { PatientSearch } from '@/pages/patients/PatientSearch';
import { PatientRegister } from '@/pages/patients/PatientRegister';
import { PatientDetail } from '@/pages/patients/PatientDetail';
import { OpdVisitDetail } from '@/pages/opd/OpdVisitDetail';
import { PrescriptionDetail } from '@/pages/prescriptions/PrescriptionDetail';
import { EmployeeList } from '@/pages/employees/EmployeeList';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/opd-queue" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/employees';
    return '/opd-queue';
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/opd-queue"
          element={
            <ProtectedRoute allowedRoles={['Receptionist', 'Doctor']}>
              {user?.role === 'Doctor' ? <OpdQueueDoctor /> : <OpdQueueReceptionist />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/search"
          element={
            <ProtectedRoute allowedRoles={['Receptionist', 'Doctor']}>
              <PatientSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/register"
          element={
            <ProtectedRoute allowedRoles={['Receptionist']}>
              <PatientRegister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute allowedRoles={['Receptionist', 'Doctor']}>
              <PatientDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opd/:id"
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <OpdVisitDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions/:id"
          element={
            <ProtectedRoute allowedRoles={['Doctor']}>
              <PrescriptionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
