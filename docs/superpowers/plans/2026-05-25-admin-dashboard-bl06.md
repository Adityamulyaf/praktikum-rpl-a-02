# Admin Dashboard BL-06 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun Admin Dashboard lengkap untuk mengelola master data SPPG dan Sekolah, termasuk pemetaan sekolah ke SPPG.

**Architecture:** Sidebar layout dengan komponen terpisah per fitur. State modal dan tabel dikelola di komponen masing-masing. AdminDashboard hanya urus navigasi aktif.

**Tech Stack:** React 18, React Router v6, Axios, CSS Variables (design system sudah ada di `src/index.css`)

**Spec:** `docs/superpowers/specs/2026-05-25-admin-dashboard-bl06-design.md`

---

## File Map

| File | Status | Tanggung Jawab |
|---|---|---|
| `src/api/admin.js` | Buat baru | Semua API call admin (SPPG + Sekolah) |
| `src/pages/AdminDashboard.jsx` | Modifikasi | Shell: sidebar + render tabel aktif |
| `src/pages/AdminDashboard.css` | Buat baru | Sidebar layout styles |
| `src/pages/admin/admin.css` | Buat baru | Shared styles: tabel, modal, form, badge |
| `src/pages/admin/SchoolFormModal.jsx` | Buat baru | Modal tambah/edit sekolah |
| `src/pages/admin/SchoolTable.jsx` | Buat baru | Tabel daftar sekolah + trigger modal |
| `src/pages/admin/SppgFormModal.jsx` | Buat baru | Modal tambah/edit SPPG |
| `src/pages/admin/SppgSchoolModal.jsx` | Buat baru | Modal kelola sekolah per SPPG |
| `src/pages/admin/SppgTable.jsx` | Buat baru | Tabel daftar SPPG + trigger semua modal |

---

## Task 1: API Layer

**Files:**
- Buat: `src/api/admin.js`

- [ ] **Step 1: Buat file API**

Buat file `framework/frontend/src/api/admin.js`:

```js
import api from './axios';

export const getSppgs  = ()          => api.get('/admin/sppg');
export const createSppg = (data)     => api.post('/admin/sppg', data);
export const updateSppg = (id, data) => api.put(`/admin/sppg/${id}`, data);
export const deleteSppg = (id)       => api.delete(`/admin/sppg/${id}`);

export const getSchools   = ()          => api.get('/admin/schools');
export const createSchool = (data)      => api.post('/admin/schools', data);
export const updateSchool = (id, data)  => api.put(`/admin/schools/${id}`, data);
export const deleteSchool = (id)        => api.delete(`/admin/schools/${id}`);

export const syncSppgSchools = (sppgId, schoolIds) =>
  api.put(`/admin/sppg/${sppgId}/schools/sync`, { school_ids: schoolIds });
```

- [ ] **Step 2: Commit**

```
feat: add admin API layer
```

---

## Task 2: Admin Dashboard Shell + CSS

**Files:**
- Modifikasi: `src/pages/AdminDashboard.jsx`
- Buat: `src/pages/AdminDashboard.css`

- [ ] **Step 1: Buat CSS sidebar**

Buat file `framework/frontend/src/pages/AdminDashboard.css`:

```css
.ad-root {
  display: flex;
  min-height: 100svh;
  width: 100%;
  text-align: left;
}

.ad-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface-1);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg) 0;
  position: sticky;
  top: 0;
  height: 100svh;
  box-sizing: border-box;
}

.ad-brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary);
  padding: 0 var(--space-lg) var(--space-lg);
  border-bottom: 1px solid var(--border-default);
  margin-bottom: var(--space-md);
}

.ad-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 var(--space-sm);
  flex: 1;
}

.ad-nav-item {
  width: 100%;
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  background: none;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 150ms, color 150ms;
}

.ad-nav-item:hover {
  background: var(--surface-2);
  color: var(--text-primary);
}

.ad-nav-item.active {
  background: var(--surface-3);
  color: var(--color-primary);
}

.ad-sidebar-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ad-user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ad-logout {
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 6px var(--space-md);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 150ms;
}

.ad-logout:hover {
  border-color: var(--status-error);
  color: var(--status-error);
}

.ad-content {
  flex: 1;
  padding: var(--space-xl);
  min-width: 0;
  background: var(--surface-2);
}
```

