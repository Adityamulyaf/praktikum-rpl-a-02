import DashboardLayout from "../../components/DashboardLayout";
import PublicLandingContent from "../../features/PublicLandingContent";
import SppgTable from "./SppgTable";
import SchoolTable from "./SchoolTable";
import NotifikasiList from "../sppg/notifikasi/NotifikasiList";

/* ── Icons ─────────────────────────────────────────────────── */
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
const IconSppg = () => (
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
    <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);
const IconSchool = () => (
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
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
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

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: "beranda", label: "Beranda", icon: <IconHome /> },
      { key: "notif", label: "Notifikasi", icon: <IconBell /> },
      { key: "sppg", label: "SPPG", icon: <IconSppg /> },
      { key: "sekolah", label: "Sekolah", icon: <IconSchool /> },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="admin-page" hasSidebar>
      {(active, onNavigate) => {
        switch (active) {
          case "beranda":
            return <PublicLandingContent onNavigate={onNavigate} />;
          case "sppg":
            return <SppgTable />;
          case "sekolah":
            return <SchoolTable />;
          case "notif":
            return <NotifikasiList onNavigate={onNavigate} />;
          default:
            return null;
        }
      }}
    </DashboardLayout>
  );
}
