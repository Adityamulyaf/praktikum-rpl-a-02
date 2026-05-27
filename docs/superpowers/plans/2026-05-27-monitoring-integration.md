# Monitoring Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambahkan fitur monitoring publik (cari SPPG/sekolah, menu harian, status distribusi, profil dapur) ke semua dashboard role, plus buat landing page publik di `/`.

**Architecture:** Update `DashboardLayout` agar support menu groups (dengan label separator). Buat komponen monitoring di `src/features/monitoring/`. Semua dashboard (Admin, SPPG, Siswa, Guru) pakai grup menu baru "Monitoring". Buat `PublicLanding` page untuk user yang belum login. AdminDashboard direfactor untuk pakai `DashboardLayout` agar konsisten.

**Tech Stack:** React 18, React Router v6, CSS variables, axios (endpoint `/public/schools` sudah ada)

---

## File Map

| Action | File | Tanggung Jawab |
|--------|------|----------------|
| Modify | `src/components/DashboardLayout.jsx` | Ganti prop `menuItems` → `menuGroups` (array of groups with optional label) |
| Modify | `src/components/DashboardLayout.css` | Tambah `.dl-nav-group-label` dan `.dl-nav-divider` |
| Create | `src/features/monitoring/MonitoringCariSppg.jsx` | Search sekolah pakai `/public/schools`, tampil hasil |
| Create | `src/features/monitoring/MonitoringMenuHarian.jsx` | Placeholder menu harian publik |
| Create | `src/features/monitoring/MonitoringStatusDistribusi.jsx` | Placeholder status distribusi |
| Create | `src/features/monitoring/MonitoringProfilDapur.jsx` | Placeholder profil dapur publik |
| Modify | `src/pages/AdminDashboard.jsx` | Refactor ke DashboardLayout + tambah Monitoring group |
| Modify | `src/pages/SppgDashboard.jsx` | menuItems → menuGroups + Monitoring group |
| Modify | `src/pages/SiswaDashboard.jsx` | menuItems → menuGroups + Monitoring group |
| Modify | `src/pages/GuruDashboard.jsx` | menuItems → menuGroups + Monitoring group |
| Create | `src/pages/PublicLanding.jsx` | Landing page `/` — hero + search + link ke monitoring |
| Create | `src/pages/PublicLanding.css` | Styles untuk landing page |
| Modify | `src/App.jsx` | Tambah route `/` → PublicLanding |

---

## Task 1: Update DashboardLayout — Menu Groups

**Files:**
- Modify: `framework/frontend/src/components/DashboardLayout.jsx`
- Modify: `framework/frontend/src/components/DashboardLayout.css`

- [ ] **Step 1: Tambah CSS untuk group label dan divider**

Di `DashboardLayout.css`, tambahkan SEBELUM bagian `/* ── RESPONSIVE */`:

```css
/* ── NAV GROUPS ───────────────────────────────────────────── */
.dl-nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: var(--space-sm) var(--space-sm);
}

.dl-nav-group-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: var(--space-sm) var(--space-md) 2px;
}
```

- [ ] **Step 2: Update DashboardLayout.jsx**

Ganti seluruh isi `DashboardLayout.jsx` dengan:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

/**
 * Shared dashboard shell untuk semua role.
 *
 * Props:
 *   menuGroups – array of { label?: string, items: { key, label, icon }[] }
 *   children   – render prop: (activeMenu: string) => ReactNode
 *   pageClass  – optional string ditambahkan ke #root element
 */
