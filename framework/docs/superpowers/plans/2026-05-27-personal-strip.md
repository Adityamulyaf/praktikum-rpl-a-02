# Personal Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambahkan PersonalStrip — strip role-aware antara topbar dan hero yang menampilkan shortcut ke fitur role, dan hapus sidebar/hamburger yang tidak perlu.

**Architecture:** `PersonalStrip` adalah komponen mandiri yang membaca `role` dan `user` dari `AuthContext`, lalu merender greeting + tombol shortcut. Komponen ini di-render di `DashboardLayout` tepat setelah topbar, hanya saat `isHome === true`. Hamburger dan sidebar dihapus sepenuhnya; navigasi balik ke beranda via tombol `← Beranda` di topbar.

**Tech Stack:** React 18, Vite, CSS custom properties (design tokens di `index.css`), React Router v6, AuthContext (`src/context/AuthContext.jsx`)

---

## File Map

| File | Action | Tanggung jawab |
|------|--------|----------------|
| `frontend/src/components/PersonalStrip.jsx` | CREATE | Komponen strip: baca role, render greeting + aksi |
| `frontend/src/components/PersonalStrip.css` | CREATE | Styling strip (ps-* prefix) |
| `frontend/src/components/DashboardLayout.jsx` | MODIFY | Hapus sidebar/hamburger, tambah PersonalStrip + ← Beranda |
| `frontend/src/components/DashboardLayout.css` | MODIFY | Hapus CSS sidebar, tambah `.dl-back-btn` |

Semua path relatif terhadap `framework/`.

---

## Task 1: Buat PersonalStrip.jsx

**Files:**
- Create: `frontend/src/components/PersonalStrip.jsx`

- [ ] **Step 1: Buat file PersonalStrip.jsx dengan konten berikut**

```jsx
import { useAuth } from '../context/AuthContext';
import './PersonalStrip.css';

/* Map role → daftar aksi. key harus cocok dengan menu key di masing-masing dashboard. */
const ROLE_ACTIONS = {
  admin: [
    { key: 'sppg',    label: 'Kelola SPPG' },
    { key: 'sekolah', label: 'Kelola Sekolah' },
  ],
  sppg: [
    { key: 'menu',       label: 'Input Menu' },
    { key: 'distribusi', label: 'Konfirmasi Distribusi' },
    { key: 'profil',     label: 'Profil Dapur' },
  ],
  siswa: [
    { key: 'ulasan',  label: 'Kirim Ulasan' },
    { key: 'riwayat', label: 'Riwayat Ulasan' },
  ],
  guru: [
    { key: 'ulasan', label: 'Ulasan Siswa' },
    { key: 'notif',  label: 'Notifikasi' },
  ],
};

/**
 * Strip tipis di bawah topbar, hanya muncul di beranda (isHome).
 * Menampilkan salam + tombol shortcut ke fitur role.
 *
 * Props:
 *   onNavigate(key) — callback untuk ubah active menu di DashboardLayout
 */
export default function PersonalStrip({ onNavigate }) {
  const { user, role } = useAuth();
  const actions = ROLE_ACTIONS[role] ?? [];

  // Jangan render kalau user tidak ada atau role tidak punya aksi
  if (!user || actions.length === 0) return null;

  return (
    <div className="ps-root">
      <span className="ps-greeting">Hai, {user.name}</span>
      <div className="ps-actions">
        {actions.map(({ key, label }) => (
          <button
            key={key}
            className="ps-action-btn"
            onClick={() => onNavigate(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi file terbuat**

```bash
ls frontend/src/components/PersonalStrip.jsx
```

Expected: file ada, tidak ada error.

---

## Task 2: Buat PersonalStrip.css

**Files:**
- Create: `frontend/src/components/PersonalStrip.css`

- [ ] **Step 1: Buat file PersonalStrip.css dengan konten berikut**

```css
/* ── PERSONAL STRIP ───────────────────────────────────────── */
/* Subtle role-action bar, muncul antara topbar dan hero di beranda */
.ps-root {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 10px var(--space-md);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-default);
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* Greeting: subtle, tidak mendominasi */
.ps-greeting {
  font-size: 13px;
  color: var(--text-secondary);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ps-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* Secondary button style — sama dengan dl-topbar-logout dan pl-nav-register */
.ps-action-btn {
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 5px 12px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: background 150ms, color 150ms;
  white-space: nowrap;
}

.ps-action-btn:hover {
  background: var(--color-primary);
  color: var(--text-inverse);
}

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 480px) {
  .ps-root {
    padding: 8px var(--space-md);
  }

  /* Greeting pindah ke baris sendiri di mobile */
  .ps-greeting {
    width: 100%;
    flex: none;
  }
}
```

- [ ] **Step 2: Verifikasi file terbuat**

```bash
ls frontend/src/components/PersonalStrip.css
```

Expected: file ada.

---

## Task 3: Update DashboardLayout.jsx

**Files:**
- Modify: `frontend/src/components/DashboardLayout.jsx`

Hapus: `sidebarOpen` state, `handleNav`, hamburger button, overlay `div`, `aside` sidebar.  
Tambah: import `PersonalStrip`, tombol `← Beranda` di topbar, render `PersonalStrip` saat `isHome`.

- [ ] **Step 1: Ganti seluruh konten DashboardLayout.jsx dengan versi berikut**

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PersonalStrip from './PersonalStrip';
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
    navigate('/');
  };

  const isHome = activeMenu === firstKey;

  return (
    <div className="dl-root">
      {/* Top bar — always visible */}
      <header className="dl-topbar">
        {!isHome && (
          <button
            className="dl-back-btn"
            onClick={() => setActiveMenu(firstKey)}
          >
            ← Beranda
          </button>
        )}
        <span className="dl-topbar-brand">HaloMBG</span>
        <div className="dl-topbar-right">
          <span className="dl-topbar-username">{user?.name}</span>
          <button className="dl-topbar-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </header>

      {/* Personal strip — hanya di beranda, hilang saat di halaman fitur */}
      {isHome && <PersonalStrip onNavigate={setActiveMenu} />}

      {/* Main content */}
      <main className={`dl-content${isHome ? ' dl-content-home' : ''}`}>
        {children(activeMenu)}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi tidak ada syntax error**

Buka browser dev tools → Console. Reload halaman. Expected: tidak ada error merah.

---

## Task 4: Update DashboardLayout.css

**Files:**
- Modify: `frontend/src/components/DashboardLayout.css`

Hapus blok CSS untuk: `.dl-hamburger`, `.dl-overlay`, `.dl-sidebar` (semua varian), `.dl-sidebar-head`, `.dl-brand`, `.dl-sidebar-close`, `.dl-nav`, `.dl-nav-item`, `.dl-nav-divider`, `.dl-nav-group-label`, `.dl-sidebar-footer`, `.dl-user-info`, `.dl-user-name`, `.dl-user-role`, `.dl-logout`.

Tambah: `.dl-back-btn`.

- [ ] **Step 1: Ganti seluruh konten DashboardLayout.css dengan versi berikut**

```css
/* ── ROOT ─────────────────────────────────────────────────── */
.dl-root {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  width: 100%;
}

