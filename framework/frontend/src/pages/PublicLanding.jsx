import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicLandingContent from '../features/PublicLandingContent';
import './PublicLanding.css';

const ROLE_PATHS = {
  admin: '/admin',
  sppg:  '/sppg',
  siswa: '/siswa',
  guru:  '/guru',
};

export default function PublicLanding() {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('landing-page');
    return () => root.classList.remove('landing-page');
  }, []);

  useEffect(() => {
    if (token && role) {
      navigate(ROLE_PATHS[role] ?? '/dashboard', { replace: true });
    }
  }, [token, role, navigate]);

  return (
    <div className="pl-root">
      {/* Nav */}
      <nav className="pl-nav">
        <span className="pl-nav-brand">HaloMBG</span>
        <div className="pl-nav-actions">
          <a className="pl-nav-register" onClick={() => navigate('/login', { state: { view: 'register-select' } })}>
            Daftar
          </a>
          <a className="pl-nav-login" onClick={() => navigate('/login')}>
            Masuk
          </a>
        </div>
      </nav>

      {/* Reuse the same content as dashboard beranda */}
      <PublicLandingContent />
    </div>
  );
}
