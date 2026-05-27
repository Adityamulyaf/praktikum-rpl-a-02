# Personal Strip — Design Spec

**Date:** 2026-05-27  
**Status:** Approved  
**Feature:** Role-aware action strip untuk logged-in users di beranda dashboard

---

## Problem

Setelah login, semua role (admin, sppg, siswa, guru) mendarat di beranda yang tampilannya identik dengan halaman publik — hero search, fitur monitoring, footer. Tidak ada visual cue bahwa user sudah login, dan fitur role-spesifik tersembunyi di balik hamburger drawer yang tidak obvious.

---

## Solution

Tambahkan **PersonalStrip** — strip tipis antara topbar dan hero yang muncul hanya di beranda. Strip menampilkan:
- Salam + nama user (tanda visual "kamu sudah login")
- Tombol-tombol shortcut ke fitur role

Sidebar/hamburger dihapus sepenuhnya. Navigasi balik dari halaman fitur ke beranda menggunakan tombol `← Beranda` di topbar.

---

## Architecture

```
DashboardLayout
├── <header className="dl-topbar">
│     ├── [← Beranda]  ← muncul hanya saat !isHome
│     ├── brand "HaloMBG"
│     ├── username
│     └── [Keluar]
│
├── {isHome && <PersonalStrip onNavigate={setActive} />}  ← BARU
│
└── <main className="dl-content">
      {children(active)}   ← PublicLandingContent atau halaman fitur
```

---

## Component: PersonalStrip

**File:** `src/components/PersonalStrip.jsx`  
**CSS:** `src/components/PersonalStrip.css`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onNavigate` | `(key: string) => void` | Callback untuk ubah active menu di DashboardLayout |

### Behaviour

1. Baca `user` dan `role` dari `AuthContext`
2. Lookup `ROLE_ACTIONS[role]` → array `{ key, label }` (key = menu key di DashboardLayout)
3. Render greeting + action buttons
4. Klik tombol → panggil `onNavigate(key)`

### Role Actions

| Role | Actions |
|------|---------|
| `admin` | `{ key: 'sppg', label: 'Kelola SPPG' }`, `{ key: 'sekolah', label: 'Kelola Sekolah' }` |
| `sppg` | `{ key: 'menu', label: 'Input Menu' }`, `{ key: 'distribusi', label: 'Konfirmasi Distribusi' }`, `{ key: 'profil', label: 'Profil Dapur' }` |
| `siswa` | `{ key: 'ulasan', label: 'Kirim Ulasan' }`, `{ key: 'riwayat', label: 'Riwayat Ulasan' }` |
| `guru` | `{ key: 'ulasan', label: 'Ulasan Siswa' }`, `{ key: 'notif', label: 'Notifikasi' }` |

---

## Visual Design (DESIGN.md compliant)

```
┌─────────────────────────────────────────────────────┐
│  Hai, Budi Santoso          [Kirim Ulasan]  [Riwayat Ulasan] │
└─────────────────────────────────────────────────────┘
```

- **Background:** `var(--surface-2)` — subtle, tidak competing dengan hero navy
- **Border bottom:** `1px solid var(--border-default)` — pemisah bersih
- **Padding:** `10px var(--space-md)`
- **Greeting:** font-size 13px, `var(--text-secondary)`, flex: 1
- **Tombol:** secondary style — `border: 1px solid var(--color-primary)`, transparent bg, 12px font, `var(--color-primary)` color. Hover: fill navy.
- **Gap tombol:** `var(--space-sm)`
- **No gradients, no shadows, no colored icon circles** — per DESIGN.md §4.5, §8.1

---

## Changes to DashboardLayout

### 1. Render PersonalStrip

```jsx
// Setelah topbar, sebelum main content:
{isHome && <PersonalStrip onNavigate={setActive} />}
```

`isHome` sudah ada: `const isHome = active === firstItem.key`

### 2. Hapus Hamburger & Sidebar

- Hapus state `sidebarOpen`
- Hapus `dl-hamburger` button dari topbar
- Hapus `dl-overlay` dan `dl-sidebar` dari render
- Hapus CSS class `.dl-hamburger`, `.dl-overlay`, `.dl-sidebar`, `.dl-sidebar-*`, `.dl-nav`, `.dl-nav-*` dari `DashboardLayout.css`

### 3. Tambah tombol ← Beranda di Topbar

```jsx
// Di dalam dl-topbar, sebelum brand:
{!isHome && (
  <button className="dl-back-btn" onClick={() => setActive(firstItem.key)}>
    ← Beranda
  </button>
)}
```

CSS `.dl-back-btn`:
- `background: none`, `border: none`, `cursor: pointer`
- `font-size: 13px`, `color: var(--color-primary)`, `font-weight: 500`
- `padding: 4px 8px`, `border-radius: var(--radius-sm)`
- Hover: `background: var(--surface-2)`

---

## Data Flow

```
User klik "Kirim Ulasan"
  → PersonalStrip.onNavigate('ulasan')
  → DashboardLayout.setActive('ulasan')
  → isHome = false  (active !== firstItem.key)
  → PersonalStrip hilang, ← Beranda muncul di topbar
  → children('ulasan') → render halaman Kirim Ulasan

User klik ← Beranda
  → DashboardLayout.setActive(firstItem.key)
  → isHome = true
  → PersonalStrip muncul lagi, ← Beranda hilang
  → children('beranda') → render PublicLandingContent
```

---

## Responsive

- `@media (max-width: 480px)`: tombol action wrap ke baris kedua jika perlu, atau horizontal scroll
- Greeting text terpotong dengan `text-overflow: ellipsis` jika nama terlalu panjang

---

## Out of Scope

- Animasi/transisi pada strip (DESIGN.md melarang animasi dekoratif)
- Notifikasi badge pada tombol (fitur terpisah)
- Sidebar sebagai optional panel (dihapus sepenuhnya)