export default function DashboardLayout({ menuGroups, children, pageClass }) {
  const firstKey = menuGroups?.[0]?.items?.[0]?.key ?? '';
  const [activeMenu, setActiveMenu] = useState(firstKey);
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
          {menuGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="dl-nav-divider" />}
              {group.label && (
                <span className="dl-nav-group-label">{group.label}</span>
              )}
              {group.items.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`dl-nav-item${activeMenu === key ? ' active' : ''}`}
                  onClick={() => handleNav(key)}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
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

- [ ] **Step 3: Verifikasi**

Tidak ada yang perlu dirender ke browser dulu — lanjut task berikutnya.

---

## Task 2: Monitoring Feature Components

**Files:**
- Create: `framework/frontend/src/features/monitoring/MonitoringCariSppg.jsx`
- Create: `framework/frontend/src/features/monitoring/MonitoringMenuHarian.jsx`
- Create: `framework/frontend/src/features/monitoring/MonitoringStatusDistribusi.jsx`
- Create: `framework/frontend/src/features/monitoring/MonitoringProfilDapur.jsx`

- [ ] **Step 1: Buat `MonitoringCariSppg.jsx`**

Buat file `framework/frontend/src/features/monitoring/MonitoringCariSppg.jsx`:

```jsx
import { useState, useRef } from 'react';
import { searchPublicSchools } from '../../api/auth';

export default function MonitoringCariSppg() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);

    clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setSearched(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchPublicSchools(q);
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Cari SPPG / Sekolah</h1>
        <p className="mon-sub">
          Temukan dapur MBG yang melayani sekolah tertentu dengan mengetik nama sekolah atau kabupaten.
        </p>
      </div>

      <div className="mon-search-wrap">
        <div className="mon-search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          className="mon-search-input"
          type="text"
          placeholder="Cari nama sekolah atau kabupaten..."
          value={query}
          onChange={handleInput}
          autoComplete="off"
        />
        {loading && <div className="mon-search-spinner" />}
      </div>

      {searched && results.length === 0 && (
        <div className="mon-empty">
          <p>Tidak ada sekolah ditemukan untuk "<strong>{query}</strong>"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mon-results">
          <p className="mon-results-count">{results.length} sekolah ditemukan</p>
          <div className="mon-table-wrap">
            <table className="mon-table">
              <thead>
                <tr>
                  <th>Nama Sekolah</th>
                  <th>Kabupaten / Kota</th>
                  <th>Provinsi</th>
                  <th>Dapur SPPG</th>
                </tr>
              </thead>
              <tbody>
                {results.map((school) => (
                  <tr key={school.id}>
                    <td>{school.name}</td>
                    <td>{school.district ?? '—'}</td>
                    <td>{school.province ?? '—'}</td>
                    <td>
                      <span className="mon-badge-pending">Segera tersedia</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!searched && (
        <div className="mon-hint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--text-tertiary)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>Ketik minimal 2 karakter untuk memulai pencarian</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Buat `MonitoringMenuHarian.jsx`**

Buat file `framework/frontend/src/features/monitoring/MonitoringMenuHarian.jsx`:

```jsx
export default function MonitoringMenuHarian() {
  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Menu Harian</h1>
        <p className="mon-sub">
          Pantau menu makanan yang disajikan oleh setiap dapur MBG hari ini beserta informasi nutrisinya.
        </p>
      </div>
      <div className="mon-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-tertiary)' }}>
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
        </svg>
        <h2>Menu Harian</h2>
        <p>Data menu harian akan tersedia setelah operator SPPG mulai menginput menu di platform ini.</p>
        <span className="dl-placeholder-badge">Segera Hadir</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Buat `MonitoringStatusDistribusi.jsx`**

Buat file `framework/frontend/src/features/monitoring/MonitoringStatusDistribusi.jsx`:

```jsx
export default function MonitoringStatusDistribusi() {
  return (
    <div className="mon-root">
      <div className="mon-header">
        <h1 className="mon-title">Status Distribusi</h1>
        <p className="mon-sub">
          Pantau status pengiriman makanan MBG ke setiap sekolah secara real-time.
        </p>
      </div>
      <div className="mon-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--text-tertiary)' }}>
          <rect x="1" y="3" width="15" height="13"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <h2>Status Distribusi</h2>
        <p>Status distribusi harian akan tampil di sini setelah SPPG mulai memperbarui pengiriman di platform.</p>
        <span className="dl-placeholder-badge">Segera Hadir</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Buat `MonitoringProfilDapur.jsx`**

Buat file `framework/frontend/src/features/monitoring/MonitoringProfilDapur.jsx`:

```jsx
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
```

- [ ] **Step 5: Buat CSS monitoring di `DashboardLayout.css`**

Tambahkan di akhir file `DashboardLayout.css` (setelah `@media (max-width: 480px)`):

```css
/* ── MONITORING PAGES ─────────────────────────────────────── */
.mon-root {
  max-width: 900px;
}

.mon-header {
  margin-bottom: var(--space-xl);
}

.mon-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm);
}