- [ ] **Step 2: Perbarui AdminDashboard.jsx**

Ganti seluruh isi `framework/frontend/src/pages/AdminDashboard.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const MENU_ITEMS = [
  { key: 'sppg',    label: 'SPPG' },
  { key: 'sekolah', label: 'Sekolah' },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('sppg');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="ad-root">
      <aside className="ad-sidebar">
        <div className="ad-brand">HaloMBG</div>
        <nav className="ad-nav">
          {MENU_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`ad-nav-item${activeMenu === key ? ' active' : ''}`}
              onClick={() => setActiveMenu(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <span className="ad-user-name">{user?.name}</span>
          <button className="ad-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>
      <main className="ad-content">
        {/* Tabel akan dirender di sini pada Task berikutnya */}
        <p>Pilih menu di sidebar.</p>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verifikasi tampilan sidebar**

Buka `http://localhost:5173`, login sebagai admin, pastikan:
- Sidebar muncul di kiri dengan menu "SPPG" dan "Sekolah"
- Tombol "Keluar" berfungsi
- Tidak ada error di console

- [ ] **Step 4: Commit**

```
feat: add admin dashboard sidebar layout
```

---

## Task 3: Shared Admin CSS

**Files:**
- Buat: `src/pages/admin/admin.css`

- [ ] **Step 1: Buat direktori dan file CSS**

Buat file `framework/frontend/src/pages/admin/admin.css`:

```css
/* ── SECTION HEADER ─────────────────────────────────────── */

.adm-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.adm-section-header h2 {
  margin: 0;
}

/* ── TABLE ───────────────────────────────────────────────── */

.adm-table-wrap {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.adm-table th {
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid var(--border-default);
  background: var(--surface-2);
}

.adm-table td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-default);
  color: var(--text-primary);
  vertical-align: middle;
}

.adm-table tr:last-child td { border-bottom: none; }
.adm-table tr:hover td { background: var(--surface-2); }

/* ── BADGES ──────────────────────────────────────────────── */

.adm-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.adm-badge.active   { background: #E8F5E9; color: var(--status-success); }
.adm-badge.inactive { background: #FFEBEE; color: var(--status-error); }

/* ── BUTTONS ─────────────────────────────────────────────── */

.adm-actions { display: flex; gap: var(--space-sm); }

.adm-btn {
  padding: 5px 12px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-default);
  background: var(--surface-1);
  color: var(--text-primary);
  transition: all 150ms;
}

.adm-btn:hover              { background: var(--surface-2); }
.adm-btn.primary            { background: var(--color-primary); color: var(--text-inverse); border-color: var(--color-primary); }
.adm-btn.primary:hover      { background: #0a2a5c; }
.adm-btn.danger             { color: var(--status-error); }
.adm-btn.danger:hover       { background: #FFEBEE; border-color: var(--status-error); }
.adm-btn:disabled           { opacity: 0.5; cursor: not-allowed; }

/* ── STATES ──────────────────────────────────────────────── */

.adm-loading { text-align: center; padding: var(--space-2xl); color: var(--text-secondary); }
.adm-empty   { text-align: center; padding: var(--space-2xl); color: var(--text-tertiary); }

/* ── MODAL ───────────────────────────────────────────────── */

.adm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.adm-modal {
  background: var(--surface-1);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.adm-modal.wide { max-width: 480px; }

.adm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-default);
  flex-shrink: 0;
}

.adm-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.adm-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-tertiary);
  font-size: 20px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
}

.adm-modal-close:hover { color: var(--text-primary); }

.adm-modal-body {
  overflow-y: auto;
  padding: var(--space-lg);
  flex: 1;
}

.adm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}

/* ── FORM ────────────────────────────────────────────────── */

.adm-field-group { margin-bottom: var(--space-md); }

.adm-field-group h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin: 0 0 var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-default);
}

.adm-field { margin-bottom: var(--space-md); }

.adm-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.adm-input,
.adm-textarea {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-sizing: border-box;
  transition: border-color 150ms;
  outline: none;
  -webkit-appearance: none;
}

.adm-textarea { resize: vertical; min-height: 80px; }

.adm-input:focus,
.adm-textarea:focus {
  border-color: var(--color-primary);
  outline: 2px solid rgba(7, 30, 73, 0.12);
  outline-offset: 1px;
}

.adm-error-msg {
  font-size: 13px;
  color: var(--status-error);
  background: #FFEBEE;
  border-left: 3px solid var(--status-error);
  border-radius: var(--radius-md);
  padding: var(--space-sm) 12px;
  margin-bottom: var(--space-md);
}

/* ── SCHOOL MODAL ────────────────────────────────────────── */

.adm-search {
  width: 100%;
  padding: 8px 12px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-sizing: border-box;
  margin-bottom: var(--space-md);
  outline: none;
  transition: border-color 150ms;
  -webkit-appearance: none;
}

.adm-search:focus { border-color: var(--color-primary); }

.adm-school-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
}

.adm-school-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 150ms;
}

.adm-school-item:hover { background: var(--surface-2); }

.adm-school-item input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.adm-school-item-label {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.adm-school-item-sub {
  font-size: 12px;
  color: var(--text-tertiary);
}
```

