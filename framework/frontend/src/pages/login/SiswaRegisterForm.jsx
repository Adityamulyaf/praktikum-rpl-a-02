import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import { registerSiswa, verifyNisn } from '../../api/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export default function SiswaRegisterForm({ onSuccess, onBack, googleData }) {
  const [form, setForm]             = useState({
    name: googleData?.name || '',
    email: googleData?.email || '',
    password: '',
    password_confirmation: '',
    school_id: googleData?.schoolId || '',
    nisn: googleData?.nisn || '',
    google_id: googleData?.googleId || ''
  });
  const [showPw, setShowPw]         = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  
  // Verification states
  const [nisnVerified, setNisnVerified]       = useState(false);
  const [nisnChecking, setNisnChecking]       = useState(false);
  const [nisnError, setNisnError]             = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Auto-verify when 10 digits are typed
  useEffect(() => {
    if (form.nisn.length === 10) {
      handleVerifyNisn(form.nisn);
    } else {
      setNisnVerified(false);
      setVerifiedStudent(null);
      if (form.nisn.length > 0 && form.nisn.length < 10) {
        setNisnError('NISN harus 10 digit.');
      } else {
        setNisnError('');
      }
    }
  }, [form.nisn]);

  const handleVerifyNisn = async (nisnVal) => {
    if (!nisnVal || nisnVal.length !== 10) {
      setNisnError('NISN harus terdiri dari 10 digit.');
      return;
    }
    setNisnChecking(true);
    setNisnError('');
    try {
      const { data } = await verifyNisn(nisnVal);
      setVerifiedStudent(data);
      setNisnVerified(true);
      setForm((f) => ({ 
        ...f, 
        name: data.name, 
        school_id: data.school_id 
      }));
    } catch (err) {
      setNisnVerified(false);
      setVerifiedStudent(null);
      setNisnError(err.response?.data?.message || 'NISN tidak terdaftar dalam database penerima MBG.');
    } finally {
      setNisnChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nisnVerified) {
      setError('Harap verifikasi NISN Anda terlebih dahulu.');
      return;
    }
    if (!googleData && form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await registerSiswa(form);
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
        <h2>Daftar sebagai Siswa</h2>
        <p>Masukkan NISN Anda untuk memuat data sekolah</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-nisn">
            NISN (Nomor Induk Siswa Nasional)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              id="sv-nisn" 
              className="lp-input" 
              type="text" 
              placeholder="Masukkan 10 digit NISN"
              maxLength={10}
              value={form.nisn} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setForm((f) => ({ ...f, nisn: val }));
              }}
              autoComplete="off" 
              required
              disabled={nisnChecking || loading}
            />
            <button 
              type="button" 
              className="lp-btn" 
              style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 16px', marginTop: 0, height: '42px' }}
              onClick={() => handleVerifyNisn(form.nisn)}
              disabled={form.nisn.length !== 10 || nisnChecking || loading}
            >
              {nisnChecking ? 'Mengecek...' : 'Cari'}
            </button>
          </div>
          {nisnError && <p className="lp-error" style={{ marginTop: '8px', marginBottom: 0 }}>{nisnError}</p>}
        </div>

        {/* Info Box NISN Dummy untuk Testing */}
        {!nisnVerified && (
          <details className="lp-info-box">
            <summary>Petunjuk Pengujian (Daftar NISN Dummy)</summary>
            <p style={{ marginTop: '8px', marginBottom: '8px' }}>
              Gunakan salah satu NISN dummy di bawah ini untuk mensimulasikan pencarian database Dapodik:
            </p>
            <table className="lp-info-table">
              <thead>
                <tr>
                  <th>Sekolah Asal</th>
                  <th>Contoh NISN</th>
                  <th>Nama Siswa</th>
                </tr>
              </thead>
              <tbody>
                 <tr>
                   <td>SD NEGERI 1 BOCOR</td>
                   <td><code>0080000102</code></td>
                   <td>Budi Santoso</td>
                 </tr>
                 <tr>
                   <td>SD NEGERI 2 LUNDONG</td>
                   <td><code>0080000203</code></td>
                   <td>Siti Rahmawati</td>
                 </tr>
                <tr>
                  <td>SD NEGERI 1 KARANGREJO</td>
                  <td><code>0080000315</code></td>
                  <td>Oki Saputra</td>
                </tr>
                <tr>
                  <td>SD NEGERI 4 JATIJAJAR</td>
                  <td><code>0080000424</code></td>
                  <td>Zainal Lubis</td>
                </tr>
                <tr>
                  <td>SMP PGRI 1 PURING</td>
                  <td><code>0080000529</code></td>
                  <td>Farhan Tampubolon</td>
                </tr>
              </tbody>
            </table>
          </details>
        )}

        {nisnVerified && verifiedStudent && (
          <div className="lp-fadein">
            <div className="lp-success">
              ✓ NISN Terverifikasi: <strong>{verifiedStudent.name}</strong> dari sekolah <strong>{verifiedStudent.school_name}</strong>
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="sv-name">Nama Lengkap</label>
              <input 
                id="sv-name" 
                className="lp-input" 
                type="text" 
                value={form.name} 
                disabled 
                style={{ background: 'var(--surface-2, #f5f4f0)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="sv-school">Sekolah Asal</label>
              <input 
                id="sv-school" 
                className="lp-input" 
                type="text" 
                value={`${verifiedStudent.school_name} (${verifiedStudent.district}, ${verifiedStudent.province})`} 
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
                  onClick={() => { window.location.href = `${API_BASE}/auth/google?role=siswa&nisn=${form.nisn}`; }}
                >
                  <GoogleIcon />
                  Daftar dengan Google
                </button>
                <div className="lp-divider" style={{ marginBottom: '20px' }}><span>atau gunakan email & sandi</span></div>
              </>
            )}

            <div className="lp-field">
              <label className="lp-label" htmlFor="sv-email">Email</label>
              <input 
                id="sv-email" 
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
                  <label className="lp-label" htmlFor="sv-password">Kata Sandi</label>
                  <PasswordInput id="sv-password" value={form.password} onChange={set('password')}
                    showPassword={showPw} onToggle={() => setShowPw((v) => !v)}
                    placeholder="Minimal 8 karakter" autoComplete="new-password" />
                </div>

                <div className="lp-field">
                  <label className="lp-label" htmlFor="sv-pwconf">Konfirmasi Kata Sandi</label>
                  <PasswordInput id="sv-pwconf" value={form.password_confirmation} onChange={set('password_confirmation')}
                    showPassword={showPwConf} onToggle={() => setShowPwConf((v) => !v)}
                    placeholder="Ulangi kata sandi" autoComplete="new-password" />
                </div>
              </>
            )}

            {error && <p className="lp-error">{error}</p>}

            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? <><span className="lp-spinner" />Memproses...</> : 'Daftar sebagai Siswa'}
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