.mon-sub {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Search */
.mon-search-wrap {
  position: relative;
  margin-bottom: var(--space-lg);
}

.mon-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
}

.mon-search-input {
  width: 100%;
  height: 44px;
  padding: 0 44px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  background: var(--surface-1);
  color: var(--text-primary);
  box-sizing: border-box;
  transition: border-color 150ms;
}

.mon-search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.mon-search-spinner {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-default);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: mon-spin 0.6s linear infinite;
}

@keyframes mon-spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Results */
.mon-results-count {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 var(--space-md);
}

.mon-table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  background: var(--surface-1);
}

.mon-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.mon-table thead tr {
  background: var(--surface-2);
}

.mon-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--border-default);
  white-space: nowrap;
}

.mon-table td {
  padding: 12px 16px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-default);
}

.mon-table tbody tr:last-child td {
  border-bottom: none;
}

.mon-table tbody tr:hover td {
  background: var(--surface-2);
}

.mon-badge-pending {
  display: inline-block;
  padding: 2px 8px;
  background: var(--surface-3);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
}

/* Empty / hint */
.mon-empty {
  padding: var(--space-xl) 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.mon-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-3xl) 0;
  color: var(--text-tertiary);
  font-size: 14px;
  text-align: center;
}

.mon-hint p {
  margin: 0;
}

/* Placeholder (reuse dl-placeholder style but inside mon-root) */
.mon-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  gap: var(--space-md);
}

.mon-placeholder h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.mon-placeholder p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 380px;
  line-height: 1.6;
}
```

---

## Task 3: Refactor AdminDashboard ke DashboardLayout

**Files:**
- Modify: `framework/frontend/src/pages/AdminDashboard.jsx`

> Note: `AdminDashboard.css` tetap ada dan tidak dihapus karena mungkin masih di-import oleh file lain. Kita cukup hapus import-nya dari AdminDashboard.jsx.

- [ ] **Step 1: Ganti seluruh isi `AdminDashboard.jsx`**

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SppgTable from './admin/SppgTable';
import SchoolTable from './admin/SchoolTable';
import MonitoringCariSppg from '../features/monitoring/MonitoringCariSppg';
import MonitoringMenuHarian from '../features/monitoring/MonitoringMenuHarian';
import MonitoringStatusDistribusi from '../features/monitoring/MonitoringStatusDistribusi';
import MonitoringProfilDapur from '../features/monitoring/MonitoringProfilDapur';

/* ── Icons ─────────────────────────────────────────────────── */
const IconSppg    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconSchool  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconFood    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>;
const IconTruck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: 'sppg',    label: 'SPPG',    icon: <IconSppg /> },
      { key: 'sekolah', label: 'Sekolah', icon: <IconSchool /> },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'mon-cari',       label: 'Cari SPPG / Sekolah',  icon: <IconSearch /> },
      { key: 'mon-menu',       label: 'Menu Harian',          icon: <IconFood /> },
      { key: 'mon-distribusi', label: 'Status Distribusi',    icon: <IconTruck /> },
      { key: 'mon-profil',     label: 'Profil Dapur',         icon: <IconBuilding /> },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="admin-page">
      {(active) => {
        switch (active) {
          case 'sppg':            return <SppgTable />;
          case 'sekolah':         return <SchoolTable />;
          case 'mon-cari':        return <MonitoringCariSppg />;
          case 'mon-menu':        return <MonitoringMenuHarian />;
          case 'mon-distribusi':  return <MonitoringStatusDistribusi />;
          case 'mon-profil':      return <MonitoringProfilDapur />;
          default:                return null;
        }
      }}
    </DashboardLayout>
  );
}
```

