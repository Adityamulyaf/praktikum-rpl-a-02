import DashboardLayout from "../../components/DashboardLayout";
import MenuHarian from "./menu/MenuHarian";
import PublicLandingContent from "../../features/PublicLandingContent";
import Kitchen from "./profile/Kitchen";
import DistribusiHarian from "./distribusi/DistribusiHarian";
import { useAuth } from "../../context/AuthContext";
import KirimUlasan from "../siswa/ulasan/KirimUlasan";
import RiwayatUlasan from "../siswa/ulasan/RiwayatUlasan";

const IconScan = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 012-2h2" />
    <path d="M17 3h2a2 2 0 012 2v2" />
    <path d="M21 17v2a2 2 0 01-2 2h-2" />
    <path d="M5 21H3a2 2 0 01-2-2v-2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 7v10" />
    <path d="M7 12h10" />
  </svg>
);


/* ── Icons ─────────────────────────────────────────────── */
const IconHome = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconMenu = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
const IconTruck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconBuilding = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);
const IconChart = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconStar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconClock = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconMessages = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconBell = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

function ComingSoon({ title, description }) {
  return (
    <div className="dl-placeholder">
      <div className="dl-placeholder-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="dl-placeholder-badge">Segera Hadir</span>
    </div>
  );
}

export default function SppgDashboard() {
  const { role } = useAuth();

  const menuItems = [
    { key: "beranda", label: "Beranda", icon: <IconHome /> },
    { key: "menu", label: "Menu Harian", icon: <IconMenu /> },
    { key: "distribusi", label: "Distribusi", icon: <IconTruck /> },
    { key: "profil", label: "Profil Dapur", icon: <IconBuilding /> },
  ];

  if (role === "siswa") {
    menuItems.push(
      { key: "ulasan", label: "Kirim Ulasan", icon: <IconStar /> },
      { key: "riwayat", label: "Riwayat Ulasan", icon: <IconClock /> }
    );
  } else if (role === "guru") {
    menuItems.push(
      { key: "ulasan_siswa", label: "Ulasan Siswa", icon: <IconMessages /> },
      { key: "notif", label: "Notifikasi", icon: <IconBell /> }
    );
  } else {
    menuItems.push({ key: "evaluasi", label: "Evaluasi", icon: <IconChart /> });
  }

  const menuGroups = [{ label: null, items: menuItems }];

  return (
    <DashboardLayout menuGroups={menuGroups} pageClass="sppg-page">
      {(active, onNavigate) => {
        switch (active) {
          case "beranda":
            return <PublicLandingContent onNavigate={onNavigate} />;
          case "menu":
            return <MenuHarian />;
          case "distribusi":
            return <DistribusiHarian />;
          case "profil":
            return <Kitchen />;
          case "ulasan":
            return <KirimUlasan />;
          case "riwayat":
            return <RiwayatUlasan />;
          case "ulasan_siswa":
            return <ComingSoon title="Ulasan Siswa" description="Pantau dan moderasi ulasan yang dikirim siswa di sekolah Anda." />;
          case "notif":
            return <ComingSoon title="Notifikasi" description="Pemberitahuan saat ada ulasan baru dari siswa yang perlu diperhatikan." />;
          case "evaluasi":
            return (
              <ComingSoon
                title="Evaluasi Internal"
                description="Ringkasan sentimen ulasan dengan breakdown per sekolah dan rekap historis mingguan."
              />
            );
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
