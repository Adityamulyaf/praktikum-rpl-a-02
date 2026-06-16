import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterSelectForm from './RegisterSelectForm';
import SiswaRegisterForm from './SiswaRegisterForm';
import GuruRegisterForm from './GuruRegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import Logo from '../../components/Logo';
import './Login.css';

// Import Framer Motion for smooth login views swap
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_PATHS = {
  admin: '/admin',
  sppg:  '/sppg',
  siswa: '/siswa',
  guru:  '/guru',
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, token, role } = useAuth();
  const [view, setView] = useState(location.state?.view ?? 'login');
  const [googleData, setGoogleData] = useState(null);
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('login-page');
    return () => root.classList.remove('login-page');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const roleParam = params.get('role');
    const errorParam = params.get('error');

    const googleRegister = params.get('google_register');
    const googleEmail = params.get('email');
    const googleName = params.get('name');
    const googleId = params.get('google_id');

    if (tokenParam && roleParam) {
      // Direct Google Login
      localStorage.setItem('access_token', tokenParam);
      api.get('/me')
        .then(response => {
          login({ access_token: tokenParam, role: roleParam, user: response.data });
        })
        .catch(err => {
          console.error('Failed to retrieve user profile:', err);
          localStorage.removeItem('access_token');
        });
      navigate('/login', { replace: true });
    } else if (googleRegister === '1' && googleEmail && googleId) {
      // Google Registration Flow initiated from Callback redirect
      setGoogleData({
        email: googleEmail,
        name: googleName || '',
        googleId: googleId,
        nisn: params.get('nisn') || '',
        schoolId: params.get('school_id') || '',
        nip: params.get('nip') || '',
      });
      const targetRole = params.get('role');
      if (targetRole === 'siswa' || targetRole === 'guru') {
        setView(`register-${targetRole}`);
      } else {
        setView('register-select');
      }
      navigate('/login', { replace: true });
    } else if (errorParam) {
      alert(decodeURIComponent(errorParam));
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, login]);

  useEffect(() => {
    if (token && role) {
      navigate(ROLE_PATHS[role] ?? '/dashboard', { replace: true });
    }
  }, [token, role, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const glowX = `${(e.clientX / window.innerWidth) * 100}%`;
      const glowY = `${(e.clientY / window.innerHeight) * 100}%`;
      setGlowPos({ x: glowX, y: glowY });
    };
    
    if (window.innerWidth > 900) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async ({ email, password }) => {
    const response = await api.post('/login', { email, password });
    login(response.data);
    navigate(ROLE_PATHS[response.data.role] ?? '/dashboard', { replace: true });
  };

  const handleRegistered = (data) => {
    login(data);
    navigate(ROLE_PATHS[data.role] ?? '/dashboard', { replace: true });
  };

  const handleForgot = async ({ email }) => {
    await api.post('/forgot-password', { email });
  };

  return (
    <div className="login-root">
      <div className="login-bg-overlay" />
      <div 
        className="login-glow" 
        style={{
          '--glow-x': glowPos.x,
          '--glow-y': glowPos.y
        }}
      />
      
      <svg className="login-blockchain-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="15" y1="20" x2="10" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
        <line x1="10" y1="50" x2="14" y2="75" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
        <line x1="15" y1="20" x2="14" y2="75" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.15" />
        
        <line x1="85" y1="20" x2="90" y2="54" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
        <line x1="90" y1="54" x2="86" y2="73" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.25" strokeDasharray="1 1" />
        <line x1="85" y1="20" x2="86" y2="73" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.15" />

        <line x1="10" y1="50" x2="30" y2="52" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.15" />
        <line x1="90" y1="54" x2="70" y2="56" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.15" />
      </svg>

      <div className="lp-center">
        <div className="lp-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={32} />
          <span>HaloMBG</span>
        </div>
        <div className="lp-card">
          <div className="lp-card-body" style={{ overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                {view === 'login' && (
                  <LoginForm
                    onSubmit={handleLogin}
                    onForgot={() => setView('forgot')}
                    onSwitch={() => setView('register-select')}
                  />
                )}
                {view === 'register-select' && (
                  <RegisterSelectForm
                    onSelect={(role) => setView(`register-${role}`)}
                    onBack={() => {
                      setGoogleData(null);
                      setView('login');
                    }}
                  />
                )}
                {view === 'register-siswa' && (
                  <SiswaRegisterForm
                    googleData={googleData}
                    onSuccess={handleRegistered}
                    onBack={() => setView('register-select')}
                  />
                )}
                {view === 'register-guru' && (
                  <GuruRegisterForm
                    googleData={googleData}
                    onSuccess={handleRegistered}
                    onBack={() => setView('register-select')}
                  />
                )}
                {view === 'forgot' && (
                  <ForgotPasswordForm
                    onSubmit={handleForgot}
                    onBack={() => setView('login')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="lp-footer">&copy; 2026 HaloMBG</p>
      </div>
    </div>
  );
}
