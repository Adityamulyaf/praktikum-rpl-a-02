# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

*Software Requirements Specification* (SRS) ini disusun untuk memberikan gambaran yang jelas mengenai kebutuhan teknis dan fungsional dalam pengembangan platform HaloMBG, sistem monitoring berbasis web untuk Program Makan Bergizi Gratis (MBG). Tujuan utama dari dokumen ini adalah:

- Menjadi panduan utama bagi tim pengembang (Frontend & Backend) dalam mengimplementasikan fitur.
- Menjadi acuan dalam proses pengujian sistem (testing) untuk memastikan fitur yang dibangun sesuai dengan perencanaan.
- Berfungsi sebagai kesepakatan tertulis antar anggota tim mengenai batasan dan ruang lingkup proyek.

### 1.2 Ruang Lingkup

HaloMBG adalah platform web yang memungkinkan:

- Pemantau publik (orang tua, masyarakat, pemerintah) mengakses informasi profil dapur MBG, menu harian, kandungan nutrisi, dan status distribusi secara transparan tanpa perlu login.
- SPPG (Satuan Pelayanan Pemenuhan Gizi) mengelola profil dapur, menginput menu harian beserta foto, dan memperbarui status distribusi.
- Sistem AI memvalidasi kesesuaian antara klaim nutrisi yang diinput SPPG dengan foto makanan yang diunggah.
- Siswa memberikan ulasan harian disertai foto sebagai bentuk partisipasi komunitas.
- Guru memoderasi konten ulasan yang tidak pantas.
- Administrator mengelola master data SPPG dan sekolah.

Platform ini tidak mencakup: sistem pemesanan bahan baku, pengelolaan anggaran dapur, penggajian, atau integrasi dengan sistem pemerintah lainnya di luar lingkup program MBG.

### 1.3 Definisi dan Akronim

| Akronim | Kepanjangan / Keterangan |
|---------|--------------------------|
| `SRS` | Software Requirements Specification. |
| `MBG` | Makan Bergizi Gratis. |
| `SPPG` | Satuan Pelayanan Pemenuhan Gizi (unit dapur resmi yang memproduksi dan mendistribusikan makanan MBG). |
| `FR` | Functional Requirement (kebutuhan fungsional sistem). |
| `NFR` | Non-Functional Requirement (kebutuhan non-fungsional sistem). |
| `AI` | Artificial Intelligence (sistem kecerdasan buatan untuk validasi nutrisi dan analisis sentimen). |
| `Dashboard` | Halaman utama yang menampilkan ringkasan data dalam bentuk grafik atau tabel. |
| `Badge` | Label visual pada menu yang telah lolos validasi AI. |
| `WhatsApp` | Aplikasi pesan instan yang digunakan sebagai kanal notifikasi dalam sistem ini. |

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk

HaloMBG merupakan sistem web baru yang berdiri sendiri (standalone), tidak menggantikan sistem yang sudah ada. Platform ini hadir untuk menjembatani kesenjangan informasi antara pengelola program MBG (SPPG) dan publik penerima manfaat. Sistem dibangun menggunakan Laravel (backend), ReactJS (frontend), dan PostgreSQL (database), dengan integrasi layanan AI eksternal untuk fitur validasi nutrisi dan analisis sentimen.

### 2.2 Fungsi Produk

Fungsi utama HaloMBG mencakup:

| Fungsi | Deskripsi |
|--------|-----------|
| Direktori & Profil Dapur | Halaman publik yang menampilkan daftar dan detail setiap dapur SPPG beserta sekolah yang dilayani. |
| Monitoring Menu Harian | Tampilan publik menu makanan yang diinput SPPG per hari, dilengkapi informasi nutrisi dan status validasi AI. |
| Validasi Nutrisi Berbasis AI | Analisis otomatis kesesuaian foto makanan dengan klaim nutrisi yang diinput SPPG. |
| Tracking Status Distribusi | Pembaruan dan tampilan real-time status pengiriman makanan ke setiap sekolah. |
| Ulasan Komunitas | Fasilitas bagi siswa untuk mengirim ulasan harian dengan foto, beserta mekanisme moderasi oleh guru. |
| Evaluasi Berbasis AI | Ringkasan sentimen ulasan harian per dapur untuk konsumsi publik dan internal SPPG. |
| Manajemen Master Data | Panel admin untuk mendaftarkan SPPG dan memetakan sekolah. |

