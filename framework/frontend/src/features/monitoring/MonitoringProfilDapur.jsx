export default function MonitoringProfilDapur() {
  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Profil Dapur</h1>
        <p className="mon-sub">
          Lihat informasi lengkap setiap dapur MBG — alamat, wilayah, daftar sekolah yang dilayani, dan contact person.
        </p>
      </div>
      <div className="mon-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-tertiary)' }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <h2>Profil Dapur MBG</h2>
        <p>Direktori dapur MBG beserta profil lengkap akan tersedia setelah data SPPG selesai diverifikasi oleh admin.</p>
        <span className="dl-placeholder-badge">Segera Hadir</span>
      </div>
    </div>
  );
}