- [ ] **Step 2: Commit**

```
feat: add shared admin CSS
```

---

## Task 4: School Form Modal

**Files:**
- Buat: `src/pages/admin/SchoolFormModal.jsx`

- [ ] **Step 1: Buat komponen**

Buat file `framework/frontend/src/pages/admin/SchoolFormModal.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { createSchool, updateSchool } from '../../api/admin';
import './admin.css';

export default function SchoolFormModal({ school, onClose, onSaved }) {
  const isEdit = !!school;
  const [form, setForm] = useState({ name: '', address: '', district: '', province: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school) {
      setForm({
        name:     school.name     ?? '',
        address:  school.address  ?? '',
        district: school.district ?? '',
        province: school.province ?? '',
      });
    }
  }, [school]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      isEdit ? await updateSchool(school.id, form) : await createSchool(form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>{isEdit ? 'Edit Sekolah' : 'Tambah Sekolah'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}
            <div className="adm-field">
              <label className="adm-label">Nama Sekolah</label>
              <input className="adm-input" value={form.name} onChange={set('name')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label">Alamat</label>
              <input className="adm-input" value={form.address} onChange={set('address')} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Kecamatan</label>
              <input className="adm-input" value={form.district} onChange={set('district')} required />
            </div>
            <div className="adm-field">
              <label className="adm-label">Provinsi</label>
              <input className="adm-input" value={form.province} onChange={set('province')} required />
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="adm-btn primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
feat: add SchoolFormModal component
```

---

## Task 5: School Table

**Files:**
- Buat: `src/pages/admin/SchoolTable.jsx`

- [ ] **Step 1: Buat komponen**

