# Dokumentasi Fitur: Validasi AI Kelayakan Menu & Layout Dashboard

Dokumentasi ini menjelaskan implementasi fitur **Validasi AI** (antarmuka pemindai nutrisi & akses kamera peramban) serta integrasi tata letak dashboard modern untuk aplikasi HaloMBG.

---

## 📋 Ikhtisar Fitur

Fitur ini dikembangkan untuk memfasilitasi pengguna (petugas dapur/SPPG atau guru) dalam memverifikasi kandungan gizi makanan anak secara instan. 

### Fitur Utama:
1. **Tata Letak Dashboard Terintegrasi**: Sidebar navigasi berwarna navy (`#071E49`), bar atas setinggi 56px dengan informasi peran pengguna, remah roti (*breadcrumbs*), dan status role badge.
2. **Kamera Pemindai & Pengambilan Gambar**: Mengakses kamera lokal peramban secara langsung menggunakan WebRTC API (`getUserMedia`).
3. **Deteksi Gambar Kosong/Hitam**: Melakukan inspeksi piksel secara otomatis. Jika tangkapan gambar dideteksi hitam atau kosong (misal: akibat izin kamera ditolak), sistem akan mengembalikan status **Tidak Terdeteksi** dan melarang penyimpanan laporan.
4. **Kamera Simulasi (Bypass)**: Menyediakan tombol khusus untuk mensimulasikan tangkapan piring makanan bergizi lengkap. Sangat berguna untuk pengujian di lingkungan lokal/WSL ketika izin webcam diblokir peramban.
5. **Simulasi Analisis Gizi**: Animasi garis pemindaian (*scanline*) visual selama 2,5 detik, menampilkan rincian kalori, protein, karbohidrat, lemak, serta checklist kesesuaian standar gizi.
6. **Riwayat Validasi Harian**: Menyimpan hasil pemindaian yang valid ke dalam tabel riwayat sesi lokal saat itu juga.

---

## 📂 Struktur Berkas Baru & Modifikasi

Perubahan dilakukan pada repositori `framework/frontend` dengan rincian berikut:

### Berkas Baru:
1. **[DashboardLayout.jsx](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/components/DashboardLayout.jsx)**: Komponen React pembungkus rute dashboard, sidebar, topbar, dan status peran.
2. **[DashboardLayout.css](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/components/DashboardLayout.css)**: Gaya CSS tata letak dashboard yang responsif dan mengikuti panduan `DESIGN.md`.
3. **[ValidationAI.jsx](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/pages/ValidationAI.jsx)**: Halaman pemindai AI, logika WebRTC kamera, canvas capture, fallback file upload, piksel inspektor, serta tabel riwayat.
4. **[ValidationAI.css](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/pages/ValidationAI.css)**: Gaya CSS khusus untuk scanner, animasi *laser scanline*, kartu nutrisi, dan tabel.

