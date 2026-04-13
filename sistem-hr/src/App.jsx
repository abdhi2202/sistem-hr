import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import PageLoader from './components/routing/PageLoader';
import ProtectedRoute from './components/routing/ProtectedRoute';

const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EmployeeManagementPage = lazy(() => import('./pages/EmployeeManagementPage'));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage'));
const LeavePage = lazy(() => import('./pages/LeavePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MasterDataPage = lazy(() => import('./pages/MasterDataPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/karyawan" element={<EmployeeManagementPage />} />
            <Route path="/master" element={<MasterDataPage />} />
            <Route path="/absensi" element={<AttendancePage />} />
            <Route path="/cuti" element={<LeavePage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