### 2.3 Karakteristik Pengguna

| Role | Karakteristik |
|------|---------------|
| Administrator | Pengguna teknis dengan akses penuh ke master data; familiar dengan antarmuka manajemen data; jumlah terbatas. |
| SPPG | Pengguna non-teknis yang mengoperasikan dapur; perlu antarmuka input yang sederhana; bisa dari berbagai latar belakang. |
| Siswa | Pengguna muda usia sekolah; terbiasa dengan aplikasi mobile; membutuhkan antarmuka yang intuitif. |
| Guru | Pengguna dengan kemampuan teknologi menengah; memerlukan fitur moderasi yang mudah digunakan. |
| Pemantau Publik | Pengguna umum tanpa login; memerlukan akses informasi yang cepat dan mudah dipahami. |

### 2.4 Batasan Sistem

Pengembangan platform ini memiliki beberapa batasan sebagai berikut:

- Sistem hanya mendukung akses melalui web browser (desktop dan mobile), tidak tersedia aplikasi native iOS/Android pada fase ini. Antarmuka wajib responsif di semua ukuran layar.
- Validasi nutrisi AI bergantung pada ketersediaan layanan AI eksternal, jika layanan tidak tersedia, input menu tetap dapat disimpan tanpa validasi AI.
- Koneksi internet diperlukan untuk semua operasi, sistem tidak mendukung mode offline.
- Kapasitas upload foto dibatasi maksimum 5 MB per file.
- Notifikasi sementara menggunakan WhatsApp sebagai kanal utama.

---

## 3. Kebutuhan Fungsional

Seluruh Functional Requirement (FR) di bawah diturunkan dari user stories yang telah disepakati pada P2. FR dengan prioritas High berasal dari backlog Must-have (BL-01 s.d. BL-06); FR dengan prioritas Medium berasal dari backlog Should-have (BL-07 s.d. BL-08).

### 3.1 Autentikasi dan Manajemen Role

#### FR-01: Autentikasi Multi-Role

| | |
|---|---|
| **Deskripsi** | Sistem menyediakan mekanisme login yang memvalidasi kredensial pengguna (email dan password) dan mengarahkan pengguna ke dashboard yang sesuai dengan role-nya (Admin, SPPG, Siswa, atau Guru) secara otomatis setelah berhasil masuk. |
| **Prioritas** | `High` |
| **Ref** | US-01 |

#### FR-02: Kontrol Akses Berbasis Role

| | |
|---|---|
| **Deskripsi** | Sistem membatasi akses fitur berdasarkan role: SPPG hanya mengelola data dapur miliknya sendiri, Guru hanya memoderasi ulasan dari sekolah yang terhubung, dan Admin memiliki akses penuh ke seluruh master data. Setiap akses tidak sah menghasilkan respons HTTP 403. |
| **Prioritas** | `High` |
| **Ref** | US-01 |

#### FR-03: Akses Publik Tanpa Login

| | |
|---|---|
| **Deskripsi** | Sistem memungkinkan pengguna yang tidak memiliki akun (Pemantau Publik) untuk mengakses seluruh halaman monitoring: direktori dapur, profil SPPG, menu harian, status distribusi, dan ulasan siswa, tanpa perlu melakukan login atau registrasi. |
| **Prioritas** | `High` |
| **Ref** | US-01, US-02, US-07 |

---

### 3.2 Profil Dapur MBG dan Daftar Sekolah

#### FR-04: Tampilan Profil Publik Dapur

| | |
|---|---|
| **Deskripsi** | Sistem menampilkan halaman profil publik untuk setiap SPPG yang memuat nama dapur, alamat, wilayah kabupaten/kota, daftar sekolah yang dilayani, dan informasi contact person (nama dan nomor WhatsApp/email). |
| **Prioritas** | `High` |
| **Ref** | US-02 |

