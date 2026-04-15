# User Stories - HaloMBG

## 1. Identifikasi Aktor / Role Pengguna

* **Administrator (Sistem/Pusat)**
  Pihak otoritas yang bertanggung jawab mengelola data induk (*master data*) sistem, melakukan validasi pendaftaran dapur baru, memetakan sekolah ke dapur terkait, serta mengelola hak akses pengguna secara menyeluruh.
* **Pihak SPPG (Operator Dapur MBG)**
  Pengelola resmi dapur MBG yang bertanggung jawab menginput profil dapur, menu harian beserta klaim nutrisi dan foto makanan, serta status distribusi. Profil SPPG dibuat oleh Admin, namun SPPG dapat mengedit data operasionalnya sendiri setelah login.
* **Siswa (Penerima Manfaat MBG)**
  Pelajar yang menerima makanan MBG secara langsung di sekolah. Dapat memberikan ulasan harian dan mengunggah foto makanan yang diterima sebagai bukti kesesuaian menu. Ulasan langsung tampil ke publik setelah dikirim.
* **Guru (Moderator Konten)**
  Tenaga pendidik di sekolah penerima MBG. Dapat menandai (*flag*) ulasan siswa yang sudah tampil di publik jika kontennya tidak pantas atau menyesatkan, tanpa menghalangi partisipasi siswa.
* **Pemantau Publik (Orang Tua, Pemerintah & Masyarakat)**
  Pengguna umum yang tidak terlibat langsung dalam operasional MBG, tetapi memiliki kepentingan untuk memantau transparansi, kualitas, dan pemerataan distribusi program. Dapat mengakses seluruh halaman monitoring tanpa login.

---

## 2. Daftar User Story

### US-01 — Login dan Akses Sesuai Role
**Sebagai** pengguna terdaftar (SPPG, Siswa, atau Guru), **saya ingin** dapat login ke platform dan langsung diarahkan ke dashboard sesuai role saya, **agar** saya hanya dapat mengakses fitur yang relevan dengan peran saya dalam program MBG.

**Acceptance Criteria:**
* **Given** saya membuka halaman login dan memasukkan kredensial yang valid, **When** saya menekan tombol masuk, **Then** sistem mengenali role saya dan mengarahkan saya ke dashboard yang sesuai (dashboard SPPG, siswa, atau guru).
* **Given** saya adalah pengguna publik yang tidak login, **When** saya mengakses halaman monitoring menu, profil dapur, atau status distribusi, **Then** seluruh konten publik tetap dapat diakses tanpa perlu login.

### US-02 — Melihat Profil Dapur MBG
**Sebagai** Pemantau Publik, **saya ingin** melihat profil lengkap setiap dapur MBG (SPPG) beserta daftar sekolah yang dilayani dan contact person-nya, **agar** saya dapat mengetahui dapur mana yang bertanggung jawab atas sekolah tertentu dan kepada siapa keluhan dapat disampaikan.

**Acceptance Criteria:**
* **Given** saya berada di halaman direktori SPPG, **When** saya mengklik salah satu kartu dapur MBG, **Then** sistem menampilkan halaman profil yang berisi nama dapur, alamat, wilayah kabupaten/kota, daftar sekolah yang dilayani, dan informasi contact person (nama, nomor telepon/email).

### US-03 — Mengelola Profil Dapur (SPPG)
**Sebagai** Pihak SPPG, **saya ingin** dapat mengedit informasi profil dapur saya (deskripsi, contact person, kapasitas produksi), **agar** data yang ditampilkan kepada publik selalu akurat dan terkini.

**Acceptance Criteria:**
* **Given** saya telah login sebagai SPPG dan membuka halaman profil dapur saya, **When** saya mengubah informasi contact person lalu menyimpan perubahan, **Then** sistem menyimpan data terbaru dan perubahan langsung terlihat di halaman profil publik.

### US-04 — Mencari Dapur Berdasarkan Wilayah atau Sekolah
**Sebagai** Orang Tua, **saya ingin** mencari dapur MBG yang melayani sekolah anak saya cukup dengan memasukkan nama sekolah atau kabupaten, **agar** saya langsung menemukan informasi yang relevan tanpa harus menelusuri seluruh daftar dapur.

**Acceptance Criteria:**  **Given** saya berada di halaman utama HaloMBG, **When** saya mengetikkan nama sekolah atau kabupaten di kolom pencarian dan menekan enter, **Then** sistem menampilkan dapur MBG yang terkait beserta profil singkat dan link ke halaman detailnya.

### US-05 — Menginput Menu Harian
**Sebagai** Pihak SPPG, **saya ingin** menginput menu makanan harian beserta klaim kandungan nutrisinya (kalori, protein, karbohidrat, lemak), **agar** publik dapat memantau apa yang akan atau telah disajikan kepada penerima MBG.

**Acceptance Criteria:**
* **Given** saya telah login dan membuka form input menu, **When** saya mengisi nama menu, komponen makanan, dan nilai nutrisi lalu menekan tombol simpan, **Then** menu tersebut tersimpan dan ditampilkan di halaman monitoring menu publik pada tanggal yang sesuai.

### US-06 — Validasi Nutrisi oleh AI
**Sebagai** Pihak SPPG, **saya ingin** mendapatkan peringatan otomatis dari sistem AI jika kandungan nutrisi yang saya klaim tidak konsisten dengan foto makanan yang saya unggah, **agar** saya dapat memperbaiki data sebelum dipublikasikan dan menghindari informasi gizi yang menyesatkan.

**Acceptance Criteria:**
* **Given** saya telah mengisi form menu dengan klaim nutrisi dan mengunggah foto makanan, **When** saya menekan tombol simpan dan AI menganalisis foto lalu mendeteksi ketidaksesuaian (misalnya kalori yang diklaim terlalu tinggi dibanding porsi yang terlihat di foto), **Then** sistem menampilkan peringatan spesifik yang menjelaskan aspek mana yang dinilai tidak wajar berdasarkan foto, dan saya diminta merevisi atau mengonfirmasi data sebelum publikasi.
* **Given** saya mengunggah foto makanan dan AI tidak menemukan ketidaksesuaian signifikan, **When** proses analisis selesai, **Then** sistem menampilkan indikator "Nutrisi Tervalidasi AI" pada menu yang dipublikasikan.
