# Product Backlog - HaloMBG

## Daftar Backlog

| ID | Judul | Prioritas | Estimasi | Dependensi |
|----|-------|-----------|----------|------------|
| [BL-01](#bl-01--sistem-autentikasi-dan-manajemen-role) | Sistem Autentikasi dan Manajemen Role | 🔴 Must-have | M | - |
| [BL-02](#bl-02--profil-dapur-mbg-sppg-dan-daftar-sekolah) | Profil Dapur MBG (SPPG) dan Daftar Sekolah | 🔴 Must-have | L | BL-01 |
| [BL-03](#bl-03--pencarian-sppg-melalui-wilayah-dan-nama-sekolah) | Pencarian SPPG melalui Wilayah dan Nama Sekolah | 🔴 Must-have | S | BL-02 |
| [BL-04](#bl-04--input-menu-harian-oleh-sppg) | Input Menu Harian oleh SPPG | 🔴 Must-have | M | BL-01, BL-02 |
| [BL-05](#bl-05--validasi-nutrisi-berbasis-ai-foto--teks) | Validasi Nutrisi Berbasis AI (Foto + Teks) | 🔴 Must-have | L | BL-04 |
| [BL-06](#bl-06--panel-admin-master-data-sppg--sekolah) | Panel Admin: Master Data SPPG & Sekolah  | 🔴 Must-have | M | BL-01 |
| [BL-07](#bl-07--status-distribusi-harian-dan-bukti-foto) | Status Distribusi Harian dan Bukti Foto | 🟠 Should-have | M | BL-01, BL-02 |
| [BL-08](#bl-08--ulasan-dan-foto-dari-siswa) | Ulasan dan Foto dari Siswa | 🟠 Should-have | M | BL-01, BL-04 |
| [BL-09](#bl-09--sistem-notifikasi) | Sistem Notifikasi  | 🟠 Should-have | S | BL-08 |
| [BL-10](#bl-10--moderasi-post-publish-ulasan-oleh-guru) | Moderasi Post-Publish Ulasan oleh Guru | 🟡 Could-have | S | BL-08 |
| [BL-11](#bl-11--ringkasan-evaluasi-dapur-berbasis-ai-publik) | Ringkasan Evaluasi Dapur Berbasis AI (Publik) | 🟡 Could-have | M | BL-08, BL-10 |
| [BL-12](#bl-12--dashboard-evaluasi-internal-sppg) | Dashboard Evaluasi Internal SPPG  | 🟡 Could-have | S | BL-11 |


---

## 🔴 Must-have (MVP)

### BL-01 — Sistem Autentikasi dan Manajemen Role

| | |
|---|---|
| **Story terkait** | Semua US |
| **Estimasi** | M (Medium) |
| **Dependensi** | - |

Fondasi seluruh platform. Sistem login harus dibangun pertama karena semua fitur operasional (input menu, ulasan, moderasi) bergantung pada identitas dan role pengguna. Role yang dikelola: Admin, SPPG, Siswa, dan Guru.

**Kriteria Selesai:**

- Login tersedia dengan pembedaan role yang jelas.
- SPPG hanya dapat mengelola data dapur miliknya sendiri.
- Guru hanya dapat memoderasi ulasan dari sekolah yang terhubung dengannya.
- Halaman publik (monitoring) dapat diakses tanpa login.

---

### BL-02 — Profil Dapur MBG (SPPG) dan Daftar Sekolah

| | |
|---|---|
| **Story terkait** | US-01, US-02 |
| **Estimasi** | L (Large) |
| **Dependensi** | BL-01 |

Halaman profil publik untuk setiap dapur MBG yang mencakup nama dapur, wilayah, daftar sekolah yang dilayani, dan informasi contact person. Admin membuat profil awal; SPPG dapat mengeditnya setelah login.

**Kriteria Selesai:**

- Profil dapur menampilkan setidaknya: nama, alamat, sekolah yang dilayani, dan contact person.
- SPPG yang sudah login dapat mengedit data profil miliknya.

---

### BL-03 — Pencarian SPPG melalui Wilayah dan Nama Sekolah

| | |
|---|---|
| **Story terkait** | US-10 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-02 |

Pengguna dapat mencari dapur MBG menggunakan nama sekolah atau kabupaten/kota dari halaman utama, sehingga tidak perlu menelusuri seluruh direktori.

**Kriteria Selesai:**

- Kolom pencarian tersedia di halaman utama.
- Hasil pencarian muncul dalam waktu < 2 detik.
- Pencarian mendukung nama sekolah dan nama kabupaten/kota.

---

### BL-04 — Input Menu Harian oleh SPPG

| | |
|---|---|
| **Story terkait** | US-03 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01, BL-02 |

SPPG menginput menu makanan harian per dapur lengkap dengan komponen makanan dan klaim kandungan nutrisi (kalori, protein, karbohidrat, lemak), yang kemudian tampil di halaman publik.

**Kriteria Selesai:**

- Form input menu tersedia di dashboard SPPG.
- Menu yang disimpan langsung tampil di halaman monitoring publik.
- Riwayat menu dapat dilihat berdasarkan tanggal.

---

### BL-05 — Validasi Nutrisi Berbasis AI (Foto + Teks)

| | |
|---|---|
| **Story terkait** | US-04 |
| **Estimasi** | L (Large) |
| **Dependensi** | BL-04 |

Saat SPPG menginput menu, mereka wajib mengunggah foto makanan beserta klaim nutrisi. Sistem AI menganalisis foto tersebut dan membandingkannya dengan klaim nutrisi yang diinput, lalu memberikan peringatan spesifik jika ada ketidaksesuaian. Jika lolos validasi, menu mendapat label "Nutrisi Tervalidasi AI" di halaman publik.

**Kriteria Selesai:**

- Upload foto wajib dilakukan bersamaan dengan input klaim nutrisi.
- AI memberikan peringatan spesifik (menyebut aspek mana yang tidak wajar) berdasarkan analisis visual foto.
- SPPG harus mengonfirmasi atau merevisi sebelum data dipublikasikan.
- Menu yang lolos validasi menampilkan badge "Tervalidasi AI" di halaman publik.
- Riwayat peringatan dan hasil validasi AI tersimpan untuk keperluan audit.

---

### BL-06 — Panel Admin: Master Data SPPG & Sekolah

| | |
|---|---|
| **Story terkait** | US-13 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01 |

Panel khusus Admin untuk mendaftarkan dapur SPPG baru, membuat akun login SPPG, dan memetakan sekolah-sekolah yang dilayani ke dapur terkait. Ini adalah prasyarat operasional agar seluruh struktur sistem terbentuk dengan benar sebelum program berjalan. Tanpa backlog ini, SPPG tidak dapat login dan tidak ada data dapur yang bisa dikelola.

**Kriteria Selesai:**

- Admin dapat mendaftarkan akun SPPG baru dengan data dapur lengkap.
- Admin dapat memilih dan memetakan daftar sekolah dari database ke dapur terkait.
- Sistem menyimpan relasi dapur–sekolah dan memberikan akses login kepada SPPG.
- Admin dapat menonaktifkan atau mengedit akun SPPG yang sudah ada.
- Tersedia audit log untuk setiap perubahan master data yang dilakukan Admin.

---

## 🟠 Should-have

### BL-07 — Status Distribusi Harian dan Bukti Foto

| | |
|---|---|
| **Story terkait** | US-07, US-08 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01, BL-02 |

SPPG memperbarui status distribusi ke setiap sekolah (siap diantar / sudah diantar / belum diantar / batal) dan mengunggah foto bukti. Status tampil secara real-time di halaman publik.

**Kriteria Selesai:**

- Status distribusi mencakup empat kondisi yang didefinisikan.
- Perubahan status beserta foto bukti tampil secara real-time di halaman publik.
- Timestamp setiap pembaruan status tersimpan.

---

### BL-08 — Ulasan dan Foto dari Siswa

| | |
|---|---|
| **Story terkait** | US-05 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01, BL-04 |

Siswa mengirimkan ulasan harian disertai foto makanan yang diterima. Ulasan langsung tampil ke publik tanpa antrian persetujuan.

**Kriteria Selesai:**

- Form ulasan dengan upload foto tersedia bagi siswa yang login.
- Ulasan yang dikirim siswa langsung tampil di halaman publik beserta nama dan timestamp.
- Ulasan terhubung ke menu dan dapur yang sesuai pada hari tersebut.

---

### BL-09 — Sistem Notifikasi

| | |
|---|---|
| **Story terkait** | US-09, US-10 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-08 |

Mekanisme notifikasi untuk mendukung alur komunikasi antar role. Diperlukan agar guru mengetahui adanya ulasan baru dari siswa, dan agar siswa mendapat konfirmasi ketika ulasannya dihapus oleh guru. Tanpa notifikasi, moderasi konten tidak efektif karena tidak ada sinyal antar pihak.

**Kriteria Selesai:**

- Guru menerima notifikasi ketika siswa di sekolahnya mengirimkan ulasan baru.
- Siswa menerima notifikasi beserta alasan jika ulasannya dihapus oleh guru.
- Notifikasi dapat dilihat melalui panel notifikasi di dalam aplikasi.

---

## 🟡 Could-have

### BL-10 — Moderasi Post-Publish Ulasan oleh Guru

| | |
|---|---|
| **Story terkait** | US-06 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-08 |

Guru menandai (flag) ulasan yang bermasalah untuk ditinjau admin, atau langsung menghapus konten yang melanggar pedoman komunitas. Didevelop setelah fitur ulasan berjalan dan volume konten mulai memerlukan moderasi.

**Kriteria Selesai:**

- Guru dapat melakukan flag atau hapus ulasan beserta alasannya dari panel moderasi.
- Ulasan yang di-flag menampilkan label peringatan sementara hingga putusan dari admin.
- Siswa menerima notifikasi jika ulasannya dihapus beserta alasannya.

---

### BL-11 — Ringkasan Evaluasi Dapur Berbasis AI (Publik)

| | |
|---|---|
| **Story terkait** | US-11 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-08, BL-10 |

Sistem menghasilkan ringkasan analisis sentimen harian per dapur (positif/netral/negatif) menggunakan AI untuk tampilan publik. Didevelop setelah moderasi berjalan agar data ulasan yang dianalisis sudah terverifikasi kualitasnya.

**Kriteria Selesai:**

- Ringkasan evaluasi diperbarui setidaknya satu kali per hari setelah batas waktu pengiriman ulasan.
- Menampilkan distribusi sentimen dan poin-poin utama yang sering disebut.
- Data evaluasi bisa dilihat per hari dan secara historis di halaman profil publik dapur.

---

### BL-12 — Dashboard Evaluasi Internal SPPG

| | |
|---|---|
| **Story terkait** | US-12 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-11 |

Tampilan evaluasi khusus untuk SPPG di dalam dashboard internal, dengan detail yang lebih terperinci dibanding ringkasan publik. SPPG memerlukan breakdown per sekolah dan rekap historis mingguan sebagai bahan evaluasi dan perbaikan layanan.

**Kriteria Selesai:**

- Dashboard SPPG menampilkan ringkasan sentimen (positif/netral/negatif) per hari.
- Tersedia breakdown sentimen per sekolah yang dilayani dapur tersebut.
- Rekap historis tersedia per minggu sebagai bahan evaluasi internal.
- Tampilan ini hanya dapat diakses oleh SPPG yang login, tidak tampil di halaman publik.

---