#### FR-05: Pengelolaan Profil Dapur oleh SPPG

| | |
|---|---|
| **Deskripsi** | Sistem memungkinkan SPPG yang telah login untuk mengedit data profil dapur miliknya (deskripsi, contact person, kapasitas produksi); perubahan langsung terlihat di halaman profil publik setelah disimpan. |
| **Prioritas** | `High` |
| **Ref** | US-03 |

---

### 3.3 Pencarian SPPG

#### FR-06: Pencarian Dapur Berdasarkan Sekolah atau Wilayah

| | |
|---|---|
| **Deskripsi** | Sistem menyediakan kolom pencarian di halaman utama yang memungkinkan pengguna menemukan dapur MBG yang relevan dengan memasukkan nama sekolah atau nama kabupaten/kota. Hasil pencarian menampilkan profil singkat dapur beserta tautan ke halaman detailnya. |
| **Prioritas** | `High` |
| **Ref** | US-04 |

---

### 3.4 Input Menu Harian

#### FR-07: Input Menu Harian oleh SPPG

| | |
|---|---|
| **Deskripsi** | Sistem menyediakan formulir bagi SPPG yang telah login untuk menginput menu makanan harian, termasuk nama menu, komponen makanan, nilai nutrisi (kalori, protein, karbohidrat, lemak), dan wajib menyertakan foto makanan. Menu yang tersimpan ditampilkan otomatis di halaman monitoring menu publik pada tanggal yang sesuai, beserta riwayat menu yang dapat dilihat berdasarkan tanggal. |
| **Prioritas** | `High` |
| **Ref** | US-05 |

---

### 3.5 Validasi Nutrisi Berbasis AI

#### FR-08: Analisis AI dan Peringatan Ketidaksesuaian Nutrisi

| | |
|---|---|
| **Deskripsi** | Sistem secara otomatis menganalisis konsistensi antara klaim nutrisi yang diinput SPPG dan foto makanan yang diunggah menggunakan AI. Jika AI mendeteksi ketidaksesuaian signifikan, sistem menampilkan peringatan spesifik (menyebutkan aspek yang tidak wajar) dan meminta SPPG merevisi atau mengonfirmasi data sebelum dipublikasikan. Riwayat peringatan dan hasil validasi tersimpan untuk keperluan audit. |
| **Prioritas** | `High` |
| **Ref** | US-06 |

#### FR-09: Badge Validasi AI pada Menu Publik

| | |
|---|---|
| **Deskripsi** | Sistem menampilkan badge "Tervalidasi AI" pada menu yang lolos proses validasi tanpa ketidaksesuaian signifikan di halaman monitoring publik. |
| **Prioritas** | `High` |
| **Ref** | US-06 |

---

### 3.6 Panel Admin: Master Data SPPG & Sekolah

#### FR-10: Pengelolaan Master Data oleh Admin

| | |
|---|---|
| **Deskripsi** | Sistem menyediakan panel administrasi bagi Admin untuk mendaftarkan akun SPPG baru, menginput data dapur, memetakan sekolah-sekolah yang dilayani, serta mengelola hak akses seluruh pengguna. Setelah data SPPG disimpan, sistem memberikan akses login kepada SPPG terkait. Admin dapat menonaktifkan atau mengedit akun yang sudah ada, dan setiap perubahan master data dicatat dalam audit log. |
| **Prioritas** | `High` |
| **Ref** | US-13 |

---

### 3.7 Status Distribusi Harian dan Bukti Foto

#### FR-11: Pemantauan Status Distribusi (Publik)

| | |
|---|---|
| **Deskripsi** | Sistem menampilkan halaman status distribusi per dapur yang memuat daftar sekolah dengan empat kondisi status (Siap Diantar / Sudah Diantar / Belum Diantar / Batal), timestamp pembaruan terakhir, dan foto bukti pengiriman apabila sudah diunggah. |
| **Prioritas** | `Medium` |
| **Ref** | US-07 |

