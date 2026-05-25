import { useState } from 'react';
import PasswordInput from './PasswordInput';
import SchoolSearch from './SchoolSearch';
import { registerGuru } from '../api/auth';

export default function GuruRegisterForm({ onSuccess, onBack }) {
  const [form, setForm]             = useState({ name: '', email: '', password: '', password_confirmation: '', school_id: '', nip: '' });
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
        <p>Masukkan data diri Anda untuk membuat akun</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-name">Nama Lengkap</label>
          <input id="gr-name" className="lp-input" type="text" placeholder="Nama Anda"
            value={form.name} onChange={set('name')} required autoComplete="name" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-email">Email</label>
          <input id="gr-email" className="lp-input" type="email" placeholder="nama@email.com"
            value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-school">Sekolah</label>
          <SchoolSearch
            id="gr-school"
            value={form.school_id}
            onChange={(id) => setForm((f) => ({ ...f, school_id: id }))}
            required
          />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-nip">
            NIP <span style={{ fontWeight: 400, opacity: 0.6 }}>(opsional)</span>
          </label>
          <input id="gr-nip" className="lp-input" type="text" placeholder="Nomor Induk Pegawai"
            value={form.nip} onChange={set('nip')} autoComplete="off" />
        </div>

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

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? <><span className="lp-spinner" />Memproses...</> : 'Daftar sebagai Guru'}
        </button>
      </form>

      <button type="button" className="lp-back-btn" onClick={onBack}>← Kembali</button>
    </>
  );
}
