# Skenario Demo Aplikasi HaloMBG

Dokumen ini memuat skenario uji coba (*demo script*) untuk mempresentasikan seluruh fitur utama sistem **HaloMBG** secara langsung (live demo). Skenario ini membagi pengguna menjadi dua tipe: **Akun Ter-seed (Bawaan)** untuk peninjauan cepat, dan **Akun Baru (Registrasi Live)** untuk mendemonstrasikan proses integrasi data riil (seperti integrasi NIP/NISN Dapodik dan pengiriman notifikasi WhatsApp secara instan).

---

## Matriks Akun Demo

Untuk demo ini, kita menggunakan total **7 akun** yang mewakili seluruh peran di sistem:

| Role | Tipe Akun | Kredensial / ID | Nama Simulasi | Tujuan Demo |
|---|---|---|---|---|
| **Admin** | Ter-seed | Email: `admin@halombg.com`<br>Password: `password` | Test Admin | Mengelola master data, membuat dapur SPPG baru, dan memetakan sekolah. |
| **Siswa 1** | Ter-seed | Email: `siswa@halombg.com`<br>Password: `password` | Test Siswa | Melihat menu harian dan mengirimkan ulasan baru secara *live* saat demo. |
| **Siswa 2** | **Akun Baru** | NISN: `0080000102` | Budi Santoso<br>*(SD Negeri 1 Bocor)* | Demo register siswa baru dengan **validasi NISN Dapodik** asli secara live. |
| **Guru 1** | Ter-seed | Email: `guru@halombg.com`<br>Password: `password` | Test Guru | Meninjau dasbor guru dan notifikasi web lonceng historis. |
| **Guru 2** | **Akun Baru** | NIP: `198710102010121101` | Heri Setiawan<br>*(SD Negeri 1 Bocor)* | Demo register guru baru dengan **validasi NIP Dapodik** secara live. |
| **SPPG 1** | Ter-seed | Email: `sppg@halombg.com`<br>Password: `password` | Test SPPG | Menampilkan dasbor dapur bawaan dengan data menu terisi. |
| **SPPG 2** | **Akun Baru** | Email: *Ditentukan saat buat*<br>Password: *Ditentukan saat buat* | Dapur Demo Gizi | Dibuat oleh Admin secara live dengan memasukkan **Nomor WhatsApp Riil Demonstrator** untuk demo WhatsApp Notifikasi. |

### Akun Siswa dengan Riwayat Ulasan (Ter-seed)
Untuk meninjau riwayat ulasan historis yang sudah terisi di sistem (misal untuk menampilkan daftar ulasan di dashboard SPPG/Admin/Guru), Anda dapat login menggunakan salah satu akun siswa bawaan seeder berikut (semuanya dari sekolah **SD Negeri 1 Bocor**):

| Nama Siswa | Email Login | Password | NISN Dapodik | Status Ulasan |
|---|---|---|---|---|
| **Guntur Kusuma** | `guntur@example.com` | `password` | `0080000107` | Memiliki ulasan historis selama 3 hari terakhir |
| **Siti Rahmawati** | `siti@example.com` | `password` | `0080000103` | Memiliki ulasan historis selama 3 hari terakhir |
| **Dewi Lestari** | `dewi@example.com` | `password` | `0080000104` | Memiliki ulasan historis selama 3 hari terakhir |
| **Eko Wibowo** | `eko@example.com` | `password` | `0080000105` | Memiliki ulasan historis selama 3 hari terakhir |
| **Fitri Hidayat** | `fitri@example.com` | `password` | `0080000106` | Memiliki ulasan historis selama 3 hari terakhir |

---

## Alur Skenario Demo (Langkah Demi Langkah)

### Langkah 1: Persiapan Awal (.env, Docker, & Seeding Database)

1. **Konfigurasi API & WhatsApp:**
   Buka berkas `framework/backend/.env` dan pastikan konfigurasi API dan WhatsApp Anda sudah terisi dengan benar:
   ```env
   WHATSAPP_ENABLED=true
   GEMINI_API_KEY=your_gemini_api_key
   WHATSAPP_FONNTE_TOKEN=your_fonnte_token
   ```
   *Catatan: Pastikan nomor/perangkat WhatsApp Anda di dashboard Fonnte sudah berstatus **Connected**.*