---

## Task 4: Update SppgDashboard, SiswaDashboard, GuruDashboard

**Files:**
- Modify: `framework/frontend/src/pages/SppgDashboard.jsx`
- Modify: `framework/frontend/src/pages/SiswaDashboard.jsx`
- Modify: `framework/frontend/src/pages/GuruDashboard.jsx`

- [ ] **Step 1: Ganti seluruh isi `SppgDashboard.jsx`**

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import MonitoringCariSppg from '../features/monitoring/MonitoringCariSppg';
import MonitoringMenuHarian from '../features/monitoring/MonitoringMenuHarian';
import MonitoringStatusDistribusi from '../features/monitoring/MonitoringStatusDistribusi';
import MonitoringProfilDapur from '../features/monitoring/MonitoringProfilDapur';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMenu     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
const IconTruck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
const IconChart    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconFood     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>;

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: 'beranda',    label: 'Beranda',      icon: <IconHome /> },
      { key: 'menu',       label: 'Menu Harian',  icon: <IconMenu /> },
      { key: 'distribusi', label: 'Distribusi',   icon: <IconTruck /> },
      { key: 'profil',     label: 'Profil Dapur', icon: <IconBuilding /> },
      { key: 'evaluasi',   label: 'Evaluasi',     icon: <IconChart /> },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'mon-cari',       label: 'Cari SPPG / Sekolah', icon: <IconSearch /> },
      { key: 'mon-menu',       label: 'Menu Harian',         icon: <IconFood /> },
      { key: 'mon-distribusi', label: 'Status Distribusi',   icon: <IconTruck /> },
      { key: 'mon-profil',     label: 'Profil Dapur',        icon: <IconBuilding /> },
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

export default function SppgDashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="sppg-page">
      {(active) => {
        switch (active) {
          case 'beranda':         return <Beranda user={user} />;
          case 'menu':            return <ComingSoon title="Menu Harian" description="Input menu makanan harian beserta klaim kandungan nutrisi dan foto." />;
          case 'distribusi':      return <ComingSoon title="Status Distribusi" description="Perbarui status pengiriman ke setiap sekolah dan unggah foto bukti distribusi." />;
          case 'profil':          return <ComingSoon title="Profil Dapur" description="Kelola informasi profil dapur — deskripsi, contact person, dan kapasitas produksi." />;
          case 'evaluasi':        return <ComingSoon title="Evaluasi Internal" description="Ringkasan sentimen ulasan dengan breakdown per sekolah dan rekap historis mingguan." />;
          case 'mon-cari':        return <MonitoringCariSppg />;
          case 'mon-menu':        return <MonitoringMenuHarian />;
          case 'mon-distribusi':  return <MonitoringStatusDistribusi />;
          case 'mon-profil':      return <MonitoringProfilDapur />;
          default:                return null;
        }
      }}
    </DashboardLayout>
  );
}
```

- [ ] **Step 2: Ganti seluruh isi `SiswaDashboard.jsx`**

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import MonitoringCariSppg from '../features/monitoring/MonitoringCariSppg';
import MonitoringMenuHarian from '../features/monitoring/MonitoringMenuHarian';
import MonitoringStatusDistribusi from '../features/monitoring/MonitoringStatusDistribusi';
import MonitoringProfilDapur from '../features/monitoring/MonitoringProfilDapur';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconStar     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconFood     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>;
const IconTruck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: 'beranda', label: 'Beranda',        icon: <IconHome /> },
      { key: 'ulasan',  label: 'Kirim Ulasan',   icon: <IconStar /> },
      { key: 'riwayat', label: 'Riwayat Ulasan', icon: <IconClock /> },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'mon-cari',       label: 'Cari SPPG / Sekolah', icon: <IconSearch /> },
      { key: 'mon-menu',       label: 'Menu Harian',         icon: <IconFood /> },
      { key: 'mon-distribusi', label: 'Status Distribusi',   icon: <IconTruck /> },
      { key: 'mon-profil',     label: 'Profil Dapur',        icon: <IconBuilding /> },
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

function Beranda({ user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';
  return (
    <div className="dl-welcome">
      <h1 className="dl-welcome-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="dl-welcome-sub">
        Selamat datang di dashboard siswa HaloMBG. Berikan ulasan harian dan pantau distribusi MBG di sekolahmu.
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

export default function SiswaDashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="siswa-page">
      {(active) => {
        switch (active) {
          case 'beranda':         return <Beranda user={user} />;
          case 'ulasan':          return <ComingSoon title="Kirim Ulasan" description="Berikan ulasan harian tentang makanan MBG yang kamu terima hari ini, lengkap dengan foto sebagai bukti." />;
          case 'riwayat':         return <ComingSoon title="Riwayat Ulasan" description="Lihat semua ulasan yang pernah kamu kirimkan beserta statusnya." />;
          case 'mon-cari':        return <MonitoringCariSppg />;
          case 'mon-menu':        return <MonitoringMenuHarian />;
          case 'mon-distribusi':  return <MonitoringStatusDistribusi />;
          case 'mon-profil':      return <MonitoringProfilDapur />;
          default:                return null;
        }
      }}
    </DashboardLayout>
  );
}
```

