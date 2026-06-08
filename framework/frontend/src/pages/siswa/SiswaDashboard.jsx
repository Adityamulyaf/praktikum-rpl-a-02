import DashboardLayout from "../../components/DashboardLayout";
import PublicLandingContent from "../../features/PublicLandingContent";
import KirimUlasan from "./ulasan/KirimUlasan";
import RiwayatUlasan from "./ulasan/RiwayatUlasan";
import NotifikasiList from "../sppg/notifikasi/NotifikasiList";

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

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: "beranda", label: "Beranda", icon: <IconHome /> },
      { key: "ulasan", label: "Kirim Ulasan", icon: <IconStar /> },
      { key: "riwayat", label: "Riwayat Ulasan", icon: <IconClock /> },
    ],
  },
];

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

export default function SiswaDashboard() {
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="siswa-page">
      {(active, onNavigate) => {
        switch (active) {
          case "beranda":
            return <PublicLandingContent onNavigate={onNavigate} />;
          case "ulasan":
            return <KirimUlasan />;
          case "riwayat":
            return <RiwayatUlasan />;
          case "notif":
            return <NotifikasiList onNavigate={onNavigate} />;
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
