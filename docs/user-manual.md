# Panduan Pengguna (User Manual) — HaloMBG
### Sistem Monitoring Program Makan Bergizi Gratis (MBG)
---

Selamat datang di Dokumen Panduan Pengguna **HaloMBG**. HaloMBG adalah platform monitoring berbasis web yang mengintegrasikan transparansi data, validasi nutrisi berbasis kecerdasan buatan (AI) melalui analisis foto, status distribusi real-time, serta ulasan dari siswa untuk memastikan program Makan Bergizi Gratis berjalan dengan akuntabel dan transparan.

---

## Daftar Isi
1. [Aktor dan Hak Akses Pengguna](#1-aktor-dan-hak-akses-pengguna)
2. [Akses Publik (Pemantau Publik / Umum)](#2-akses-publik-pemantau-publik--umum)
   - 2.1 [Menelusuri & Mencari Dapur SPPG](#21-menelusuri--mencari-dapur-sppg)
   - 2.2 [Melihat Profil Detail Dapur](#22-melihat-profil-detail-dapur)
   - 2.3 [Memantau Menu Gizi & Status Validasi AI](#23-memantau-menu-gizi--status-validasi-ai)
   - 2.4 [Memantau Status Distribusi Sekolah](#24-memantau-status-distribusi-sekolah)
   - 2.5 [Melihat Evaluasi Sentimen Dapur (AI Summary)](#25-melihat-evaluasi-sentimen-dapur-ai-summary)
3. [Panduan untuk Pihak SPPG (Operator Dapur)](#3-panduan-untuk-pihak-sppg-operator-dapur)
   - 3.1 [Login Akun Dapur](#31-login-akun-dapur)
   - 3.2 [Memperbarui Profil Dapur](#32-memperbarui-profil-dapur)
   - 3.3 [Menginput Menu Harian & Validasi AI](#33-menginput-menu-harian--validasi-ai)
   - 3.4 [Mengelola Status Distribusi Sekolah](#34-mengelola-status-distribusi-sekolah)
   - 3.5 [Menangani Notifikasi Ulasan Kritis](#35-menangani-notifikasi-ulasan-kritis)
4. [Panduan untuk Siswa (Penerima Manfaat)](#4-panduan-untuk-siswa-penerima-manfaat)
   - 4.1 [Registrasi Akun Siswa (Verifikasi NISN)](#41-registrasi-akun-siswa-verifikasi-nisn)
   - 4.2 [Mengirimkan Ulasan & Foto Makanan](#42-mengirimkan-ulasan--foto-makanan)
5. [Panduan untuk Guru (Moderator Sekolah)](#5-panduan-untuk-guru-moderator-sekolah)
   - 5.1 [Login & Menerima Notifikasi WhatsApp](#51-login--menerima-notifikasi-whatsapp)
   - 5.2 [Moderasi Ulasan Siswa (Flagging & Penghapusan)](#52-moderasi-ulasan-siswa-flagging--penghapusan)
6. [Panduan untuk Administrator (Pusat/Sistem)](#6-panduan-untuk-administrator-pusatsistem)
   - 6.1 [Dashboard Analitik Utama](#61-dashboard-analitik-utama)
   - 6.2 [Mengelola Master Data SPPG & Sekolah](#62-mengelola-master-data-sppg--sekolah)
7. [Daftar Lampiran Gambar & Panduan Highlight](#7-daftar-lampiran-gambar--panduan-highlight)

---

## 1. Aktor dan Hak Akses Pengguna

Sistem HaloMBG dirancang untuk melayani lima aktor dengan hak akses spesifik sebagai berikut:

| Aktor | Autentikasi | Fitur Utama |
|---|---|---|
| **Pemantau Publik** | Tanpa Login | Mencari dapur, melihat menu harian, memantau status gizi & validasi AI, memantau status pengiriman, melihat grafik ulasan publik. |
| **Pihak SPPG (Dapur)** | Login Akun | Mengelola profil operasional dapur, input menu harian + foto, memproses verifikasi AI gizi, memperbarui status pengiriman (bukti foto), merespons tindak lanjut ulasan kritis. |
| **Siswa** | Login NISN | Registrasi mandiri via pencocokan database Dapodik, memberikan rating bintang & ulasan teks, serta mengunggah foto makanan melalui kamera/unggah file. |
| **Guru** | Login Akun | Menerima notifikasi otomatis WhatsApp, memantau ulasan sekolahnya, memberikan tanda (*flag*) ulasan tidak layak, serta menghapus ulasan yang melanggar pedoman. |
| **Administrator** | Login Akun | Mengelola data induk (SPPG & Sekolah), memetakan sekolah ke dapur terdekat, melihat statistik analitik nasional/regional, memantau log audit sistem. |

---

## 2. Akses Publik (Pemantau Publik / Umum)

Masyarakat umum, orang tua siswa, dan perwakilan pemerintah dapat mengakses HaloMBG secara terbuka tanpa harus mendaftarkan akun atau melakukan login.

### 2.1 Menelusuri & Mencari Dapur SPPG
Saat pertama kali membuka situs HaloMBG, Anda akan disajikan dengan halaman direktori dapur SPPG yang menyalurkan program MBG.

**Langkah-langkah Pencarian:**
1. Masuk ke halaman utama HaloMBG.
2. Di bagian atas halaman, gunakan kolom pencarian utama.
3. Masukkan nama sekolah anak Anda atau nama kabupaten/kota tempat tinggal Anda, lalu tekan **Enter** atau tombol **Cari**.
4. Hasil pencarian akan secara otomatis menyaring daftar dapur penyedia dan menampilkan kartu dapur yang relevan.

> [!NOTE]
> Pencarian menggunakan sistem pencocokan teks fleksibel untuk wilayah (Kabupaten/Kota) dan nama sekolah terdaftar.

---

```
[Gambar 1: Halaman Utama Direktori dan Kolom Pencarian]
*Panduan Pengambilan Gambar:*
- Ambil screenshot halaman depan / beranda publik.
- Berikan KOTAK MERAH pada kolom pencarian universal (Search Bar) di bagian atas.
- Berikan KOTAK BIRU pada filter wilayah/kabupaten berupa tombol-tombol tag cepat di bawah search bar.
- Berikan KOTAK HIJAU pada deretan kartu-kartu Dapur SPPG (Kitchen Cards Grid).
```

---

### 2.2 Melihat Profil Detail Dapur
Setiap dapur memiliki halaman profil transparan yang menyajikan informasi dasar operasional mereka.

**Langkah-langkah:**
1. Pada hasil pencarian atau daftar di halaman utama, klik salah satu **Kartu Dapur SPPG**.
2. Anda akan diarahkan ke halaman detail dapur.
3. Halaman ini memuat:
   - Nama resmi dapur dan alamat lengkap.
   - Wilayah operasional dapur.
   - Daftar sekolah-sekolah yang mendapatkan pasokan makanan dari dapur tersebut.
   - Kontak Person operasional dapur (Nama, email, dan nomor WhatsApp) untuk memfasilitasi komunikasi langsung.

---

```
[Gambar 2: Halaman Profil Detail Dapur SPPG]
*Panduan Pengambilan Gambar:*
- Ambil screenshot halaman detail Dapur SPPG.
- Berikan KOTAK MERAH pada detail informasi kontak (Nama & tombol hubungi via WhatsApp).
- Berikan KOTAK BIRU pada daftar sekolah terpetakan yang dilayani dapur tersebut.
- Berikan HIGHLIGHT KUNING pada tab navigasi halaman ("Menu Harian", "Status Distribusi", "Evaluasi AI").
```

---

### 2.3 Memantau Menu Gizi & Status Validasi AI
HaloMBG menghadirkan transparansi kandungan gizi setiap porsi makanan yang disajikan.

**Langkah-langkah:**
1. Buka profil dapur pilihan Anda, lalu pastikan Anda berada di tab **Menu Harian**.
2. Anda akan melihat foto makanan yang disajikan dapur pada hari tersebut serta rincian nilai gizi:
   - Kalori (kkal)
   - Protein (gram)
   - Karbohidrat (gram)
   - Lemak (gram)
3. Perhatikan keberadaan badge **"Tervalidasi AI"** (berwarna hijau). Badge ini menunjukkan bahwa sistem kecerdasan buatan (Gemini AI) telah membandingkan foto makanan asli dengan klaim angka gizi yang diinput dapur dan menyimpulkan bahwa data tersebut logis/wajar secara visual.

---

```
[Gambar 3: Tampilan Menu Harian dengan Badge Validasi AI]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman detail menu harian yang telah dipublikasikan.
- Berikan KOTAK MERAH pada foto makanan yang diunggah dapur.
- Berikan KOTAK BIRU pada visualisasi grafik/diagram gizi makro (Karbohidrat, Protein, Lemak, Kalori).
- Berikan HIGHLIGHT HIJAU TEBAL pada badge label "Tervalidasi AI" yang terletak di dekat nama menu.
```

---

### 2.4 Memantau Status Distribusi Sekolah
Anda bisa melacak apakah makanan bergizi untuk hari ini sudah tiba di sekolah anak Anda.

**Langkah-langkah:**
1. Masuk ke halaman profil dapur, kemudian pilih tab **Status Distribusi**.
2. Sistem akan menampilkan daftar sekolah yang dilayani lengkap dengan status pengiriman saat ini:
   - `Belum Diantar`: Makanan masih dalam proses persiapan atau belum dikirim oleh dapur.
   - `Siap Diantar`: Makanan selesai dikemas dan siap diberangkatkan oleh kurir.
   - `Sudah Diantar`: Makanan telah tiba di sekolah tujuan.
   - `Batal`: Pengiriman dibatalkan (disertai keterangan kendala di lapangan).
3. Untuk status `Sudah Diantar`, Anda dapat mengklik tombol **Lihat Bukti Foto** untuk melihat foto serah terima makanan asli di sekolah beserta waktu persis (timestamp) penerimaan.

---

```
[Gambar 4: Tampilan Status Distribusi Harian Sekolah]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman status distribusi harian per sekolah.
- Berikan KOTAK MERAH pada indikator label status (misalnya tag "Sudah Diantar" berwarna hijau atau "Belum Diantar" berwarna kuning).
- Berikan KOTAK BIRU pada kolom waktu pembaruan (Timestamp) terakhir.
- Berikan KOTAK HIJAU pada tombol "Lihat Bukti Foto" di baris sekolah yang sudah menerima makanan.
```

---

### 2.5 Melihat Evaluasi Sentimen Dapur (AI Summary)
HaloMBG merangkum ratusan ulasan siswa secara harian menggunakan kecerdasan buatan agar publik dapat mengetahui kualitas rata-rata dapur secara cepat.

**Langkah-langkah:**
1. Masuk ke halaman profil dapur, klik tab **Evaluasi & Sentimen**.
2. Anda akan disajikan grafik persentase sentimen ulasan siswa: **Positif** (hijau), **Netral** (abu-abu), dan **Negatif** (merah).
3. Di bawah grafik, baca bagian **Ringkasan Evaluasi AI** yang mengekstrak poin utama (misalnya: *"Siswa sangat menyukai menu ayam goreng, namun terdapat catatan bahwa porsi sayur dirasa kurang pada hari Selasa"*).

---

```
[Gambar 5: Halaman Ringkasan Sentimen AI]
*Panduan Pengambilan Gambar:*
- Screenshot bagian tab Evaluasi pada profil dapur publik.
- Berikan KOTAK MERAH pada diagram lingkaran/batang statistik sentimen ulasan.
- Berikan HIGHLIGHT KUNING pada teks paragraf rangkuman poin positif & negatif hasil analisis AI.
```

---

## 3. Panduan untuk Pihak SPPG (Operator Dapur)

Sebagai operator dapur SPPG, Anda bertanggung jawab penuh untuk memperbarui data operasional dapur, menu makanan, dan status distribusi harian.

### 3.1 Login Akun Dapur
Akun dapur didaftarkan oleh Administrator pusat. Anda akan menerima email dan kata sandi sementara.

**Langkah-langkah:**
1. Buka halaman utama HaloMBG lalu klik **Masuk** di pojok kanan atas.
2. Di halaman login, pilih peran/role **"SPPG / Dapur"**.
3. Masukkan alamat email dan kata sandi Anda.
4. Klik tombol **Masuk**. Anda akan diarahkan ke Dashboard SPPG secara otomatis.

---

```
[Gambar 6: Form Login Terpadu untuk SPPG]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman Login sistem.
- Berikan KOTAK MERAH pada pilihan radio button/tombol kartu untuk peran "SPPG / Dapur".
- Berikan KOTAK BIRU pada input email dan password.
- Berikan HIGHLIGHT HIJAU pada tombol "Masuk ->".
```

---

### 3.2 Memperbarui Profil Dapur
Pastikan profil publik dapur Anda selalu memiliki data kontak yang aktif agar dapat dihubungi oleh pihak sekolah maupun masyarakat.

**Langkah-langkah:**
1. Pada menu sidebar dashboard SPPG, klik **Pengaturan Profil**.
2. Perbarui data yang diperlukan:
   - Deskripsi operasional dapur.
   - Nama penanggung jawab (Contact Person).
   - Nomor WhatsApp aktif (gunakan format internasional: contoh `62812xxxx`).
   - Kapasitas produksi harian (porsi).
3. Klik **Simpan Perubahan**. Data di halaman publik akan segera diperbarui secara real-time.

---

### 3.3 Menginput Menu Harian & Validasi AI
Anda diwajibkan menginput menu makanan setiap hari sebelum distribusi dilakukan.

**Langkah-langkah:**
1. Masuk ke dashboard SPPG, lalu klik menu **Kelola Menu Harian**.
2. Klik tombol **Tambah Menu Baru**.
3. Isi formulir yang disediakan:
   - **Nama Menu**: Contoh *"Nasi Kuning Ayam Bakar & Tumis Buncis"*.
   - **Komponen Makanan**: Rincian lauk pauk.
   - **Kandungan Nutrisi**: Masukkan perkiraan Kalori (kkal), Karbohidrat (g), Protein (g), dan Lemak (g).
   - **Foto Makanan**: Unggah foto nyata porsi makanan yang siap didistribusikan (maksimal ukuran file 5 MB).
4. Klik tombol **Simpan dan Validasi**.
5. **Proses Validasi Visual AI:**
   - Sistem akan memproses gambar menggunakan AI Gemini.
   - **Kondisi A (Lolos)**: Jika foto dinilai wajar dengan klaim gizi, menu langsung terbit dengan badge hijau *"Tervalidasi AI"*.
   - **Kondisi B (Ketidakwajaran Terdeteksi)**: Jika AI mendeteksi kejanggalan visual (misalnya, klaim protein 50g tetapi di foto hanya terlihat nasi polos tanpa lauk), layar akan memunculkan **Pop-up Peringatan AI**.
   - Pada pop-up tersebut, baca catatan visual AI (misal: *"Klaim protein tidak sesuai dengan tampilan visual piring"*). Anda dapat memilih tombol **Revisi Data** untuk membetulkan angka gizi, atau mengklik **Konfirmasi Tetap Simpan** jika Anda yakin data Anda benar (status menu akan disimpan, namun tanpa badge "Tervalidasi AI").

---

```
[Gambar 7: Form Tambah Menu Harian Dapur]
*Panduan Pengambilan Gambar:*
- Tampilkan form input menu harian dengan data terisi.
- Berikan KOTAK MERAH pada kolom input nilai nutrisi makro (Kalori, Protein, Karbohidrat, Lemak).
- Berikan KOTAK BIRU pada area dropzone untuk unggah file foto makanan.
```

---

```
[Gambar 8: Pop-Up Peringatan Ketidakwajaran Nutrisi AI]
*Panduan Pengambilan Gambar:*
- Simulasikan input gizi yang tidak rasional dengan foto makanan, lalu simpan untuk memicu pop-up peringatan AI.
- Berikan KOTAK MERAH pada teks analisis visual AI yang menerangkan ketidakwajaran porsi.
- Berikan KOTAK BIRU pada tombol opsi "Revisi Data" (kiri) dan tombol opsi "Konfirmasi Tetap Simpan" (kanan).
```

---

### 3.4 Mengelola Status Distribusi Sekolah
Setiap pagi, Anda harus memperbarui status pengiriman secara berkala agar sekolah dan masyarakat dapat memantau kedatangan makanan.

**Langkah-langkah:**
1. Di dashboard SPPG, klik menu **Status Distribusi**.
2. Anda akan melihat daftar sekolah yang dijadwalkan menerima pasokan hari ini.
3. Di samping nama sekolah tujuan, pilih dropdown status:
   - Pilih `Siap Diantar` saat makanan selesai dikemas dan siap di armada.
   - Pilih `Sudah Diantar` ketika kurir telah sampai di sekolah.
4. Saat memilih `Sudah Diantar`, sistem mewajibkan Anda untuk mengunggah **Foto Bukti Penerimaan** (misalnya foto serah terima dengan guru atau perwakilan sekolah).
5. Klik **Perbarui Status**. Data distribusi sekolah terkait langsung berubah secara instan di halaman publik.

> [!WARNING]
> Batas waktu pembaruan status distribusi adalah pukul **11.00 WIB**. Jika hingga pukul 11.00 WIB status distribusi sekolah masih `Belum Diantar`, sistem otomatis mengirim pesan WhatsApp peringatan keterlambatan ke Admin Pusat dan Guru sekolah tersebut.

---

```
[Gambar 9: Panel Kelola Distribusi Makanan SPPG]
*Panduan Pengambilan Gambar:*
- Tampilkan dashboard pengelolaan status distribusi di akun SPPG.
- Berikan KOTAK MERAH pada kolom dropdown pilihan status untuk salah satu sekolah.
- Berikan KOTAK BIRU pada area tombol input file/kamera untuk mengunggah bukti foto pengiriman.
- Berikan HIGHLIGHT HIJAU pada tombol aksi "Simpan & Perbarui" di baris data sekolah tersebut.
```

---

### 3.5 Menangani Notifikasi Ulasan Kritis
Jika ulasan siswa berisi keluhan ekstrem yang menyangkut kebersihan atau kelayakan makanan, Anda wajib segera melakukan investigasi dan menindaklanjutinya.

**Langkah-langkah:**
1. Ulasan siswa yang mengandung kata kunci kritis seperti *"basi"*, *"bau"*, *"busuk"*, atau *"kotor"* akan otomatis memicu notifikasi di dashboard dapur Anda dan masuk ke menu **Ulasan Perlu Tindak Lanjut**.
2. Klik menu **Tindak Lanjut Ulasan** di sidebar.
3. Klik ulasan kritis tersebut untuk membaca rincian keluhan, nama sekolah, dan foto yang dilampirkan siswa.
4. Klik tombol **Ubah Status Tindak Lanjut**:
   - Ubah ke `Dalam Proses Tindak Lanjut` saat Anda sedang melakukan pengecekan ke bagian masak atau kurir.
   - Ubah ke `Selesai` setelah Anda memberikan kompensasi atau melakukan perbaikan prosedur masakan.
5. Tuliskan tanggapan/catatan penanganan di kolom yang tersedia (contoh: *"Kami telah mengganti menu untuk kelas terkait dan mengevaluasi kebersihan bahan pangan"*).
6. Klik **Simpan**. Riwayat penanganan ini akan tersimpan permanen sebagai bukti akuntabilitas dapur Anda.

---

```
[Gambar 10: Panel Tindak Lanjut Ulasan Kritis SPPG]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman pengelolaan ulasan kritis pada akun SPPG.
- Berikan KOTAK MERAH pada ulasan siswa yang ditandai sebagai ulasan kritis (memiliki label merah "Kritis - Kata Kunci: Basi").
- Berikan KOTAK BIRU pada dropdown status penanganan (Belum Diproses / Dalam Proses / Selesai).
- Berikan KOTAK HIJAU pada textarea "Catatan Tindak Lanjut Dapur".
```

---

## 4. Panduan untuk Siswa (Penerima Manfaat)

Siswa yang menerima paket makanan di sekolah dapat berpartisipasi langsung dalam mengawasi kualitas makanan dengan mengirimkan ulasan harian.

### 4.1 Registrasi Akun Siswa (Verifikasi NISN)
Untuk memastikan ulasan hanya dikirim oleh siswa asli yang berhak, sistem menerapkan verifikasi nomor induk siswa nasional (NISN) yang terhubung ke database Dapodik.

**Langkah-langkah:**
1. Pada halaman Login HaloMBG, klik tautan **Daftar Akun Siswa Baru**.
2. Masukkan **10 digit NISN** resmi Anda pada kolom yang disediakan.
3. Klik tombol **Verifikasi**.
4. **Validasi NISN:**
   - Jika NISN terdaftar di database simulasi Dapodik, sistem akan menampilkan nama lengkap Anda dan nama sekolah Anda secara otomatis.
   - Jika data sudah sesuai, lanjutkan mengisi email aktif, kata sandi baru, dan konfirmasi kata sandi Anda.
5. Klik **Daftar Akun**. Akun Anda kini aktif dan Anda bisa langsung login.

---

```
[Gambar 11: Form Pendaftaran Siswa & Verifikasi NISN]
*Panduan Pengambilan Gambar:*
- Tampilkan layar registrasi siswa baru.
- Berikan KOTAK MERAH pada input field "Masukkan 10 Digit NISN".
- Berikan KOTAK BIRU pada tombol "Cari / Verifikasi".
- Berikan HIGHLIGHT KUNING pada kolom nama siswa dan nama sekolah yang muncul otomatis setelah verifikasi NISN berhasil.
```

---

### 4.2 Mengirimkan Ulasan & Foto Makanan
Setelah makan siang, Anda dapat memberikan ulasan langsung mengenai kualitas makanan hari ini.

**Langkah-langkah:**
1. Login menggunakan akun siswa yang telah terdaftar.
2. Di halaman beranda siswa, klik tombol **Tulis Ulasan Hari Ini**.
3. Isi formulir ulasan:
   - **Rating**: Berikan bintang 1 sampai 5 sesuai kepuasan Anda terhadap rasa dan porsi makanan.
   - **Teks Ulasan**: Tuliskan pendapat jujur Anda (contoh: *"Makanannya enak, ayamnya empuk tapi sayurnya agak terlalu asin"*).
   - **Foto Makanan**: Ambil foto makanan asli menggunakan kamera HP/laptop Anda secara langsung melalui integrasi kamera web (WebRTC) atau unggah file foto dari galeri.
4. Klik **Kirim Ulasan**. Ulasan Anda akan langsung terbit di halaman publik dan notifikasi akan dikirimkan otomatis ke WhatsApp Guru sekolah Anda.

---

```
[Gambar 12: Form Pengiriman Ulasan Harian Siswa]
*Panduan Pengambilan Gambar:*
- Tampilkan antarmuka pengisian ulasan di akun siswa.
- Berikan KOTAK MERAH pada opsi pemilihan rating bintang (Star Ratings).
- Berikan KOTAK BIRU pada textarea ulasan komentar.
- Berikan KOTAK HIJAU pada modul kamera WebRTC / tombol unggah foto makanan.
```

---

## 5. Panduan untuk Guru (Moderator Sekolah)

Guru berperan sebagai pengawas lokal yang membantu memoderasi ulasan siswa di sekolahnya serta memantau ketepatan waktu distribusi.

### 5.1 Login & Menerima Notifikasi WhatsApp
Setiap kali siswa di sekolah Anda mengirimkan ulasan baru, sistem secara otomatis akan mengirimkan pesan notifikasi ke nomor WhatsApp Anda yang terdaftar di sistem.

**Contoh isi pesan WhatsApp:**
> *"Halo Guru [Nama], siswa [Nama Siswa] baru saja mengirimkan ulasan untuk menu hari ini di [Nama Sekolah]. Silakan tinjau ulasan tersebut di dashboard HaloMBG."*

**Langkah Login:**
1. Masuk ke halaman login HaloMBG, pilih peran **"Guru"**.
2. Ketikkan email dan password terdaftar Anda, lalu klik **Masuk**.

---

### 5.2 Moderasi Ulasan Siswa (Flagging & Penghapusan)
Untuk mencegah konten ulasan yang kasar, bercanda berlebihan, atau memuat gambar yang tidak pantas diakses publik, guru memiliki wewenang untuk melakukan moderasi.

**Langkah-langkah:**
1. Di dashboard guru, buka halaman **Kelola Ulasan Siswa**.
2. Anda akan melihat seluruh ulasan yang dikirim oleh siswa dari sekolah tempat Anda mengajar.
3. **Pilihan Tindakan 1: Tandai (Flag)**
   - Jika ulasan mencurigakan atau membutuhkan verifikasi lebih lanjut, klik tombol **Tandai (Flag)**.
   - Masukkan alasan penandaan ulasan tersebut pada form modal yang muncul.
   - Ulasan akan tetap tampil di publik, namun akan dilabeli dengan tag kuning *"Sedang Ditinjau Guru"* untuk peringatan awal.
4. **Pilihan Tindakan 2: Hapus Ulasan**
   - Jika ulasan terbukti melanggar pedoman (memakai kata kasar/foto tidak sopan), klik tombol **Hapus**.
   - Isi alasan penghapusan ulasan.
   - Klik **Konfirmasi Hapus**. Ulasan akan segera ditarik dari halaman publik. Siswa yang bersangkutan akan menerima notifikasi bahwa ulasannya dihapus disertai dengan alasan penolakannya.

---

```
[Gambar 13: Panel Moderasi Ulasan oleh Guru]
*Panduan Pengambilan Gambar:*
- Tampilkan dashboard akun guru bagian daftar ulasan siswa.
- Berikan KOTAK MERAH pada tombol "Flag (Tandai)" berwarna kuning di salah satu ulasan siswa.
- Berikan KOTAK BIRU pada tombol "Hapus" berwarna merah di ulasan yang melanggar.
```

---

## 6. Panduan untuk Administrator (Pusat/Sistem)

Administrator memiliki kendali tertinggi dalam pengelolaan sistem HaloMBG di tingkat kabupaten/kota maupun nasional.

### 6.1 Dashboard Analitik Utama
Dashboard admin memberikan visualisasi cepat mengenai jalannya program MBG.

**Fungsi Utama:**
- Memantau grafik kelancaran pengiriman makanan harian secara real-time.
- Memantau tren sentimen ulasan nasional/daerah untuk mendeteksi SPPG yang berkinerja buruk.
- Membaca kartu ringkasan metrik (Total Dapur Aktif, Total Sekolah Terlayani, Total Porsi Terdistribusi Hari Ini).

---

```
[Gambar 14: Dashboard Utama Administrator]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman dashboard setelah login sebagai admin.
- Berikan KOTAK MERAH pada deretan Kartu Ringkasan (Summary Cards) di bagian atas dasbor.
- Berikan KOTAK BIRU pada grafik statistik visualisasi kelancaran distribusi.
- Berikan HIGHLIGHT HIJAU pada menu navigasi sidebar khusus Admin (Master Data SPPG, Master Data Sekolah, Log Audit).
```

---

### 6.2 Mengelola Master Data SPPG & Sekolah
Sebelum sistem dapat berjalan, Admin harus memasukkan data dasar dapur dan memetakan sekolah penerima manfaat.

**Langkah-langkah Mendaftarkan SPPG Baru:**
1. Klik menu **Data Master -> SPPG** di sidebar Admin.
2. Klik tombol **Tambah SPPG**.
3. Masukkan data: Nama Dapur, Alamat, Wilayah Kabupaten/Kota, Kapasitas Produksi Maksimal, serta Email & Password awal untuk login SPPG.
4. Klik **Simpan**. Akun SPPG kini aktif dan data profil publiknya terbuat.

**Langkah-langkah Pemetaan Sekolah:**
1. Klik menu **Data Master -> Sekolah** di sidebar Admin.
2. Pilih sekolah yang ingin diatur distribusinya, lalu klik **Edit Pemetaan**.
3. Pada dropdown **Dapur Penyedia**, pilih nama dapur SPPG yang bertanggung jawab mengirimkan makanan ke sekolah tersebut.
4. Klik **Terapkan**. Hubungan relasi distribusi berhasil dibuat. Dapur terpilih kini akan melihat sekolah ini dalam daftar target distribusi hariannya.

---

```
[Gambar 15: Form Pemetaan Sekolah ke Dapur SPPG oleh Admin]
*Panduan Pengambilan Gambar:*
- Tampilkan halaman edit sekolah pada panel master data admin.
- Berikan KOTAK MERAH pada dropdown selection untuk memilih Dapur SPPG penanggung jawab.
- Berikan KOTAK BIRU pada tombol "Simpan Pemetaan".
```

---

## 7. Daftar Lampiran Gambar & Panduan Highlight

Tabel di bawah ini dirancang sebagai panduan bagi desainer UI/UX atau developer yang akan menangkap gambar (screenshot) aplikasi dan menyisipkannya ke dokumen user manual ini:

| Kode Gambar | Nama Tampilan | Dimensi Rekomendasi | Fokus Kotak Sorotan (Highlight Area) |
|---|---|---|---|
| **Gambar 1** | Halaman Utama & Kolom Pencarian | Desktop (1920x1080) | **Merah**: Search Bar universal.<br>**Biru**: Filter wilayah cepat.<br>**Hijau**: Grid kartu dapur. |
| **Gambar 2** | Detail Profil Dapur SPPG | Desktop (1920x1080) | **Merah**: Area tombol WhatsApp kontak dapur.<br>**Biru**: Daftar sekolah terhubung.<br>**Kuning**: Tab menu navigasi profil. |
| **Gambar 3** | Detail Menu & Badge AI | Desktop / Mobile | **Merah**: Foto masakan.<br>**Biru**: Nilai Gizi makro.<br>**Hijau**: Badge label "Tervalidasi AI". |
| **Gambar 4** | Status Distribusi | Mobile (375x812) | **Merah**: Tag status (Siap/Sudah/Batal).<br>**Biru**: Timestamp terupdate.<br>**Hijau**: Tombol bukti foto. |
| **Gambar 5** | Sentimen AI Profil Dapur | Desktop (1920x1080) | **Merah**: Grafik sentimen ulasan.<br>**Kuning**: Teks paragraf ringkasan ulasan kecerdasan buatan. |
| **Gambar 6** | Halaman Login Terpadu | Desktop / Mobile | **Merah**: Pilihan Peran "SPPG/Dapur".<br>**Biru**: Input text kredensial.<br>**Hijau**: Tombol Masuk. |
| **Gambar 7** | Form Input Menu Dapur | Desktop (1920x1080) | **Merah**: Input nutrisi kalori, protein, lemak.<br>**Biru**: Dropzone unggah berkas foto makanan. |
| **Gambar 8** | Warning Ketidakwajaran AI | Desktop / Pop-up | **Merah**: Teks penjelasan visual mismatch dari AI.<br>**Biru**: Tombol "Revisi Data" & "Konfirmasi". |
| **Gambar 9** | Pengelolaan Distribusi SPPG | Desktop (1920x1080) | **Merah**: Dropdown status sekolah.<br>**Biru**: Upload bukti foto.<br>**Hijau**: Tombol Simpan & Perbarui. |
| **Gambar 10** | Penanganan Ulasan Kritis | Desktop (1920x1080) | **Merah**: Deteksi label kritis.<br>**Biru**: Dropdown status penanganan.<br>**Hijau**: Textarea tanggapan penanganan dapur. |
| **Gambar 11** | Registrasi & Validasi NISN | Mobile (375x812) | **Merah**: Field input NISN.<br>**Biru**: Tombol Cari/Verifikasi.<br>**Kuning**: Hasil data otomatis dari Dapodik. |
| **Gambar 12** | Form Ulasan Harian Siswa | Mobile (375x812) | **Merah**: Rating bintang.<br>**Biru**: Textarea komentar.<br>**Hijau**: Modul kamera / upload file foto. |
| **Gambar 13** | Panel Moderasi Ulasan Guru | Desktop (1920x1080) | **Merah**: Tombol Flag.<br>**Biru**: Tombol Hapus. |
| **Gambar 14** | Dashboard Analitik Admin | Desktop (1920x1080) | **Merah**: Kartu Ringkasan Metrik.<br>**Biru**: Grafik progress distribusi.<br>**Hijau**: Menu sidebar admin. |
| **Gambar 15** | Pemetaan Sekolah Admin | Desktop (1920x1080) | **Merah**: Dropdown pilihan SPPG Dapur.<br>**Biru**: Tombol simpan. |

---
*Dokumen ini dibuat oleh Tim Pengembang HaloMBG untuk memandu implementasi dan mempermudah operasional sistem di lapangan. Terakhir diperbarui Juni 2026.*
