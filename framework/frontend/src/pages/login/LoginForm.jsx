import { useState } from 'react';
import PasswordInput from './PasswordInput';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export default function LoginForm({ onSubmit, onForgot, onSwitch, onBack }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Autentikasi gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-header">
        <h2>Masuk ke HaloMBG</h2>
        <p>Masukkan kredensial Anda untuk melanjutkan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="lp-email">Email</label>
          <div className="lp-input-wrap">
            <input
              id="lp-email"
              className="lp-input"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="lp-field">
          <div className="lp-label-row">
            <label className="lp-label" htmlFor="lp-password">Kata Sandi</label>
            <button type="button" className="lp-forgot-btn" onClick={onForgot}>
              Lupa sandi?
            </button>
          </div>
          <PasswordInput
            id="lp-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? (
            <><span className="lp-spinner" />Memproses...</>
          ) : (
            <>Masuk <ArrowRightIcon /></>
          )}
        </button>
      </form>

      <div className="lp-divider"><span>atau</span></div>

      <button
        type="button"
        className="lp-google-btn"
        onClick={() => { window.location.href = `${API_BASE}/auth/google`; }}
      >
        <GoogleIcon />
        Masuk dengan Google
      </button>

      <p className="lp-switch">
        Belum punya akun?{' '}
        <button type="button" className="lp-switch-btn" onClick={onSwitch}>Daftar</button>
      </p>

      {onBack && (
        <button type="button" className="lp-back-btn" onClick={onBack} style={{ marginTop: '16px' }}>
          ← Kembali ke Beranda
        </button>
      )}
    </>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
