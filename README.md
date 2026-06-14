# HaloMBG

Aplikasi Monitoring Program Makan Bergizi Gratis (MBG) untuk memantau distribusi makanan, menu harian, dan kualitas gizi sekolah.

HaloMBG hadir sebagai solusi monitoring berbasis web yang mengintegrasikan transparansi data, validasi nutrisi berbasis kecerdasan buatan (AI) melalui analisis foto dan teks, serta partisipasi aktif komunitas. Platform ini bertujuan untuk memastikan program MBG berjalan sesuai standar, meningkatkan akuntabilitas, dan memberikan akses informasi yang terbuka bagi publik, termasuk siswa, orang tua, guru, dan masyarakat umum.

---

## Identitas Tim

| Nama Lengkap | NIM | Email |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | adityamulyaf@gmail.com |
| Yashif Victoriawan | L0124124 | yashif.vkt@gmail.com |
| Fairuz Shiba Alkhirza | L0124014 | fairuzziba@gmail.com |
| Nurman Aqil Wicaksono | L0124139 | nurmanaqil.25@gmail.com |

---

## Status Pengembangan & Backlog

Seluruh fitur dalam product backlog telah selesai diimplementasikan. Berikut adalah status pengembangan fitur aplikasi HaloMBG berdasarkan dokumen kebutuhan perangkat lunak (SRS) dan backlog pengembangan:

### Status MVP: 100% Selesai (6 dari 6 Fitur Must-have)
### Status Keseluruhan: 100% Selesai (13 dari 13 Fitur Terimplementasi)

| ID Backlog | Nama Fitur | Kategori / Prioritas | Status |
| :--- | :--- | :--- | :--- |
| **BL-01** | Sistem Autentikasi dan Manajemen Role | Must-have (MVP) | Selesai |
| **BL-02** | Profil Dapur MBG (SPPG) dan Daftar Sekolah | Must-have (MVP) | Selesai |
| **BL-03** | Pencarian SPPG melalui Wilayah dan Nama Sekolah | Must-have (MVP) | Selesai |
| **BL-04** | Input Menu Harian oleh SPPG | Must-have (MVP) | Selesai |
| **BL-05** | Validasi Nutrisi Berbasis AI (Foto + Teks) | Must-have (MVP) | Selesai |
| **BL-06** | Panel Admin: Master Data SPPG & Sekolah | Must-have (MVP) | Selesai |
| **BL-07** | Status Distribusi Harian dan Bukti Foto | Should-have | Selesai |
| **BL-08** | Notifikasi Keterlambatan Distribusi | Should-have | Selesai |
| **BL-09** | Ulasan dan Foto dari Siswa | Should-have | Selesai |
| **BL-10** | Moderasi Post-Publish Ulasan oleh Guru | Could-have | Selesai |
| **BL-11** | Sistem Notifikasi (In-App dan WhatsApp) | Could-have | Selesai |
| **BL-12** | Notifikasi Ulasan Kritis dan Tindak Lanjut SPPG | Could-have | Selesai |
| **BL-13** | Ringkasan Evaluasi Dapur Berbasis AI (Publik) | Could-have | Selesai |

---

## Panduan Instalasi dan Menjalankan Aplikasi

Aplikasi HaloMBG dikemas menggunakan Docker Compose untuk memudahkan instalasi dan memastikan konsistensi lingkungan pengembangan di backend, frontend, database, dan web server.

### Prasyarat
Sebelum memulai, pastikan perangkat Anda telah terpasang:
1. **Docker Desktop** (untuk Windows/macOS) atau **Docker Engine** (untuk Linux).
2. **WSL 2** (Windows Subsystem for Linux) jika Anda menggunakan sistem operasi Windows.

### Langkah-Langkah Menjalankan Aplikasi
1. Buka terminal (atau WSL terminal jika di Windows) dan masuk ke direktori `framework` proyek ini:
   ```bash
   cd framework
   ```
2. Buat file konfigurasi lingkungan `.env` dengan menyalin contoh yang ada:
   ```bash
   cp .env.example .env
   ```
   *Catatan: Secara default, kredensial database diatur dengan nama database `laravel`, user `sail`, dan password `password` (Anda dapat menyesuaikan isi file `.env` jika diperlukan).*
3. Jalankan container Docker:
   - Untuk **pertama kali** atau jika ada perubahan file konfigurasi:
     ```bash
     docker compose up --build -d
     ```
   - Untuk **menjalankan normal** (sudah pernah build):
     ```bash
     docker compose up -d
     ```
4. Lakukan instalasi database dan data seeders awal (opsional jika database masih kosong):
   ```bash
   docker compose exec backend php artisan migrate:fresh --seed
   ```
