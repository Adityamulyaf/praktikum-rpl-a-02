import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import { registerSiswa, verifyNisn } from '../../api/auth';

export default function SiswaRegisterForm({ onSuccess, onBack }) {
  const [form, setForm]             = useState({ name: '', email: '', password: '', password_confirmation: '', school_id: '', nisn: '' });
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
    if (form.password !== form.password_confirmation) {
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              id="sv-nisn" 
              className="lp-input" 
              type="text" 
              placeholder="Masukkan 10 digit NISN"
              maxLength={10}
              value={form.nisn} 
              onChange={set('nisn')} 
              autoComplete="off" 
              required
              disabled={nisnChecking || loading}
            />
            <button 
              type="button" 
              className="lp-btn" 
              style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 16px' }}
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
                  <td>SMP SATAP KAGI</td>
                  <td><code>0080000101</code></td>
                  <td>Ahmad Pratama</td>
                </tr>
                <tr>
                  <td>SD YPPGI WURINERI</td>
                  <td><code>0080000202</code></td>
                  <td>Budi Santoso</td>
                </tr>
                <tr>
                  <td>SMAN BOKONDINI</td>
                  <td><code>0080000315</code></td>
                  <td>Oki Saputra</td>
                </tr>
                <tr>
                  <td>SD INPRES KUARI</td>
                  <td><code>0080000424</code></td>
                  <td>Zainal Lubis</td>
                </tr>
                <tr>
                  <td>SMAS YPPGI KARUBAGA</td>
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

            <div className="lp-field">
              <label className="lp-label" htmlFor="sv-email">Email</label>
              <input id="sv-email" className="lp-input" type="email" placeholder="nama@email.com"
                value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

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
