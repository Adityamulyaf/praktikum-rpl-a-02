import { useState, useEffect, useCallback } from 'react';
import api from '../../../api/axios';
import '../../admin/admin.css';

const FLAG_BADGE = {
  none:    null,
  flagged: { label: '⚑ Dilaporkan', color: '#d97706' },
};

export default function RiwayatUlasan() {
  const [reviews, setReviews] = useState([]);
  const [meta,    setMeta]    = useState(null);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/siswa/reviews', { params: { page: pg } });
      setReviews(data.data);
      setMeta(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const handleDelete = async (review) => {
    if (!confirm('Hapus ulasan ini?')) return;
    try {
      await api.delete(`/siswa/reviews/${review.id}`);
      load(page);
    } catch {
      alert('Gagal menghapus ulasan.');
    }
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>Riwayat Ulasan</h2>
      </div>

      {loading ? (
        <p className="adm-loading">Memuat ulasan...</p>
      ) : reviews.length === 0 ? (
        <p className="adm-empty">Belum ada ulasan yang kamu kirimkan.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map((review) => {
            const badge = FLAG_BADGE[review.flag_status];
            return (
              <div key={review.id} style={{
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: '10px',
                padding: '14px 16px',
                background: 'var(--surface, #fff)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.school?.name ?? '—'}</span>
                    <span style={{ fontSize: '0.78rem', opacity: 0.55, marginLeft: '8px' }}>{review.review_date}</span>
                    {badge && (
                      <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: badge.color, fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <button className="adm-btn danger" style={{ padding: '2px 10px', fontSize: '0.78rem' }}
                    onClick={() => handleDelete(review)}>
                    Hapus
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {review.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="adm-pagination">
          <button className="adm-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Sebelumnya
          </button>
          <span className="adm-page-info">
            Halaman {meta.current_page} dari {meta.last_page}
          </span>
          <button className="adm-btn" disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}>
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
