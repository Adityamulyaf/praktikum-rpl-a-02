import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import HeroPanel from './HeroPanel';
import LoginForm from './LoginForm';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('login-page');
    return () => root.classList.remove('login-page');
  }, []);

  const handleLogin = async ({ email, password }) => {
    const response = await api.post('/login', { email, password });
    login(response.data);
    navigate(response.data.role === 'admin' ? '/admin' : '/dashboard');
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