- [ ] **Step 3: Ganti seluruh isi `GuruDashboard.jsx`**

```jsx
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import MonitoringCariSppg from '../features/monitoring/MonitoringCariSppg';
import MonitoringMenuHarian from '../features/monitoring/MonitoringMenuHarian';
import MonitoringStatusDistribusi from '../features/monitoring/MonitoringStatusDistribusi';
import MonitoringProfilDapur from '../features/monitoring/MonitoringProfilDapur';

/* ── Icons ─────────────────────────────────────────────── */
const IconHome     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconMessages = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconFood     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>;
const IconTruck    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconBuilding = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;

const MENU_GROUPS = [
  {
    label: null,
    items: [
      { key: 'beranda', label: 'Beranda',      icon: <IconHome /> },
      { key: 'ulasan',  label: 'Ulasan Siswa', icon: <IconMessages /> },
      { key: 'notif',   label: 'Notifikasi',   icon: <IconBell /> },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'mon-cari',       label: 'Cari SPPG / Sekolah', icon: <IconSearch /> },
      { key: 'mon-menu',       label: 'Menu Harian',         icon: <IconFood /> },
      { key: 'mon-distribusi', label: 'Status Distribusi',   icon: <IconTruck /> },
      { key: 'mon-profil',     label: 'Profil Dapur',        icon: <IconBuilding /> },
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

function Beranda({ user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';
  return (
    <div className="dl-welcome">
      <h1 className="dl-welcome-title">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="dl-welcome-sub">
        Selamat datang di dashboard guru HaloMBG. Pantau moderasi ulasan siswa dan distribusi MBG di sekolah Anda.
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

export default function GuruDashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout menuGroups={MENU_GROUPS} pageClass="guru-page">
      {(active) => {
        switch (active) {
          case 'beranda':         return <Beranda user={user} />;
          case 'ulasan':          return <ComingSoon title="Ulasan Siswa" description="Pantau dan moderasi ulasan yang dikirim siswa di sekolah Anda." />;
          case 'notif':           return <ComingSoon title="Notifikasi" description="Pemberitahuan saat ada ulasan baru dari siswa yang perlu diperhatikan." />;
          case 'mon-cari':        return <MonitoringCariSppg />;
          case 'mon-menu':        return <MonitoringMenuHarian />;
          case 'mon-distribusi':  return <MonitoringStatusDistribusi />;
          case 'mon-profil':      return <MonitoringProfilDapur />;
          default:                return null;
        }
      }}
    </DashboardLayout>
  );
}
```

---

## Task 5: Public Landing Page

