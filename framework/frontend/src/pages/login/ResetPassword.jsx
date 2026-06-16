import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import PasswordInput from './PasswordInput';
import Logo from '../../components/Logo';
import './Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('login-page');
    return () => root.classList.remove('login-page');
  }, []);

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

  if (!token) {
    return (
      <div className="login-root">
        <div className="lp-center">
          <div className="lp-card">
            <div className="lp-card-body">
              <p className="lp-error">Tautan reset kata sandi tidak valid atau tidak lengkap.</p>
              <button className="lp-btn" onClick={() => navigate('/login')}>
                Kembali ke Halaman Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mereset kata sandi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
      
      <div className="lp-center">
        <div className="lp-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={32} />
          <span>HaloMBG</span>
        </div>
        <div className="lp-card">
          <div className="lp-card-body">
            {success ? (
              <>
                <div className="lp-header">
                  <h2>Kata Sandi Direset</h2>
                  <p>Kata sandi Anda telah berhasil diubah. Silakan masuk dengan kata sandi baru Anda.</p>
                </div>
                <button className="lp-btn" onClick={() => navigate('/login')}>
                  Masuk Sekarang
                </button>
              </>
            ) : (
              <>
                <div className="lp-header">
                  <h2>Reset Kata Sandi</h2>
                  <p>Buat kata sandi baru untuk akun Anda</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="lp-field">
                    <label className="lp-label" htmlFor="rp-email">Email</label>
                    <input
                      id="rp-email"
                      className="lp-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled
                      style={{ background: 'var(--surface-2)', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="lp-field">
                    <label className="lp-label" htmlFor="rp-password">Kata Sandi Baru</label>
                    <PasswordInput
                      id="rp-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showPassword={showPw}
                      onToggle={() => setShowPw(!showPw)}
                      placeholder="Minimal 8 karakter"
                      required
                    />
                  </div>
                  <div className="lp-field">
                    <label className="lp-label" htmlFor="rp-pwconf">Konfirmasi Kata Sandi</label>
                    <PasswordInput
                      id="rp-pwconf"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      showPassword={showPwConf}
                      onToggle={() => setShowPwConf(!showPwConf)}
                      placeholder="Ulangi kata sandi baru"
                      required
                    />
                  </div>
                  {error && <p className="lp-error">{error}</p>}
                  <button type="submit" className="lp-btn" disabled={loading}>
                    {loading ? (
                      <><span className="lp-spinner" />Mengubah...</>
                    ) : (
                      'Simpan Kata Sandi'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        <p className="lp-footer">&copy; 2026 HaloMBG</p>
      </div>
    </div>
  );
}