#### FR-12: Pembaruan Status Distribusi oleh SPPG

| | |
|---|---|
| **Deskripsi** | Sistem memungkinkan SPPG yang telah login untuk memperbarui status distribusi makanan ke setiap sekolah dan mengunggah foto bukti pengiriman; pembaruan langsung tampil secara real-time di halaman publik beserta timestamp. |
| **Prioritas** | `Medium` |
| **Ref** | US-08 |

---

### 3.8 Ulasan dan Foto dari Siswa

#### FR-13: Pengiriman Ulasan Harian oleh Siswa

| | |
|---|---|
| **Deskripsi** | Sistem menyediakan formulir bagi siswa yang telah login untuk memberikan ulasan harian tentang makanan MBG yang diterima, disertai teks dan foto sebagai bukti. Ulasan langsung tampil di halaman publik setelah dikirim beserta nama pengirim dan timestamp. Ulasan terhubung ke menu dan dapur yang sesuai pada hari tersebut. |
| **Prioritas** | `Medium` |
| **Ref** | US-09 |

#### FR-14: Notifikasi WhatsApp Ulasan Baru ke Guru

| | |
|---|---|
| **Deskripsi** | Sistem mengirimkan notifikasi WhatsApp secara otomatis kepada guru di sekolah yang sama ketika siswa mengirimkan ulasan baru. |
| **Prioritas** | `Medium` |
| **Ref** | US-09 |

#### FR-15: Moderasi Post-Publish Ulasan oleh Guru

| | |
|---|---|
| **Deskripsi** | Sistem memungkinkan guru yang telah login untuk menandai (flag) ulasan siswa yang sudah tampil di halaman publik jika kontennya tidak pantas atau menyesatkan, dengan menyertakan alasan. Ulasan yang di-flag mendapat label peringatan sementara hingga keputusan admin. |
| **Prioritas** | `Medium` |
| **Ref** | US-10 |

---

### 3.9 Notifikasi Otomatis Sistem

#### FR-16: Notifikasi WhatsApp Keterlambatan Distribusi

| | |
|---|---|
| **Deskripsi** | Sistem secara otomatis mengirimkan pesan WhatsApp kepada Admin dan Guru di sekolah terkait apabila status distribusi suatu sekolah masih "Belum Diantar" pada pukul 11.00 WIB. |
| **Prioritas** | `Medium` |
| **Ref** | US-14 |

#### FR-17: Notifikasi WhatsApp Ulasan Sangat Negatif ke SPPG

| | |
|---|---|
| **Deskripsi** | Sistem mengirimkan notifikasi WhatsApp real-time ke akun SPPG apabila AI mendeteksi ulasan siswa dengan sentimen sangat negatif atau kata kunci kritis (contoh: "basi", "bau"), agar SPPG dapat segera menindaklanjuti. |
| **Prioritas** | `Medium` |
| **Ref** | US-15 |

---

## 4. Kebutuhan Non-Fungsional

### 4.1 Performance

#### NFR-01: Waktu Muat Halaman Publik

| | |
|---|---|
| **Deskripsi** | Halaman publik utama (direktori dapur, profil SPPG, monitoring menu) harus termuat sepenuhnya dalam waktu kurang dari 3 detik pada koneksi broadband standar (≥ 10 Mbps), dan kurang dari 6 detik pada koneksi 4G standar (≥ 5 Mbps). |
| **Metode Verifikasi** | Pengujian menggunakan Google Lighthouse (target skor Performance ≥ 80) dan WebPageTest dengan simulasi koneksi 4G. |

#### NFR-02: Waktu Respons Pencarian

| | |
|---|---|
| **Deskripsi** | Fitur pencarian dapur berdasarkan nama sekolah atau wilayah harus menghasilkan respons dan menampilkan hasil dalam waktu kurang dari 2 detik sejak pengguna menekan enter, untuk basis data hingga 1000 entri dapur/sekolah. |
| **Metode Verifikasi** | Pengujian fungsional dengan DevTools Network tab menggunakan dataset dummy 1000 entri; diulangi 10 kali dan rata-rata harus ≤ 2 detik. |

