import { useState } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';

export default function KirimUlasan() {
  const [content,   setContent]   = useState('');
  const [date,      setDate]      = useState(new Date().toISOString().split('T')[0]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/siswa/reviews', { content, review_date: date });
      setSuccess(true);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--border, #e5e7eb)', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
          <h2 style={{ margin: '0 0 8px', fontWeight: 700 }}>Ulasan Terkirim!</h2>
          <p style={{ opacity: 0.7, marginBottom: '20px' }}>Ulasanmu sudah tampil di halaman publik.</p>
          <button className="adm-btn primary" onClick={() => setSuccess(false)}>
            Kirim Ulasan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="adm-section-header" style={{ marginBottom: '20px' }}>
        <h2>Kirim Ulasan Harian</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <p className="adm-error-msg">{error}</p>}

        <div className="adm-field">
          <label className="adm-label" htmlFor="ku-date">Tanggal</label>
          <input id="ku-date" className="adm-input" type="date"
            value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="ku-content">Ulasanmu</label>
          <textarea
            id="ku-content"
            className="adm-textarea"
            style={{ minHeight: '140px' }}
            placeholder="Ceritakan pengalamanmu dengan makanan MBG hari ini. Bagaimana rasanya? Apakah sesuai menu? (min. 10 karakter)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            maxLength={2000}
          />
          <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', textAlign: 'right' }}>
            {content.length} / 2000
          </span>
        </div>

        <button type="submit" className="adm-btn primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
}