Buat file `framework/frontend/src/pages/admin/SchoolTable.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react';
import { getSchools, deleteSchool } from '../../api/admin';
import SchoolFormModal from './SchoolFormModal';
import './admin.css';

export default function SchoolTable() {
  const [schools, setSchools]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSchools();
      setSchools(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = ()       => { setEditTarget(null);   setModalOpen(true); };
  const openEdit = (school) => { setEditTarget(school); setModalOpen(true); };
  const closeModal  = () => setModalOpen(false);
  const handleSaved = () => { closeModal(); load(); };

  const handleDelete = async (school) => {
    if (!confirm(`Hapus sekolah "${school.name}"?`)) return;
    await deleteSchool(school.id);
    load();
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>Sekolah</h2>
        <button className="adm-btn primary" onClick={openAdd}>+ Tambah Sekolah</button>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : schools.length === 0 ? (
          <p className="adm-empty">Belum ada sekolah.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama Sekolah</th>
                <th>Kecamatan</th>
                <th>Provinsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td>{school.name}</td>
                  <td>{school.district}</td>
                  <td>{school.province}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn" onClick={() => openEdit(school)}>Edit</button>
                      <button className="adm-btn danger" onClick={() => handleDelete(school)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <SchoolFormModal school={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
feat: add SchoolTable component
```

---

## Task 6: SPPG Form Modal

**Files:**
- Buat: `src/pages/admin/SppgFormModal.jsx`

- [ ] **Step 1: Buat komponen**

Buat file `framework/frontend/src/pages/admin/SppgFormModal.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { createSppg, updateSppg } from '../../api/admin';
import './admin.css';

const INITIAL = {
  name: '', email: '', password: '', phone_number: '',
  kitchen_name: '', address: '', district: '', province: '',
  contact_person_name: '', contact_phone: '', contact_email: '',
  description: '', production_capacity: '',
};

export default function SppgFormModal({ sppg, onClose, onSaved }) {
  const isEdit = !!sppg;
  const [form, setForm]     = useState(INITIAL);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sppg) {
      setForm((f) => ({
        ...f,
        kitchen_name:        sppg.kitchen_name        ?? '',
        address:             sppg.address             ?? '',
        district:            sppg.district            ?? '',
        province:            sppg.province            ?? '',
        contact_person_name: sppg.contact_person_name ?? '',
        contact_phone:       sppg.contact_phone       ?? '',
        contact_email:       sppg.contact_email       ?? '',
        description:         sppg.description         ?? '',
        production_capacity: sppg.production_capacity ?? '',
      }));
    }
  }, [sppg]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateSppg(sppg.id, {
          kitchen_name:        form.kitchen_name,
          address:             form.address,
          district:            form.district,
          province:            form.province,
          contact_person_name: form.contact_person_name,
          contact_phone:       form.contact_phone,
          contact_email:       form.contact_email       || undefined,
          description:         form.description         || undefined,
          production_capacity: form.production_capacity ? Number(form.production_capacity) : undefined,
        });
      } else {
        await createSppg({
          ...form,
          contact_email:       form.contact_email       || undefined,
          description:         form.description         || undefined,
          production_capacity: form.production_capacity ? Number(form.production_capacity) : undefined,
        });
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>{isEdit ? 'Edit SPPG' : 'Tambah SPPG'}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="adm-modal-body">
            {error && <p className="adm-error-msg">{error}</p>}

            {!isEdit && (
              <div className="adm-field-group">
                <h4>Akun Login</h4>
                <div className="adm-field">
                  <label className="adm-label">Nama</label>
                  <input className="adm-input" value={form.name} onChange={set('name')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Email</label>
                  <input className="adm-input" type="email" value={form.email} onChange={set('email')} required />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Password</label>
                  <input className="adm-input" type="password" value={form.password} onChange={set('password')} required minLength={8} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Telepon</label>
                  <input className="adm-input" value={form.phone_number} onChange={set('phone_number')} />
                </div>
              </div>
            )}

            <div className="adm-field-group">
              <h4>Data Dapur</h4>
              <div className="adm-field">
                <label className="adm-label">Nama Dapur</label>
                <input className="adm-input" value={form.kitchen_name} onChange={set('kitchen_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Alamat</label>
                <input className="adm-input" value={form.address} onChange={set('address')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Kecamatan</label>
                <input className="adm-input" value={form.district} onChange={set('district')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Provinsi</label>
                <input className="adm-input" value={form.province} onChange={set('province')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Nama Contact Person</label>
                <input className="adm-input" value={form.contact_person_name} onChange={set('contact_person_name')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Telepon Contact</label>
                <input className="adm-input" value={form.contact_phone} onChange={set('contact_phone')} required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Email Contact</label>
                <input className="adm-input" type="email" value={form.contact_email} onChange={set('contact_email')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Deskripsi</label>
                <textarea className="adm-textarea" value={form.description} onChange={set('description')} />
              </div>
              <div className="adm-field">
                <label className="adm-label">Kapasitas Produksi</label>
                <input className="adm-input" type="number" min="1" value={form.production_capacity} onChange={set('production_capacity')} />
              </div>
            </div>
          </div>
          <div className="adm-modal-footer">
            <button type="button" className="adm-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="adm-btn primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
feat: add SppgFormModal component
```

