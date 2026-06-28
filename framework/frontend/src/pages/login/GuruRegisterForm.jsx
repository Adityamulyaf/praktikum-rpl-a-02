import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import { registerGuru, verifyNip } from '../../api/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export default function GuruRegisterForm({ onSuccess, onBack, googleData }) {
  const [form, setForm]             = useState({
    name: googleData?.name || '',
    email: googleData?.email || '',
    password: '',
    password_confirmation: '',
    school_id: googleData?.schoolId || '',
    nip: googleData?.nip || '',
    google_id: googleData?.googleId || ''
  });
  const [showPw, setShowPw]         = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  
  // Verification states
  const [nipVerified, setNipVerified]       = useState(false);
  const [nipChecking, setNipChecking]       = useState(false);
  const [nipError, setNipError]             = useState('');
  const [verifiedTeacher, setVerifiedTeacher] = useState(null);
  
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Auto-verify when 18 digits are typed
  useEffect(() => {
    if (form.nip.length === 18) {
      handleVerifyNip(form.nip);
    } else {
      setNipVerified(false);
      setVerifiedTeacher(null);
      if (form.nip.length > 0 && form.nip.length < 18) {
        setNipError('NIP harus 18 digit.');
      } else {
        setNipError('');
      }
    }
  }, [form.nip]);

  const handleVerifyNip = async (nipVal) => {
    if (!nipVal || nipVal.length !== 18) {
      setNipError('NIP harus terdiri dari 18 digit.');
      return;
    }
    setNipChecking(true);
    setNipError('');
    try {
      const { data } = await verifyNip(nipVal);
      setVerifiedTeacher(data);
      setNipVerified(true);
      setForm((f) => ({ 
        ...f, 
        name: data.name, 
        school_id: data.school_id 
      }));
    } catch (err) {
      setNipVerified(false);
      setVerifiedTeacher(null);
      setNipError(err.response?.data?.message || 'NIP tidak terdaftar dalam database guru.');
    } finally {
      setNipChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nipVerified) {
      setError('Harap verifikasi NIP Anda terlebih dahulu.');
      return;
    }
    if (!googleData && form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await registerGuru(form);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-header">
        <h2>Daftar sebagai Guru</h2>
        <p>Masukkan NIP Anda untuk memuat data sekolah</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-nip">
            NIP (Nomor Induk Pegawai)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              id="gr-nip" 
              className="lp-input" 
              type="text" 
              placeholder="Masukkan 18 digit NIP"
              maxLength={18}
              value={form.nip} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setForm((f) => ({ ...f, nip: val }));
              }}
              autoComplete="off" 
              required
              disabled={nipChecking || loading}
            />
            <button 
              type="button" 
              className="lp-btn" 
              style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 16px' }}
              onClick={() => handleVerifyNip(form.nip)}
              disabled={form.nip.length !== 18 || nipChecking || loading}
            >
              {nipChecking ? 'Mengecek...' : 'Cari'}
            </button>
          </div>
          {nipError && <p className="lp-error" style={{ marginTop: '8px', marginBottom: 0 }}>{nipError}</p>}
        </div>

        {/* Info Box NIP Dummy untuk Testing */}
        {!nipVerified && (
          <details className="lp-info-box">
            <summary>Petunjuk Pengujian (Daftar NIP Dummy)</summary>
            <p style={{ marginTop: '8px', marginBottom: '8px' }}>
              Gunakan salah satu NIP dummy di bawah ini untuk mensimulasikan pencarian database guru:
            </p>
            <table className="lp-info-table">
              <thead>
                <tr>
                  <th>Sekolah Mengajar</th>
                  <th>Contoh NIP</th>
                  <th>Nama Guru</th>
                </tr>
              </thead>
              <tbody>
                 <tr>
                   <td>SD NEGERI 1 BOCOR</td>
                   <td><code>198710102010121101</code></td>
                   <td>Heri Setiawan</td>
                 </tr>
                 <tr>
                   <td>SD NEGERI 2 LUNDONG</td>
                   <td><code>198710102010121203</code></td>
                   <td>Rudi Hermawan</td>
                 </tr>
                 <tr>
                   <td>SD NEGERI 1 KARANGREJO</td>
                   <td><code>198710102010121305</code></td>
                   <td>Edi Susanto</td>
                 </tr>
              </tbody>
            </table>
          </details>
        )}

        {nipVerified && verifiedTeacher && (
          <div className="lp-fadein">
            <div className="lp-success">
              ✓ NIP Terverifikasi: <strong>{verifiedTeacher.name}</strong> mengajar di <strong>{verifiedTeacher.school_name}</strong>
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="gr-name">Nama Lengkap</label>
              <input 
                id="gr-name" 
                className="lp-input" 
                type="text" 
                value={form.name} 
                disabled 
                style={{ background: 'var(--surface-2, #f5f4f0)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="gr-school">Sekolah</label>
              <input 
                id="gr-school" 
                className="lp-input" 
                type="text" 
                value={`${verifiedTeacher.school_name} (${verifiedTeacher.district}, ${verifiedTeacher.province})`} 
                disabled 
                style={{ background: 'var(--surface-2, #f5f4f0)', cursor: 'not-allowed' }}
              />
            </div>

            {!googleData && (
              <>
                <button
                  type="button"
                  className="lp-google-btn"
                  style={{ marginTop: '8px', marginBottom: '16px' }}
                  onClick={() => { window.location.href = `${API_BASE}/auth/google?role=guru&nip=${form.nip}`; }}
                >
                  <GoogleIcon />
                  Daftar dengan Google
                </button>
                <div className="lp-divider" style={{ marginBottom: '20px' }}><span>atau gunakan email & sandi</span></div>
              </>
            )}

            <div className="lp-field">
              <label className="lp-label" htmlFor="gr-email">Email</label>
              <input 
                id="gr-email" 
                className="lp-input" 
                type="email" 
                placeholder="nama@email.com"
                value={form.email} 
                onChange={set('email')} 
                required 
                autoComplete="email" 
                disabled={!!googleData}
                style={googleData ? { background: 'var(--surface-2, #f5f4f0)', cursor: 'not-allowed' } : {}}
              />
            </div>

            {!googleData && (
              <>
                <div className="lp-field">
                  <label className="lp-label" htmlFor="gr-password">Kata Sandi</label>
                  <PasswordInput id="gr-password" value={form.password} onChange={set('password')}
                    showPassword={showPw} onToggle={() => setShowPw((v) => !v)}
                    placeholder="Minimal 8 karakter" autoComplete="new-password" />
                </div>

                <div className="lp-field">
                  <label className="lp-label" htmlFor="gr-pwconf">Konfirmasi Kata Sandi</label>
                  <PasswordInput id="gr-pwconf" value={form.password_confirmation} onChange={set('password_confirmation')}
                    showPassword={showPwConf} onToggle={() => setShowPwConf((v) => !v)}
                    placeholder="Ulangi kata sandi" autoComplete="new-password" />
                </div>
              </>
            )}

            {error && <p className="lp-error">{error}</p>}

            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? <><span className="lp-spinner" />Memproses...</> : 'Daftar sebagai Guru'}
            </button>
          </div>
        )}
      </form>

      <button type="button" className="lp-back-btn" onClick={onBack} style={{ marginTop: '16px' }}>← Kembali</button>
    </>
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
