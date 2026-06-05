import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import ValidationAI from './pages/ValidationAI';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Paths */}
        <Route path="/login" element={<Login />} />

        {/* Protected System Routes wrapped inside DashboardLayout */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'guru', 'siswa', 'sppg']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/validasi-ai" element={<ValidationAI />} />

            {/* Admin only route wrapped in layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Catchalls */}
        <Route path="/unauthorized" element={<div style={{ padding: '2rem', color: 'var(--status-error)' }}>403 - Access Denied</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}