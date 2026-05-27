export default function MonitoringStatusDistribusi() {
  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Status Distribusi</h1>
        <p className="mon-sub">
          Pantau status pengiriman makanan MBG ke setiap sekolah secara real-time.
        </p>
      </div>
      <div className="mon-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-tertiary)' }}>
          <rect x="1" y="3" width="15" height="13"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <h2>Status Distribusi</h2>
        <p>Status distribusi harian akan tampil di sini setelah SPPG mulai memperbarui pengiriman di platform.</p>
        <span className="dl-placeholder-badge">Segera Hadir</span>
      </div>
    </div>
  );
}
