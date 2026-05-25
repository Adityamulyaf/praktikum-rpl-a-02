# Design Spec: Admin Dashboard BL-06

**Tanggal:** 2026-05-25
**Backlog:** BL-06 — Panel Admin: Master Data SPPG & Sekolah
**User Story:** US-13

---

## Keputusan Desain

| Aspek | Keputusan |
|---|---|
| Layout | Sidebar tetap di kiri, konten di kanan |
| Form tambah/edit | Modal (popup) |
| Pemetaan sekolah ke SPPG | Modal terpisah, diakses lewat tombol "Kelola Sekolah" di tabel |
| Arsitektur komponen | Komponen terpisah per fitur |

---

## Struktur File

```
src/pages/
  AdminDashboard.jsx          ← shell: sidebar + routing konten
  admin/
    SppgTable.jsx             ← tabel SPPG + trigger modal
    SppgFormModal.jsx         ← modal tambah/edit SPPG
    SppgSchoolModal.jsx       ← modal kelola sekolah per SPPG
    SchoolTable.jsx           ← tabel sekolah + trigger modal
    SchoolFormModal.jsx       ← modal tambah/edit sekolah
```

---

## Section 1 — Layout & Navigasi

`AdminDashboard.jsx` adalah shell dengan dua area:

**Sidebar kiri (220px tetap):**
- Brand "HaloMBG" di atas
- Dua menu: "SPPG" dan "Sekolah" dengan highlight aktif
- Info nama user dan tombol Logout di bawah

**Area konten kanan:**
- Render `<SppgTable />` atau `<SchoolTable />` sesuai menu aktif
- Background `--surface-2`, padding konsisten

**State di `AdminDashboard.jsx`:**
```js
activeMenu: 'sppg' | 'sekolah'
```

Semua state tabel dan modal dikelola di komponen masing-masing, bukan di parent.

---

## Section 2 — Manajemen SPPG

### `SppgTable.jsx`

**State:**
```js
sppgs: []
loading: bool
modalOpen: bool
editTarget: null | sppg        // null = tambah, ada data = edit
schoolModalTarget: null | sppg // SPPG yang sedang dikelola sekolahnya
```

**Kolom tabel:**
- Nama Dapur, Wilayah (district / province), Contact Person, Jumlah Sekolah, Status (Aktif/Nonaktif), Aksi

**Aksi per baris:**
- `Edit` → buka `SppgFormModal` dengan data SPPG
- `Kelola Sekolah` → buka `SppgSchoolModal`
- `Nonaktifkan` → konfirmasi → `DELETE /api/admin/sppg/{id}`

### `SppgFormModal.jsx`

**Mode tambah** — tampilkan section "Akun Login" + "Data Dapur":

*Akun Login (hanya mode tambah):*
- Nama, Email, Password, Telepon

*Data Dapur (tambah & edit):*
- Nama Dapur, Alamat, Kecamatan, Provinsi
- Nama Contact Person, Telepon Contact, Email Contact
- Deskripsi, Kapasitas Produksi

**Submit:**
- Tambah → `POST /api/admin/sppg`
- Edit → `PUT /api/admin/sppg/{id}`
- Setelah sukses: tutup modal, refresh tabel

---

## Section 3 — Manajemen Sekolah

### `SchoolTable.jsx`

**State:**
```js
schools: []
loading: bool
modalOpen: bool
editTarget: null | school
```

**Kolom tabel:**
- Nama Sekolah, Kecamatan, Provinsi, Aksi

**Aksi per baris:**
- `Edit` → buka `SchoolFormModal`
- `Hapus` → konfirmasi → `DELETE /api/admin/schools/{id}`

### `SchoolFormModal.jsx`

**Fields:** Nama Sekolah, Alamat, Kecamatan, Provinsi

**Submit:**
- Tambah → `POST /api/admin/schools`
- Edit → `PUT /api/admin/schools/{id}`
- Setelah sukses: tutup modal, refresh tabel

---

## Section 4 — Pemetaan Sekolah ke SPPG

### `SppgSchoolModal.jsx`

**State:**
```js
allSchools: []       // semua sekolah dari GET /api/admin/schools
assigned: Set<id>    // id sekolah yang sudah ter-assign
loading: bool
```

**Tampilan:**
- Header: "Kelola Sekolah — [Nama Dapur]"
- Input search untuk filter nama sekolah (filter lokal)
- Daftar semua sekolah dengan checkbox (dicentang = ter-assign)
- Tombol "Simpan" di bawah

**Submit:**
- Hit `PUT /api/admin/sppg/{id}/schools/sync` dengan `{ school_ids: [...] }`
- Satu request untuk semua perubahan, bukan per-checkbox

---

## API Endpoints

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/admin/sppg` | List semua SPPG |
| POST | `/api/admin/sppg` | Tambah SPPG + buat akun user |
| PUT | `/api/admin/sppg/{id}` | Edit data dapur SPPG |
| DELETE | `/api/admin/sppg/{id}` | Nonaktifkan SPPG |
| GET | `/api/admin/schools` | List semua sekolah |
| POST | `/api/admin/schools` | Tambah sekolah |
| PUT | `/api/admin/schools/{id}` | Edit sekolah |
| DELETE | `/api/admin/schools/{id}` | Hapus sekolah |
| PUT | `/api/admin/sppg/{id}/schools/sync` | Sync sekolah ke SPPG |