/* ── TOP BAR — surface-1 bg, border-bottom per DESIGN.md §5.3 */
.dl-topbar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  height: 56px;
  padding: 0 var(--space-md);
  background: var(--surface-1);
  border-bottom: 1px solid var(--border-default);
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
}

.dl-topbar-brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary);
  flex: 1;
}

.dl-topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.dl-topbar-username {
  font-size: 13px;
  color: var(--text-secondary);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Secondary button style per DESIGN.md §5.1 */
.dl-topbar-logout {
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 5px 12px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  transition: background 150ms, color 150ms;
  white-space: nowrap;
}

.dl-topbar-logout:hover {
  background: var(--color-primary);
  color: var(--text-inverse);
}

/* ── BACK BUTTON ──────────────────────────────────────────── */
/* Muncul di topbar kiri saat user berada di halaman fitur (!isHome) */
.dl-back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background 150ms;
  white-space: nowrap;
  flex-shrink: 0;
}

.dl-back-btn:hover {
  background: var(--surface-2);
}

/* ── CONTENT ──────────────────────────────────────────────── */
.dl-content {
  flex: 1;
  padding: var(--space-xl);
  background: var(--surface-2);
  min-width: 0;
}

/* Home mode: no padding, landingpage fills full width */
.dl-content.dl-content-home {
  padding: 0;
  background: var(--surface-1);
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

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 480px) {
  .dl-topbar-username {
    display: none;
  }

  .dl-content {
    padding: var(--space-md);
  }
}
```

- [ ] **Step 2: Verifikasi tidak ada CSS error**

Buka browser → DevTools → Console. Expected: tidak ada error CSS.

---

## Task 5: Verifikasi Manual End-to-End

- [ ] **Step 1: Jalankan frontend dev server**

```bash
cd framework/frontend
npm run dev
```

Expected output mengandung: `Local: http://localhost:5173/`

- [ ] **Step 2: Login sebagai siswa, cek beranda**

1. Buka `http://localhost:5173/`
2. Klik Masuk → login dengan akun siswa
3. Setelah redirect ke `/siswa`, pastikan:
   - ✅ Strip `ps-root` terlihat di bawah topbar: "Hai, [nama]" + tombol "Kirim Ulasan" + "Riwayat Ulasan"
   - ✅ Tidak ada hamburger button di topbar
   - ✅ Tidak ada sidebar drawer
   - ✅ Tombol "← Beranda" TIDAK terlihat (karena sedang di beranda)
   - ✅ Hero + monitoring content terlihat di bawah strip

- [ ] **Step 3: Klik tombol aksi di strip**

1. Klik "Kirim Ulasan"
2. Pastikan:
   - ✅ Strip hilang (tidak lagi di beranda)
   - ✅ Tombol "← Beranda" muncul di kiri topbar
   - ✅ Konten halaman berubah ke halaman Kirim Ulasan

- [ ] **Step 4: Klik ← Beranda**

1. Klik tombol "← Beranda" di topbar
2. Pastikan:
   - ✅ Strip "Hai, [nama]" muncul kembali
   - ✅ Tombol "← Beranda" hilang
   - ✅ Hero + monitoring content tampil kembali

- [ ] **Step 5: Cek role admin**

1. Login sebagai admin → buka `/admin`
2. Pastikan strip menampilkan "Kelola SPPG" dan "Kelola Sekolah"
3. Klik "Kelola SPPG" → pastikan pindah ke halaman SPPG table
4. Klik "← Beranda" → kembali ke landing

- [ ] **Step 6: Cek mobile responsive**

1. Di DevTools, aktifkan device toolbar (Ctrl+Shift+M)
2. Set width 375px (iPhone SE)
3. Pastikan:
   - ✅ Strip tidak overflow horizontal
   - ✅ Greeting dan tombol wrap dengan baik
   - ✅ Tombol masih bisa diklik

---

## Commit Message

Setelah semua task selesai dan terverifikasi:

```
feat: add PersonalStrip, remove hamburger sidebar

- Add PersonalStrip component: role-aware greeting + action shortcuts
  shown between topbar and hero on beranda only
- Remove drawer sidebar and hamburger button entirely
- Add ← Beranda button in topbar when user is on a feature page
- Strip reads role/user from AuthContext, zero prop threading needed
```