---

## Task 7: SPPG School Modal

**Files:**
- Buat: `src/pages/admin/SppgSchoolModal.jsx`

- [ ] **Step 1: Buat komponen**

Buat file `framework/frontend/src/pages/admin/SppgSchoolModal.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { getSchools, syncSppgSchools } from '../../api/admin';
import './admin.css';

export default function SppgSchoolModal({ sppg, onClose, onSaved }) {
  const [allSchools, setAllSchools] = useState([]);
  const [assigned, setAssigned]     = useState(new Set());
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    getSchools().then(({ data }) => {
      setAllSchools(data);
      setAssigned(new Set((sppg.schools ?? []).map((s) => s.id)));
      setLoading(false);
    });
  }, [sppg]);

  const toggle = (id) =>
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await syncSppgSchools(sppg.id, [...assigned]);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = allSchools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>Kelola Sekolah — {sppg.kitchen_name}</h3>
          <button className="adm-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="adm-modal-body">
          {error && <p className="adm-error-msg">{error}</p>}
          <input
            className="adm-search"
            placeholder="Cari nama sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading ? (
            <p className="adm-loading">Memuat data...</p>
          ) : (
            <div className="adm-school-list">
              {filtered.length === 0 && <p className="adm-empty">Sekolah tidak ditemukan.</p>}
              {filtered.map((school) => (
                <label key={school.id} className="adm-school-item">
                  <input
                    type="checkbox"
                    checked={assigned.has(school.id)}
                    onChange={() => toggle(school.id)}
                  />
                  <span className="adm-school-item-label">{school.name}</span>
                  <span className="adm-school-item-sub">{school.district}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn" onClick={onClose}>Batal</button>
          <button className="adm-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
feat: add SppgSchoolModal component
```

---

## Task 8: SPPG Table

**Files:**
- Buat: `src/pages/admin/SppgTable.jsx`

- [ ] **Step 1: Buat komponen**