### Berkas yang Dimodifikasi:
1. **[App.jsx](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/App.jsx)**: Mendaftarkan rute baru `/validasi-ai` di bawah proteksi login dan menyatukan seluruh halaman dashboard di bawah `DashboardLayout`.
2. **[index.css](file:///home/vic/praktikum-rpl-a-02/framework/frontend/src/index.css)**: Menambahkan dukungan lebar dinamis 100% untuk `#root.dashboard-page`.

---

## 🛠️ Langkah Pengujian Lokal (Manual Verification)

1. Jalankan aplikasi menggunakan docker compose:
   ```bash
   docker compose up --build
   ```
2. Buka peramban ke [http://localhost:5173](http://localhost:5173) dan masuk menggunakan kredensial:
   - **Email**: `admin@halombg.com`
   - **Kata Sandi**: `password`
3. Masuk ke halaman **Validasi AI** melalui menu sidebar samping.
4. **Menguji Kasus Kamera Terblokir (Tampilan Hitam)**:
   - Klik **Buka Kamera**. Ambil foto saat layar hitam.
   - Sistem akan memproses pemindaian selama 2.5 detik dengan animasi laser.
   - Hasil Penilaian AI akan menampilkan **TIDAK TERDETEKSI / KOSONG** dengan tanda silang merah, dan tombol **Simpan Laporan** akan dinonaktifkan.
   - Banner informasi bantuan berwarna merah akan muncul di bawah kotak kamera.
5. **Menguji Kasus Sukses (Kamera Simulasi)**:
   - Klik **Reset Tampilan**, kemudian klik **Kamera Simulasi**.
   - Sistem akan memuat umpan simulasi piring makanan interaktif.
   - Klik **Ambil Foto & Validasi**.
   - Hasil Penilaian AI akan mendeteksi menu nutrisi lengkap secara acak (misalnya: Nasi Putih, Ayam Panggang, Sayur, Susu Kotak).
   - Tombol **Simpan Laporan Validasi** akan aktif. Klik tombol tersebut untuk menyimpan hasil ke tabel riwayat di bawah.
6. **Menguji Unggah Foto**:
   - Anda juga dapat menggunakan opsi **Unggah Foto** untuk memasukkan gambar porsi makanan dari berkas lokal. Jika gambar yang diunggah kosong/hitam, sistem akan otomatis menolak.

---

## 🚀 Template Isian Pull Request (PR Template)

Salin konten di bawah ini untuk digunakan sebagai deskripsi Pull Request Anda di GitHub:

```markdown
## Deskripsi
PR ini mengimplementasikan Fitur 4 (Validasi AI kelayakan menu makanan - Tampilan UI awal & integrasi kamera peramban) sesuai dengan kesepakatan target. 

Fitur ini memfasilitasi operator dapur atau guru untuk memverifikasi porsi dan kelayakan nutrisi program Makan Bergizi Gratis (MBG) secara visual.

## Perubahan yang Dilakukan
- **Dashboard Layout**: Membuat komponen pembungkus `DashboardLayout` (sidebar navy, topbar 56px, remah roti, role-badge, dan log out) yang responsif dan patuh pada pedoman `DESIGN.md`.
- **Halaman Validasi AI**:
  - Integrasi akses kamera web peramban (WebRTC `getUserMedia`) dan canvas capture.
  - Opsi fallback **Unggah Foto** untuk berkas lokal.
  - Fitur **Kamera Simulasi** guna mempermudah pengetesan alur sukses (mencegah layar hitam akibat izin diblokir di mesin lokal).
  - Algoritma **Deteksi Gambar Kosong/Hitam** pada canvas untuk mencegah sistem mengidentifikasi makanan ketika tangkapan kamera kosong (mengembalikan status "Tidak Terdeteksi").
  - UI Hasil Analisis Gizi lengkap (Kalori, Protein, Karbohidrat, Lemak, Checklist kelayakan porsi, tags bahan makanan).
  - Modul riwayat sesi aktif untuk menyimpan laporan pemindaian.

## Tipe Perubahan
- [x] Fitur Baru (New Feature)
- [ ] Perbaikan Bug (Bug Fix)
- [x] Refaktor / Integrasi Layout (Refactoring)

## Cara Menguji / Meninjau
1. Jalankan `docker compose up --build`.
2. Login sebagai `admin@halombg.com` dengan password `password`.
3. Buka tab **Validasi AI** di sidebar.
4. Uji tombol **Kamera Simulasi** untuk alur sukses (Nasi + Ayam + Sayur), ambil foto, lihat hasil gizi gizi makro, lalu klik simpan laporan.
5. Uji tombol **Buka Kamera** (jika kamera hitam/terblokir, scan akan ditolak secara otomatis dan menampilkan status "Tidak Terdeteksi").
6. Uji tombol **Unggah Foto** dengan file gambar lokal.

## Checklist
- [x] Kode berhasil dikompilasi (build sukses dalam 233ms).
- [x] Mengikuti aturan desain `DESIGN.md` (no gradients, 6px radius button, solid surfaces, no heavy shadows).
- [x] Fallback kamera hitam dan tanpa webcam telah ditangani dengan aman.
```