#### NFR-03: Respons API

| | |
|---|---|
| **Deskripsi** | Respons API untuk endpoint pencarian dan pengambilan data menu harian harus berada di bawah 1,5 detik untuk 95% dari total request dalam kondisi beban normal (hingga 100 pengguna konkuren). |
| **Metode Verifikasi** | Load testing menggunakan k6 dengan simulasi 100 pengguna konkuren selama 5 menit; laporan persentil ke-95 harus ≤ 1,5 detik. |

---

### 4.2 Security

#### NFR-04: Penyimpanan Kata Sandi

| | |
|---|---|
| **Deskripsi** | Seluruh kata sandi pengguna tidak boleh disimpan dalam bentuk plain text. Kata sandi wajib di-hash menggunakan algoritma bcrypt dengan cost factor minimum 10. |
| **Metode Verifikasi** | Inspeksi kolom password di tabel users — nilai yang tersimpan harus berformat hash bcrypt (diawali `$2y$`), bukan teks yang dapat dibaca. |

#### NFR-05: Kontrol Akses Berbasis Role

| | |
|---|---|
| **Deskripsi** | Setiap endpoint yang memerlukan autentikasi hanya dapat diakses oleh pengguna dengan role yang sesuai. Akses lintas role menghasilkan respons HTTP 403 Forbidden. Token sesi memiliki masa berlaku maksimum 24 jam. |
| **Metode Verifikasi** | Pengujian penetrasi manual dengan mencoba akses endpoint terlarang menggunakan token role berbeda; setiap percobaan harus mengembalikan HTTP 403. |

#### NFR-06: Enkripsi Koneksi

| | |
|---|---|
| **Deskripsi** | Seluruh komunikasi antara klien dan server harus menggunakan HTTPS (TLS 1.2 atau lebih baru). Akses melalui HTTP harus dialihkan otomatis ke HTTPS dengan redirect 301. |
| **Metode Verifikasi** | Verifikasi dengan SSL Labs, rating minimum A; koneksi HTTP harus mendapat redirect 301 ke HTTPS. |

---

### 4.3 Usability

#### NFR-07: Responsivitas Antarmuka Web

| | |
|---|---|
| **Deskripsi** | Seluruh halaman utama HaloMBG harus dapat ditampilkan dan digunakan dengan baik pada perangkat mobile dengan lebar layar minimum 375px (setara iPhone SE) tanpa horizontal scrolling dan tanpa elemen yang terpotong, menggunakan pendekatan responsive design berbasis web. |
| **Metode Verifikasi** | Pengujian menggunakan Chrome DevTools Device Toolbar pada preset iPhone SE (375×667px) dan Samsung Galaxy S8+ (360×740px); tidak boleh ada horizontal scroll dan semua elemen interaktif dapat diklik. |

#### NFR-08: Kemudahan Tugas Inti SPPG

| | |
|---|---|
| **Deskripsi** | Tugas inti SPPG yakni menginput menu harian beserta foto dan menyimpannya, harus dapat diselesaikan pengguna baru dalam waktu kurang dari 5 menit tanpa bantuan teknis, diukur pada skenario penggunaan pertama. |
| **Metode Verifikasi** | Usability testing dengan 3 pengguna SPPG baru, rata-rata waktu penyelesaian harus ≤ 5 menit. |

---

### 4.4 Reliability

#### NFR-09: Ketersediaan Sistem

| | |
|---|---|
| **Deskripsi** | Sistem harus tersedia minimal 99% dari total waktu operasional setiap bulan kalender (downtime maks ±7 jam/bulan), tidak termasuk jendela maintenance terjadwal yang diumumkan minimal 24 jam sebelumnya. |
| **Metode Verifikasi** | Pemantauan uptime menggunakan UptimeRobot atau Better Uptime; laporan uptime bulanan yang dapat diaudit. |

---

### 4.5 Maintainability

#### NFR-10: Standar Penulisan Kode

