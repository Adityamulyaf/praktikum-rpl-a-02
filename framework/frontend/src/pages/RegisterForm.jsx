import { useState } from 'react';
import PasswordInput from './PasswordInput';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost';

export default function RegisterForm({ onSubmit, onSwitch }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [showPw, setShowPw]         = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-header">
        <h2>Buat Akun</h2>
        <p>Daftarkan diri Anda untuk memulai</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="rg-name">Nama Lengkap</label>
          <div className="lp-input-wrap">
            <input
              id="rg-name"
              className="lp-input"
              type="text"
              placeholder="Nama Anda"
              value={form.name}
              onChange={set('name')}
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="rg-email">Email</label>
          <div className="lp-input-wrap">
            <input
              id="rg-email"
              className="lp-input"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="rg-password">Kata Sandi</label>
          <PasswordInput
            id="rg-password"
            value={form.password}
            onChange={set('password')}
            showPassword={showPw}
            onToggle={() => setShowPw((v) => !v)}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
          />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="rg-pwconf">Konfirmasi Kata Sandi</label>
          <PasswordInput
            id="rg-pwconf"
            value={form.password_confirmation}
            onChange={set('password_confirmation')}
            showPassword={showPwConf}
            onToggle={() => setShowPwConf((v) => !v)}
            placeholder="Ulangi kata sandi"
            autoComplete="new-password"
          />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? (
            <><span className="lp-spinner" />Memproses...</>
          ) : (
            <>Daftar <ArrowRightIcon /></>
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
        Daftar dengan Google
      </button>

      <p className="lp-switch">
        Sudah punya akun?{' '}
        <button type="button" className="lp-switch-btn" onClick={onSwitch}>Masuk</button>
      </p>
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
