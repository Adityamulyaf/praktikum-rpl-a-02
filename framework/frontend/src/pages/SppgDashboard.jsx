import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMenu     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
const IconTruck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
const IconChart    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda',    label: 'Beranda',      icon: <IconHome /> },
  { key: 'menu',       label: 'Menu Harian',  icon: <IconMenu /> },
  { key: 'distribusi', label: 'Distribusi',   icon: <IconTruck /> },
  { key: 'profil',     label: 'Profil Dapur', icon: <IconBuilding /> },
  { key: 'evaluasi',   label: 'Evaluasi',     icon: <IconChart /> },
];

/* ── Helpers ────────────────────────────────────────────── */
function ComingSoon({ title, description }) {
  return (
    <div className="dl-placeholder">
      <div className="dl-placeholder-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="dl-placeholder-badge">Segera Hadir</span>
    </div>
  );
}

function Beranda({ user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';
  return (
    <div className="dl-welcome">
      <h1 className="dl-welcome-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="dl-welcome-sub">
        Selamat datang di dashboard SPPG HaloMBG. Gunakan menu di sebelah kiri untuk mengelola dapur dan distribusi MBG.
      </p>
      <div className="dl-info-grid">
        <div className="dl-info-card">
          <span className="dl-info-label">Role</span>
          <span className="dl-info-value">Operator SPPG</span>
        </div>
        <div className="dl-info-card">
          <span className="dl-info-label">Email</span>
          <span className="dl-info-value">{user?.email ?? '—'}</span>
        </div>
        <div className="dl-info-card">
          <span className="dl-info-label">Status Akun</span>
          <span className="dl-info-value">{user?.is_active ? 'Aktif' : 'Nonaktif'}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────── */
export default function SppgDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout menuItems={MENU_ITEMS} pageClass="sppg-page">
      {(active) => {
        switch (active) {
          case 'beranda':
            return <Beranda user={user} />;
          case 'menu':
            return <ComingSoon title="Menu Harian" description="Input menu makanan harian beserta klaim kandungan nutrisi dan foto. Akan tersedia setelah setup profil dapur selesai." />;
          case 'distribusi':
            return <ComingSoon title="Status Distribusi" description="Perbarui status pengiriman ke setiap sekolah dan unggah foto bukti distribusi secara real-time." />;
          case 'profil':
            return <ComingSoon title="Profil Dapur" description="Kelola informasi profil dapur Anda — deskripsi, contact person, kapasitas produksi, dan daftar sekolah yang dilayani." />;
          case 'evaluasi':
            return <ComingSoon title="Evaluasi Internal" description="Lihat ringkasan sentimen ulasan penerima MBG dengan breakdown per sekolah dan rekap historis mingguan." />;
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