| | |
|---|---|
| **Deskripsi** | Seluruh kode PHP (Laravel) harus mengikuti PSR-12 coding standard, dan kode JavaScript (ReactJS) harus mengikuti konfigurasi ESLint yang disepakati tim. Tidak ada error atau warning yang diabaikan pada saat merge ke branch dev. |
| **Metode Verifikasi** | CI/CD pipeline menjalankan PHP CS Fixer dan ESLint secara otomatis pada setiap Pull Request; merge diblokir jika ada pelanggaran. |

---

## 5. Catatan dan Asumsi

### 5.1 Asumsi Sistem

| Asumsi | Keterangan |
|--------|------------|
| **Koneksi Internet** | Seluruh pengguna diasumsikan memiliki akses internet yang memadai (minimal 4G untuk fitur dengan upload foto) selama menggunakan platform. Sistem tidak dirancang untuk mode offline. |
| **Ketersediaan API AI** | Fitur validasi nutrisi dan analisis sentimen bergantung pada layanan API AI eksternal. Kegagalan layanan AI tidak boleh menghentikan operasional inti sistem (input menu tetap bisa disimpan tanpa label validasi AI). |
| **Data Sekolah** | Data nama dan wilayah sekolah akan disediakan oleh tim dalam bentuk dataset awal (CSV) untuk keperluan pengembangan dan pengujian. |
| **Nomor WhatsApp** | Nomor telepon yang terdaftar pada akun SPPG dan Guru diasumsikan adalah nomor aktif WhatsApp untuk keperluan notifikasi. Jika nomor tidak valid, notifikasi dianggap gagal terkirim dan dicatat dalam log sistem. |
| **Satu Siswa, Satu Sekolah** | Setiap akun siswa hanya terhubung dengan satu sekolah pada satu waktu. Perpindahan sekolah memerlukan pembaruan data oleh Admin. |
| **Kualitas Foto** | Akurasi analisis AI bergantung pada kualitas foto yang diunggah. Sistem tidak dapat menjamin akurasi 100% pada foto yang buram, gelap, atau diambil dari sudut tidak representatif. |

### 5.2 Dependensi Eksternal

- Layanan AI eksternal (untuk validasi nutrisi dan analisis sentimen) harus diidentifikasi sebelum implementasi fitur terkait.
- Infrastruktur hosting (VPS/cloud) dengan dukungan HTTPS dan kapasitas penyimpanan file memadai harus tersedia sebelum deployment.
- Layanan WhatsApp Business API (atau alternatif seperti Fonnte/WA Gateway) harus disetup dan diuji sebelum fitur notifikasi dapat diimplementasikan.
- Database sekolah dan wilayah kabupaten/kota yang akurat dan komprehensif diperlukan sebelum fitur pencarian dapat diuji sepenuhnya.

### 5.3 Keterbatasan Teknis

- Validasi nutrisi AI bersifat indikatif, bukan pengganti penilaian ahli gizi. Badge "Tervalidasi AI" tidak menjamin keakuratan absolut kandungan gizi.
- Analisis sentimen ulasan bersifat otomatis dan dapat menghasilkan klasifikasi tidak akurat pada teks ambigu, sarkasme, atau bahasa daerah.
- Fitur foto bukti distribusi memerlukan koneksi yang cukup untuk upload; pada koneksi lambat, ukuran maksimum foto 5 MB mungkin menyebabkan waktu upload yang lama.

### 5.4 Di Luar Ruang Lingkup (Out of Scope)

- Integrasi dengan sistem data pemerintah (Dapodik, SIAK, Kemendikbud) tidak termasuk dalam scope MVP.
- Manajemen anggaran, biaya operasional, dan pengadaan bahan baku dapur MBG tidak dikelola dalam platform ini.
- Aplikasi mobile native (Android/iOS) tidak termasuk dalam scope, platform berbasis web responsive.
- Notifikasi melalui email dan SMS tidak termasuk dalam fase ini, saat ini menggunakan WhatsApp sebagai kanal tunggal.
- Laporan analitik tingkat lanjut (BI/data warehouse) tidak termasuk dalam scope MVP.