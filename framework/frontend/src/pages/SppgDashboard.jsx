import DashboardLayout from "../components/DashboardLayout";
import MenuHarian from "./SppgMenu/MenuHarian";
import PublicLandingContent from "../features/PublicLandingContent";
import Kitchen from "./KitchenProfile/Kitchen";
import DistribusiHarian from "./SppgDistribusi/DistribusiHarian";

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

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: "beranda", label: "Beranda", icon: <IconHome /> },
      { key: "menu", label: "Menu Harian", icon: <IconMenu /> },
      { key: "distribusi", label: "Distribusi", icon: <IconTruck /> },
      { key: "profil", label: "Profil Dapur", icon: <IconBuilding /> },
      { key: "evaluasi", label: "Evaluasi", icon: <IconChart /> },
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

export default function SppgDashboard() {
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="sppg-page">
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
