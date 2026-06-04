import DashboardLayout from '../components/DashboardLayout';
import PublicLandingContent from '../features/PublicLandingContent';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMessages = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: 'beranda', label: 'Beranda',      icon: <IconHome /> },
      { key: 'ulasan',  label: 'Ulasan Siswa', icon: <IconMessages /> },
      { key: 'notif',   label: 'Notifikasi',   icon: <IconBell /> },
    ],
  },
];

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

export default function GuruDashboard() {
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="guru-page">
      {(active, onNavigate) => {
        switch (active) {
          case 'beranda': return <PublicLandingContent onNavigate={onNavigate} />;
          case 'ulasan':  return <ComingSoon title="Ulasan Siswa" description="Pantau dan moderasi ulasan yang dikirim siswa di sekolah Anda." />;
          case 'notif':   return <ComingSoon title="Notifikasi" description="Pemberitahuan saat ada ulasan baru dari siswa yang perlu diperhatikan." />;
          default:        return null;
        }
      }}
    </DashboardLayout>
  );
}
