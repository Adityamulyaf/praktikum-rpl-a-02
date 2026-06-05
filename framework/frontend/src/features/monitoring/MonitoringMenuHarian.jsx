export default function MonitoringMenuHarian() {
  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Menu Harian</h1>
        <p className="mon-sub">
          Pantau menu makanan yang disajikan oleh setiap dapur MBG hari ini beserta informasi nutrisinya.
        </p>
      </div>
      <div className="mon-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-tertiary)' }}>
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
        </svg>
        <h2>Menu Harian</h2>
        <p>Data menu harian akan tersedia setelah operator SPPG mulai menginput menu di platform ini.</p>
        <span className="dl-placeholder-badge">Segera Hadir</span>
      </div>
    </div>
  );
}
