# Dashboard Shells (SPPG, Siswa, Guru) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create shell dashboards for SPPG, Siswa, dan Guru roles — full sidebar layout dengan menu items sesuai backlog, konten placeholder untuk fitur yang belum ada backend-nya.

**Architecture:** Extract shared `DashboardLayout` component dari pola AdminDashboard yang sudah ada. Tiga dashboard baru (SPPG, Siswa, Guru) masing-masing define menu items-nya sendiri dan render konten per-menu. AdminDashboard yang sudah ada tidak diubah.

**Tech Stack:** React 18, React Router v6, Vite, CSS variables (dari DESIGN.md)

---

## File Map

| Action | File | Tanggung Jawab |
|--------|------|----------------|
| Create | `src/components/DashboardLayout.jsx` | Shared sidebar + mobile topbar + overlay + content slot |
| Create | `src/components/DashboardLayout.css` | CSS untuk layout (port dari AdminDashboard.css) |
| Create | `src/pages/SppgDashboard.jsx` | Dashboard SPPG dengan 5 menu item |
| Create | `src/pages/SiswaDashboard.jsx` | Dashboard Siswa dengan 3 menu item |
| Create | `src/pages/GuruDashboard.jsx` | Dashboard Guru dengan 3 menu item |
| Modify | `src/App.jsx` | Ganti placeholder `<div>` dengan komponen baru |

---

## Task 1: Shared DashboardLayout Component

**Files:**
- Create: `framework/frontend/src/components/DashboardLayout.jsx`
- Create: `framework/frontend/src/components/DashboardLayout.css`

- [ ] **Step 1: Buat `DashboardLayout.css`**

Buat file `framework/frontend/src/components/DashboardLayout.css` dengan isi:

```css
/* ── ROOT ─────────────────────────────────────────────────── */
.dl-root {
  display: flex;
  min-height: 100svh;
  width: 100%;
  text-align: left;
}

/* ── SIDEBAR ──────────────────────────────────────────────── */
.dl-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) 0;
  position: sticky;
  top: 0;
  height: 100svh;
  box-sizing: border-box;
}

.dl-brand {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  padding: 0 var(--space-lg) var(--space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--space-md);
}

.dl-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 var(--space-sm);
  flex: 1;
}

.dl-nav-item {
  width: 100%;
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  background: none;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background 150ms, color 150ms;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.dl-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.dl-nav-item.active {
  background: none;
  color: #ffffff;
  font-weight: 600;
  border-left: 3px solid var(--color-secondary);
  padding-left: calc(var(--space-md) - 3px);
}

.dl-nav-item svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.dl-nav-item.active svg,
.dl-nav-item:hover svg {
  opacity: 1;
}

/* ── SIDEBAR FOOTER ───────────────────────────────────────── */
.dl-sidebar-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.dl-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dl-user-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dl-user-role {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.dl-logout {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: 6px var(--space-md);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 150ms;
}

.dl-logout:hover {
  border-color: #ff8a80;
  color: #ff8a80;
}

/* ── CONTENT ──────────────────────────────────────────────── */
.dl-content {
  flex: 1;
  padding: var(--space-xl);
  min-width: 0;
  background: var(--surface-2);
}

/* ── MOBILE TOP BAR (hidden on desktop) ──────────────────── */
.dl-topbar {
  display: none;
}

.dl-overlay {
  display: none;
}

/* ── PLACEHOLDER CARD ─────────────────────────────────────── */
.dl-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  gap: var(--space-md);
}

.dl-placeholder-icon {
  color: var(--text-tertiary);
  margin-bottom: var(--space-sm);
}

.dl-placeholder h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.dl-placeholder p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 360px;
  line-height: 1.6;
}

.dl-placeholder-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--surface-3);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--space-sm);
}

/* ── WELCOME CARD ─────────────────────────────────────────── */
.dl-welcome {
  max-width: 640px;
}

.dl-welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm);
}

.dl-welcome-sub {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 var(--space-xl);
  line-height: 1.6;
}

.dl-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-md);
}

.dl-info-card {
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.dl-info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.dl-info-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .dl-root {
    flex-direction: column;
  }

  .dl-topbar {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    height: 52px;
    padding: 0 var(--space-md);
    background: var(--color-primary);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .dl-topbar-brand {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }

  .dl-hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    flex-shrink: 0;
  }

  .dl-hamburger span {
    display: block;
    height: 2px;
    width: 100%;
    background: #ffffff;
    border-radius: 2px;
  }

  .dl-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 99;
  }

  .dl-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100svh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 250ms ease;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
  }

  .dl-sidebar.open {
    transform: translateX(0);
  }

  .dl-content {
    padding: var(--space-lg) var(--space-md);
  }
}

@media (max-width: 480px) {
  .dl-content {
    padding: var(--space-md);
  }
}
```

