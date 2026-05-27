import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconStar  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda', label: 'Beranda',        icon: <IconHome /> },
  { key: 'ulasan',  label: 'Kirim Ulasan',   icon: <IconStar /> },
  { key: 'riwayat', label: 'Riwayat Ulasan', icon: <IconClock /> },
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
        Selamat datang di dashboard siswa HaloMBG. Di sini kamu bisa memberikan ulasan harian tentang makanan MBG yang diterima.
      </p>
      <div className="dl-info-grid">
        <div className="dl-info-card">
          <span className="dl-info-label">Role</span>
          <span className="dl-info-value">Siswa</span>
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
export default function SiswaDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout menuItems={MENU_ITEMS} pageClass="siswa-page">
      {(active) => {
        switch (active) {
          case 'beranda':
            return <Beranda user={user} />;
          case 'ulasan':
            return <ComingSoon title="Kirim Ulasan" description="Berikan ulasan harian tentang makanan MBG yang kamu terima hari ini, lengkap dengan foto sebagai bukti." />;
          case 'riwayat':
            return <ComingSoon title="Riwayat Ulasan" description="Lihat semua ulasan yang pernah kamu kirimkan beserta statusnya." />;
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
