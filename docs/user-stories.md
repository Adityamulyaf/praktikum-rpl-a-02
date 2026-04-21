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

**Acceptance Criteria:**
* **Given** saya berada di halaman utama HaloMBG, **When** saya mengetikkan nama sekolah atau kabupaten di kolom pencarian dan menekan enter, **Then** sistem menampilkan dapur MBG yang terkait beserta profil singkat dan link ke halaman detailnya.

### US-05 — Menginput Menu Harian
**Sebagai** Pihak SPPG, **saya ingin** menginput menu makanan harian beserta klaim kandungan nutrisinya (kalori, protein, karbohidrat, lemak), **agar** publik dapat memantau apa yang akan atau telah disajikan kepada penerima MBG.

**Acceptance Criteria:**
* **Given** saya telah login dan membuka form input menu, **When** saya mengisi nama menu, komponen makanan, dan nilai nutrisi lalu menekan tombol simpan, **Then** menu tersebut tersimpan dan ditampilkan di halaman monitoring menu publik pada tanggal yang sesuai.

### US-06 — Validasi Nutrisi oleh AI
**Sebagai** Pihak SPPG, **saya ingin** mendapatkan peringatan otomatis dari sistem AI jika klaim kandungan nutrisi yang saya masukkan terlihat tidak wajar berdasarkan foto makanan yang saya unggah, **agar** saya dapat memperbaiki data sebelum dipublikasikan dan menghindari informasi gizi yang menyesatkan.

**Acceptance Criteria:**
* **Given** saya telah mengisi form menu dengan klaim nutrisi dan mengunggah foto makanan, **When** saya menekan tombol simpan dan AI menganalisis foto lalu mendeteksi ketidakwajaran (misalnya klaim kalori yang sangat tinggi tidak sebanding dengan porsi atau jenis makanan yang terlihat di foto), **Then** sistem menampilkan peringatan spesifik yang menjelaskan aspek mana yang dinilai tidak wajar secara visual, bukan sebagai hasil analisis lab, dan saya diminta merevisi atau mengonfirmasi data sebelum publikasi.
* **Given** saya mengunggah foto makanan dan AI tidak menemukan ketidakwajaran yang signifikan, **When** proses analisis selesai, **Then** sistem menampilkan indikator "Nutrisi Tervalidasi AI" pada menu yang dipublikasikan.

### US-07 — Memantau Status Distribusi MBG
**Sebagai** Pemantau Publik, **saya ingin** melihat status distribusi MBG harian per dapur dan per sekolah (siap diantar/sudah diantar/belum diantar/batal), **agar** saya dapat memastikan penerima manfaat mendapatkan hak mereka setiap harinya.

**Acceptance Criteria:**
* **Given** saya membuka halaman status distribusi suatu dapur pada hari tertentu, **When** halaman berhasil dimuat, **Then** sistem menampilkan daftar sekolah dengan status distribusi masing-masing beserta timestamp pembaruan terakhir dan foto bukti pengiriman (jika sudah diunggah oleh SPPG).

### US-08 — Memperbarui Status Distribusi (SPPG)
**Sebagai** Pihak SPPG, **saya ingin** memperbarui status distribusi makanan ke setiap sekolah dan mengunggah foto bukti pengiriman, **agar** distribusi yang saya lakukan terdokumentasi secara transparan dan dapat diverifikasi publik.

**Acceptance Criteria:**
* **Given** saya telah login dan membuka dashboard distribusi harian, **When** saya mengubah status pengiriman ke suatu sekolah menjadi "Sudah Diantar" dan mengunggah foto bukti, **Then** status terupdate secara real-time di halaman publik beserta foto dan timestamp pengiriman.

### US-09 — Memberikan Ulasan dan Foto Makanan
**Sebagai** Siswa, **saya ingin** memberikan ulasan harian tentang makanan MBG yang saya terima, disertai foto sebagai bukti, **agar** ada wadah resmi untuk menyampaikan pengalaman saya dan memverifikasi kesesuaian menu yang dipublikasikan.

**Acceptance Criteria:**
* **Given** saya telah login sebagai siswa dan MBG telah terdistribusi hari ini, **When** saya mengisi form ulasan dengan teks dan mengunggah foto makanan lalu mengirim, **Then** ulasan saya langsung tampil di halaman publik dengan nama dan timestamp, sementara guru di sekolah saya menerima notifikasi ulasan baru.

### US-10 — Moderasi Post-Publish Ulasan oleh Guru
**Sebagai** Guru, **saya ingin** dapat menandai (*flag*) ulasan siswa yang sudah tampil di publik jika kontennya tidak pantas atau menyesatkan, **agar** kualitas konten di platform tetap terjaga tanpa menghambat partisipasi siswa.

