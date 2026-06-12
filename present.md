# Panduan Demo & Presentasi Program HaloMBG

Dokumen ini berisi panduan lengkap langkah-demi-langkah (scenario-based demo) untuk melakukan demonstrasi aplikasi HaloMBG di hadapan penguji atau penonton.

---

## 🔑 Data Akun Demo (Credentials)

Untuk mendemonstrasikan alur registrasi mandiri, Anda akan mendaftarkan akun baru untuk **Siswa** dan **Guru**, sedangkan peran **SPPG** dan **Admin** menggunakan akun bawaan (pre-seeded) karena pembatasan keamanan sistem.

### 1. Registrasi Akun Baru (Lakukan saat Demo)

| Role | Langkah Registrasi | Data Input |
| :--- | :--- | :--- |
| **Siswa** | Klik **Daftar** > Pilih **Siswa** | **NISN**: `0080000102`<br>**Nama**: (Otomatis: *Budi Santoso*) <br>**Email**: `budi.baru@example.com`<br>**Password**: `password` |
| **Guru** | Klik **Daftar** > Pilih **Guru** | **Nama**: `Guru Baru Demo`<br>**Email**: `guru.baru@example.com`<br>**Sekolah**: Cari dan pilih `SD NEGERI 1 BOCOR`<br>**NIP**: `198710102010121002`<br>**Password**: `password` |

### 2. Akun Bawaan Sistem (Pre-seeded)

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **SPPG** | `sppg@halombg.com` | `password` | Akun operator dapur `SPPG Kebumen Buayan Rangkah` (melayani SD NEGERI 1 BOCOR) |
| **Admin** | `admin@halombg.com` | `password` | Akun administrator nasional untuk moderasi ulasan |

> [!IMPORTANT]
> **Dapur Utama Pilihan:** `SPPG Kebumen Buayan Rangkah`  
> **Sekolah Pilihan:** `SD NEGERI 1 BOCOR` (Kab. Kebumen, Prov. Jawa Tengah)  
> *Kedua entitas ini telah memiliki data historis 3 hari terakhir (menu, ulasan siswa, dan hasil analisis sentimen AI) yang siap didemokan.*

---

## 🎬 Skenario Demonstrasi Terpadu

Jalankan demo dengan alur cerita berkesinambungan dari registrasi, publik, siswa, guru, operator dapur (SPPG), hingga administrator.

### 🌐 Skenario 1: Portal Publik (Public Landing Page)
*Menunjukkan transparansi platform yang bisa diakses langsung oleh masyarakat umum.*

1. **Buka Landing Page Utama**
   - Tunjukkan visual beranda baru dengan logo **HaloMBG** (gambar maskot anak laki-laki bulat transparan).
   - Scroll ke bawah untuk menunjukkan statistik nasional (Sekolah, Provinsi, Dapur SPPG).
2. **Pencarian Sekolah**
   - Di kolom pencarian hero, ketik `"Bocor"` atau `"Kebumen"`.
   - Pilih **SD NEGERI 1 BOCOR**.
   - Halaman akan memuat profil dapur **SPPG Kebumen Buayan Rangkah** yang melayani sekolah tersebut.
3. **Eksplorasi Profil Publik Dapur**
   - **Tab Menu Harian**: Tunjukkan foto makanan riil, komponen menu, serta informasi kalori, karbohidrat, protein, dan lemak.
   - **Tab Status Distribusi**: Tunjukkan rekam jejak pengiriman harian lengkap dengan foto bukti serah terima makanan.
   - **Tab Ulasan**: Tunjukkan umpan balik langsung berupa rating bintang dan ulasan tekstual dari siswa sekolah.
   - **Tab Evaluasi AI**: Tunjukkan grafik distribusi sentimen (Positif, Netral, Negatif) serta rangkuman poin-poin penting ulasan yang diekstrak oleh kecerdasan buatan (AI).

---

### 🎒 Skenario 2: Registrasi & Alur Siswa (Student Experience)
*Menunjukkan proses pendaftaran siswa yang terverifikasi Dapodik dan pengisian review gizi.*

1. **Registrasi Akun Siswa Baru**
   - Di halaman utama, klik **Daftar** lalu pilih **Siswa**.
   - Masukkan NISN `0080000102` lalu klik **Cari**. Tunjukkan bahwa sistem berhasil memverifikasi nama siswa (**Budi Santoso**) dari **SD NEGERI 1 BOCOR** secara real-time dari database Dapodik.
   - Lengkapi pendaftaran dengan email `budi.baru@example.com` dan kata sandi `password`. Klik **Daftar**.
2. **Dashboard Gizi Siswa**
   - Setelah pendaftaran sukses, Anda akan otomatis masuk ke dashboard siswa.
   - Tunjukkan tampilan dashboard siswa yang berisi menu hari ini beserta infografis kandungan nutrisi (kalori, protein, lemak, karbohidrat).
3. **Kirim Ulasan Makanan**
   - Masuk ke menu **Kirim Ulasan**.
   - Berikan penilaian hari ini (misal: "Nasinya pulen sekali dan ayamnya garing! Susunya segar.").
   - Kirim ulasan tersebut.
