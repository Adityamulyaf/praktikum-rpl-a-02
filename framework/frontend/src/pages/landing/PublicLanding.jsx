import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PublicLandingContent from '../../features/PublicLandingContent';
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
  const navRef = useRef(null);

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

  // Scroll-based navbar: full-width → floating rounded
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 80) {
        navRef.current.classList.add('pl-nav--scrolled');
      } else {
        navRef.current.classList.remove('pl-nav--scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pl-root">
      {/* Nav — transparent over hero, solid on scroll */}
      <nav className="pl-nav" ref={navRef}>
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