2. **Menjalankan Container Docker:**
   Jalankan container Docker dari root direktori proyek `praktikum-rpl-a-02/framework` dengan perintah berikut:
   ```bash
   # Menjalankan seluruh container (database, backend, webserver, frontend)
   docker compose up -d
   ```

3. **Reset dan Seed Database (Fresh Seeding):**
   Jalankan perintah berikut untuk mengosongkan database dan men-seed ulang semua data dummy bawaan sistem (sekolah, akun test admin, sppg, guru, siswa, menu gizi, dan riwayat ulasan):
   ```bash
   # Melakukan fresh migration dan seeding database
   docker compose exec backend php artisan migrate:fresh --seed
   ```

4. **Penanganan Error / Troubleshooting Cepat:**
   Jika saat demo berlangsung Anda menemui error `502 Bad Gateway` atau koneksi backend terputus akibat beban database yang tinggi, jalankan perintah restart berikut:
   ```bash
   # Me-restart service backend laravel dan nginx webserver
   docker compose restart backend webserver
   ```

---

### Langkah 2: Demo Registrasi Akun Baru (Siswa & Guru)

#### A. Registrasi Siswa Baru (Siswa 2)
1. Buka halaman utama [http://localhost:5173](http://localhost:5173) lalu klik **Daftar Sebagai Siswa**.
2. Masukkan **NISN: `0080000102`** (Budi Santoso).
3. Klik **Verifikasi NISN**. Sistem akan mencocokkan data ke database simulasi Dapodik secara otomatis dan memunculkan nama *"Budi Santoso"*.
4. Lengkapi formulir dengan email (misal: `budi@gmail.com`) dan password, lalu klik **Daftar**.
5. Akun siswa baru berhasil dibuat dan otomatis terhubung dengan sekolah asalnya di Dapodik.

#### B. Registrasi Guru Baru (Guru 2)
1. Kembali ke halaman utama, klik **Daftar Sebagai Guru**.
2. Masukkan **NIP: `198710102010121101`** (Heri Setiawan).
3. Klik **Verifikasi NIP**. Sistem akan mencocokkan data ke Dapodik dan menampilkan nama *"Heri Setiawan"*.
4. Lengkapi email (misal: `heri@gmail.com`) dan password, lalu klik **Daftar**.
5. Akun guru baru berhasil dibuat.

---

### Langkah 3: Demo Tambah SPPG Baru oleh Admin (SPPG 2)
Untuk mendemonstrasikan penerimaan notifikasi WhatsApp nyata ke HP demonstrator:

1. Login sebagai Admin dengan email `admin@halombg.com` (password: `password`).
2. Masuk ke menu **Daftar SPPG**, lalu klik **Tambah SPPG**.
3. Isi formulir pembuatan dapur baru:
   * **Nama Dapur:** `Dapur Demo Gizi`
   * **Email Dapur:** `dapurdemo@halombg.com`
   * **Password Dapur:** `password`
   * **Nomor Telepon SPPG:** *Masukkan nomor WhatsApp Anda sendiri yang aktif* (format: `628xxxxxxxxxx` tanpa tanda `+`).
   * **Kontak Person:** `Bapak Demo`
   * **Detail Wilayah:** Lengkapi kecamatan, kota (Bocor/Kebumen), dan alamat.
4. Klik **Simpan**. Sistem akan membuat user ber-role `sppg` baru secara otomatis di tabel `users` dengan nomor WhatsApp Anda terdaftar di kolom `phone_number`.
5. **Sesuaikan Pemetaan Sekolah (Penting agar tidak bentrok):**
   * Cari dapur **SPPG Kebumen Buayan Rangkah** (SPPG 1) di daftar SPPG Admin, masuk ke kelola sekolahnya, lalu **lepas (detach)** hubungannya dengan **SD Negeri 1 Bocor**.
   * Cari dapur baru **Dapur Demo Gizi** (SPPG 2), masuk ke kelola sekolahnya, lalu **hubungkan (attach)** dengan **SD Negeri 1 Bocor**.
   * *Rasional:* Langkah ini mendemonstrasikan fitur pemetaan sekolah dinamis oleh Admin (BL-06), sekaligus memastikan ulasan dari Budi Santoso mengalir langsung ke SPPG 2 (HP Anda) tanpa terdistraksi oleh SPPG 1 bawaan database.


---

### Langkah 4: Demo Input Menu & Validasi AI Vision oleh SPPG

1. Logout dari Admin, lalu login sebagai SPPG baru: `dapurdemo@halombg.com` (password: `password`).
2. Masuk ke halaman **Input Menu Harian**.
3. Nyalakan kamera (sistem akan meminta izin WebRTC kamera laptop Anda).
4. Klik **Ambil Foto** makanan bergizi yang disiapkan (atau unggah foto piring makanan bergizi).
5. Masukkan takaran gizi makro:
   * **Kalori:** `650` kkal
   * **Protein:** `35` gram
   * **Karbohidrat:** `80` gram
   * **Lemak:** `15` gram
6. Klik tombol **Validasi AI**. Sistem akan mengirimkan foto dan data gizi ke Gemini API:
   * **Hasil Sukses:** Jika porsi makanan di foto wajar, pop-up hijau **"Lolos Validasi Nutrisi AI"** akan muncul.
   * **Hasil Peringatan:** (Opsional) Jika Anda memasukkan kalori sangat tinggi (misal `3000` kkal) tapi fotonya hanya berisi sedikit nasi, pop-up kuning **"Peringatan Ketidakwajaran Nutrisi AI"** akan muncul.
7. Klik **Simpan Menu**.

---

### Langkah 5: Demo Ulasan Kritis & Live Notifikasi WhatsApp (Siswa ➔ SPPG)

1. Logout dari SPPG, lalu login sebagai Siswa Baru: `budi@gmail.com` (password saat daftar).
2. Di halaman beranda Budi, ulasan untuk menu hari ini akan tersedia.
3. Klik **Tulis Ulasan**, beri **Rating Bintang 1**, lalu tulis ulasan negatif yang mengandung kata kunci kritis:
   * *Contoh Ulasan:* `"Makanannya basi, bau, dan tidak layak makan sama sekali."`
4. Kirim ulasan.
5. **Verifikasi Notifikasi WhatsApp:**
   * Di latar belakang, sistem mendeteksi kata ulasan kritis (`basi`, `bau`, `tidak layak`).
   * Periksa HP Anda (nomor WhatsApp yang dimasukkan pada SPPG 2 di Langkah 3).
   * Anda akan menerima pesan WhatsApp masuk secara instan dari nomor bot Fonnte:
     > **[Ulasan Kritis Terdeteksi]**  
     > Peringatan: Ulasan kritis diterima untuk dapur Anda pada tanggal 2026-06-28.  
     > Ulasan: "Makanannya basi, bau, dan tidak layak makan sama sekali."  
     > Segera lakukan tindak lanjut di dashboard.

---

### Langkah 6: Demo Moderasi Guru & Notifikasi Lonceng Web

1. Logout dari Siswa, lalu login sebagai Guru Baru: `heri@gmail.com` (password saat daftar).
2. Di pojok kanan atas, perhatikan **ikon lonceng** menyala merah. Klik lonceng tersebut, akan muncul notifikasi web: *"Ulasan Baru dari Siswa Budi Santoso"*.
3. Masuk ke halaman **Moderasi Ulasan**. Ulasan dari Budi Santoso akan terlihat.
4. Klik tombol **Tandai Ulasan** (flagged), lalu masukkan alasan moderasinya (misal: *"Ulasan mengandung keluhan fatal gizi buruk"*).
5. Logout dari Guru, lalu login kembali sebagai Siswa: `budi@gmail.com`.
6. Klik **ikon lonceng** pada akun Budi Santoso.
7. Tunjukkan notifikasi web yang masuk: *"Ulasan Anda pada tanggal [Tanggal] telah ditandai oleh guru. Alasan: Ulasan mengandung keluhan fatal gizi buruk."* *(Tunjukkan bahwa notifikasi ini hanya masuk ke web lonceng saja, tidak mengirim pesan WhatsApp ke siswa).*

---

### Langkah 7: Demo Ringkasan Evaluasi AI Publik
1. Logout dari semua akun (menjadi pengunjung publik anonim).
2. Masuk ke menu **Peta Sekolah & SPPG**, lalu cari sekolah SD Negeri 1 Bocor atau dapur `Dapur Demo Gizi`.
3. Buka tab **Evaluasi Dapur**.
4. Tunjukkan visualisasi grafik tingkat kepuasan ulasan siswa serta **Ringkasan Analisis Sentimen AI** (dirangkum oleh Gemini API menjadi 2 paragraf evaluasi berkala) yang dapat diakses secara transparan oleh publik umum.