4. **Riwayat Ulasan**
   - Tunjukkan halaman **Riwayat Ulasan** untuk membuktikan bahwa ulasan yang baru saja dibuat oleh Budi telah tersimpan dalam history sistem.

---

### 🍎 Skenario 3: Registrasi & Alur Guru (Teacher Moderation)
*Menunjukkan pendaftaran guru dan pengawasan kualitas serta moderasi ulasan.*

1. **Registrasi Akun Guru Baru**
   - Keluar (logout) dari akun siswa.
   - Klik **Daftar** lalu pilih **Guru**.
   - Lengkapi formulir pendaftaran:
     - **Nama**: `Guru Baru Demo`
     - **Email**: `guru.baru@example.com`
     - **Sekolah**: Ketik `"Bocor"` dan pilih `SD NEGERI 1 BOCOR` dari pilihan otomatis.
     - **NIP**: `198710102010121002`
     - **Password**: `password`
   - Klik **Daftar**.
2. **Dashboard Pemantauan Guru**
   - Tunjukkan dashboard guru yang menampilkan statistik ulasan sekolah dan grafik kepuasan siswa.
3. **Moderasi Ulasan Siswa**
   - Buka menu **Ulasan Siswa**.
   - Temukan ulasan siswa yang baru saja dikirim oleh Budi (`budi.baru@example.com`).
   - Klik tombol **Flag / Laporkan** untuk melaporkan ulasan tersebut agar dimoderasi oleh Admin utama (simulasikan seolah-olah ulasan tersebut butuh peninjauan lebih lanjut).

---

### 🍳 Skenario 4: Alur Dapur SPPG (Kitchen Operation & AI Analytics)
*Menunjukkan proses input operasional harian dapur dan pemanfaatan analisis sentimen AI.*

1. **Masuk (Login) sebagai Operator SPPG**
   - Keluar (logout) dari akun guru.
   - Login menggunakan akun bawaan: `sppg@halombg.com` / `password`.
2. **Kelola Menu Harian**
   - Masuk ke menu **Menu Harian**.
   - Tunjukkan menu yang sudah aktif. Coba buat menu baru untuk esok hari lengkap dengan berat gizi makro (kalori, protein, karbohidrat, lemak).
3. **Distribusi Makanan**
   - Buka menu **Status Distribusi**.
   - Tunjukkan sekolah-sekolah yang dilayani oleh dapur ini.
   - Update status pengiriman untuk salah satu sekolah menjadi **Terkirim**, isi nama penerima, dan upload foto bukti serah terima (sebagai jaminan transparansi publik).
4. **Evaluasi Tindak Lanjut & Analisis AI**
   - Masuk ke menu **Tindak Lanjut & Evaluasi AI**.
   - Tunjukkan bagaimana AI mengekstrak data dari ulasan siswa untuk memberikan rekomendasi perbaikan kualitas dapur secara instan (misalnya: masukan tentang keasinan sup atau kekerasan ayam).

---

### 🛡️ Skenario 5: Alur Administrator Utama (Control Center)
*Menunjukkan pengawasan sistem secara makro dan keputusan moderasi akhir.*

1. **Masuk (Login) sebagai Admin**
   - Keluar (logout) dari akun SPPG.
   - Login menggunakan akun bawaan: `admin@halombg.com` / `password`.
2. **Moderasi Laporan Guru**
   - Masuk ke modul **Moderasi Ulasan / Flagged Reviews**.
   - Temukan ulasan Budi yang tadi dilaporkan oleh Guru Baru Demo di Skenario 3.
   - Admin dapat memutuskan untuk **Menolak Laporan** (menampilkan kembali ulasan) atau **Menyetujui Laporan** (menyembunyikan ulasan secara permanen dari publik).
3. **Statistik Nasional**
   - Tunjukkan peta dashboard admin yang memantau total porsi makan terdistribusi secara nasional hari ini.

---

## 🛠️ Langkah Menjalankan Aplikasi di Lokal

Apabila Docker kontainer mati atau perlu dijalankan ulang, ikuti perintah berikut:

```bash
# Masuk ke folder framework
cd framework

# Jalankan semua kontainer (frontend, backend, db, nginx) di background
docker compose up -d

# Apabila database kosong, jalankan migrasi & seeder pengujian
docker compose exec laravel_api php artisan migrate:fresh --seed
```

---

## 📁 Berkas Penting Pendukung Demo

Berikut adalah berkas-berkas utama yang mendefinisikan logika bisnis dan tampilan per role:
- **Tampilan Publik & Profil Dapur:** [LandingKitchenProfile.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/landing/LandingKitchenProfile.jsx)
- **Dashboard Layout Utama:** [DashboardLayout.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/components/DashboardLayout.jsx)
- **Halaman Login & Pilihan Peran:** [Login.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/login/Login.jsx)
- **Dashboard Siswa:** [SiswaDashboard.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/siswa/SiswaDashboard.jsx) & [KirimUlasan.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/siswa/ulasan/KirimUlasan.jsx)
- **Dashboard Guru:** [GuruDashboard.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/guru/GuruDashboard.jsx) & [GuruReviews.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/guru/GuruReviews.jsx)
- **Dashboard SPPG:** [SppgDashboard.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/sppg/SppgDashboard.jsx) & [TindakLanjut.jsx](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/sppg/tindak-lanjut/TindakLanjut.jsx)
