import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterSelectForm from './RegisterSelectForm';
import SiswaRegisterForm from './SiswaRegisterForm';
import GuruRegisterForm from './GuruRegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import './Login.css';

const ROLE_PATHS = {
  admin: '/admin',
  sppg:  '/sppg',
  siswa: '/siswa',
  guru:  '/guru',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, token, role } = useAuth();
  const [view, setView] = useState('login');

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('login-page');
    return () => root.classList.remove('login-page');
  }, []);

  useEffect(() => {
    if (token && role) {
      navigate(ROLE_PATHS[role] ?? '/dashboard', { replace: true });
    }
  }, [token, role, navigate]);

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
      <div className="lp-center">
        <div className="lp-brand">HaloMBG</div>
        <div className="lp-card">
          <div className="lp-card-body">
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
                onBack={() => setView('login')}
              />
            )}
            {view === 'register-siswa' && (
              <SiswaRegisterForm
                onSuccess={handleRegistered}
                onBack={() => setView('register-select')}
              />
            )}
            {view === 'register-guru' && (
              <GuruRegisterForm
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
          </div>
        </div>
        <p className="lp-footer">&copy; 2026 HaloMBG</p>
      </div>
    </div>
  );
}
