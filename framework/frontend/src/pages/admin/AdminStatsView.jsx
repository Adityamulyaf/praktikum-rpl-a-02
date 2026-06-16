import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminStatsView.css';

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const IconSppg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

const IconSchool = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const IconSiswa = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconGuru = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconReview = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function AdminStatsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Gagal memuat data statistik dashboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="as-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="lp-spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px', borderColor: 'var(--border-default)', borderTopColor: 'var(--color-primary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Memuat data statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="as-container">
        <div className="lp-error">{error}</div>
      </div>
    );
  }

  const { totals, distribution_today } = data;
  const distTotal = distribution_today.total;

  const getPercentage = (count) => {
    if (!distTotal) return 0;
    return Math.round((count / distTotal) * 100);
  };

  return (
    <div className="as-container">
      <div className="as-header">
        <h1>Dashboard Utama Administrasi</h1>
        <p>Ringkasan data operasional sistem pendistribusian program MBG secara real-time</p>
      </div>

      <div className="as-grid">
        <div className="as-card">
          <div className="as-card-header">
            <span className="as-card-label">Dapur Pelayanan</span>
            <div className="as-card-icon"><IconSppg /></div>
          </div>
          <span className="as-card-num">{totals.sppg}</span>
        </div>

        <div className="as-card">
          <div className="as-card-header">
            <span className="as-card-label">Sekolah Penerima</span>
            <div className="as-card-icon"><IconSchool /></div>
          </div>
          <span className="as-card-num">{totals.schools}</span>
        </div>

        <div className="as-card">
          <div className="as-card-header">
            <span className="as-card-label">Siswa Terdaftar</span>
            <div className="as-card-icon"><IconSiswa /></div>
          </div>
          <span className="as-card-num">{totals.siswa}</span>
        </div>

        <div className="as-card">
          <div className="as-card-header">
            <span className="as-card-label">Guru Terdaftar</span>
            <div className="as-card-icon"><IconGuru /></div>
          </div>
          <span className="as-card-num">{totals.guru}</span>
        </div>

        <div className="as-card">
          <div className="as-card-header">
            <span className="as-card-label">Total Ulasan</span>
            <div className="as-card-icon"><IconReview /></div>
          </div>
          <span className="as-card-num">{totals.reviews}</span>
        </div>
      </div>

      <h2 className="as-section-title">Pemantauan Distribusi Makanan Hari Ini</h2>

      <div className="as-distribution-box">
        <div className="as-dist-summary">
          <span className="as-dist-total-num">{distTotal}</span>
          <span className="as-dist-total-label">Paket Makanan Terjadwal</span>
          <p className="as-dist-total-desc">
            Jumlah total paket makanan yang dijadwalkan untuk didistribusikan ke sekolah-sekolah di bawah pengawasan SPPG hari ini.
          </p>
        </div>

        <div className="as-dist-breakdown">
          <div className="as-progress-row">
            <div className="as-progress-header">
              <span className="as-progress-label">Sudah Diantar</span>
              <span className="as-progress-count">{distribution_today.details.sudah_diantar} sekolah ({getPercentage(distribution_today.details.sudah_diantar)}%)</span>
            </div>
            <div className="as-progress-bar-wrap">
              <div 
                className="as-progress-bar sudah_diantar" 
                style={{ width: `${getPercentage(distribution_today.details.sudah_diantar)}%` }} 
              />
            </div>
          </div>

          <div className="as-progress-row">
            <div className="as-progress-header">
              <span className="as-progress-label">Siap Diantar</span>
              <span className="as-progress-count">{distribution_today.details.siap_diantar} sekolah ({getPercentage(distribution_today.details.siap_diantar)}%)</span>
            </div>
            <div className="as-progress-bar-wrap">
              <div 
                className="as-progress-bar siap_diantar" 
                style={{ width: `${getPercentage(distribution_today.details.siap_diantar)}%` }} 
              />
            </div>
          </div>

          <div className="as-progress-row">
            <div className="as-progress-header">
              <span className="as-progress-label">Belum Diantar</span>
              <span className="as-progress-count">{distribution_today.details.belum_diantar} sekolah ({getPercentage(distribution_today.details.belum_diantar)}%)</span>
            </div>
            <div className="as-progress-bar-wrap">
              <div 
                className="as-progress-bar belum_diantar" 
                style={{ width: `${getPercentage(distribution_today.details.belum_diantar)}%` }} 
              />
            </div>
          </div>

          <div className="as-progress-row">
            <div className="as-progress-header">
              <span className="as-progress-label">Batal / Ditunda</span>
              <span className="as-progress-count">{distribution_today.details.batal} sekolah ({getPercentage(distribution_today.details.batal)}%)</span>
            </div>
            <div className="as-progress-bar-wrap">
              <div 
                className="as-progress-bar batal" 
                style={{ width: `${getPercentage(distribution_today.details.batal)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
