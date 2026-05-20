import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Paths */}
        <Route path="/login" element={<Login />} />

        {/* Protected System Admin Scopes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* General Authenticated Fallback */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'guru', 'siswa', 'sppg']} />}>
          <Route path="/dashboard" element={<div style={{ padding: '2rem' }}>General Dashboard</div>} />
        </Route>

        {/* Catchalls */}
        <Route path="/unauthorized" element={<div style={{ padding: '2rem', color: 'red' }}>403 - Access Denied</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}