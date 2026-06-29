import { useState, useEffect, useCallback } from 'react';
import { getFlaggedReviews, resolveReview } from '../../api/admin';
import './admin.css';

const IconMessageLarge = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--text-tertiary)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

function PhotoViewerModal({ photoUrl, onClose }) {
  return (
    <div
      className="adm-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="adm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', padding: 0, overflow: 'hidden', position: 'relative' }}
      >
        <img src={photoUrl} alt="Bukti Makanan" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function AdminReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getFlaggedReviews({ page: pg });
      setReviews(data.data || []);
      setMeta(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat ulasan bermasalah.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const handleResolve = async (id, action) => {
    if (action === 'approve' && !confirm('Apakah Anda yakin ingin menyetujui penghapusan ulasan ini secara permanen?')) {
      return;
    }
    setActioningId(id);
    try {
      await resolveReview(id, action);
      // Remove from list in UI
      setReviews((prev) => prev.filter((r) => r.id !== id));
      
      // If we cleared the last item on the page, go to previous page if page > 1
      if (reviews.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        load(page);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses keputusan moderasi.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 0' }}>
      <div className="adm-section-header" style={{ marginBottom: '20px', display: 'block' }}>
        <h2>Moderasi Ulasan (Flagged)</h2>
        <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '4px' }}>
          Tinjau ulasan siswa yang ditandai (flagged) oleh guru sekolah untuk memutuskan tindakan moderasi akhir.
        </p>
      </div>

      {error && <p className="adm-error-msg" style={{ marginBottom: '16px' }}>{error}</p>}

      {loading && reviews.length === 0 ? (
        <p className="adm-loading">Memuat daftar moderasi ulasan...</p>
      ) : reviews.length === 0 ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            background: 'var(--surface-2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <IconMessageLarge />
          </div>
          <h3 style={{ margin: '0 0 8px', fontWeight: 600, color: 'var(--text-primary)' }}>Semua Ulasan Bersih</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Tidak ada ulasan siswa yang sedang ditandai (flagged) oleh guru.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                padding: '16px 20px',
                background: 'var(--surface-1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform var(--duration-fast) var(--ease-smooth)',
              }}
            >
              {/* Header: Student, School, Kitchen */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {review.user?.name ?? 'Siswa'}
                  </span>
                  <span
                    style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      background: 'var(--surface-2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {review.school?.name ?? '—'}
                  </span>
                  <span
                    style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      background: 'rgba(21, 101, 192, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--status-info)',
                      fontWeight: 500,
                    }}
                  >
                    Dapur: {review.sppg?.kitchen_name ?? '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {review.review_date}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {review.content}
                  </p>
                </div>
                {review.photo && (
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(review.photo)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={review.photo}
                      alt="Ulasan Makanan"
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--border-default)',
                      }}
                    />
                  </button>
                )}
              </div>

              {/* Flag Reason Callout */}
              <div
                style={{
                  background: 'rgba(198, 40, 40, 0.04)',
                  borderLeft: '3px solid var(--status-error)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '0.825rem',
                  color: 'var(--status-error)',
                }}
              >
                <strong>Alasan Flag Guru:</strong> {review.flag_reason ?? 'Tidak disebutkan'}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid var(--border-default, #f3f4f6)',
                  paddingTop: '12px',
                  marginTop: '4px',
                  gap: '8px',
                }}
              >
                <button
                  type="button"
                  className="adm-btn success"
                  disabled={actioningId === review.id}
                  onClick={() => handleResolve(review.id, 'dismiss')}
                  style={{
                    fontSize: '0.8rem',
                    height: '32px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Abaikan Laporan
                </button>
                <button
                  type="button"
                  className="adm-btn danger"
                  disabled={actioningId === review.id}
                  onClick={() => handleResolve(review.id, 'approve')}
                  style={{
                    fontSize: '0.8rem',
                    height: '32px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Setujui Penghapusan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '24px',
          }}
        >
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
            className="lkp-page-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              background: 'var(--surface-1)',
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            {meta.current_page} / {meta.last_page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === meta.last_page || loading}
            className="lkp-page-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              background: 'var(--surface-1)',
            }}
          >
            →
          </button>
        </div>
      )}

      {selectedPhoto && (
        <PhotoViewerModal photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </div>
  );
}