**Acceptance Criteria:**
* **Given** sebuah ulasan siswa sudah tampil di halaman publik, **When** saya login sebagai guru dan mengklik tombol "Flag" pada ulasan tersebut dengan menyertakan alasan, **Then** ulasan ditandai untuk ditinjau oleh admin dan muncul label peringatan sementara di halaman publik hingga keputusan admin dikeluarkan.
* **Given** saya menilai sebuah ulasan melanggar pedoman komunitas, **When** saya mengklik tombol "Hapus" dan mengisi alasan penghapusan, **Then** ulasan langsung tidak tampil di halaman publik dan siswa menerima notifikasi beserta alasan penghapusannya.

### US-11 — Melihat Ringkasan Evaluasi Dapur
**Sebagai** Pemantau Publik, **saya ingin** melihat ringkasan evaluasi sentimen harian atas ulasan yang masuk untuk suatu dapur MBG, **agar** saya dapat dengan cepat menilai kualitas dan konsistensi pelayanan dapur tersebut dari waktu ke waktu.

**Acceptance Criteria:**
* **Given** saya berada di halaman profil suatu dapur MBG, **When** saya membuka tab "Evaluasi", **Then** sistem menampilkan ringkasan analisis ulasan harian (positif/netral/negatif) beserta poin-poin utama yang sering disebut penerima, yang dihasilkan oleh sistem analisis AI.

### US-12 — Melihat Ringkasan Evaluasi Dapur sebagai Bahan Evaluasi Internal (SPPG)
**Sebagai** Pihak SPPG, **saya ingin** melihat ringkasan evaluasi sentimen ulasan penerima MBG di dapur saya secara lebih terperinci, **agar** saya dapat mengidentifikasi masalah spesifik per sekolah dan memperbaiki kualitas layanan dapur dari waktu ke waktu.

**Acceptance Criteria:**
* **Given** saya telah login sebagai SPPG dan membuka dashboard dapur saya, **When** saya membuka tab "Evaluasi", **Then** sistem menampilkan ringkasan sentimen (positif/netral/negatif) yang dilengkapi dengan breakdown per sekolah dan rekap historis per minggu sebagai bahan evaluasi internal dapur.

### US-13 — Pengelolaan Master Data SPPG & Sekolah
**Sebagai** Administrator, **saya ingin** dapat mendaftarkan akun SPPG baru dan memetakan sekolah-sekolah yang mereka layani, **agar** struktur operasional dan distribusi dalam sistem terbentuk dengan benar sebelum program dimulai.

**Acceptance Criteria:**
* **Given** saya telah login sebagai Admin, **When** saya menginput data dapur (SPPG) baru dan memilih daftar sekolah dari database, **Then** sistem menyimpan relasi tersebut dan memberikan akses login kepada pihak SPPG terkait.

### US-14 — Notifikasi Keterlambatan Distribusi
**Sebagai** Administrator atau Guru, **saya ingin** menerima peringatan otomatis jika suatu SPPG belum memperbarui status distribusi hingga batas waktu yang ditentukan (pukul 11.00 WIB), **agar** saya dapat segera melakukan pengecekan langsung ke pihak dapur dan memastikan penerima manfaat tidak terdampak.

**Acceptance Criteria:**
* **Given** waktu sistem menunjukkan pukul 11.00 WIB, **When** ada sekolah yang status distribusinya masih "Belum Diantar", **Then** sistem secara otomatis mengirimkan notifikasi peringatan melalui WhatsApp kepada Admin pusat dan Guru di sekolah tersebut, disertai informasi nama sekolah dan nama dapur yang bersangkutan.
* **Given** notifikasi keterlambatan telah terkirim, **When** Admin atau Guru membuka dashboard, **Then** daftar sekolah yang terlambat distribusinya ditampilkan secara khusus sebagai bahan tindak lanjut dan evaluasi.

### US-15 — Notifikasi Peringatan Ulasan Negatif/Kritis
**Sebagai** Pihak SPPG, **saya ingin** menerima notifikasi instan jika ada siswa yang memberikan ulasan dengan sentimen sangat negatif (misalnya indikasi makanan tidak layak), serta dapat memperbarui status tindak lanjut atas ulasan tersebut, **agar** saya dapat segera melakukan investigasi dan perbaikan kualitas pada hari yang sama.

**Acceptance Criteria:**
* **Given** seorang siswa mengirimkan ulasan, **When** sistem analisis AI mendeteksi sentimen negatif yang ekstrem atau kata kunci kritis (misalnya: "basi", "bau"), **Then** sistem mengirimkan notifikasi real-time ke dashboard SPPG dan ulasan tersebut muncul di daftar "Ulasan Perlu Tindak Lanjut" dengan status awal **Belum Diproses**.
* **Given** SPPG menerima notifikasi ulasan kritis dan membuka detail ulasan tersebut, **When** SPPG memperbarui status tindak lanjut menjadi **Dalam Proses Tindak Lanjut** atau **Selesai** disertai catatan penanganan, **Then** sistem menyimpan perubahan status beserta catatan tersebut, dan status terbaru ditampilkan di panel tindak lanjut SPPG sebagai dokumentasi investigasi.