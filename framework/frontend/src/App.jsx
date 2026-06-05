import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLanding from './pages/landing/PublicLanding';
import Login from './pages/login/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import SppgDashboard from './pages/sppg/SppgDashboard';
import SiswaDashboard from './pages/siswa/SiswaDashboard';
import GuruDashboard from './pages/guru/GuruDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLanding />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* SPPG */}
        <Route element={<ProtectedRoute allowedRoles={['sppg']} />}>
          <Route path="/sppg" element={<SppgDashboard />} />
        </Route>

        {/* Siswa */}
        <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
          <Route path="/siswa" element={<SiswaDashboard />} />
        </Route>

        {/* Guru */}
        <Route element={<ProtectedRoute allowedRoles={['guru']} />}>
          <Route path="/guru" element={<GuruDashboard />} />
        </Route>

        {/* Catchalls */}
        <Route path="/unauthorized" element={<div style={{ padding: '2rem', color: 'red' }}>403 - Access Denied</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
