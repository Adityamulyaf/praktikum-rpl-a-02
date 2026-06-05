import { useState } from 'react';

export default function ForgotPasswordForm({ onSubmit, onBack }) {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim email. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <div className="lp-header">
          <h2>Email Terkirim</h2>
          <p>
            Kami telah mengirimkan tautan reset kata sandi ke{' '}
            <strong>{email}</strong>. Periksa kotak masuk Anda.
          </p>
        </div>
        <button type="button" className="lp-btn" onClick={onBack}>
          Kembali ke Halaman Masuk
        </button>
      </>
    );
  }

  return (
    <>
      <div className="lp-header">
        <h2>Lupa Kata Sandi?</h2>
        <p>Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="fp-email">Email</label>
          <div className="lp-input-wrap">
            <input
              id="fp-email"
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

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? (
            <><span className="lp-spinner" />Mengirim...</>
          ) : (
            'Kirim Tautan Reset'
          )}
        </button>
      </form>

      <button type="button" className="lp-back-btn" onClick={onBack}>
        ← Kembali ke Masuk
      </button>
    </>
  );
}
