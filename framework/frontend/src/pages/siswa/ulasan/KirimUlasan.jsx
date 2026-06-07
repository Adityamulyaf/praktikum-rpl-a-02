import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';

export default function KirimUlasan() {
  const [content,   setContent]   = useState('');
  const [date,      setDate]      = useState(new Date().toISOString().split('T')[0]);
  const [photo,     setPhoto]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  // SPPG linkage check
  const [sppgInfo,     setSppgInfo]     = useState(null);
  const [checkingSppg, setCheckingSppg] = useState(true);

  useEffect(() => {
    const checkSppg = async () => {
      try {
        const { data } = await api.get('/siswa/sppg-info');
        setSppgInfo(data);
      } catch (err) {
        setError(err.response?.data?.message ?? 'Gagal memeriksa info SPPG.');
      } finally {
        setCheckingSppg(false);
      }
    };
    checkSppg();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran foto terlalu besar. Maksimal 2MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/siswa/reviews', { content, review_date: date, photo });
      setSuccess(true);
      setContent('');
      setPhoto('');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSppg) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 0', textAlign: 'center' }}>
        <p className="adm-loading">Memeriksa layanan SPPG...</p>
      </div>
    );
  }

  if (sppgInfo && !sppgInfo.served) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 0' }}>
        <div className="adm-error-msg" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', borderLeft: 'none', background: 'rgba(198, 40, 40, 0.05)', border: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--status-error)', fontWeight: 700 }}>Belum Dilayani Dapur SPPG</h3>
          <p style={{ opacity: 0.8, fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
            Sekolah Anda saat ini belum terhubung dengan dapur SPPG mana pun, sehingga Anda belum dapat mengirimkan ulasan harian.
          </p>
        </div>
      </div>
    );
  }

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
        {sppgInfo && sppgInfo.served && (
          <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '4px' }}>
            Ulasan Anda akan ditujukan untuk dapur: <strong>{sppgInfo.kitchen_name}</strong>
          </p>
        )}
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

        <div className="adm-field">
          <label className="adm-label" htmlFor="ku-photo">Foto Makanan (Opsional)</label>
          <input 
            id="ku-photo" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              type="button" 
              className="adm-btn" 
              onClick={() => document.getElementById('ku-photo').click()}
              style={{ background: 'var(--surface-2, #f5f4f0)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Pilih Foto
            </button>
            {photo && (
              <button 
                type="button" 
                className="adm-btn danger" 
                onClick={() => setPhoto('')}
                style={{ padding: '0 12px', height: '40px' }}
              >
                Hapus Foto
              </button>
            )}
          </div>
          {photo && (
            <div style={{ marginTop: '12px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-default)', maxWidth: '240px' }}>
              <img src={photo} alt="Preview Makanan" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
        </div>

        <button type="submit" className="adm-btn primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
          {loading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
}