- [ ] **Step 2: Buat `DashboardLayout.jsx`**

Buat file `framework/frontend/src/components/DashboardLayout.jsx` dengan isi:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

/**
 * Shared dashboard shell untuk semua role (SPPG, Siswa, Guru).
 *
 * Props:
 *   menuItems  – array of { key: string, label: string, icon: ReactNode }
 *   children   – render prop: (activeMenu: string) => ReactNode
 *   pageClass  – optional string ditambahkan ke #root element (untuk global CSS reset)
 */
export default function DashboardLayout({ menuItems, children, pageClass }) {
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.key ?? '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageClass) return;
    const root = document.getElementById('root');
    root.classList.add(pageClass);
    return () => root.classList.remove(pageClass);
  }, [pageClass]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNav = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  return (
    <div className="dl-root">
      {/* Mobile top bar */}
      <header className="dl-topbar">
        <button
          className="dl-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka menu"
        >
          <span /><span /><span />
        </button>
        <span className="dl-topbar-brand">HaloMBG</span>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="dl-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dl-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dl-brand">HaloMBG</div>
        <nav className="dl-nav">
          {menuItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`dl-nav-item${activeMenu === key ? ' active' : ''}`}
              onClick={() => handleNav(key)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
        <div className="dl-sidebar-footer">
          <div className="dl-user-info">
            <span className="dl-user-name">{user?.name}</span>
            <span className="dl-user-role">{user?.role}</span>
          </div>
          <button className="dl-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dl-content">
        {children(activeMenu)}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verifikasi manual**

Pastikan kedua file ada:
- `src/components/DashboardLayout.jsx`
- `src/components/DashboardLayout.css`

Belum ada yang di-render ke browser — lanjut ke Task 2.

---

## Task 2: Shared Placeholder & Welcome Components (inline helpers)

Tidak perlu file terpisah — helper ini ditulis langsung di masing-masing dashboard sebagai fungsi lokal.

**Placeholder helper** (dipakai di semua menu "coming soon"):

```jsx
function ComingSoon({ title, description }) {
  return (
    <div className="dl-placeholder">
      <div className="dl-placeholder-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
```

**Welcome helper** (untuk halaman Beranda):

```jsx
function Beranda({ user, infoItems }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  return (
    <div className="dl-welcome">
      <h1 className="dl-welcome-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="dl-welcome-sub">
        Selamat datang di dashboard HaloMBG. Pilih menu di sebelah kiri untuk mulai.
      </p>
      <div className="dl-info-grid">
        {infoItems.map(({ label, value }) => (
          <div key={label} className="dl-info-card">
            <span className="dl-info-label">{label}</span>
            <span className="dl-info-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Task 3: SPPG Dashboard

**Files:**
- Create: `framework/frontend/src/pages/SppgDashboard.jsx`

- [ ] **Step 1: Buat `SppgDashboard.jsx`**

Buat file `framework/frontend/src/pages/SppgDashboard.jsx`:

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMenu      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
const IconTruck     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
const IconChart     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda',    label: 'Beranda',       icon: <IconHome /> },
  { key: 'menu',       label: 'Menu Harian',   icon: <IconMenu /> },
  { key: 'distribusi', label: 'Distribusi',    icon: <IconTruck /> },
  { key: 'profil',     label: 'Profil Dapur',  icon: <IconBuilding /> },
  { key: 'evaluasi',   label: 'Evaluasi',      icon: <IconChart /> },
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
```

- [ ] **Step 2: Verifikasi file ada**

Cek `src/pages/SppgDashboard.jsx` sudah tersimpan.

---

## Task 4: Siswa Dashboard

**Files:**
- Create: `framework/frontend/src/pages/SiswaDashboard.jsx`

- [ ] **Step 1: Buat `SiswaDashboard.jsx`**

Buat file `framework/frontend/src/pages/SiswaDashboard.jsx`:

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconStar    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda',  label: 'Beranda',         icon: <IconHome /> },
  { key: 'ulasan',   label: 'Kirim Ulasan',    icon: <IconStar /> },
  { key: 'riwayat',  label: 'Riwayat Ulasan',  icon: <IconClock /> },
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
```

---

## Task 5: Guru Dashboard

**Files:**
- Create: `framework/frontend/src/pages/GuruDashboard.jsx`

- [ ] **Step 1: Buat `GuruDashboard.jsx`**

Buat file `framework/frontend/src/pages/GuruDashboard.jsx`:

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMessages = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;

const MENU_ITEMS = [
  { key: 'beranda',  label: 'Beranda',         icon: <IconHome /> },
  { key: 'ulasan',   label: 'Ulasan Siswa',    icon: <IconMessages /> },
  { key: 'notif',    label: 'Notifikasi',       icon: <IconBell /> },
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
```

---

## Task 6: Wire Up Routes di App.jsx

**Files:**
- Modify: `framework/frontend/src/App.jsx`

- [ ] **Step 1: Update `App.jsx`**

Ganti isi `App.jsx` menjadi:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SppgDashboard from './pages/SppgDashboard';
import SiswaDashboard from './pages/SiswaDashboard';
import GuruDashboard from './pages/GuruDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* SPPG */}
        <Route element={<ProtectedRoute allowedRoles={['sppg']} />}>
          <Route path="/sppg" element={<SppgDashboard />} />
        </Route>

        {/* Siswa */}
        <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
          <Route path="/siswa" element={<SiswaDashboard />} />
        </Route>

        {/* Guru */}
        <Route element={<ProtectedRoute allowedRoles={['guru']} />}>
          <Route path="/guru" element={<GuruDashboard />} />
        </Route>

        {/* Catchalls */}
        <Route path="/unauthorized" element={<div style={{ padding: '2rem', color: 'red' }}>403 - Access Denied</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Verifikasi di browser**

1. Login sebagai `admin@halombg.com` → harus masuk ke `/admin` (AdminDashboard, tidak berubah)
2. Register akun siswa baru → login → harus masuk ke `/siswa` → tampil Beranda dengan nama user
3. Register akun guru baru → login → harus masuk ke `/guru` → tampil Beranda dengan nama user
4. Klik setiap menu item → harus tampil placeholder "Segera Hadir"
5. Test responsive: perkecil browser → hamburger menu harus muncul dan berfungsi

- [ ] **Step 3: Commit**

```bash
git add framework/frontend/src/components/DashboardLayout.jsx \
        framework/frontend/src/components/DashboardLayout.css \
        framework/frontend/src/pages/SppgDashboard.jsx \
        framework/frontend/src/pages/SiswaDashboard.jsx \
        framework/frontend/src/pages/GuruDashboard.jsx \
        framework/frontend/src/App.jsx
git commit -m "feat: add SPPG, Siswa, Guru dashboard shells with shared DashboardLayout"
```
