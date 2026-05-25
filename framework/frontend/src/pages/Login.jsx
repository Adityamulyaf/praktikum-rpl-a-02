import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import HeroPanel from './HeroPanel';
import LoginForm from './LoginForm';
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

  return (
    <div className="login-root">
      <HeroPanel />
      <div className="lp-form-panel">
        <div className="lp-form-inner">
          <LoginForm onSubmit={handleLogin} />
          <p className="lp-footer">
            &copy; 2026 HaloMBG;
          </p>
        </div>
      </div>
    </div>
  );
}