Buat file `framework/frontend/src/pages/admin/SppgTable.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react';
import { getSppgs, deleteSppg } from '../../api/admin';
import SppgFormModal from './SppgFormModal';
import SppgSchoolModal from './SppgSchoolModal';
import './admin.css';

export default function SppgTable() {
  const [sppgs, setSppgs]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [modalOpen, setModalOpen]           = useState(false);
  const [editTarget, setEditTarget]         = useState(null);
  const [schoolModalTarget, setSchoolModalTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSppgs();
      setSppgs(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd    = ()     => { setEditTarget(null); setModalOpen(true); };
  const openEdit   = (sppg) => { setEditTarget(sppg); setModalOpen(true); };
  const closeModal  = ()    => setModalOpen(false);
  const handleSaved = ()    => { closeModal(); load(); };

  const openSchoolModal    = (sppg) => setSchoolModalTarget(sppg);
  const closeSchoolModal   = ()     => setSchoolModalTarget(null);
  const handleSchoolSaved  = ()     => { closeSchoolModal(); load(); };

  const handleDeactivate = async (sppg) => {
    if (!confirm(`Nonaktifkan SPPG "${sppg.kitchen_name}"?`)) return;
    await deleteSppg(sppg.id);
    load();
  };

  return (
    <div>
      <div className="adm-section-header">
        <h2>SPPG</h2>
        <button className="adm-btn primary" onClick={openAdd}>+ Tambah SPPG</button>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <p className="adm-loading">Memuat data...</p>
        ) : sppgs.length === 0 ? (
          <p className="adm-empty">Belum ada SPPG.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nama Dapur</th>
                <th>Wilayah</th>
                <th>Contact Person</th>
                <th>Sekolah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sppgs.map((sppg) => (
                <tr key={sppg.id}>
                  <td>{sppg.kitchen_name}</td>
                  <td>{sppg.district}, {sppg.province}</td>
                  <td>{sppg.contact_person_name}</td>
                  <td>{sppg.schools?.length ?? 0} sekolah</td>
                  <td>
                    <span className={`adm-badge ${sppg.user?.is_active ? 'active' : 'inactive'}`}>
                      {sppg.user?.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn" onClick={() => openEdit(sppg)}>Edit</button>
                      <button className="adm-btn" onClick={() => openSchoolModal(sppg)}>Kelola Sekolah</button>
                      {sppg.user?.is_active && (
                        <button className="adm-btn danger" onClick={() => handleDeactivate(sppg)}>
                          Nonaktifkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <SppgFormModal sppg={editTarget} onClose={closeModal} onSaved={handleSaved} />
      )}

      {schoolModalTarget && (
        <SppgSchoolModal sppg={schoolModalTarget} onClose={closeSchoolModal} onSaved={handleSchoolSaved} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
feat: add SppgTable component
```

---

## Task 9: Wire Up AdminDashboard

**Files:**
- Modifikasi: `src/pages/AdminDashboard.jsx`

- [ ] **Step 1: Import dan render tabel di AdminDashboard**

Ganti seluruh isi `framework/frontend/src/pages/AdminDashboard.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SppgTable from './admin/SppgTable';
import SchoolTable from './admin/SchoolTable';
import './AdminDashboard.css';

const MENU_ITEMS = [
  { key: 'sppg',    label: 'SPPG' },
  { key: 'sekolah', label: 'Sekolah' },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('sppg');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="ad-root">
      <aside className="ad-sidebar">
        <div className="ad-brand">HaloMBG</div>
        <nav className="ad-nav">
          {MENU_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`ad-nav-item${activeMenu === key ? ' active' : ''}`}
              onClick={() => setActiveMenu(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <span className="ad-user-name">{user?.name}</span>
          <button className="ad-logout" onClick={handleLogout}>Keluar</button>
        </div>
      </aside>
      <main className="ad-content">
        {activeMenu === 'sppg'    && <SppgTable />}
        {activeMenu === 'sekolah' && <SchoolTable />}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi end-to-end di browser**

Buka `http://localhost:5173`, login sebagai admin, lalu test semua skenario:

| Skenario | Yang diharapkan |
|---|---|
| Buka menu "SPPG" | Tabel SPPG muncul (kosong jika belum ada data) |
| Klik "+ Tambah SPPG" | Modal muncul dengan section "Akun Login" dan "Data Dapur" |
| Isi form dan klik "Simpan" | SPPG tersimpan, tabel refresh |
| Klik "Edit" pada SPPG | Modal muncul tanpa section "Akun Login", data terisi |
| Klik "Kelola Sekolah" | Modal checklist sekolah muncul |
| Centang sekolah dan simpan | Relasi tersimpan, jumlah sekolah di tabel terupdate |
| Klik "Nonaktifkan" | Konfirmasi muncul, SPPG berubah jadi Nonaktif |
| Buka menu "Sekolah" | Tabel sekolah muncul |
| Tambah, edit, hapus sekolah | Semua operasi berfungsi |

- [ ] **Step 3: Commit**

```
feat: wire up AdminDashboard with SPPG and School tables (BL-06)
```
