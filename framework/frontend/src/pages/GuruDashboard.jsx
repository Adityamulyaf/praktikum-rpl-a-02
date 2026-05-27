import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMessages = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda', label: 'Beranda',      icon: <IconHome /> },
  { key: 'ulasan',  label: 'Ulasan Siswa', icon: <IconMessages /> },
  { key: 'notif',   label: 'Notifikasi',   icon: <IconBell /> },
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
        Selamat datang di dashboard guru HaloMBG. Pantau dan moderasi ulasan siswa di sekolah Anda untuk menjaga kualitas konten platform.
      </p>
      <div className="dl-info-grid">
        <div className="dl-info-card">
          <span className="dl-info-label">Role</span>
          <span className="dl-info-value">Guru / Moderator</span>
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
export default function GuruDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout menuItems={MENU_ITEMS} pageClass="guru-page">
      {(active) => {
        switch (active) {
          case 'beranda':
            return <Beranda user={user} />;
          case 'ulasan':
            return <ComingSoon title="Ulasan Siswa" description="Pantau dan moderasi ulasan yang dikirim siswa di sekolah Anda. Flag atau hapus konten yang tidak pantas." />;
          case 'notif':
            return <ComingSoon title="Notifikasi" description="Terima pemberitahuan saat ada ulasan baru dari siswa di sekolah Anda yang perlu diperhatikan." />;
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
