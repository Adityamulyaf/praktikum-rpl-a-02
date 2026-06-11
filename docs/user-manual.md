# Panduan Pengguna (User Manual) — HaloMBG
### Sistem Monitoring Program Makan Bergizi Gratis (MBG)
---

## Pendahuluan

Selamat datang di Panduan Pengguna resmi **HaloMBG**. HaloMBG adalah platform monitoring digital terpadu berbasis web yang dirancang khusus untuk memastikan akuntabilitas, transparansi, dan efisiensi dalam pelaksanaan **Program Makan Bergizi Gratis (MBG)** di seluruh Indonesia.

Sistem ini menjembatani berbagai pihak terkait melalui integrasi fitur-fitur canggih:
- **Transparansi Gizi Publik**: Publikasi menu harian dan takaran gizi makro (kalori, protein, lemak, karbohidrat).
- **Validasi Nutrisi berbasis AI**: Verifikasi kesesuaian klaim gizi dengan foto nyata makanan menggunakan model AI (Gemini Vision).
- **Pemantauan Distribusi Real-Time**: Pelacakan status pengantaran makanan dari dapur ke sekolah tujuan lengkap dengan bukti foto serah terima.
- **Analisis Sentimen Otomatis**: Pengolahan ulasan siswa harian menjadi infografis sentimen dan kesimpulan tindak lanjut bagi dapur penyedia menggunakan AI.
- **Moderasi Bertingkat**: Pengawasan kualitas ulasan yang didelegasikan kepada guru sekolah dan administrator sistem.

Tujuan dokumen ini adalah memberikan panduan teknis yang komprehensif bagi seluruh pengguna dalam mengoperasikan platform HaloMBG sesuai dengan peran masing-masing.

---

## Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Aktor dan Hak Akses Pengguna](#aktor-dan-hak-akses-pengguna)
4. [Akses Publik](#akses-publik)
5. [Panduan untuk Pihak SPPG](#panduan-untuk-pihak-sppg)
6. [Panduan untuk Siswa](#panduan-untuk-siswa)
7. [Panduan untuk Guru](#panduan-untuk-guru)
8. [Panduan untuk Administrator](#panduan-untuk-administrator)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)
11. [Lampiran Screenshot](#lampiran-screenshot)

---

## Persyaratan Sistem

Untuk mendapatkan pengalaman pengguna terbaik dan memastikan seluruh fitur (seperti WebRTC kamera dan visualisasi grafik) berjalan lancar, pastikan perangkat Anda memenuhi spesifikasi berikut:

### 1. Spesifikasi Perangkat Lunak (Software)
- **Peramban Web (Web Browser)**:
  - Google Chrome (Versi 90 atau terbaru)
  - Mozilla Firefox (Versi 88 atau terbaru)
  - Apple Safari (Versi 14 atau terbaru)
  - Microsoft Edge (Versi 90 atau terbaru)
- **Sistem Operasi**: Windows 10/11, macOS, Linux, Android 9.0+, atau iOS 14+.

### 2. Koneksi Internet
- Koneksi internet stabil dengan kecepatan unduh/unggah minimal **2 Mbps** untuk memfasilitasi pengunggahan foto bukti makanan/serah terima.

### 3. Izin Akses Perangkat (Device Permissions)
- **Kamera**: Dibutuhkan izin akses kamera web bagi pengguna Siswa yang ingin mengambil foto makanan secara langsung menggunakan fitur kamera internal (WebRTC).

---

## Aktor dan Hak Akses Pengguna

Sistem HaloMBG mengkategorikan pengguna ke dalam lima aktor dengan tingkat aksesibilitas yang berbeda:

| Aktor | Metode Autentikasi | Cakupan Hak Akses Utama |
| :--- | :--- | :--- |
| **Publik (Umum)** | Tanpa Login | Pencarian dapur/sekolah, melihat menu harian, melihat grafik gizi & badge AI, memantau pengiriman makanan, membaca statistik sentimen AI. |
| **Pihak SPPG (Operator Dapur)** | Login Akun Dapur | Mengelola data profil dapur, mengunggah menu makanan harian, memproses validasi AI gizi, memperbarui status distribusi, merespons ulasan kritis. |
| **Siswa** | Login Terverifikasi NISN | Registrasi mandiri via Dapodik, melihat menu gizi hari ini, mengirimkan rating & ulasan tekstual, serta mengunggah foto makanan. |
| **Guru** | Login Akun Guru | Menerima peringatan otomatis WhatsApp, memantau review siswa di sekolahnya, menandai (*flag*) ulasan, dan menghapus ulasan yang melanggar ketentuan. |
| **Administrator** | Login Akun Admin | Dashboard analitik nasional, mengelola database master sekolah & dapur, mengatur pemetaan relasi antar sekolah dan dapur penyedia. |

---

## Akses Publik

Masyarakat umum, orang tua siswa, pemerhati program, dan instansi pengawas dapat mengakses data transparansi program HaloMBG tanpa perlu mendaftarkan akun.

### 1. Menelusuri & Mencari Dapur SPPG
Untuk menemukan dapur yang menyuplai makanan di sekolah Anda:
1. Buka halaman beranda [Public Landing Page](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/landing/PublicLanding.jsx).
2. Di bagian kolom pencarian utama (Hero Section), ketikkan **Nama Sekolah** atau **Kabupaten/Kota**.
3. Sistem akan memunculkan pilihan sekolah yang sesuai. Klik nama sekolah yang dituju.
4. Anda akan otomatis diarahkan ke profil dapur SPPG penanggung jawab sekolah tersebut.

![Tampilan Halaman Beranda Publik dan Pencarian](/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_kids_eating.png)
*Gambar 1: Halaman utama direktori pencarian.*

---

### 2. Memantau Menu Gizi & Status Validasi AI
1. Pada profil dapur SPPG terpilh, pastikan Anda membuka tab **Menu Harian**.
2. Anda akan melihat daftar masakan hari ini lengkap dengan foto riil makanan.
3. Tinjau nilai gizi makro (Kalori, Protein, Karbohidrat, Lemak) yang disajikan.
4. Perhatikan indikator badge **"Tervalidasi AI"** (berwarna hijau). Badge ini menandakan bahwa sistem kecerdasan buatan telah memeriksa keselarasan porsi foto makanan asli dengan nilai gizi yang dimasukkan operator dapur.

![Tampilan Profil Detail Menu Harian](/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_meal_box.png)
*Gambar 2: Rincian menu harian dengan badge verifikasi gizi AI.*

---

### 3. Memantau Status Distribusi Sekolah
1. Masuk ke halaman profil dapur, kemudian pilih tab **Status Distribusi**.
2. Anda akan melihat tabel real-time status pengiriman makanan untuk hari ini:
   - `Belum Diantar`: Makanan sedang dalam proses persiapan di dapur.
   - `Siap Diantar`: Makanan sudah dimuat ke armada kurir.
   - `Sudah Diantar`: Makanan telah tiba di sekolah tujuan.
3. Untuk sekolah dengan status `Sudah Diantar`, Anda dapat mengklik tombol **Lihat Bukti Foto** guna memverifikasi foto bukti fisik serah terima di sekolah yang diunggah oleh kurir.

---

### 4. Melihat Evaluasi Sentimen Dapur (AI Summary)
1. Klik tab **Evaluasi & Sentimen** di profil dapur.
2. Tinjau grafik batang/lingkaran yang menunjukkan rasio ulasan siswa: **Positif** (hijau), **Netral** (abu-abu), dan **Negatif** (merah).
3. Di bawah grafik, baca ringkasan teks otomatis hasil ekstraksi AI Gemini yang merangkum seluruh masukan siswa serta rekomendasi peningkatan kualitas makanan dapur tersebut.

---

## Panduan untuk Pihak SPPG

Operator dapur bertanggung jawab mengelola operasional harian, menginput menu gizi, dan melaporkan proses distribusi makanan.

### 1. Login Akun Dapur
1. Buka halaman masuk HaloMBG, pilih tab/opsi login **SPPG / Dapur**.
2. Masukkan alamat email dan kata sandi operasional Anda yang didaftarkan oleh Admin.
3. Klik **Masuk** untuk mengakses Dashboard.

---

### 2. Menginput Menu Harian & Validasi AI
1. Di dashboard SPPG, pilih menu **Kelola Menu Harian** di sidebar, lalu klik **Tambah Menu Baru**.
2. Isi formulir menu makanan:
   - **Nama Menu & Komponen Detail**: Rincian lauk pauk gizi seimbang.
   - **Nutrisi Makro**: Kalori, Karbohidrat, Protein, dan Lemak.
   - **Foto Makanan**: Unggah foto riil satu porsi makanan.
3. Klik **Simpan dan Validasi**.
4. **Alur Validasi AI Gemini**:
   - Jika AI mendeteksi data gizi logis dibandingkan visual foto, menu langsung diterbitkan dengan label hijau **"Tervalidasi AI"**.
   - Jika AI mendeteksi ketidakwajaran (visual piring kosong/porsi tidak cocok dengan klaim gizi tinggi), sistem akan menampilkan **Pop-Up Peringatan Visual AI**.
   - **Opsi Revisi**: Klik *Revisi Data* untuk menyesuaikan kembali angka gizi.
   - **Opsi Tetap Simpan**: Klik *Konfirmasi Tetap Simpan* untuk menerbitkan menu apa adanya (tanpa label verifikasi hijau).

![Form Input Menu Dapur](/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_kitchen_prep.png)
*Gambar 3: Formulir pembuatan menu makanan harian.*

---

### 3. Mengelola Status Distribusi Sekolah
1. Buka menu **Status Distribusi** di sidebar.
2. Untuk setiap sekolah mitra yang akan dikirimi makanan hari ini, perbarui statusnya:
   - Ubah ke `Siap Diantar` saat kurir berangkat.
   - Ubah ke `Sudah Diantar` setelah makanan sampai di sekolah tujuan.
3. Saat memilih status `Sudah Diantar`, sistem mewajibkan Anda mengunggah **Foto Bukti Serah Terima** di lokasi sekolah.
4. Klik **Perbarui Status**.

> [!WARNING]
> Batas waktu pengiriman makanan harian adalah pukul **11.00 WIB**. Jika status distribusi sekolah masih `Belum Diantar` melewati batas waktu tersebut, sistem secara otomatis akan mengirimkan notifikasi peringatan keterlambatan via WhatsApp kepada Admin Utama dan Guru sekolah yang bersangkutan.

---

### 4. Menangani Ulasan Kritis
1. Jika ulasan siswa terdeteksi mengandung kata-kata keluhan kritis (seperti *"basi"*, *"asam"*, *"bau"*, *"kotor"*), ulasan tersebut secara otomatis dimasukkan ke modul **Ulasan Perlu Tindak Lanjut** di dashboard SPPG Anda.
2. Buka menu **Tindak Lanjut Ulasan** di sidebar.
3. Klik ulasan kritis tersebut, baca komentar siswa, dan perbarui status penanganannya:
   - `Dalam Proses`: Saat Anda sedang melakukan investigasi ke tim masak/kurir.
   - `Selesai`: Setelah Anda mengambil tindakan penyelesaian (seperti mengganti porsi makanan atau memperbaiki kebersihan bahan pangan).
4. Tulis catatan penyelesaian di kolom tanggapan, lalu klik **Simpan**.

---

## Panduan untuk Siswa

Siswa dapat berpartisipasi aktif dengan memberikan rating rasa dan dokumentasi foto makanan yang mereka terima.

### 1. Registrasi Akun Siswa (Verifikasi NISN)
Sebelum masuk untuk pertama kali, siswa harus melakukan registrasi mandiri:
1. Klik **Daftar Akun** pada halaman login, pilih peran **Siswa**.
2. Masukkan **10 digit NISN** resmi Anda pada kolom pencarian Dapodik, klik **Verifikasi/Cari**.
3. Sistem akan mencocokkan data NISN ke database Dapodik. Jika lolos, Nama Lengkap Anda dan Sekolah Anda akan terisi secara otomatis.
4. Masukkan alamat email Anda, buat kata sandi baru, dan masukkan konfirmasi kata sandi.
5. Klik **Daftar Akun**.

---

### 2. Mengirimkan Ulasan & Foto Makanan
1. Login menggunakan akun siswa Anda.
2. Klik tombol **Kirim Ulasan Hari Ini** di halaman dashboard siswa.
3. Berikan penilaian bintang (1-5) dan tulis komentar jujur Anda tentang masakan hari ini.
4. **Dokumentasi Foto Makanan**:
   - Klik **Ambil Foto** untuk mengakses kamera HP/Laptop Anda secara langsung (WebRTC), atau
   - Klik **Unggah File** untuk memilih file foto makanan yang sudah diambil sebelumnya.
5. Klik **Kirim Ulasan**. Notifikasi otomatis akan dikirim ke WhatsApp Guru pengawas Anda.

---

## Panduan untuk Guru

Guru memegang kendali moderasi tingkat pertama di sekolah guna menjaga kualitas konten ulasan yang dipublikasikan oleh siswanya.

### 1. WhatsApp Alerts & Login
1. Setiap kali ada siswa dari sekolah Anda yang mengirim ulasan makanan baru, sistem akan mengirimkan pesan WhatsApp notifikasi real-time ke nomor HP Anda.
2. Buka HaloMBG, pilih peran **Guru**, lalu login dengan akun Anda.

---

### 2. Moderasi Ulasan Siswa
1. Di dashboard guru, masuk ke menu **Kelola Ulasan Siswa**.
2. Tinjau ulasan-ulasan yang dikirim siswa sekolah Anda pada hari ini.
3. **Melaporkan Ulasan (Flagging)**:
   - Jika ulasan mengandung keluhan masukan gizi yang mencurigakan tetapi belum terkonfirmasi, klik tombol **Tandai (Flag)**.
   - Masukkan alasan penandaan ulasan. Ulasan publik akan dilabeli badge kuning *"Dalam Peninjauan Guru"* dan dikirim ke Admin Pusat untuk ditinjau.
4. **Menghapus Ulasan (Delete)**:
   - Jika ulasan terbukti melanggar ketentuan (misal: berkata tidak sopan, mengunggah foto selfie/bukan makanan), klik tombol **Hapus**.
   - Tuliskan alasan penghapusan ulasan pada form konfirmasi, klik **Hapus**. Ulasan akan segera disembunyikan dari profil publik.

---

## Panduan untuk Administrator

Admin pusat memiliki kendali pengawasan makro atas seluruh entitas dapur SPPG, sekolah, dan moderasi akhir ulasan di tingkat regional.

### 1. Dashboard Analitik Nasional
1. Di dashboard Admin, tinjau metrik agregat di bagian atas dasbor:
   - Total Dapur SPPG aktif.
   - Total Sekolah Terlayani.
   - Persentase Kelancaran Distribusi Harian.
2. Pantau grafik garis untuk mendeteksi tren keterlambatan pengantaran makanan di daerah tertentu.

---

### 2. Mengelola Master Data SPPG & Sekolah
- **Mendaftarkan SPPG**: Masuk ke menu **Data Master -> SPPG**, klik *Tambah SPPG Baru*. Isi kapasitas dapur, wilayah operasional, dan akun email login dapur.
- **Memetakan Relasi Dapur ke Sekolah**:
  1. Buka menu **Data Master -> Sekolah**.
  2. Klik tombol **Edit Pemetaan** pada sekolah yang dituju.
  3. Pada kolom *Dapur Penanggung Jawab*, pilih nama dapur SPPG terdekat yang akan melayani sekolah tersebut.
  4. Klik **Simpan Pemetaan**.

---

### 3. Moderasi Ulasan Flagged (Laporan Guru)
1. Masuk ke modul **Moderasi Ulasan (Flagged)** di sidebar Admin.
2. Tinjau ulasan-ulasan yang telah diberi tanda bendera (flag) oleh guru sekolah di daerah Anda.
3. Klik **Setujui Penghapusan** jika ulasan terbukti melanggar pedoman publikasi, atau klik **Abaikan Laporan** jika ulasan dinilai layak tampil kembali tanpa label peringatan.

---

## Troubleshooting

Berikut adalah solusi cepat untuk kendala yang sering ditemui pada aplikasi:

| Gejala Kendala | Kemungkinan Penyebab | Solusi Penanganan |
| :--- | :--- | :--- |
| **Pencarian NISN Siswa Gagal** | NISN salah input atau belum dimasukkan ke database simulasi Dapodik. | Pastikan 10 digit NISN diinput dengan benar. Untuk testing, silakan gunakan daftar NISN dummy yang tertera pada panduan pendaftaran siswa. |
| **Kamera Web tidak dapat diakses** | Perizinan akses kamera di peramban (browser) diblokir oleh pengguna. | Klik ikon gembok di sebelah kiri bilah alamat URL browser Anda, lalu ubah izin akses **Kamera** menjadi *Izinkan (Allow)*. |
| **Pop-up AI Nutrisi terus muncul** | Angka kandungan gizi yang diinput terlalu jauh melenceng dari takaran visual makanan. | Perbaiki takaran gizi sesuai petunjuk analisis visual AI, atau Anda dapat melewati pemeriksaan dengan mengklik tombol *Konfirmasi Tetap Simpan*. |
| **Pesan WhatsApp Notifikasi Terlambat** | Nomor telepon WhatsApp Guru / Admin di sistem salah format. | Masuk ke menu Master Data, pastikan format nomor HP diawali kode negara tanpa tanda plus (misal: `628123456789`). |

---

## FAQ

**Q: Bagaimana cara kerja verifikasi gizi AI di HaloMBG?**  
A: Sistem menggunakan API Vision dari Gemini AI untuk mengenali jenis makanan di dalam foto. AI kemudian mencocokkannya dengan estimasi gizi (kalori, protein, lemak, karbohidrat) yang dimasukkan oleh SPPG. Jika rentang nilai gizi terlalu jauh atau foto tidak menampilkan makanan, sistem akan memberikan peringatan visual.

**Q: Siapa yang dapat melihat ulasan dari siswa?**  
A: Semua orang dapat melihat ulasan siswa di tab "Ulasan" pada halaman detail dapur publik. Namun, ulasan yang melanggar pedoman kesopanan dapat dihapus oleh Guru sekolah atau Administrator pusat.

**Q: Mengapa status pengiriman sekolah saya otomatis berubah warna menjadi merah?**  
A: Jika waktu menunjukkan lewat pukul 11.00 WIB dan status distribusi harian sekolah belum diperbarui menjadi "Sudah Diantar" oleh pihak dapur, sistem secara otomatis menandai pengiriman tersebut terlambat (merah) dan mengirimkan notifikasi peringatan.

---

## Lampiran Screenshot

Tabel ini merinci target visual screenshot yang harus disertakan dalam implementasi dokumen panduan versi cetak/PDF:

| Kode Gambar | Judul Visual Halaman | Dimensi Target | Area Fokus Kotak Sorotan (Highlight Area) |
| :--- | :--- | :--- | :--- |
| **Gambar 1** | Halaman Utama & Pencarian | 1920x1080 (Desktop) | **Merah**: Search Box universal.<br>**Biru**: Hasil filter sekolah terverifikasi. |
| **Gambar 2** | Detail Profil Dapur SPPG | 1920x1080 (Desktop) | **Merah**: Area kontak & tombol WhatsApp.<br>**Kuning**: Tab navigasi utama profil dapur. |
| **Gambar 3** | Form Input Menu & Gizi | 1920x1080 (Desktop) | **Merah**: Input nutrisi makro.<br>**Biru**: Dropzone unggah file foto porsi makanan. |
| **Gambar 4** | Warning Ketidakwajaran AI | 900x600 (Pop-up) | **Merah**: Teks penjelasan visual mismatch dari AI.<br>**Biru**: Tombol "Revisi Data" & "Tetap Simpan". |
| **Gambar 5** | Antarmuka Ulasan Siswa | 375x812 (Mobile) | **Merah**: Pilihan bintang ulasan.<br>**Hijau**: Modul tangkapan kamera WebRTC. |
| **Gambar 6** | Dashboard Moderasi Guru | 1920x1080 (Desktop) | **Merah**: Tombol bendera (Flag).<br>**Biru**: Tombol hapus komentar melanggar. |
| **Gambar 7** | Pemetaan Sekolah Admin | 1920x1080 (Desktop) | **Merah**: Dropdown daftar SPPG Dapur.<br>**Biru**: Tombol simpan pemetaan. |

---
*Dokumen User Manual HaloMBG ini disiapkan oleh Tim Pengembang Aplikasi untuk memandu implementasi operasional sistem di lapangan. Terakhir diperbarui Juni 2026.*