5. Akses layanan aplikasi melalui web browser:
   - **Frontend (ReactJS + Vite):** [http://localhost:5173](http://localhost:5173)
   - **Backend API (Laravel):** [http://localhost:80](http://localhost:80)
   - **Database PostgreSQL:** `localhost:5433` (kredensial sesuai file `.env`)

### Akun Uji Coba Demo
Gunakan akun bawaan sistem berikut untuk mencoba alur aplikasi:
* **Operator Dapur (SPPG):** `sppg@halombg.com` dengan password `password` (melayani SD Negeri 1 Bocor).
* **Administrator:** `admin@halombg.com` dengan password `password`.
* **Siswa & Guru:** Anda dapat mendaftarkan akun baru secara langsung di halaman registrasi.
  - Pendaftaran Siswa memerlukan NISN valid simulasi Dapodik (contoh: `0080000102` untuk siswa bernama Budi Santoso di SD Negeri 1 Bocor).
  - Pendaftaran Guru memerlukan NIP (contoh: `198710102010121002`) dan menghubungkannya dengan SD Negeri 1 Bocor.

---

## Teknologi Utama

* **Backend:** Laravel (PHP) dengan Laravel Sanctum untuk sistem otentikasi berbasis token API.
* **Frontend:** React dengan Vite, Tailwind CSS untuk antarmuka visual, dan sistem WebRTC untuk integrasi kamera.
* **Basis Data:** PostgreSQL.
* **Integrasi AI:** Google Gemini API untuk analisis visual porsi dan validasi nutrisi makanan serta ringkasan evaluasi sentimen.

---

## Screenshot Aplikasi

Berikut adalah beberapa tampilan utama dari aplikasi HaloMBG:

### 1. Portal Publik (Landing Page) & Pencarian
Halaman utama yang dapat diakses oleh masyarakat umum untuk mencari sekolah dan melihat profil dapur SPPG penyedia makanan.
![Portal Publik dan Pencarian](framework/frontend/src/assets/readme/public-search.png)

### 2. Detail Profil Dapur SPPG
Halaman detail profil dapur SPPG lengkap dengan deskripsi, info kontak, daftar sekolah terlayani, menu, dan status distribusi harian.
![Detail Profil Dapur SPPG](framework/frontend/src/assets/readme/kitchen-profile.png)

### 3. Tampilan Menu Harian
Detail menu makanan bergizi harian lengkap dengan foto makanan riil dan takaran gizi makro.
![Tampilan Menu Harian](framework/frontend/src/assets/readme/daily-menus.png)

### 4. Formulir Input Menu Harian oleh SPPG
Formulir bagi operator dapur untuk menginput komponen menu harian, data gizi makro, serta kewajiban mengunggah foto makanan riil.
![Formulir Input Menu Harian](framework/frontend/src/assets/readme/menu-form.png)

### 5. Validasi Nutrisi AI - Lolos Validasi
Tampilan pop-up status validasi AI Gemini Vision yang memberikan lampu hijau (nutrisi wajar/tervalidasi) berdasarkan analisis visual foto porsi makanan.
![Validasi Nutrisi AI - Lolos](framework/frontend/src/assets/readme/ai-approve.png)

### 6. Validasi Nutrisi AI - Peringatan Ketidakwajaran
Tampilan pop-up ketika sistem AI Gemini Vision mendeteksi adanya ketidaksesuaian yang signifikan antara visual porsi makanan dengan klaim data gizi yang diinput.
![Validasi Nutrisi AI - Peringatan](framework/frontend/src/assets/readme/ai-reject.png)

### 7. Status Distribusi Makanan & Bukti Pengiriman
Tampilan monitoring status pengiriman makanan dari dapur ke sekolah tujuan secara real-time lengkap dengan kewajiban upload bukti foto serah terima.
![Status Distribusi Makanan](framework/frontend/src/assets/readme/distribution-status.png)

### 8. Penanganan Ulasan Kritis oleh Dapur
Panel dashboard SPPG untuk menindaklanjuti ulasan dari siswa yang mengandung kata kunci keluhan kritis (basi, bau, dll.).
![Penanganan Ulasan Kritis](framework/frontend/src/assets/readme/critical-review.png)

### 9. Ringkasan Evaluasi & Analisis Sentimen AI
Grafik kepuasan serta ringkasan ulasan harian siswa yang diekstrak dan dirangkum secara otomatis oleh AI untuk ditampilkan ke publik.
![Ringkasan Evaluasi AI](framework/frontend/src/assets/readme/ai-summary.png)