**Files:**
- Create: `framework/frontend/src/pages/PublicLanding.jsx`
- Create: `framework/frontend/src/pages/PublicLanding.css`

- [ ] **Step 1: Buat `PublicLanding.css`**

```css
/* ── ROOT ─────────────────────────────────────────────────── */
.pl-root {
  min-height: 100svh;
  background: var(--surface-1);
  font-family: var(--font-sans);
}

/* ── NAV ──────────────────────────────────────────────────── */
.pl-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-2xl);
  border-bottom: 1px solid var(--border-default);
  background: var(--surface-1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.pl-nav-brand {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

.pl-nav-login {
  padding: 8px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 150ms;
}

.pl-nav-login:hover {
  opacity: 0.88;
}

/* ── HERO ─────────────────────────────────────────────────── */
.pl-hero {
  background: var(--color-primary);
  color: white;
  padding: var(--space-3xl) var(--space-2xl);
  text-align: center;
}

.pl-hero-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 var(--space-md);
  line-height: 1.25;
}

.pl-hero-sub {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  margin: 0 auto var(--space-2xl);
  max-width: 520px;
  line-height: 1.6;
}

.pl-hero-search {
  max-width: 520px;
  margin: 0 auto;
  position: relative;
}

.pl-hero-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.5);
  pointer-events: none;
  display: flex;
}

.pl-hero-input {
  width: 100%;
  height: 48px;
  padding: 0 48px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 15px;
  color: white;
  box-sizing: border-box;
  transition: border-color 150ms, background 150ms;
}

.pl-hero-input::placeholder {
  color: rgba(255,255,255,0.45);
}

.pl-hero-input:focus {
  outline: none;
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.5);
}

.pl-hero-spinner {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: pl-spin 0.6s linear infinite;
}

@keyframes pl-spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Search results */
.pl-search-results {
  background: white;
  border-radius: var(--radius-lg);
  margin-top: var(--space-sm);
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  text-align: left;
}

.pl-search-count {
  font-size: 12px;
  color: var(--text-secondary);
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-default);
}

.pl-school-item {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pl-school-item:last-child {
  border-bottom: none;
}

.pl-school-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.pl-school-loc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.pl-school-badge {
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--surface-3);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.pl-search-empty {
  padding: var(--space-md);
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

/* ── FEATURES SECTION ─────────────────────────────────────── */
.pl-features {
  padding: var(--space-3xl) var(--space-2xl);
  max-width: 960px;
  margin: 0 auto;
}

.pl-features-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xl);
  text-align: center;
}

.pl-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.pl-feature-card {
  background: var(--surface-2);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.pl-feature-icon {
  color: var(--color-primary);
  width: 32px;
  height: 32px;
}

.pl-feature-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.pl-feature-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.pl-feature-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--surface-3);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  align-self: flex-start;
}

/* ── FOOTER ───────────────────────────────────────────────── */
.pl-footer {
  border-top: 1px solid var(--border-default);
  padding: var(--space-xl) var(--space-2xl);
  text-align: center;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .pl-nav {
    padding: var(--space-md);
  }

  .pl-hero {
    padding: var(--space-2xl) var(--space-md);
  }

  .pl-hero-title {
    font-size: 24px;
  }

  .pl-features {
    padding: var(--space-2xl) var(--space-md);
  }
}
```

- [ ] **Step 2: Buat `PublicLanding.jsx`**

```jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPublicSchools } from '../api/auth';
import './PublicLanding.css';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    name: 'Cari SPPG & Sekolah',
    desc: 'Temukan dapur MBG yang melayani sekolah tertentu.',
    badge: null,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/>
      </svg>
    ),
    name: 'Menu Harian',
    desc: 'Pantau menu dan informasi nutrisi MBG setiap hari.',
    badge: 'Segera',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    name: 'Status Distribusi',
    desc: 'Cek real-time apakah MBG sudah sampai ke sekolah hari ini.',
    badge: 'Segera',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    name: 'Profil Dapur',
    desc: 'Informasi lengkap setiap dapur MBG dan contact person-nya.',
    badge: 'Segera',
  },
];

export default function PublicLanding() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);

    clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setSearched(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchPublicSchools(q);
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="pl-root">
      {/* Nav */}
      <nav className="pl-nav">
        <span className="pl-nav-brand">HaloMBG</span>
        <a className="pl-nav-login" onClick={() => navigate('/login')}>
          Masuk
        </a>
      </nav>

      {/* Hero */}
      <section className="pl-hero">
        <h1 className="pl-hero-title">Monitoring Makan Bergizi Gratis</h1>
        <p className="pl-hero-sub">
          Platform transparan untuk memantau distribusi, menu, dan kualitas program MBG di seluruh Indonesia.
        </p>

        <div className="pl-hero-search">
          <div className="pl-hero-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <input
            className="pl-hero-input"
            type="text"
            placeholder="Cari nama sekolah atau kabupaten..."
            value={query}
            onChange={handleInput}
            autoComplete="off"
          />
          {loading && <div className="pl-hero-spinner" />}

          {searched && (
            <div className="pl-search-results">
              {results.length === 0 ? (
                <div className="pl-search-empty">
                  Tidak ada sekolah ditemukan untuk "{query}"
                </div>
              ) : (
                <>
                  <div className="pl-search-count">{results.length} sekolah ditemukan</div>
                  {results.slice(0, 8).map((s) => (
                    <div key={s.id} className="pl-school-item">
                      <div>
                        <div className="pl-school-name">{s.name}</div>
                        <div className="pl-school-loc">{s.district} · {s.province}</div>
                      </div>
                      <span className="pl-school-badge">SPPG: segera</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="pl-features">
        <h2 className="pl-features-title">Fitur Monitoring</h2>
        <div className="pl-features-grid">
          {FEATURES.map(({ icon, name, desc, badge }) => (
            <div key={name} className="pl-feature-card">
              <div className="pl-feature-icon">{icon}</div>
              <p className="pl-feature-name">{name}</p>
              <p className="pl-feature-desc">{desc}</p>
              {badge && <span className="pl-feature-badge">{badge}</span>}
            </div>
          ))}
        </div>
      </section>

      <footer className="pl-footer">© 2026 HaloMBG · Platform Monitoring Makan Bergizi Gratis</footer>
    </div>
  );
}
```

---

## Task 6: Update App.jsx

**Files:**
- Modify: `framework/frontend/src/App.jsx`

- [ ] **Step 1: Ganti seluruh isi `App.jsx`**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLanding from './pages/PublicLanding';
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
        <Route path="/" element={<PublicLanding />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Verifikasi di browser**

1. Buka `http://127.0.0.1:5173/` → landing page dengan hero + search box + feature cards
2. Ketik nama sekolah di hero search → hasil muncul
3. Klik "Masuk" → ke halaman login
4. Login sebagai admin → `/admin` → sidebar sekarang ada grup "Monitoring" di bawah SPPG & Sekolah
5. Klik "Cari SPPG / Sekolah" di sidebar admin → search box muncul, bisa cari sekolah
6. Login sebagai siswa → `/siswa` → ada grup Monitoring di sidebar
7. Login sebagai guru → `/guru` → ada grup Monitoring di sidebar

- [ ] **Step 3: Commit**

```bash
git add framework/frontend/src/components/DashboardLayout.jsx \
        framework/frontend/src/components/DashboardLayout.css \
        framework/frontend/src/features/ \
        framework/frontend/src/pages/AdminDashboard.jsx \
        framework/frontend/src/pages/SppgDashboard.jsx \
        framework/frontend/src/pages/SiswaDashboard.jsx \
        framework/frontend/src/pages/GuruDashboard.jsx \
        framework/frontend/src/pages/PublicLanding.jsx \
        framework/frontend/src/pages/PublicLanding.css \
        framework/frontend/src/App.jsx
git commit -m "feat: add monitoring section to all dashboards and public landing page"
```
