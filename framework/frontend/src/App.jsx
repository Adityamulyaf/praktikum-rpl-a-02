import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ValidationAICard from './components/ValidationAICard';
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
            <Route path="/dashboard" element={
              <div style={{ padding: '1rem', textAlign: 'left' }}>
                <h1 style={{ marginBottom: '8px' }}>Selamat Datang Kembali</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Ini adalah pusat monitoring program Makan Bergizi Gratis (MBG) untuk sekolah Anda.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <ValidationAICard />
                  <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Ringkasan Program</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Status Validasi Hari Ini:</span>
                      <span style={{ fontWeight: '600', color: 'var(--status-success)' }}>Tervalidasi (12 Laporan)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Sekolah Penerima:</span>
                      <span style={{ fontWeight: '600' }}>SDN Jayasinga 01</span>
                    </div>
                  </div>
                </div>
              </div>
            } />
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