# LAPORAN AKHIR TUGAS PRAKTIKUM BERSAMA
## REKAYASA PERANGKAT LUNAK (RPL)

# APLIKASI MONITORING PROGRAM MAKAN BERGIZI GRATIS
## (HaloMBG)






**NAMA TIM:** CEO MBG  
**KELAS:** Praktikum RPL A - Kelompok 02  




**ANGGOTA TIM:**
| Nama Lengkap | NIM | Peran Utama |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | Project Manager / Developer |
| Fairuz Shiba Alkhirza | L0124014 | Developer / PM / QA |
| Yashif Victoriawan | L0124124 | Developer / PM / QA |
| Nurman Aqil Wicaksono | L0124139 | QA/Docs / PM |






**PROGRAM STUDI INFORMATIKA**  
**FAKULTAS TEKNOLOGI INFORMASI DAN SAINS DATA**  
**UNIVERSITAS SEBELAS MARET**  
**2026**

---

\pagebreak


# BAB I: PENDAHULUAN

## 1.1 Latar Belakang dan Rumusan Masalah
Program Makan Bergizi Gratis (MBG) yang dijalankan oleh pemerintah Indonesia melibatkan ribuan Satuan Pelayanan Pemenuhan Gizi (SPPG) atau Dapur MBG yang tersebar di seluruh kabupaten/kota. Namun, hingga saat ini belum tersedia platform terpusat yang memungkinkan publik, termasuk siswa, orang tua, guru, dan masyarakat umum, untuk memantau secara transparan profil dapur, menu harian, kandungan nutrisi, serta status distribusi makanan. Akibatnya, informasi terkait MBG tersebar tidak merata, sulit diverifikasi, dan rentan terhadap penyimpangan yang tidak terdeteksi.

Di sisi lain, berbagai permasalahan operasional telah muncul di lapangan. Kandungan nutrisi yang dipublikasikan oleh dapur MBG kerap tidak akurat karena keterbatasan tenaga ahli gizi serta tidak adanya mekanisme verifikasi silang antara klaim nutrisi dan makanan yang benar-benar disajikan. Selain itu, menu yang diumumkan tidak selalu sesuai dengan yang diterima oleh siswa di sekolah, dan penerima manfaat belum memiliki wadah resmi yang aman untuk menyampaikan ulasan maupun keluhan.

**HaloMBG** hadir sebagai solusi monitoring berbasis web yang mengintegrasikan transparansi data, validasi nutrisi berbasis kecerdasan buatan (AI) melalui analisis foto dan teks, serta partisipasi komunitas. Platform ini bertujuan untuk memastikan program MBG berjalan sesuai standar, meningkatkan akuntabilitas, dan memberikan akses informasi yang terbuka bagi publik.

## 1.2 Tujuan Dokumen dan Proyek
Software Requirements Specification (SRS) ini disusun untuk memberikan gambaran yang jelas mengenai kebutuhan teknis dan fungsional dalam pengembangan platform **HaloMBG**: sistem monitoring berbasis web untuk Program Makan Bergizi Gratis (MBG).
 
Tujuan utama dokumen ini:
 
- Menjadi **panduan utama** bagi tim pengembang (Frontend & Backend) dalam mengimplementasikan fitur.
- Menjadi **acuan pengujian sistem** (testing) untuk memastikan fitur yang dibangun sesuai dengan perencanaan.
- Berfungsi sebagai **kesepakatan tertulis** antar anggota tim mengenai batasan dan ruang lingkup proyek.

## 1.3 Ruang Lingkup Proyek
HaloMBG adalah platform web yang memungkinkan:
 
- **Pemantau publik** (orang tua, masyarakat, pemerintah) mengakses informasi profil dapur MBG, menu harian, kandungan nutrisi, dan status distribusi secara transparan tanpa perlu login.
- **SPPG** (Satuan Pelayanan Pemenuhan Gizi) mengelola profil dapur, menginput menu harian beserta foto, dan memperbarui status distribusi.
- **Sistem AI** memvalidasi kewajaran antara klaim nutrisi yang diinput SPPG dengan foto makanan yang diunggah secara visual.
- **Siswa** memberikan ulasan harian disertai foto sebagai bentuk partisipasi komunitas.
- **Guru** memoderasi konten ulasan yang tidak pantas.
- **Administrator** mengelola master data SPPG dan sekolah.

**Platform ini tidak mencakup:** sistem pemesanan bahan baku, pengelolaan anggaran dapur, penggajian, atau integrasi dengan sistem pemerintah lainnya di luar lingkup program MBG.

## 1.4 Definisi dan Akronim
| Akronim / Istilah | Definisi |
|---|---|
| **SRS** | Software Requirements Specification |
| **MBG** | Makan Bergizi Gratis |
| **SPPG** | Satuan Pelayanan Pemenuhan Gizi, unit dapur resmi yang memproduksi dan mendistribusikan makanan MBG |
| **FR** | Functional Requirement (kebutuhan fungsional sistem) |
| **NFR** | Non-Functional Requirement (kebutuhan non-fungsional sistem) |
| **AI** | Artificial Intelligence, sistem kecerdasan buatan untuk validasi nutrisi |
| **Dashboard** | Halaman utama yang menampilkan ringkasan data dalam bentuk grafik atau tabel |
| **Badge** | Label visual pada menu yang telah lolos validasi AI |
| **WhatsApp** | Aplikasi pesan instan yang digunakan sebagai kanal notifikasi dalam sistem ini |


# BAB II: ANALISIS KEBUTUHAN SISTEM (SRS)

## 2.1 Deskripsi Umum Sistem
#### 2.1 Perspektif Produk
 
HaloMBG merupakan sistem web baru yang berdiri sendiri (*standalone*), tidak menggantikan sistem yang sudah ada. Platform ini hadir untuk menjembatani kesenjangan informasi antara pengelola program MBG (SPPG) dan publik penerima manfaat.
 
**Tech Stack:**
 
| Layer | Teknologi |
|---|---|
| Backend | Laravel (PHP) |
| Frontend | ReactJS |
| Database | PostgreSQL |
| AI Integration | Layanan AI eksternal (validasi nutrisi) |
 
#### 2.2 Fungsi Produk
 
| Fitur | Deskripsi |
|---|---|
| **Direktori & Profil Dapur** | Halaman publik yang menampilkan daftar dan detail setiap dapur SPPG beserta sekolah yang dilayani |
| **Monitoring Menu Harian** | Tampilan publik menu makanan yang diinput SPPG per hari, dilengkapi informasi nutrisi dan status validasi AI |
| **Validasi Nutrisi Berbasis AI** | Analisis otomatis ketidakwajaran visual antara foto makanan dengan klaim nutrisi yang diinput SPPG |
| **Tracking Status Distribusi** | Pembaruan dan tampilan real-time status pengiriman makanan ke setiap sekolah |
| **Ulasan Komunitas** | Fasilitas bagi siswa untuk mengirim ulasan harian dengan foto, beserta mekanisme moderasi oleh guru |
| **Evaluasi Berbasis AI** | Ringkasan sentimen ulasan harian per dapur untuk konsumsi publik (BL-13) |
| **Manajemen Master Data** | Panel admin untuk mendaftarkan SPPG dan memetakan sekolah |
| **Notifikasi Keterlambatan** | Peringatan otomatis kepada Admin dan Guru jika distribusi belum diperbarui hingga pukul 11.00 WIB |
| **Tindak Lanjut Ulasan Kritis** | Panel SPPG untuk mencatat dan memperbarui status penanganan ulasan negatif ekstrem |
 
#### 2.3 Karakteristik Pengguna
 
| Role | Karakteristik |
|---|---|
| **Administrator** | Pengguna teknis dengan akses penuh ke master data; familiar dengan antarmuka manajemen data; jumlah terbatas |
| **SPPG** | Pengguna non-teknis yang mengoperasikan dapur; perlu antarmuka input yang sederhana; bisa dari berbagai latar belakang |
| **Siswa** | Pengguna muda usia sekolah; terbiasa dengan aplikasi mobile; membutuhkan antarmuka yang intuitif |
| **Guru** | Pengguna dengan kemampuan teknologi menengah; memerlukan fitur moderasi yang mudah digunakan |
| **Pemantau Publik** | Pengguna umum tanpa login; memerlukan akses informasi yang cepat dan mudah dipahami |
 
#### 2.4 Batasan Sistem
 
- Sistem hanya mendukung akses melalui **web browser** (desktop dan mobile). Tidak tersedia aplikasi native iOS/Android pada fase ini. Antarmuka wajib responsif di semua ukuran layar.
- Validasi nutrisi AI bergantung pada ketersediaan layanan AI eksternal. Jika layanan tidak tersedia, input menu tetap dapat disimpan tanpa validasi AI.
- Koneksi internet diperlukan untuk semua operasi — **sistem tidak mendukung mode offline**.
- Kapasitas upload foto dibatasi maksimum **5 MB per file**.
- Notifikasi sementara menggunakan **WhatsApp** sebagai kanal utama.

## 2.2 Kebutuhan Fungsional (Functional Requirements)
> Seluruh Functional Requirement (FR) di bawah diturunkan dari user stories yang telah disepakati.
> - **Prioritas High**: berasal dari backlog Must-have (BL-01 s.d. BL-06)
> - **Prioritas Medium**: berasal dari backlog Should-have (BL-07 s.d. BL-09)
 
#### 3.1 Autentikasi dan Manajemen Role
 
##### FR-01 — Autentikasi Multi-Role
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-01 |
 
**Deskripsi:** Sistem menyediakan mekanisme login yang memvalidasi kredensial pengguna (email dan password) dan mengarahkan pengguna ke dashboard yang sesuai dengan role-nya (Admin, SPPG, Siswa, atau Guru) secara otomatis setelah berhasil masuk.
 
##### FR-02 — Kontrol Akses Berbasis Role
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-01 |
 
**Deskripsi:** Sistem membatasi akses fitur berdasarkan role:
- **SPPG** hanya mengelola data dapur miliknya sendiri.
- **Guru** hanya memoderasi ulasan dari sekolah yang terhubung.
- **Admin** memiliki akses penuh ke seluruh master data.
Setiap akses tidak sah menghasilkan respons **HTTP 403**.
 
##### FR-03 — Akses Publik Tanpa Login
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-01, US-02, US-07 |
 
**Deskripsi:** Sistem memungkinkan pengguna yang tidak memiliki akun (Pemantau Publik) untuk mengakses seluruh halaman monitoring — direktori dapur, profil SPPG, menu harian, status distribusi, dan ulasan siswa — tanpa perlu melakukan login atau registrasi.
 
#### 3.2 Profil Dapur MBG dan Daftar Sekolah
 
##### FR-04 — Tampilan Profil Publik Dapur
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-02 |
 
**Deskripsi:** Sistem menampilkan halaman profil publik untuk setiap SPPG yang memuat:
- Nama dapur dan alamat
- Wilayah kabupaten/kota
- Daftar sekolah yang dilayani
- Informasi contact person (nama dan nomor WhatsApp/email)
##### FR-05 — Pengelolaan Profil Dapur oleh SPPG
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-03 |
 
**Deskripsi:** Sistem memungkinkan SPPG yang telah login untuk mengedit data profil dapur miliknya (deskripsi, contact person, kapasitas produksi). Perubahan langsung terlihat di halaman profil publik setelah disimpan.
 
#### 3.3 Pencarian SPPG
 
##### FR-06 — Pencarian Dapur Berdasarkan Sekolah atau Wilayah
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-04 |
 
**Deskripsi:** Sistem menyediakan kolom pencarian di halaman utama yang memungkinkan pengguna menemukan dapur MBG yang relevan dengan memasukkan nama sekolah atau nama kabupaten/kota. Hasil pencarian menampilkan profil singkat dapur beserta tautan ke halaman detailnya.
 
#### 3.4 Input Menu Harian
 
##### FR-07 — Input Menu Harian oleh SPPG
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-05 |
 
**Deskripsi:** Sistem menyediakan formulir bagi SPPG yang telah login untuk menginput menu makanan harian, meliputi:
- Nama menu dan komponen makanan
- Nilai nutrisi: kalori, protein, karbohidrat, lemak
- Foto makanan (wajib)
Menu yang tersimpan ditampilkan otomatis di halaman monitoring menu publik pada tanggal yang sesuai, beserta riwayat menu yang dapat dilihat berdasarkan tanggal.
 
#### 3.5 Validasi Nutrisi Berbasis AI
 
##### FR-08 — Analisis AI dan Peringatan Ketidakwajaran Nutrisi
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-06 |
 
**Deskripsi:** Sistem secara otomatis menganalisis kewajaran antara klaim nutrisi yang diinput SPPG dan foto makanan yang diunggah menggunakan AI. Analisis dilakukan secara **visual** — bukan berdasarkan data laboratorium — dengan menilai apakah klaim nutrisi tampak tidak sebanding dengan porsi, jenis, atau komposisi makanan yang terlihat dalam foto. Jika AI mendeteksi ketidakwajaran yang signifikan:
- Sistem menampilkan **peringatan ketidakwajaran** yang spesifik, menyebutkan aspek visual mana yang dinilai tidak sebanding dengan klaim (misalnya: "Porsi yang terlihat di foto tampak kecil untuk klaim kalori sebesar X kkal").
- SPPG diminta merevisi atau mengonfirmasi data sebelum dipublikasikan.
- Riwayat peringatan dan hasil validasi tersimpan untuk keperluan audit.

##### FR-09 — Badge Validasi AI pada Menu Publik
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-06 |
 
**Deskripsi:** Sistem menampilkan badge **"Tervalidasi AI"** pada menu yang lolos proses validasi tanpa ketidakwajaran visual yang signifikan di halaman monitoring publik.
 
#### 3.6 Panel Admin: Master Data SPPG & Sekolah
 
##### FR-10 — Pengelolaan Master Data oleh Admin
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🔴 High |
| **Referensi** | US-12 |
 
**Deskripsi:** Sistem menyediakan panel administrasi bagi Admin untuk:
- Mendaftarkan akun SPPG baru dan menginput data dapur.
- Memetakan sekolah-sekolah yang dilayani oleh setiap SPPG.
- Mengelola hak akses seluruh pengguna.
- Menonaktifkan atau mengedit akun yang sudah ada.
Setelah data SPPG disimpan, sistem memberikan akses login kepada SPPG terkait. Setiap perubahan master data dicatat dalam **audit log**.
 
#### 3.7 Status Distribusi Harian dan Bukti Foto
 
##### FR-11 — Pemantauan Status Distribusi (Publik)
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-07 |
 
**Deskripsi:** Sistem menampilkan halaman status distribusi per dapur yang memuat:
- Daftar sekolah dengan empat kondisi status: `Siap Diantar` / `Sudah Diantar` / `Belum Diantar` / `Batal`
- Timestamp pembaruan terakhir
- Foto bukti pengiriman (jika sudah diunggah)
##### FR-12 — Pembaruan Status Distribusi oleh SPPG
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-08 |
 
**Deskripsi:** Sistem memungkinkan SPPG yang telah login untuk memperbarui status distribusi makanan ke setiap sekolah dan mengunggah foto bukti pengiriman. Pembaruan langsung tampil secara **real-time** di halaman publik beserta timestamp.
 
##### FR-13 — Notifikasi Keterlambatan Distribusi

| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-13 |

**Deskripsi:** Sistem secara otomatis memicu pemeriksaan status distribusi pada pukul **11.00 WIB** setiap hari. Apabila status distribusi suatu sekolah masih `Belum Diantar`, sistem mengirimkan notifikasi WhatsApp kepada Admin pusat dan Guru di sekolah terkait, disertai nama sekolah dan nama dapur yang bersangkutan. Daftar sekolah terlambat juga ditampilkan di dashboard Admin dan Guru sebagai bahan tindak lanjut. Kegagalan pengiriman notifikasi (misalnya nomor tidak valid) dicatat dalam log sistem.

#### 3.8 Ulasan dan Foto dari Siswa
 
##### FR-14 — Pengiriman Ulasan Harian oleh Siswa
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-09 |
 
**Deskripsi:** Sistem menyediakan formulir bagi siswa yang telah login untuk memberikan ulasan harian tentang makanan MBG yang diterima, disertai teks dan foto sebagai bukti. Ulasan langsung tampil di halaman publik setelah dikirim beserta nama pengirim dan timestamp. Ulasan terhubung ke menu dan dapur yang sesuai pada hari tersebut.
 
##### FR-15 — Notifikasi WhatsApp Ulasan Baru ke Guru
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-09 |
 
**Deskripsi:** Sistem mengirimkan notifikasi WhatsApp secara otomatis kepada guru di sekolah yang sama ketika siswa mengirimkan ulasan baru.
 
##### FR-16 — Moderasi Post-Publish Ulasan oleh Guru
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-10 |
 
**Deskripsi:** Sistem memungkinkan guru yang telah login untuk menandai (*flag*) ulasan siswa yang sudah tampil di halaman publik jika kontennya tidak pantas atau menyesatkan, dengan menyertakan alasan. Ulasan yang di-flag mendapat **label peringatan** sementara hingga keputusan admin.
 
#### 3.9 Notifikasi Otomatis Sistem
 
##### FR-17 — Notifikasi WhatsApp Ulasan Kritis ke SPPG
 
| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-14 |
 
**Deskripsi:** Sistem mengirimkan notifikasi real-time ke dashboard SPPG apabila ulasan siswa mengandung kata kunci kritis yang telah didefinisikan (contoh: *"basi"*, *"bau"*, *"busuk"*, *"tidak layak"*, *"kotor"*). Ulasan tersebut masuk ke daftar "Ulasan Perlu Tindak Lanjut" dengan status awal **Belum Diproses**.

##### FR-18 — Status Tindak Lanjut Ulasan Kritis oleh SPPG

| Atribut | Detail |
|---|---|
| **Prioritas** | 🟡 Medium |
| **Referensi** | US-14 |

**Deskripsi:** Sistem menyediakan panel tindak lanjut bagi SPPG untuk memperbarui status penanganan ulasan kritis. Status yang tersedia:
- **Belum Diproses** — status awal saat notifikasi masuk.
- **Dalam Proses Tindak Lanjut** — SPPG sedang melakukan investigasi.
- **Selesai** — penanganan telah dilakukan.

Setiap perubahan status dapat disertai catatan penanganan dari SPPG. Riwayat seluruh perubahan status tersimpan untuk keperluan audit dan evaluasi internal.

## 2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)
#### 4.1 Performance
 
##### NFR-01 — Waktu Muat Halaman Publik
 
**Deskripsi:** Halaman publik utama (direktori dapur, profil SPPG, monitoring menu) harus termuat sepenuhnya dalam:
- **< 3 detik** pada koneksi broadband standar (≥ 10 Mbps)
- **< 6 detik** pada koneksi 4G standar (≥ 5 Mbps)
**Metode Verifikasi:** Pengujian menggunakan Google Lighthouse (target skor Performance ≥ 80) dan WebPageTest dengan simulasi koneksi 4G.
 
##### NFR-02 — Waktu Respons Pencarian
 
**Deskripsi:** Fitur pencarian dapur harus menghasilkan respons dan menampilkan hasil dalam waktu **< 2 detik** sejak pengguna menekan enter, untuk basis data hingga 1.000 entri dapur/sekolah.
 
**Metode Verifikasi:** Pengujian fungsional dengan DevTools Network tab menggunakan dataset dummy 1.000 entri; diulangi 10 kali dan rata-rata harus ≤ 2 detik.
 
##### NFR-03 — Respons API
 
**Deskripsi:** Respons API untuk endpoint pencarian dan pengambilan data menu harian harus berada di bawah **1,5 detik** untuk 95% dari total request dalam kondisi beban normal (hingga 100 pengguna konkuren).
 
**Metode Verifikasi:** Load testing menggunakan k6 dengan simulasi 100 pengguna konkuren selama 5 menit; laporan persentil ke-95 harus ≤ 1,5 detik.
 
#### 4.2 Security
 
##### NFR-04 — Penyimpanan Kata Sandi
 
**Deskripsi:** Seluruh kata sandi pengguna tidak boleh disimpan dalam bentuk plain text. Kata sandi wajib di-hash menggunakan algoritma **bcrypt** dengan cost factor minimum 10.
 
**Metode Verifikasi:** Inspeksi kolom `password` di tabel `users`, nilai yang tersimpan harus berformat hash bcrypt (diawali `$2y$`), bukan teks yang dapat dibaca.
 
##### NFR-05 — Kontrol Akses Berbasis Role
 
**Deskripsi:** Setiap endpoint yang memerlukan autentikasi hanya dapat diakses oleh pengguna dengan role yang sesuai. Akses lintas role menghasilkan respons **HTTP 403 Forbidden**. Token sesi memiliki masa berlaku maksimum **24 jam**.
 
**Metode Verifikasi:** Pengujian penetrasi manual dengan mencoba akses endpoint terlarang menggunakan token role berbeda; setiap percobaan harus mengembalikan HTTP 403.
 
##### NFR-06 — Enkripsi Koneksi
 
**Deskripsi:** Seluruh komunikasi antara klien dan server harus menggunakan **HTTPS (TLS 1.2 atau lebih baru)**. Akses melalui HTTP harus dialihkan otomatis ke HTTPS dengan redirect 301.
 
**Metode Verifikasi:** Verifikasi dengan SSL Labs, rating minimum **A**; koneksi HTTP harus mendapat redirect 301 ke HTTPS.
 
#### 4.3 Usability
 
##### NFR-07 — Responsivitas Antarmuka Web
 
**Deskripsi:** Seluruh halaman utama HaloMBG harus dapat ditampilkan dan digunakan dengan baik pada perangkat mobile dengan lebar layar minimum **375px** (setara iPhone SE), tanpa horizontal scrolling dan tanpa elemen yang terpotong.
 
**Metode Verifikasi:** Pengujian menggunakan Chrome DevTools Device Toolbar pada:
- iPhone SE: 375×667px
- Samsung Galaxy S8+: 360×740px
Tidak boleh ada horizontal scroll dan semua elemen interaktif dapat diklik.
 
##### NFR-08 — Kemudahan Tugas Inti SPPG
 
**Deskripsi:** Tugas inti SPPG menginput menu harian beserta foto dan menyimpannya harus dapat diselesaikan pengguna baru dalam waktu **< 5 menit** tanpa bantuan teknis, diukur pada skenario penggunaan pertama.
 
**Metode Verifikasi:** Usability testing dengan 3 pengguna SPPG baru; rata-rata waktu penyelesaian harus ≤ 5 menit.
 
#### 4.4 Reliability
 
##### NFR-09 — Ketersediaan Sistem
 
**Deskripsi:** Sistem harus tersedia minimal **99%** dari total waktu operasional setiap bulan kalender (downtime maks ±7 jam/bulan), tidak termasuk jendela maintenance terjadwal yang diumumkan minimal 24 jam sebelumnya.
 
**Metode Verifikasi:** Pemantauan uptime menggunakan UptimeRobot atau Better Uptime; laporan uptime bulanan yang dapat diaudit.
 
#### 4.5 Maintainability
 
##### NFR-10 — Standar Penulisan Kode
 
**Deskripsi:**
- Seluruh kode **PHP (Laravel)** harus mengikuti **PSR-12** coding standard.
- Seluruh kode **JavaScript (ReactJS)** harus mengikuti konfigurasi **ESLint** yang disepakati tim.
- Tidak ada error atau warning yang diabaikan pada saat merge ke branch `dev`.
**Metode Verifikasi:** CI/CD pipeline menjalankan PHP CS Fixer dan ESLint secara otomatis pada setiap Pull Request; merge diblokir jika ada pelanggaran.

## 2.4 Catatan, Asumsi, dan Dependensi
#### 5.1 Asumsi Sistem
 
| Asumsi | Detail |
|---|---|
| **Koneksi Internet** | Seluruh pengguna diasumsikan memiliki akses internet yang memadai (minimal 4G untuk fitur dengan upload foto). Sistem tidak dirancang untuk mode offline. |
| **Ketersediaan API AI** | Kegagalan layanan AI tidak boleh menghentikan operasional inti sistem, input menu tetap bisa disimpan tanpa label validasi AI. |
| **Data Sekolah** | Data nama dan wilayah sekolah akan disediakan oleh tim dalam bentuk dataset awal (CSV) untuk keperluan pengembangan dan pengujian. |
| **Nomor WhatsApp** | Nomor telepon yang terdaftar pada akun SPPG dan Guru diasumsikan adalah nomor aktif WhatsApp. Jika nomor tidak valid, notifikasi dianggap gagal terkirim dan dicatat dalam log sistem. |
| **Satu Siswa, Satu Sekolah** | Setiap akun siswa hanya terhubung dengan satu sekolah pada satu waktu. Perpindahan sekolah memerlukan pembaruan data oleh Admin. |
| **Kualitas Foto** | Akurasi analisis AI bergantung pada kualitas foto yang diunggah. Sistem tidak dapat menjamin akurasi 100% pada foto yang buram, gelap, atau diambil dari sudut tidak representatif. |
| **Batasan Analisis Nutrisi AI** | Analisis AI bersifat visual dan indikatif, sistem hanya menilai ketidakwajaran berdasarkan penampakan makanan di foto, bukan berdasarkan komposisi kimia atau data laboratorium. |
 
#### 5.2 Dependensi Eksternal
 
- **Layanan AI eksternal** (untuk validasi nutrisi) harus diidentifikasi sebelum implementasi fitur terkait.
- **Infrastruktur hosting** (VPS/cloud) dengan dukungan HTTPS dan kapasitas penyimpanan file memadai harus tersedia sebelum deployment.
- **Layanan WhatsApp Business API** (atau alternatif seperti Fonnte/WA Gateway) harus disetup dan diuji sebelum fitur notifikasi dapat diimplementasikan.
- **Database sekolah dan wilayah** kabupaten/kota yang akurat dan komprehensif diperlukan sebelum fitur pencarian dapat diuji sepenuhnya.

#### 5.3 Keterbatasan Teknis
 
- Validasi nutrisi AI bersifat **indikatif berbasis visual**, bukan pengganti penilaian ahli gizi. Badge "Tervalidasi AI" tidak menjamin keakuratan absolut kandungan gizi, hanya menandakan tidak ada ketidakwajaran visual yang terdeteksi.
- Deteksi ulasan kritis menggunakan **pencocokan kata kunci** yang telah didefinisikan, sehingga ulasan yang menggunakan sinonim, ejaan tidak baku, atau bahasa daerah mungkin tidak terdeteksi secara otomatis.
- Fitur foto bukti distribusi memerlukan koneksi yang cukup untuk upload. Pada koneksi lambat, ukuran maksimum foto 5 MB mungkin menyebabkan waktu upload yang lama.

#### 5.4 Di Luar Ruang Lingkup (Out of Scope)

- Integrasi dengan sistem data pemerintah (Dapodik, SIAK, Kemendikbud) tidak termasuk dalam scope MVP.
- Manajemen anggaran, biaya operasional, dan pengadaan bahan baku dapur MBG tidak dikelola dalam platform ini.
- Aplikasi mobile native (Android/iOS) tidak termasuk dalam scope, platform berbasis web responsive.
- Notifikasi melalui email dan SMS tidak termasuk dalam fase ini, saat ini menggunakan WhatsApp sebagai kanal tunggal.
- Laporan analitik tingkat lanjut (BI/data warehouse) tidak termasuk dalam scope MVP.

## 2.5 Detail Backlog Kerja Kelompok
### Daftar Backlog

| ID | Judul | Prioritas | Estimasi | Dependensi |
|----|-------|-----------|----------|------------|
| [BL-01](#bl-01--sistem-autentikasi-dan-manajemen-role) | Sistem Autentikasi dan Manajemen Role | 🔴 Must-have | M | - |
| [BL-02](#bl-02--profil-dapur-mbg-sppg-dan-daftar-sekolah) | Profil Dapur MBG (SPPG) dan Daftar Sekolah | 🔴 Must-have | L | BL-01 |
| [BL-03](#bl-03--pencarian-sppg-melalui-wilayah-dan-nama-sekolah) | Pencarian SPPG melalui Wilayah dan Nama Sekolah | 🔴 Must-have | S | BL-02 |
| [BL-04](#bl-04--input-menu-harian-oleh-sppg) | Input Menu Harian oleh SPPG | 🔴 Must-have | M | BL-01, BL-02 |
| [BL-05](#bl-05--validasi-nutrisi-berbasis-ai-foto--teks) | Validasi Nutrisi Berbasis AI (Foto + Teks) | 🔴 Must-have | L | BL-04 |
| [BL-06](#bl-06--panel-admin-master-data-sppg--sekolah) | Panel Admin: Master Data SPPG & Sekolah  | 🔴 Must-have | M | BL-01 |
| [BL-07](#bl-07--status-distribusi-harian-dan-bukti-foto) | Status Distribusi Harian dan Bukti Foto | 🟠 Should-have | M | BL-01, BL-02 |
| [BL-08](#bl-08--notifikasi-keterlambatan-distribusi) | Notifikasi Keterlambatan Distribusi | 🟠 Should-have | S | BL-07 |
| [BL-09](#bl-09--ulasan-dan-foto-dari-siswa) | Ulasan dan Foto dari Siswa | 🟠 Should-have | M | BL-01, BL-04 |
| [BL-10](#bl-10--moderasi-post-publish-ulasan-oleh-guru) | Moderasi Post-Publish Ulasan oleh Guru | 🟡 Could-have | S | BL-09 |
| [BL-11](#bl-11--sistem-notifikasi) | Sistem Notifikasi | 🟡 Could-have | S | BL-09 |
| [BL-12](#bl-12--notifikasi-ulasan-kritis-dan-tindak-lanjut-sppg) | Notifikasi Ulasan Kritis dan Tindak Lanjut SPPG | 🟡 Could-have | S | BL-09 |
| [BL-13](#bl-13--ringkasan-evaluasi-dapur-berbasis-ai-publik) | Ringkasan Evaluasi Dapur Berbasis AI (Publik) | 🟡 Could-have | M | BL-09, BL-10 |


### 🔴 Must-have (MVP)

#### BL-01 — Sistem Autentikasi dan Manajemen Role

| | |
|---|---|
| **Story terkait** | US-01 |
| **Estimasi** | M (Medium) |
| **Dependensi** | - |

Fondasi seluruh platform. Sistem login harus dibangun pertama karena semua fitur operasional (input menu, ulasan, moderasi) bergantung pada identitas dan role pengguna. Role yang dikelola: Admin, SPPG, Siswa, dan Guru.

**Kriteria Selesai:**

- Login tersedia dengan pembedaan role yang jelas.
- SPPG hanya dapat mengelola data dapur miliknya sendiri.
- Guru hanya dapat memoderasi ulasan dari sekolah yang terhubung dengannya.
- Halaman publik (monitoring) dapat diakses tanpa login.

#### BL-02 — Profil Dapur MBG (SPPG) dan Daftar Sekolah

| | |
|---|---|
| **Story terkait** | US-02, US-03 |
| **Estimasi** | L (Large) |
| **Dependensi** | BL-01 |

Halaman profil publik untuk setiap dapur MBG yang mencakup nama dapur, wilayah, daftar sekolah yang dilayani, dan informasi contact person. Admin membuat profil awal; SPPG dapat mengeditnya setelah login.

**Kriteria Selesai:**

- Profil dapur menampilkan setidaknya: nama, alamat, sekolah yang dilayani, dan contact person.
- SPPG yang sudah login dapat mengedit data profil miliknya.

#### BL-03 — Pencarian SPPG melalui Wilayah dan Nama Sekolah

| | |
|---|---|
| **Story terkait** | US-04 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-02 |

Pengguna dapat mencari dapur MBG menggunakan nama sekolah atau kabupaten/kota dari halaman utama, sehingga tidak perlu menelusuri seluruh direktori.

**Kriteria Selesai:**

- Kolom pencarian tersedia di halaman utama.
- Hasil pencarian muncul dalam waktu < 2 detik.
- Pencarian mendukung nama sekolah dan nama kabupaten/kota.

#### BL-04 — Input Menu Harian oleh SPPG

| | |
|---|---|
| **Story terkait** | US-05 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01, BL-02 |

SPPG menginput menu makanan harian per dapur lengkap dengan komponen makanan dan klaim kandungan nutrisi (kalori, protein, karbohidrat, lemak), yang kemudian tampil di halaman publik.

**Kriteria Selesai:**

- Form input menu tersedia di dashboard SPPG.
- Menu yang disimpan langsung tampil di halaman monitoring publik.
- Riwayat menu dapat dilihat berdasarkan tanggal.

#### BL-05 — Validasi Nutrisi Berbasis AI (Foto + Teks)

| | |
|---|---|
| **Story terkait** | US-06 |
| **Estimasi** | L (Large) |
| **Dependensi** | BL-04 |

Saat SPPG menginput menu, mereka wajib mengunggah foto makanan beserta klaim nutrisi. Sistem AI menganalisis foto tersebut dan memberikan **peringatan ketidakwajaran** jika klaim nutrisi yang diinput tidak sebanding dengan porsi atau jenis makanan yang terlihat secara visual, bukan sebagai perbandingan dengan data hasil lab. Jika tidak ditemukan ketidakwajaran yang signifikan, menu mendapat label "Nutrisi Tervalidasi AI" di halaman publik.

**Kriteria Selesai:**

- Upload foto wajib dilakukan bersamaan dengan input klaim nutrisi.
- AI memberikan peringatan ketidakwajaran yang spesifik berdasarkan analisis visual foto (bukan hasil analisis laboratorium).
- Peringatan menyebut aspek visual mana yang dianggap tidak sebanding dengan klaim (misalnya porsi terlihat kecil namun klaim kalori sangat tinggi).
- SPPG harus mengonfirmasi atau merevisi sebelum data dipublikasikan.
- Menu yang lolos validasi menampilkan badge "Tervalidasi AI" di halaman publik.
- Riwayat peringatan dan hasil validasi AI tersimpan untuk keperluan audit.

#### BL-06 — Panel Admin: Master Data SPPG & Sekolah

| | |
|---|---|
| **Story terkait** | US-12 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01 |

Panel khusus Admin untuk mendaftarkan dapur SPPG baru, membuat akun login SPPG, dan memetakan sekolah-sekolah yang dilayani ke dapur terkait. Ini adalah prasyarat operasional agar seluruh struktur sistem terbentuk dengan benar sebelum program berjalan. Tanpa backlog ini, SPPG tidak dapat login dan tidak ada data dapur yang bisa dikelola.

**Kriteria Selesai:**

- Admin dapat mendaftarkan akun SPPG baru dengan data dapur lengkap.
- Admin dapat memilih dan memetakan daftar sekolah dari database ke dapur terkait.
- Sistem menyimpan relasi dapur–sekolah dan memberikan akses login kepada SPPG.
- Admin dapat menonaktifkan atau mengedit akun SPPG yang sudah ada.
- Tersedia audit log untuk setiap perubahan master data yang dilakukan Admin.

### 🟠 Should-have

#### BL-07 — Status Distribusi Harian dan Bukti Foto

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

#### BL-08 — Notifikasi Keterlambatan Distribusi

| | |
|---|---|
| **Story terkait** | US-13 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-07 |

Sistem secara otomatis mengirimkan peringatan kepada Admin dan Guru apabila status distribusi suatu sekolah masih "Belum Diantar" pada pukul 11.00 WIB. Fitur ini krusial karena memungkinkan pihak terkait segera menindaklanjuti potensi kegagalan distribusi sebelum jam makan siang, sekaligus menjadi bahan evaluasi ketepatan waktu distribusi SPPG.

**Kriteria Selesai:**

- Sistem memicu pemeriksaan otomatis pada pukul 11.00 WIB setiap hari.
- Notifikasi WhatsApp terkirim kepada Admin pusat dan Guru di sekolah terdampak, disertai nama sekolah dan nama dapur.
- Daftar sekolah yang terlambat tampil di dashboard Admin dan Guru sebagai bahan tindak lanjut.
- Notifikasi yang gagal terkirim (nomor tidak valid) dicatat dalam log sistem.

#### BL-09 — Ulasan dan Foto dari Siswa

| | |
|---|---|
| **Story terkait** | US-09 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-01, BL-04 |

Siswa mengirimkan ulasan harian disertai foto makanan yang diterima. Ulasan langsung tampil ke publik tanpa antrian persetujuan.

**Kriteria Selesai:**

- Form ulasan dengan upload foto tersedia bagi siswa yang login.
- Ulasan yang dikirim siswa langsung tampil di halaman publik beserta nama dan timestamp.
- Ulasan terhubung ke menu dan dapur yang sesuai pada hari tersebut.

### 🟡 Could-have

#### BL-10 — Moderasi Post-Publish Ulasan oleh Guru

| | |
|---|---|
| **Story terkait** | US-10 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-09 |

Guru menandai (flag) ulasan yang bermasalah untuk ditinjau admin, atau langsung menghapus konten yang melanggar pedoman komunitas. Didevelop setelah fitur ulasan berjalan dan volume konten mulai memerlukan moderasi.

**Kriteria Selesai:**

- Guru dapat melakukan flag atau hapus ulasan beserta alasannya dari panel moderasi.
- Ulasan yang di-flag menampilkan label peringatan sementara hingga putusan dari admin.
- Siswa menerima notifikasi jika ulasannya dihapus beserta alasannya.

#### BL-11 — Sistem Notifikasi

| | |
|---|---|
| **Story terkait** | US-09, US-10 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-09 |

Mekanisme notifikasi untuk mendukung alur komunikasi antar role. Diperlukan agar guru mengetahui adanya ulasan baru dari siswa, dan agar siswa mendapat konfirmasi ketika ulasannya dihapus oleh guru. Tanpa notifikasi, moderasi konten tidak efektif karena tidak ada sinyal antar pihak.

**Kriteria Selesai:**

- Guru menerima notifikasi ketika siswa di sekolahnya mengirimkan ulasan baru.
- Siswa menerima notifikasi beserta alasan jika ulasannya dihapus oleh guru.
- Notifikasi dapat dilihat melalui panel notifikasi di dalam aplikasi.

#### BL-12 — Notifikasi Ulasan Kritis dan Tindak Lanjut SPPG

| | |
|---|---|
| **Story terkait** | US-14 |
| **Estimasi** | S (Small) |
| **Dependensi** | BL-09 |

Sistem mengirimkan notifikasi real-time ke SPPG ketika ulasan siswa mengandung kata kunci kritis yang telah didefinisikan (contoh: "basi", "bau", "busuk", "tidak layak", "kotor"). SPPG kemudian dapat memperbarui status tindak lanjut atas ulasan tersebut agar investigasi terdokumentasi.

**Kriteria Selesai:**

- Notifikasi real-time terkirim ke dashboard SPPG saat sistem mendeteksi kata kunci kritis pada ulasan yang masuk.
- Ulasan kritis masuk ke daftar "Ulasan Perlu Tindak Lanjut" dengan status awal **Belum Diproses**.
- SPPG dapat memperbarui status tindak lanjut: **Belum Diproses** - **Dalam Proses Tindak Lanjut** - **Selesai**.
- Setiap perubahan status dapat disertai catatan penanganan dari SPPG.
- Riwayat tindak lanjut tersimpan untuk keperluan audit dan evaluasi internal.

#### BL-13 — Ringkasan Evaluasi Dapur Berbasis AI (Publik)

| | |
|---|---|
| **Story terkait** | US-11 |
| **Estimasi** | M (Medium) |
| **Dependensi** | BL-09, BL-10 |

Sistem menghasilkan ringkasan analisis sentimen harian per dapur (positif/netral/negatif) menggunakan AI untuk tampilan publik. Didevelop setelah moderasi berjalan agar data ulasan yang dianalisis sudah terverifikasi kualitasnya.

**Kriteria Selesai:**

- Ringkasan evaluasi diperbarui setidaknya satu kali per hari setelah batas waktu pengiriman ulasan.
- Menampilkan distribusi sentimen dan poin-poin utama yang sering disebut.
- Data evaluasi bisa dilihat per hari dan secara historis di halaman profil publik dapur.

---


# BAB III: PERANCANGAN SISTEM (DESIGN)

## 3.1 Arsitektur Aplikasi dan Tech Stack
> **Version:** 2.0
> **Last Updated:** June 2026
> **Status:** Source of Truth
> **Platform:** ReactJS Web Application (Desktop-first, responsive)
> **Context:** Civic monitoring platform for Indonesia's Program Makan Bergizi Gratis (MBG)

### 1. Design Philosophy

HaloMBG serves parents checking if their children received meals, kitchen operators logging menus under time pressure, teachers moderating student reviews between classes, and administrators overseeing distribution across hundreds of kitchens.

This is not a SaaS product. This is public infrastructure.

The interface must feel like a trustworthy institution that happens to be digital. Not a startup wearing a government costume. Not a government portal pretending to be modern.

#### Emotional Goals

**Confident clarity.** Pitch.com's approach: every element knows exactly what it is and why it exists. No hedging, no over-explanation, no filler decoration.

**Warm authority.** Professional without being cold. The feeling of a well-run school administration office. Organized, approachable, competent.

**Depth without drama.** Pitch earns its visual richness through considered use of shadow, surface layering, and spacing. Not gradients or glass effects. Real depth comes from how surfaces stack and breathe.

**Transparency as structure.** Information should feel open and navigable. No dark patterns, no ambiguous states, no hidden affordances.

#### Interaction Feeling

Using HaloMBG should feel like:
- Working in a tool that was designed for the actual job
- Reading a well-produced report, not a marketing page
- Talking to someone who respects your time

It should never feel like:
- A generic admin template someone configured
- A design system demo
- A startup pitch deck turned into an app

### 2. Visual Principles

#### 2.1 Spacing System

8px base grid. All spacing from multiples of 8.

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Icon gaps, tight label pairs |
| `space-sm` | 8px | Related element spacing |
| `space-md` | 16px | Default component padding |
| `space-lg` | 24px | Section gaps within content |
| `space-xl` | 32px | Between distinct content groups |
| `space-2xl` | 48px | Major section separators |
| `space-3xl` | 64px | Page-level breathing room |

#### 2.2 Elevation System

Pitch uses controlled surface layering to create depth. Shadow is a tool, not decoration. Use it deliberately.

| Level | Shadow | Context |
|---|---|---|
| 0 | none | Flat elements, table rows, inline content |
| 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards, inputs, default surfaces |
| 2 | `0 4px 12px rgba(0,0,0,0.10)` | Dropdowns, hover cards, floating panels |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dialogs, popovers |
| 4 | `0 16px 40px rgba(0,0,0,0.14)` | Command palettes, full-screen overlays |

Use consecutive levels only. Level 3 should never appear adjacent to another Level 3. Jumping from Level 0 to Level 4 is always wrong.

#### 2.3 Surface Layering

Build depth through stacked surfaces, not color blocks.

```
Page background (surface-1: white)
  Card on page (surface-2: warm off-white, shadow-1)
    Input inside card (surface-1: white, shadow-1)
      Dropdown from input (surface-1: white, shadow-2)
```

Never invert this: a white card on a white background is invisible. A white card on off-white background with a light shadow is readable.

#### 2.4 Hierarchy

Establish hierarchy through typography size and weight first, spatial grouping second, color contrast third.

Never use borders and dividers as primary hierarchy tools. They flatten content into a grid. Use spacing.

#### 2.5 Density

**Default:** Comfortable. Enough whitespace to scan, tight enough to work.

**Data views** (tables, monitoring, admin panels): increase density. Reduce padding, tighten line-height. Users here are working, not browsing.

**Public views** (kitchen profiles, menu display, landing page): decrease density. Users here are reading and assessing.

### 3. Typography

#### 3.1 Font Stack

| Role | Family | Weights |
|---|---|---|
| Everything | **Montserrat** | 400, 500, 600, 700 |
| Data / Code | **JetBrains Mono** or **IBM Plex Mono** | 400 |

Load Montserrat from Google Fonts. Always include the variable font where possible.

#### 3.2 Type Scale

| Token | Size | Weight | Line-Height | Usage |
|---|---|---|---|---|
| `display` | 32px | 700 | 40px | Page titles, one per page |
| `h1` | 24px | 700 | 32px | Primary section headings |
| `h2` | 20px | 600 | 28px | Subsection headings |
| `h3` | 16px | 600 | 24px | Card titles, group labels |
| `body` | 14px | 400 | 22px | Default paragraph text |
| `body-sm` | 13px | 400 | 20px | Secondary content, table cells |
| `caption` | 12px | 500 | 16px | Labels, timestamps, metadata |
| `overline` | 11px | 600 | 16px | Category labels, uppercase only here |
| `footer-display` | 80-120px | 700 | 1.0 | Footer brand wordmark only |

#### 3.3 Typography Rules

**Line length:** 60 to 75 characters for body text. Never span full container width in reading contexts.

**Letter-spacing:** Only adjust `overline` (+0.5px) and `display` (-0.3px). Leave everything else at default.

**Emphasis:** Use `font-weight: 500` for inline emphasis, not bold. Reserve 600/700 for headings. Use color for semantic emphasis. No italic for generic emphasis. Underline only for links.

**Uppercase:** Only for `overline` category labels. Never for buttons, headings, or body text.

### 4. Color System

#### 4.1 Palette

```
PRIMARY         #071E49   Deep Navy        Trust, authority, stability
SECONDARY       #92D05D   Fresh Green      Positive status, success
ACCENT          #B5E0EA   Soft Pastel Blue Info states, selection
HIGHLIGHT       #D1B06C   Warm Gold        Achievement, validated badges

SURFACE-1       #FFFFFF   White            Primary background
SURFACE-2       #F8F7F5   Warm Off-white   Cards, secondary background
SURFACE-3       #F0EEEB   Light Warm Gray  Sidebar, tertiary areas

TEXT-PRIMARY    #1A1A18   Near Black       Headings, primary content
TEXT-SECONDARY  #5C5B57   Warm Gray        Descriptions, secondary info
TEXT-TERTIARY   #8E8D88   Light Warm Gray  Placeholders, disabled
TEXT-INVERSE    #FFFFFF   White            Text on dark backgrounds

BORDER-DEFAULT  #E5E3DF   Warm Light Gray  Subtle borders
BORDER-STRONG   #C4C2BC   Medium Warm Gray Emphasized borders

STATUS-SUCCESS  #2E7D32   Deep Green       Complete, verified
STATUS-WARNING  #E8A817   Amber            Pending, needs attention
STATUS-ERROR    #C62828   Deep Red         Error, critical
STATUS-INFO     #1565C0   Blue             Informational
```

#### 4.2 Usage Proportions

| Color | Proportion | Context |
|---|---|---|
| Surfaces (whites/off-whites) | 70% | Backgrounds, content areas |
| Text colors | 15% | All text |
| Primary #071E49 | 8% | Sidebar, primary buttons, active states |
| Secondary #92D05D | 3-5% | Success indicators, positive metrics, CTA buttons |
| Accent #B5E0EA | 2% | Selection backgrounds, info callouts |
| Highlight #D1B06C | 1% | Achievement badges, validated icons |
| Status colors | 1% | Contextual only |

#### 4.3 Color Restrictions

| Color | Never use for |
|---|---|
| Secondary green | Large fills, text color, borders |
| Accent blue | Buttons, text, headings |
| Highlight gold | Backgrounds, borders, large areas |
| Status colors | Decoration or branding |
| Primary navy | More than 2 large surfaces per screen |

#### 4.4 Accessibility

WCAG 2.1 AA minimum:

| Context | Minimum Ratio |
|---|---|
| Body text on white/off-white | 4.5:1 |
| Large text (18px+) | 3:1 |
| Interactive elements | 3:1 |
| Text on primary navy | White (#FFFFFF) only |
| Text on secondary green | Primary navy (#071E49) only |
| Text on accent blue | Primary navy (#071E49) only |

Status indicators must always pair color with an icon or text label. Never color-only.

#### 4.5 Dark Backgrounds

Primary navy (#071E49) is the only dark background allowed. It appears in:
- Login panel left-side branding area
- Sidebar navigation
- Footer (public pages only)

No gradients. No dark-to-light fades. Solid color only.

### 5. Component Guidelines

#### 5.1 Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `#071E49` | White | None | One per view, main action |
| Secondary | Transparent | `#071E49` | 1px `#071E49` | Supporting actions |
| Tertiary | Transparent | `#5C5B57` | None | Cancel, low-priority |
| Destructive | `#C62828` | White | None | Delete, requires confirmation |

| Size | Height | Padding | Font |
|---|---|---|---|
| Default | 40px | 16px 20px | 14px / 500 |
| Small | 32px | 8px 12px | 13px / 500 |

**Corner radius:** 6px. Consistent everywhere.

Rules:
- One primary button per visible viewport area
- Button labels are verbs: "Simpan Menu", "Kirim Ulasan"
- Loading state shows spinner with "Menyimpan..." text
- No gradient backgrounds on buttons
- No shadow on buttons
- No pill-shaped buttons
- No uppercase button labels
- No icon-only buttons without tooltip

#### 5.2 Cards

Cards group related content and sit on the page as distinct surfaces. They use Level 1 elevation.

**Default card:**
```css
background: var(--surface-2);
border-radius: 8px;
padding: 20px;
border: none;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```

**Interactive card (clickable):**
```css
cursor: pointer;
transition: box-shadow 150ms ease-out, background 150ms ease-out;

&:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
  background: var(--surface-1);
}
```

When to add a border: Only when cards share a grid and shadow alone is insufficient for separation. Use `border: 1px solid var(--border-default)`.

Rules:
- Cards on surface-1 backgrounds use surface-2 fill
- Cards on surface-2 backgrounds use surface-1 fill
- No cards inside cards
- No colored left-border accents on cards
- No header stripes or colored top edges
- No clickable cards without an explicit button or link affordance inside

#### 5.3 Navigation

**Sidebar:**
- Width: 240px
- Background: `#071E49`
- Inactive nav text: white at 70% opacity
- Active nav text: white at 100% opacity
- Active indicator: 3px left border in `#92D05D`, not a background fill
- Icons: 20px outlined, white
- Item spacing: 8px between items, 24px between groups
- Logo area: 64px height, top
- Profile: bottom-anchored

**Top bar:**
- Height: 56px
- Background: surface-1
- Bottom border: `1px solid var(--border-default)`
- Contains: breadcrumb, search input, notification icon, user avatar
- Scroll behavior: On scroll, the top bar can transition to a floating rounded card with shadow-2 and side margins, giving the content area more breathing room

Rules:
- Sidebar always visible on desktop. No hamburger menu.
- Text labels always visible alongside icons in sidebar
- No mega-menus or dropdown navigation trees
- Current page shown in both sidebar active state and breadcrumb

#### 5.4 Tables

Tables are primary data displays. Style them well.

```css
/* Header row */
background: var(--surface-2);
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.3px;
color: var(--text-secondary);
padding: 10px 16px;
border-bottom: 1px solid var(--border-default);

/* Body rows */
padding: 12px 16px;
font-size: 14px;
border-bottom: 1px solid var(--border-default);

/* Row hover */
background: var(--surface-2);
transition: background 150ms ease-out;
```

Rules:
- Right-align numeric columns
- Truncate long text with ellipsis and tooltip on hover
- Sticky header on scroll
- Sortable columns use a subtle caret icon
- No rounded corners on tables
- No card wrapping around tables
- No colored row backgrounds for status (use a badge column instead)
- No vertical borders between columns
- Zebra striping only on tables with more than 10 rows and more than 5 columns

#### 5.5 Forms

```css
/* Input */
height: 40px;
padding: 8px 12px;
border: 1px solid var(--border-default);
border-radius: 6px;
font-size: 14px;
background: white;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Focus */
border-color: var(--primary);
outline: 2px solid rgba(7, 30, 73, 0.12);
outline-offset: 1px;

/* Error */
border-color: var(--status-error);
```

Labels always above the input. Never inside (no floating labels). Required fields marked with `*` in error color. Optional fields say "(opsional)" in tertiary color.

Helper text below field at caption size.

Rules:
- Validate on blur or submit. No keystroke validation.
- No placeholder as the only label
- Single-column forms for data entry
- Two-column only for short admin settings
- No multi-step wizards for forms under 8 fields

#### 5.6 Badges

| Size | Height | Padding | Font |
|---|---|---|---|
| Default | 24px | 4px 10px | 12px / 500 |
| Small | 20px | 2px 8px | 11px / 500 |

**Corner radius:** 4px. Not pill-shaped.

| Status | Background | Text |
|---|---|---|
| Tervalidasi | `#E8F5E9` | `#2E7D32` |
| Menunggu | `#FFF8E1` | `#E8A817` |
| Ditolak | `#FFEBEE` | `#C62828` |
| Info | `#E3F2FD` | `#1565C0` |
| Netral | `#F0EEEB` | `#5C5B57` |

Rules:
- Badges are functional, not decorative
- Always include a text label
- Maximum 2 badges per card or table row
- No animated or pulsing badges

#### 5.7 Modals

| Type | Width | Usage |
|---|---|---|
| Small | 400px | Confirmations, simple alerts |
| Default | 520px | Form submissions, detail views |
| Large | 680px | Complex content, data review |

```css
background: white;
border-radius: 8px;
padding: 24px;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

Overlay: `rgba(0, 0, 0, 0.4)`.

Rules:
- Close button top-right, always
- ESC closes non-critical modals
- Destructive actions require explicit confirmation text
- Modal title is always present
- No nested modals
- No full-screen modals on desktop
- No auto-opening modals on page load

#### 5.8 Empty States

Structure:
1. Simple outlined icon at 48px in text-tertiary color
2. Heading: "Belum ada menu hari ini"
3. Supporting sentence: "Menu akan muncul setelah SPPG menginput data harian."
4. One action button if applicable

Rules:
- Center-aligned within the content area
- Tone is forward-looking, never blaming
- No large illustrations, no mascots
- No decorative scenes
- No "Oops!" or cutesy language

#### 5.9 Footer

Footer appears on public-facing pages only. Authenticated dashboard views have no footer.

**Structure (top to bottom):**
1. CTA + navigation columns row
2. Oversized brand wordmark
3. Bottom bar with copyright and legal links

```css
background: var(--color-primary);
color: var(--text-inverse);
padding: var(--space-3xl) var(--space-2xl) var(--space-lg);
```

CTA tagline: 32px or larger, weight 700, white, no period at end.

Navigation columns: 2 to 3 columns, 14px weight 400, white at 70% opacity default, 100% on hover, underline on hover only.

Brand wordmark: 80 to 120px, weight 700, white, tight letter-spacing. Decorative only, use `<span>` not a heading tag.

Bottom bar: separated by `1px rgba(255, 255, 255, 0.1)` border, 12px caption, white at 45% opacity.

Rules:
- No social media icons
- No newsletter signup
- No background images or patterns
- No gradient backgrounds

### 6. Layout Rules

#### 6.1 Page Structure

Every authenticated page:

```
Sidebar (240px) | Top Bar (56px)
                |---------------------------
                | Page Title + Actions
                |
                | Content
                | (max-width: 1120px)
                |
```

Content max-width: 1120px, centered in the content area. Admin and monitoring tables may stretch to 1280px.

#### 6.2 Content Grouping

Use spacing to group. Not boxes, not borders, not background fills.

```
Section Title        (h2, space-2xl above)
Content here...      (body, space-sm below title)
                     (space-xl before next group)
```

Borders and horizontal rules are a last resort. Use a 1px `border-default` line only when:
- Spacing alone cannot distinguish same-level content groups
- Separating fixed header from scrollable content
- Between table rows (convention)

#### 6.3 Asymmetry

Not everything is a grid. Consider:
- Wide content column (2/3) beside a narrow detail panel (1/3) for kitchen profiles
- Full-width tables with no card wrapping
- Text blocks at 65ch in a wider container
- Left-aligned content that does not center in the page

Break the grid when content calls for it.

#### 6.4 Dashboard Balance

The dashboard should feel like a morning briefing, not a cockpit.

Do:
- Show 3 to 4 key metrics at the top as plain text with labels
- One primary chart telling today's most important story
- A list of items needing attention as a simple table

Do not:
- More than 2 charts visible without scrolling
- Colored metric cards (green card for good, red for bad)
- Sparklines, donuts, gauges, and rings all competing on one screen
- A 4-column card grid as the primary layout

### 7. Motion

#### 7.1 Rules

Motion provides feedback, not entertainment.

| Property | Duration | Easing |
|---|---|---|
| Color, opacity | 150ms | ease-out |
| Transform (small) | 200ms | ease-out |
| Layout shifts | 250ms | ease-in-out |
| Modal entrance | 200ms | ease-out |

#### 7.2 Allowed

- Hover color and shadow changes on interactive elements
- Focus ring appearance
- Accordion open and close
- Modal fade in/out with slight scale (0.98 to 1.0)
- Toast slide in from top-right
- Loading spinner (simple rotation)
- Skeleton loading with subtle pulse
- Number count-up on landing page statistics only

#### 7.3 Forbidden

- Staggered card entrance animations
- Parallax scrolling
- Bouncing, elastic, or spring physics
- Confetti or particle effects
- Page transition slides or morphs
- Elements that "lift" or translate on hover
- Animated gradients
- Typing or typewriter effects
- Lottie animations for loading states

### 8. Iconography

**Icon set:** Lucide (default) or Phosphor Icons (outlined weight). One library, consistently.

| Context | Size | Stroke |
|---|---|---|
| Navigation | 20px | 1.5px |
| Inline with text | 16px | 1.5px |
| Empty states | 48px | 1.5px |
| Feature highlights | 32px | 1.5px |

Rules:
- Every icon has a text label except close (X) and search (magnifier)
- Outlined only. No filled/solid variants
- No icon inside a colored circle background
- No decorative icons that do not aid navigation or comprehension
- No mixing icon libraries

**Illustrations:** HaloMBG does not use character illustrations, isometric scenes, or abstract blob art. For visual moments use the icon set at larger sizes, simple geometric compositions using the color palette, or real photography where available.

### 9. Images and Placeholders

**Real images:** When photography is needed (food, kitchens, schools), use real photos. Never AI-generated imagery.

**Placeholder images:** When building components or layouts before real content exists, always use a proper placeholder service rather than broken image states or colored blocks.

Recommended placeholder sources:
- `https://picsum.photos/{width}/{height}` for general photography placeholders
- `https://picsum.photos/seed/{seed}/{width}/{height}` for consistent per-item placeholders (same seed = same image)
- `https://placehold.co/{width}x{height}/{bg-hex}/{text-hex}` for labeled placeholders with custom colors

Example usage in JSX:
```jsx
// Kitchen profile cover photo placeholder
<img src="https://picsum.photos/seed/kitchen-1/800/400" alt="Dapur MBG" />

// Menu photo placeholder
<img src="https://picsum.photos/seed/menu-001/400/300" alt="Foto menu" />

// Labeled placeholder with brand color
<img src="https://placehold.co/400x300/F8F7F5/8E8D88?text=Foto+Menu" alt="Foto menu" />
```

Rules:
- Never use empty `src` attributes
- Never render broken image icons as placeholder states
- Use the `seed` variant of picsum for list items so each item gets a distinct but stable image
- Placeholder images must have descriptive `alt` text

### 10. Writing and Copy

**Language:** Bahasa Indonesia for all UI copy. Labels, buttons, placeholders, error messages, empty states.

**Tone:** Helpful, direct, neutral. The tone of a capable civil servant who respects your time.

**Rules:**
- No emoji anywhere in the UI. Labels, empty states, buttons, notifications, error messages: no emoji.
- No em dash (--) in copy. Use a comma, period, or rewrite the sentence.
- No exclamation marks except in explicit success confirmations ("Menu berhasil disimpan."). One maximum.
- No passive voice in action labels. "Simpan" not "Tersimpan oleh".
- No marketing language in operational UI.

### 11. Explicit Prohibitions

#### 11.1 Structural Patterns to Avoid

| Pattern | Why |
|---|---|
| Cards nested inside cards | Kills hierarchy, creates visual depth debt |
| Every section in a bordered card | Turns the page into a cage grid |
| Border on every element | Opposite of openness |
| Giant rounded corners (12px+) on containers | Signals toy, not tool |
| Sidebar + top nav + breadcrumb + tab bar all visible | Navigation overload |
| 4-column colored metric card grid | Dashboard cliche |

#### 11.2 Visual Patterns to Avoid

| Pattern | Why |
|---|---|
| Gradient backgrounds | Faux-premium, signals style over substance |
| Glassmorphism, backdrop-blur | Trend-chasing, no informational value |
| 4+ accent colors competing on one screen | Visual noise |
| Decorative SVG blobs or waves as dividers | Empty decoration |
| Background patterns or textures | Noise pretending to be design |
| Dark mode with neon accents | Wrong context entirely |
| Purple-to-blue gradient hero sections | The clearest AI slop signature in existence |
| Box-shadow on every single element | Shadow loses meaning if used everywhere |

#### 11.3 Copy and Content to Avoid

| Pattern | Why |
|---|---|
| Emoji in UI labels or messages | Unprofessional, inconsistent across platforms |
| Em dash (--) in copy | Use a comma or restructure the sentence |
| "Oops!" or cute error messages | Disrespects the user's situation |
| Animated number counters (except landing page statistics) | Performative |
| Tooltips on everything | If it needs a tooltip, the label is wrong |
| Skeleton screens that shimmer dramatically | Loading should be quiet |

#### 11.4 AI Slop Checklist

Before shipping any component, check:

1. Would this look at home on a credible government platform? If not, it is too flashy.
2. Would this look at home in Linear or Pitch? If not, it is too clunky.
3. Can any visual element be removed without losing information? If yes, remove it.
4. Is this decoration or communication? If decoration, remove it.
5. Would a busy SPPG operator find this helpful at 10am when they are behind on entries? If not, redesign it.
6. Does this contain an emoji? Remove it.
7. Does this contain an em dash? Rewrite it.
8. Does this use a placeholder image URL or a broken image state? Fix it with picsum or placehold.co.

### 12. CSS Variables Reference

```css
:root {
  /* Colors */
  --color-primary: #071E49;
  --color-secondary: #92D05D;
  --color-accent: #B5E0EA;
  --color-highlight: #D1B06C;

  --surface-1: #FFFFFF;
  --surface-2: #F8F7F5;
  --surface-3: #F0EEEB;

  --text-primary: #1A1A18;
  --text-secondary: #5C5B57;
  --text-tertiary: #8E8D88;
  --text-inverse: #FFFFFF;

  --border-default: #E5E3DF;
  --border-strong: #C4C2BC;

  --status-success: #2E7D32;
  --status-warning: #E8A817;
  --status-error: #C62828;
  --status-info: #1565C0;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-3: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-4: 0 16px 40px rgba(0, 0, 0, 0.14);

  /* Typography */
  --font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
}
```

#### Component Architecture

Build as composable primitives:
- `Text` with variant prop (display, h1, h2, h3, body, body-sm, caption, overline)
- `Stack` and `Inline` for spacing using space tokens
- `Surface` for background containers (variant 1, 2, 3)
- `Badge` for status indicators
- `Button` with variant and size props
- `Table` with built-in header styling and density control

When deviating from this system, document what changed, why the system did not fit, and whether the system should be updated. Undocumented deviations are how design systems die.

*When in doubt, re-read the philosophy section and the AI slop checklist. When still in doubt, choose the simpler option.*

## 3.2 Pemodelan Fungsionalitas Sistem (Diagram UML)
Berikut adalah diagram-diagram UML yang merinci visualisasi proses dan alur dari sistem HaloMBG:
*   **Use Case Diagram**: `docs/uml/use-case-diagram.png`
*   **Activity Diagram**: `docs/uml/activity-diagram.png`
*   **Class Diagram**: `docs/uml/class-diagram.png`

## 3.3 Desain Database dan Kamus Data
### Daftar Isi

1. [Konvensi Penulisan](#1-konvensi-penulisan)
2. [Entitas dan Atribut](#2-entitas-dan-atribut)
   - 2.1 [users](#21-users)
   - 2.2 [sppg_profiles](#22-sppg_profiles)
   - 2.3 [schools](#23-schools)
   - 2.4 [sppg_schools](#24-sppg_schools)
   - 2.5 [student_profiles](#25-student_profiles)
   - 2.6 [teacher_profiles](#26-teacher_profiles)
   - 2.7 [daily_menus](#27-daily_menus)
   - 2.8 [ai_validation_logs](#28-ai_validation_logs)
   - 2.9 [distribution_statuses](#29-distribution_statuses)
   - 2.10 [student_reviews](#210-student_reviews)
   - 2.11 [critical_review_followups](#211-critical_review_followups)
   - 2.12 [followup_history](#212-followup_history)
   - 2.13 [ai_sentiment_summaries](#213-ai_sentiment_summaries)
   - 2.14 [notifications](#214-notifications)
   - 2.15 [notification_logs](#215-notification_logs)
   - 2.16 [audit_logs](#216-audit_logs)
3. [Ringkasan Relasi Antar Entitas](#3-ringkasan-relasi-antar-entitas)
4. [Kode dan Nilai Enumerasi](#4-kode-dan-nilai-enumerasi)

### 1. Konvensi Penulisan

| Konvensi | Keterangan |
|---|---|
| **PK** | Primary Key — identifikasi unik setiap baris |
| **FK** | Foreign Key — referensi ke tabel lain |
| **NOT NULL** | Kolom wajib diisi, tidak boleh kosong |
| **UNIQUE** | Nilai harus unik di seluruh tabel |
| **DEFAULT** | Nilai default jika tidak diisi saat insert |
| `snake_case` | Penamaan kolom mengikuti konvensi snake_case |
| `ENUM(...)` | Nilai hanya boleh salah satu dari daftar yang tercantum |
| Ukuran foto | Maksimum **5 MB per file** sesuai batasan sistem |
| Zona waktu | Semua timestamp menggunakan **WIB (UTC+7)** |

### 2. Entitas dan Atribut

#### 2.1 `users`

Menyimpan data akun seluruh pengguna terdaftar di platform HaloMBG. Tabel ini hanya menyimpan data autentikasi dan identitas dasar; data profil spesifik per role disimpan di tabel terpisah (`sppg_profiles`, `student_profiles`, `teacher_profiles`).

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik pengguna |
| `name` | VARCHAR | NOT NULL | Nama lengkap pengguna |
| `email` | VARCHAR | NOT NULL, UNIQUE | Alamat email untuk login |
| `password` | VARCHAR | NOT NULL | Hash bcrypt (cost factor ≥ 10); tidak disimpan plaintext |
| `role` | ENUM | NOT NULL | Nilai: `admin`, `sppg`, `siswa`, `guru` |
| `phone_number` | VARCHAR | NULL | Nomor WhatsApp aktif; digunakan sebagai kanal notifikasi |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Status akun; FALSE jika dinonaktifkan oleh Admin |
| `created_at` | TIMESTAMP | NOT NULL | Waktu akun dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data akun diperbarui |

#### 2.2 `sppg_profiles`

Menyimpan profil lengkap setiap Satuan Pelayanan Pemenuhan Gizi (SPPG) atau dapur MBG. Setiap akun `users` dengan role `sppg` memiliki tepat satu baris di tabel ini.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik profil dapur |
| `user_id` | INT | FK → users.id, NOT NULL, UNIQUE | Akun pengguna yang terhubung dengan profil ini |
| `kitchen_name` | VARCHAR | NOT NULL | Nama resmi dapur MBG |
| `address` | TEXT | NOT NULL | Alamat lengkap lokasi dapur |
| `district` | VARCHAR | NOT NULL | Nama kabupaten/kota tempat dapur beroperasi |
| `province` | VARCHAR | NOT NULL | Nama provinsi |
| `contact_person_name` | VARCHAR | NOT NULL | Nama penanggung jawab yang dapat dihubungi publik |
| `contact_phone` | VARCHAR | NOT NULL | Nomor WhatsApp/telepon contact person |
| `contact_email` | VARCHAR | NULL | Alamat email contact person (opsional) |
| `description` | TEXT | NULL | Deskripsi singkat operasional dapur; dapat diedit oleh SPPG |
| `production_capacity` | INT | NULL | Estimasi kapasitas produksi dalam porsi per hari |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Status operasional dapur; dikelola oleh Admin |
| `created_at` | TIMESTAMP | NOT NULL | Waktu profil dapur didaftarkan |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil diperbarui |

#### 2.3 `schools`

Menyimpan data master sekolah yang menjadi penerima program MBG.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik sekolah |
| `name` | VARCHAR | NOT NULL | Nama lengkap sekolah |
| `address` | VARCHAR | NULL | Alamat lengkap sekolah |
| `district` | VARCHAR | NOT NULL | Nama kabupaten/kota lokasi sekolah |
| `province` | VARCHAR | NOT NULL | Nama provinsi lokasi sekolah |
| `created_at` | TIMESTAMP | NOT NULL | Waktu data sekolah ditambahkan ke sistem |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data sekolah diperbarui |

#### 2.4 `sppg_schools`

Tabel pivot yang memetakan relasi many-to-many antara dapur SPPG dan sekolah-sekolah yang dilayaninya.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik relasi |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur SPPG yang melayani |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah yang dilayani |
| `created_at` | TIMESTAMP | NOT NULL | Waktu relasi ditetapkan oleh Admin |

#### 2.5 `student_profiles`

Menyimpan data profil spesifik untuk pengguna dengan role `siswa`, termasuk keterhubungan dengan sekolah.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik profil siswa |
| `user_id` | INT | FK → users.id, NOT NULL, UNIQUE | Akun pengguna yang terhubung dengan profil ini |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah tempat siswa terdaftar |
| `created_at` | TIMESTAMP | NOT NULL | Waktu profil siswa dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil siswa diperbarui |

#### 2.6 `teacher_profiles`

Menyimpan data profil spesifik untuk pengguna dengan role `guru`, termasuk keterhubungan dengan sekolah tempatnya bertugas.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik profil guru |
| `user_id` | INT | FK → users.id, NOT NULL, UNIQUE | Akun pengguna yang terhubung dengan profil ini |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah tempat guru bertugas |
| `created_at` | TIMESTAMP | NOT NULL | Waktu profil guru dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil guru diperbarui |

#### 2.7 `daily_menus`

Menyimpan data menu makanan harian yang diinput oleh SPPG, termasuk klaim kandungan nutrisi dan status validasi AI. Kolom nutrisi dan peringatan AI disatukan dalam tabel ini agar proses input menu menjadi satu langkah atomik.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri menu |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur yang menginput menu |
| `menu_date` | DATE | NOT NULL | Tanggal menu berlaku untuk distribusi |
| `menu_name` | VARCHAR | NOT NULL | Nama menu harian (contoh: "Nasi Ayam Semur") |
| `components` | TEXT | NOT NULL | Deskripsi komponen makanan (lauk, sayur, buah, dll.) |
| `calories` | DECIMAL | NOT NULL | Klaim kandungan kalori dalam kkal |
| `protein` | DECIMAL | NOT NULL | Klaim kandungan protein dalam gram |
| `carbohydrate` | DECIMAL | NOT NULL | Klaim kandungan karbohidrat dalam gram |
| `fat` | DECIMAL | NOT NULL | Klaim kandungan lemak dalam gram |
| `photo_url` | VARCHAR | NOT NULL | URL foto makanan yang diunggah SPPG; wajib ada saat input |
| `ai_validation_status` | ENUM | NOT NULL, DEFAULT `pending` | Status validasi: `pending`, `validated`, `flagged`, `skipped` |
| `ai_warning_message` | TEXT | NULL | Pesan peringatan dari AI; diisi jika `ai_validation_status = flagged` |
| `is_published` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE setelah SPPG mengonfirmasi atau merevisi; menu tampil di halaman publik |
| `created_at` | TIMESTAMP | NOT NULL | Waktu menu pertama kali diinput |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data menu diperbarui |


#### 2.8 `ai_validation_logs`

Menyimpan riwayat lengkap setiap siklus analisis AI terhadap menu harian, termasuk respons SPPG atas peringatan yang diberikan. Berfungsi sebagai jejak audit untuk proses validasi nutrisi.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri log validasi |
| `menu_id` | INT | FK → daily_menus.id, NOT NULL | Menu yang dianalisis |
| `validation_result` | ENUM | NOT NULL | Hasil analisis: `no_anomaly`, `anomaly_detected` |
| `warning_details` | TEXT | NULL | Detail aspek visual yang tidak sebanding dengan klaim; diisi jika `validation_result = anomaly_detected` |
| `sppg_action` | ENUM | NOT NULL, DEFAULT `pending` | Respons SPPG: `pending`, `confirmed`, `revised` |
| `sppg_action_note` | TEXT | NULL | Catatan opsional dari SPPG saat mengonfirmasi atau merevisi data |
| `validated_at` | TIMESTAMP | NOT NULL | Waktu analisis AI selesai dijalankan |

#### 2.9 `distribution_statuses`

Menyimpan status distribusi harian makanan dari setiap SPPG ke setiap sekolah yang dilayaninya.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri status distribusi |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur yang melakukan distribusi |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah tujuan distribusi |
| `distribution_date` | DATE | NOT NULL | Tanggal distribusi |
| `status` | ENUM | NOT NULL, DEFAULT `belum_diantar` | Status distribusi: `belum_diantar`, `siap_diantar`, `sudah_diantar`, `batal` |
| `proof_photo_url` | VARCHAR | NULL | URL foto bukti pengiriman yang diunggah SPPG |
| `updated_by` | INT | FK → users.id, NOT NULL | Akun SPPG yang terakhir memperbarui status |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu pembaruan status terakhir; ditampilkan di halaman publik |
| `created_at` | TIMESTAMP | NOT NULL | Waktu entri distribusi pertama kali dibuat |

#### 2.10 `student_reviews`

Menyimpan ulasan harian yang dikirimkan siswa beserta foto makanan dan data moderasi konten. Kolom moderasi (flag dan penghapusan) disatukan dalam tabel ini untuk efisiensi query.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik ulasan |
| `student_id` | INT | FK → student_profiles.id, NOT NULL | Profil siswa yang memberikan ulasan |
| `menu_id` | INT | FK → daily_menus.id, NOT NULL | Menu yang diulas (berdasarkan tanggal dan SPPG terkait) |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur yang menerima ulasan ini |
| `review_text` | TEXT | NOT NULL | Isi teks ulasan dari siswa |
| `photo_url` | VARCHAR | NULL | URL foto makanan yang diunggah siswa (opsional) |
| `sentiment` | ENUM | NULL | Klasifikasi sentimen oleh AI: `positif`, `netral`, `negatif`, `kritis` |
| `is_critical` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE jika AI mengklasifikasikan ulasan sebagai kritis; memicu notifikasi ke SPPG |
| `moderation_status` | ENUM | NOT NULL, DEFAULT `visible` | Status moderasi: `visible`, `flagged`, `removed` |
| `flagged_by` | INT | FK → users.id, NULL | ID guru yang men-flag ulasan; NULL jika belum pernah di-flag |
| `flag_reason` | TEXT | NULL | Alasan guru men-flag ulasan |
| `removed_by` | INT | FK → users.id, NULL | ID guru yang menghapus ulasan; NULL jika belum dihapus |
| `removal_reason` | TEXT | NULL | Alasan penghapusan ulasan oleh guru |
| `created_at` | TIMESTAMP | NOT NULL | Waktu ulasan dikirimkan; ditampilkan sebagai timestamp di halaman publik |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data ulasan diperbarui |

#### 2.11 `critical_review_followups`

Menyimpan status dan catatan penanganan SPPG atas ulasan siswa yang terklasifikasi kritis oleh AI.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri tindak lanjut |
| `review_id` | INT | FK → student_reviews.id, NOT NULL, UNIQUE | Ulasan kritis yang ditindaklanjuti; satu ulasan satu entri |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur yang bertanggung jawab atas penanganan |
| `followup_status` | ENUM | NOT NULL, DEFAULT `belum_diproses` | Status penanganan: `belum_diproses`, `dalam_proses`, `selesai` |
| `handling_note` | TEXT | NULL | Catatan penanganan terkini dari SPPG |
| `updated_by` | INT | FK → users.id, NOT NULL | Akun SPPG yang terakhir memperbarui status |
| `created_at` | TIMESTAMP | NOT NULL | Waktu entri dibuat (saat notifikasi kritis pertama dikirim) |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir status atau catatan diperbarui |


#### 2.12 `followup_history`

Menyimpan riwayat kronologis setiap perubahan status pada tindak lanjut ulasan kritis. Berfungsi sebagai jejak audit yang tidak dapat diubah untuk proses investigasi SPPG.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri riwayat |
| `followup_id` | INT | FK → critical_review_followups.id, NOT NULL | Tindak lanjut yang statusnya berubah |
| `previous_status` | ENUM | NOT NULL | Status sebelum perubahan: `belum_diproses`, `dalam_proses`, `selesai` |
| `new_status` | ENUM | NOT NULL | Status setelah perubahan: `belum_diproses`, `dalam_proses`, `selesai` |
| `note` | TEXT | NULL | Catatan yang disertakan SPPG saat melakukan perubahan status |
| `changed_by` | INT | FK → users.id, NOT NULL | Akun SPPG yang melakukan perubahan |
| `changed_at` | TIMESTAMP | NOT NULL | Waktu perubahan status dilakukan |


#### 2.13 `ai_sentiment_summaries`

Menyimpan ringkasan analisis sentimen harian per dapur SPPG yang dihasilkan oleh AI berdasarkan agregasi ulasan siswa.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik ringkasan |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur yang dievaluasi |
| `summary_date` | DATE | NOT NULL | Tanggal ulasan yang dirangkum |
| `total_reviews` | INT | NOT NULL, DEFAULT 0 | Jumlah total ulasan yang masuk pada tanggal tersebut |
| `positive_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen positif |
| `neutral_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen netral |
| `negative_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen negatif |
| `key_points` | TEXT | NULL | Poin-poin utama yang sering disebut dalam ulasan; dihasilkan AI |
| `generated_at` | TIMESTAMP | NOT NULL | Waktu ringkasan ini dihasilkan oleh sistem AI |

#### 2.14 `notifications`

Menyimpan setiap notifikasi yang dibuat oleh sistem, baik yang dikirim melalui WhatsApp maupun yang tampil sebagai notifikasi in-app.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik notifikasi |
| `recipient_id` | INT | FK → users.id, NOT NULL | Pengguna penerima notifikasi |
| `type` | ENUM | NOT NULL | Jenis notifikasi (lihat Bagian 4) |
| `related_id` | INT | NULL | ID entitas terkait (contoh: ID distribusi, ID ulasan) |
| `message` | TEXT | NOT NULL | Isi pesan notifikasi yang dikirimkan |
| `channel` | ENUM | NOT NULL | Media pengiriman: `whatsapp`, `in_app` |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE jika pengguna sudah membaca notifikasi (untuk channel `in_app`) |
| `sent_at` | TIMESTAMP | NULL | Waktu notifikasi berhasil terkirim; NULL jika belum terkirim |
| `created_at` | TIMESTAMP | NOT NULL | Waktu notifikasi dibuat oleh sistem |


#### 2.15 `notification_logs`

Menyimpan log detail setiap percobaan pengiriman notifikasi. Digunakan untuk debugging dan pemantauan keandalan layanan notifikasi.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri log |
| `notification_id` | INT | FK → notifications.id, NOT NULL | Notifikasi yang dicoba kirim |
| `status` | ENUM | NOT NULL | Status percobaan: `sent`, `failed` |
| `failure_reason` | TEXT | NULL | Alasan kegagalan pengiriman (contoh: "Nomor tidak terdaftar di WhatsApp"); diisi jika `status = failed` |
| `attempted_at` | TIMESTAMP | NOT NULL | Waktu percobaan pengiriman dilakukan |


#### 2.16 `audit_logs`

Mencatat seluruh perubahan pada master data yang dilakukan oleh Admin sebagai jejak aktivitas yang dapat diaudit.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri log |
| `actor_id` | INT | FK → users.id, NOT NULL | Pengguna yang melakukan perubahan |
| `action` | VARCHAR | NOT NULL | Jenis aksi yang dilakukan (contoh: `create`, `update`, `delete`, `deactivate`) |
| `target_table` | VARCHAR | NOT NULL | Nama tabel yang terpengaruh (contoh: `sppg_profiles`, `schools`) |
| `target_id` | INT | NOT NULL | ID baris yang terpengaruh pada tabel tersebut |
| `old_value` | JSONB | NULL | Nilai data sebelum perubahan dalam format JSON; NULL untuk aksi `create` |
| `new_value` | JSONB | NULL | Nilai data setelah perubahan dalam format JSON; NULL untuk aksi `delete` |
| `created_at` | TIMESTAMP | NOT NULL | Waktu perubahan dilakukan |
| `delete_at`'| TIMESTAMP | NOT NULL | Waktu penghapusan dilakukan |

### 3. Ringkasan Relasi Antar Entitas

| Relasi | Tipe | Keterangan |
|---|---|---|
| `users` → `sppg_profiles` | One-to-One | Satu akun SPPG memiliki tepat satu profil dapur |
| `users` → `student_profiles` | One-to-One | Satu akun siswa memiliki tepat satu profil siswa |
| `users` → `teacher_profiles` | One-to-One | Satu akun guru memiliki tepat satu profil guru |
| `sppg_profiles` ↔ `schools` | Many-to-Many | Melalui tabel pivot `sppg_schools` |
| `student_profiles` → `schools` | Many-to-One | Banyak siswa terdaftar di satu sekolah |
| `teacher_profiles` → `schools` | Many-to-One | Banyak guru bertugas di satu sekolah |
| `sppg_profiles` → `daily_menus` | One-to-Many | Satu dapur memiliki banyak entri menu harian |
| `daily_menus` → `ai_validation_logs` | One-to-Many | Satu menu dapat memiliki beberapa log validasi AI |
| `sppg_profiles` → `distribution_statuses` | One-to-Many | Satu dapur memiliki banyak entri status distribusi |
| `schools` → `distribution_statuses` | One-to-Many | Satu sekolah memiliki banyak entri status distribusi |
| `student_profiles` → `student_reviews` | One-to-Many | Satu siswa dapat menulis banyak ulasan |
| `daily_menus` → `student_reviews` | One-to-Many | Satu menu dapat diulas oleh banyak siswa |
| `sppg_profiles` → `student_reviews` | One-to-Many | Satu dapur menerima banyak ulasan |
| `student_reviews` → `critical_review_followups` | One-to-One | Satu ulasan kritis memiliki satu entri tindak lanjut |
| `sppg_profiles` → `critical_review_followups` | One-to-Many | Satu dapur mengelola banyak tindak lanjut |
| `critical_review_followups` → `followup_history` | One-to-Many | Satu tindak lanjut memiliki banyak entri riwayat status |
| `sppg_profiles` → `ai_sentiment_summaries` | One-to-Many | Satu dapur memiliki banyak ringkasan sentimen harian |
| `users` → `notifications` | One-to-Many | Satu pengguna dapat menerima banyak notifikasi |
| `notifications` → `notification_logs` | One-to-Many | Satu notifikasi memiliki satu atau lebih log percobaan pengiriman |
| `users` → `audit_logs` | One-to-Many | Satu Admin dapat memiliki banyak entri log aksi |

### 4. Kode dan Nilai Enumerasi

#### Role Pengguna (`users.role`)

| Nilai | Deskripsi |
|---|---|
| `admin` | Administrator sistem dengan akses penuh ke master data dan panel manajemen |
| `sppg` | Operator dapur MBG; mengelola menu, distribusi, dan tindak lanjut ulasan kritis |
| `siswa` | Pelajar penerima MBG; dapat memberikan ulasan harian |
| `guru` | Tenaga pendidik; dapat memoderasi ulasan siswa di sekolahnya |

#### Status Validasi AI Menu (`daily_menus.ai_validation_status`)

| Nilai | Deskripsi |
|---|---|
| `pending` | Analisis AI sedang berjalan atau antrian belum diproses |
| `validated` | AI tidak mendeteksi ketidakwajaran visual; menu dapat diberi badge "Tervalidasi AI" |
| `flagged` | AI mendeteksi ketidakwajaran; SPPG diminta mengonfirmasi atau merevisi sebelum publikasi |
| `skipped` | Layanan AI tidak tersedia saat input; menu disimpan tanpa proses validasi |

#### Hasil Analisis AI (`ai_validation_logs.validation_result`)

| Nilai | Deskripsi |
|---|---|
| `no_anomaly` | AI tidak mendeteksi ketidakwajaran antara klaim nutrisi dan foto makanan |
| `anomaly_detected` | AI mendeteksi ketidakwajaran visual yang signifikan antara klaim nutrisi dan foto |

#### Respons SPPG atas Validasi AI (`ai_validation_logs.sppg_action`)

| Nilai | Deskripsi |
|---|---|
| `pending` | SPPG belum merespons peringatan AI |
| `confirmed` | SPPG mengonfirmasi data meskipun ada peringatan AI |
| `revised` | SPPG merevisi klaim nutrisi atau mengganti foto setelah mendapat peringatan |

#### Status Distribusi (`distribution_statuses.status`)

| Nilai | Deskripsi |
|---|---|
| `belum_diantar` | Makanan belum dikirim ke sekolah (status default harian) |
| `siap_diantar` | Makanan sudah disiapkan dan dalam proses pengiriman |
| `sudah_diantar` | Pengiriman telah dilakukan dan dikonfirmasi SPPG dengan bukti foto |
| `batal` | Distribusi dibatalkan untuk hari ini |

#### Sentimen Ulasan AI (`student_reviews.sentiment`)

| Nilai | Deskripsi |
|---|---|
| `positif` | Ulasan mengandung ekspresi kepuasan atau pujian |
| `netral` | Ulasan bersifat deskriptif tanpa muatan emosi yang jelas |
| `negatif` | Ulasan mengandung ketidakpuasan atau keluhan umum |
| `kritis` | Ulasan mengandung sentimen sangat negatif atau kata kunci kritis (contoh: "basi", "bau"); memicu `is_critical = TRUE` dan notifikasi ke SPPG |

#### Status Moderasi Ulasan (`student_reviews.moderation_status`)

| Nilai | Deskripsi |
|---|---|
| `visible` | Ulasan tampil normal di halaman publik (status default) |
| `flagged` | Ulasan ditandai guru untuk ditinjau Admin; tampil dengan label peringatan sementara |
| `removed` | Ulasan dihapus oleh guru; tidak tampil di halaman publik |

#### Status Tindak Lanjut Ulasan Kritis (`critical_review_followups.followup_status` dan `followup_history`)

| Nilai | Deskripsi |
|---|---|
| `belum_diproses` | SPPG belum memulai penanganan (status awal saat notifikasi masuk) |
| `dalam_proses` | SPPG sedang melakukan investigasi atau tindakan perbaikan |
| `selesai` | Penanganan telah selesai dan didokumentasikan oleh SPPG |

#### Jenis Notifikasi (`notifications.type`)

| Nilai | Deskripsi |
|---|---|
| `distribution_late` | Peringatan keterlambatan distribusi ke Admin dan Guru; dipicu otomatis pukul 11.00 WIB |
| `review_new` | Pemberitahuan ulasan baru dari siswa ke Guru di sekolah yang sama |
| `review_deleted` | Pemberitahuan penghapusan ulasan beserta alasannya ke Siswa |
| `review_critical` | Peringatan ulasan kritis terdeteksi AI; dikirim ke SPPG terkait |

#### Status Pengiriman Notifikasi (`notification_logs.status`)

| Nilai | Deskripsi |
|---|---|
| `sent` | Notifikasi berhasil terkirim ke penerima |
| `failed` | Pengiriman gagal; alasan kegagalan dicatat di kolom `failure_reason` |

---

## 3.4 Desain Antarmuka (Wireframe Figma)
*   Tautan Figma dan dokumentasi wireframe awal dapat dirujuk pada berkas: `docs/wireframes/figma.md`


# BAB IV: IMPLEMENTASI SISTEM

## 4.1 Lingkungan Pengembangan & Setup Deployment (Docker)
Aplikasi HaloMBG dideploy menggunakan Docker Compose untuk konsistensi environment antara frontend, backend, database, dan proxy server.
Detail setup dapat dilihat di `DOCKER.md` dan langkah instalasi di `README.md`.

## 4.2 Screenshot Antarmuka Aplikasi
Berikut adalah daftar halaman utama yang telah diimplementasikan beserta file screenshot-nya:
*   **Halaman Beranda (Landing Page)**: `docs/screenshots/landing_page.png`
*   **Registrasi Siswa via Dapodik**: `docs/screenshots/siswa_register_dapodik.png`
*   **Dashboard Siswa**: `docs/screenshots/siswa_dashboard.png`
*   **Dashboard SPPG (Operator Dapur)**: `docs/screenshots/sppg_dashboard.png`
*   **Manajemen Menu Harian SPPG**: `docs/screenshots/sppg_menu_harian.png`
*   **Evaluasi Gizi AI SPPG**: `docs/screenshots/sppg_evaluasi_ai.png`
*   **Status Distribusi SPPG**: `docs/screenshots/sppg_distribusi.png`
*   **Tindak Lanjut Ulasan Kritis SPPG**: `docs/screenshots/sppg_tindak_lanjut.png`
*   **Dashboard Guru (Moderasi)**: `docs/screenshots/guru_dashboard.png`
*   **Moderasi (Flag) Ulasan Siswa oleh Guru**: `docs/screenshots/guru_flag_ulasan.png`

## 4.3 Panduan Pengguna (User Manual)
#### Sistem Monitoring Program Makan Bergizi Gratis (MBG)
### Pendahuluan

Selamat datang di Panduan Pengguna resmi **HaloMBG**. HaloMBG adalah platform monitoring digital terpadu berbasis web yang dirancang khusus untuk memastikan akuntabilitas, transparansi, dan efisiensi dalam pelaksanaan **Program Makan Bergizi Gratis (MBG)** di seluruh Indonesia.

Sistem ini menjembatani berbagai pihak terkait melalui integrasi fitur-fitur canggih:
- **Transparansi Gizi Publik**: Publikasi menu harian dan takaran gizi makro (kalori, protein, lemak, karbohidrat).
- **Validasi Nutrisi berbasis AI**: Verifikasi kesesuaian klaim gizi dengan foto nyata makanan menggunakan model AI (Gemini Vision).
- **Pemantauan Distribusi Real-Time**: Pelacakan status pengantaran makanan dari dapur ke sekolah tujuan lengkap dengan bukti foto serah terima.
- **Analisis Sentimen Otomatis**: Pengolahan ulasan siswa harian menjadi infografis sentimen dan kesimpulan tindak lanjut bagi dapur penyedia menggunakan AI.
- **Moderasi Bertingkat**: Pengawasan kualitas ulasan yang didelegasikan kepada guru sekolah dan administrator sistem.

Tujuan dokumen ini adalah memberikan panduan teknis yang komprehensif bagi seluruh pengguna dalam mengoperasikan platform HaloMBG sesuai dengan peran masing-masing.

### Persyaratan Sistem

Untuk mendapatkan pengalaman pengguna terbaik dan memastikan seluruh fitur (seperti WebRTC kamera dan visualisasi grafik) berjalan lancar, pastikan perangkat Anda memenuhi spesifikasi berikut:

#### 1. Spesifikasi Perangkat Lunak (Software)
- **Peramban Web (Web Browser)**:
  - Google Chrome (Versi 90 atau terbaru)
  - Mozilla Firefox (Versi 88 atau terbaru)
  - Apple Safari (Versi 14 atau terbaru)
  - Microsoft Edge (Versi 90 atau terbaru)
- **Sistem Operasi**: Windows 10/11, macOS, Linux, Android 9.0+, atau iOS 14+.

#### 2. Koneksi Internet
- Koneksi internet stabil dengan kecepatan unduh/unggah minimal **2 Mbps** untuk memfasilitasi pengunggahan foto bukti makanan/serah terima.

#### 3. Izin Akses Perangkat (Device Permissions)
- **Kamera**: Dibutuhkan izin akses kamera web bagi pengguna Siswa yang ingin mengambil foto makanan secara langsung menggunakan fitur kamera internal (WebRTC).

### Aktor dan Hak Akses Pengguna

Sistem HaloMBG mengkategorikan pengguna ke dalam lima aktor dengan tingkat aksesibilitas yang berbeda:

| Aktor | Metode Autentikasi | Cakupan Hak Akses Utama |
| :--- | :--- | :--- |
| **Publik (Umum)** | Tanpa Login | Pencarian dapur/sekolah, melihat menu harian, melihat grafik gizi & badge AI, memantau pengiriman makanan, membaca statistik sentimen AI. |
| **Pihak SPPG (Operator Dapur)** | Login Akun Dapur | Mengelola data profil dapur, mengunggah menu makanan harian, memproses validasi AI gizi, memperbarui status distribusi, merespons ulasan kritis. |
| **Siswa** | Login Terverifikasi NISN | Registrasi mandiri via Dapodik, melihat menu gizi hari ini, mengirimkan rating & ulasan tekstual, serta mengunggah foto makanan. |
| **Guru** | Login Akun Guru | Menerima peringatan otomatis WhatsApp, memantau review siswa di sekolahnya, menandai (*flag*) ulasan, dan menghapus ulasan yang melanggar ketentuan. |
| **Administrator** | Login Akun Admin | Dashboard analitik nasional, mengelola database master sekolah & dapur, mengatur pemetaan relasi antar sekolah dan dapur penyedia. |

### Akses Publik

Masyarakat umum, orang tua siswa, pemerhati program, dan instansi pengawas dapat mengakses data transparansi program HaloMBG tanpa perlu mendaftarkan akun.

#### 1. Menelusuri & Mencari Dapur SPPG
Untuk menemukan dapur yang menyuplai makanan di sekolah Anda:
1. Buka halaman beranda [Public Landing Page](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/pages/landing/PublicLanding.jsx).
2. Di bagian kolom pencarian utama (Hero Section), ketikkan **Nama Sekolah** atau **Kabupaten/Kota**.
3. Sistem akan memunculkan pilihan sekolah yang sesuai. Klik nama sekolah yang dituju.
4. Anda akan otomatis diarahkan ke profil dapur SPPG penanggung jawab sekolah tersebut.

**Gambar: Tampilan Halaman Beranda Publik dan Pencarian (/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_kids_eating.png)**
*Gambar 1: Halaman utama direktori pencarian.*

#### 2. Memantau Menu Gizi & Status Validasi AI
1. Pada profil dapur SPPG terpilh, pastikan Anda membuka tab **Menu Harian**.
2. Anda akan melihat daftar masakan hari ini lengkap dengan foto riil makanan.
3. Tinjau nilai gizi makro (Kalori, Protein, Karbohidrat, Lemak) yang disajikan.
4. Perhatikan indikator badge **"Tervalidasi AI"** (berwarna hijau). Badge ini menandakan bahwa sistem kecerdasan buatan telah memeriksa keselarasan porsi foto makanan asli dengan nilai gizi yang dimasukkan operator dapur.

**Gambar: Tampilan Profil Detail Menu Harian (/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_meal_box.png)**
*Gambar 2: Rincian menu harian dengan badge verifikasi gizi AI.*

#### 3. Memantau Status Distribusi Sekolah
1. Masuk ke halaman profil dapur, kemudian pilih tab **Status Distribusi**.
2. Anda akan melihat tabel real-time status pengiriman makanan untuk hari ini:
   - `Belum Diantar`: Makanan sedang dalam proses persiapan di dapur.
   - `Siap Diantar`: Makanan sudah dimuat ke armada kurir.
   - `Sudah Diantar`: Makanan telah tiba di sekolah tujuan.
3. Untuk sekolah dengan status `Sudah Diantar`, Anda dapat mengklik tombol **Lihat Bukti Foto** guna memverifikasi foto bukti fisik serah terima di sekolah yang diunggah oleh kurir.

#### 4. Melihat Evaluasi Sentimen Dapur (AI Summary)
1. Klik tab **Evaluasi & Sentimen** di profil dapur.
2. Tinjau grafik batang/lingkaran yang menunjukkan rasio ulasan siswa: **Positif** (hijau), **Netral** (abu-abu), dan **Negatif** (merah).
3. Di bawah grafik, baca ringkasan teks otomatis hasil ekstraksi AI Gemini yang merangkum seluruh masukan siswa serta rekomendasi peningkatan kualitas makanan dapur tersebut.

### Panduan untuk Pihak SPPG

Operator dapur bertanggung jawab mengelola operasional harian, menginput menu gizi, dan melaporkan proses distribusi makanan.

#### 1. Login Akun Dapur
1. Buka halaman masuk HaloMBG, pilih tab/opsi login **SPPG / Dapur**.
2. Masukkan alamat email dan kata sandi operasional Anda yang didaftarkan oleh Admin.
3. Klik **Masuk** untuk mengakses Dashboard.

#### 2. Menginput Menu Harian & Validasi AI
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

**Gambar: Form Input Menu Dapur (/home/adityamulyaf/praktikum-rpl-a-02/framework/frontend/src/assets/mbg_kitchen_prep.png)**
*Gambar 3: Formulir pembuatan menu makanan harian.*

#### 3. Mengelola Status Distribusi Sekolah
1. Buka menu **Status Distribusi** di sidebar.
2. Untuk setiap sekolah mitra yang akan dikirimi makanan hari ini, perbarui statusnya:
   - Ubah ke `Siap Diantar` saat kurir berangkat.
   - Ubah ke `Sudah Diantar` setelah makanan sampai di sekolah tujuan.
3. Saat memilih status `Sudah Diantar`, sistem mewajibkan Anda mengunggah **Foto Bukti Serah Terima** di lokasi sekolah.
4. Klik **Perbarui Status**.

> [!WARNING]
> Batas waktu pengiriman makanan harian adalah pukul **11.00 WIB**. Jika status distribusi sekolah masih `Belum Diantar` melewati batas waktu tersebut, sistem secara otomatis akan mengirimkan notifikasi peringatan keterlambatan via WhatsApp kepada Admin Utama dan Guru sekolah yang bersangkutan.

#### 4. Menangani Ulasan Kritis
1. Jika ulasan siswa terdeteksi mengandung kata-kata keluhan kritis (seperti *"basi"*, *"asam"*, *"bau"*, *"kotor"*), ulasan tersebut secara otomatis dimasukkan ke modul **Ulasan Perlu Tindak Lanjut** di dashboard SPPG Anda.
2. Buka menu **Tindak Lanjut Ulasan** di sidebar.
3. Klik ulasan kritis tersebut, baca komentar siswa, dan perbarui status penanganannya:
   - `Dalam Proses`: Saat Anda sedang melakukan investigasi ke tim masak/kurir.
   - `Selesai`: Setelah Anda mengambil tindakan penyelesaian (seperti mengganti porsi makanan atau memperbaiki kebersihan bahan pangan).
4. Tulis catatan penyelesaian di kolom tanggapan, lalu klik **Simpan**.

### Panduan untuk Siswa

Siswa dapat berpartisipasi aktif dengan memberikan rating rasa dan dokumentasi foto makanan yang mereka terima.

#### 1. Registrasi Akun Siswa (Verifikasi NISN)
Sebelum masuk untuk pertama kali, siswa harus melakukan registrasi mandiri:
1. Klik **Daftar Akun** pada halaman login, pilih peran **Siswa**.
2. Masukkan **10 digit NISN** resmi Anda pada kolom pencarian Dapodik, klik **Verifikasi/Cari**.
3. Sistem akan mencocokkan data NISN ke database Dapodik. Jika lolos, Nama Lengkap Anda dan Sekolah Anda akan terisi secara otomatis.
4. Masukkan alamat email Anda, buat kata sandi baru, dan masukkan konfirmasi kata sandi.
5. Klik **Daftar Akun**.

#### 2. Mengirimkan Ulasan & Foto Makanan
1. Login menggunakan akun siswa Anda.
2. Klik tombol **Kirim Ulasan Hari Ini** di halaman dashboard siswa.
3. Berikan penilaian bintang (1-5) dan tulis komentar jujur Anda tentang masakan hari ini.
4. **Dokumentasi Foto Makanan**:
   - Klik **Ambil Foto** untuk mengakses kamera HP/Laptop Anda secara langsung (WebRTC), atau
   - Klik **Unggah File** untuk memilih file foto makanan yang sudah diambil sebelumnya.
5. Klik **Kirim Ulasan**. Notifikasi otomatis akan dikirim ke WhatsApp Guru pengawas Anda.

### Panduan untuk Guru

Guru memegang kendali moderasi tingkat pertama di sekolah guna menjaga kualitas konten ulasan yang dipublikasikan oleh siswanya.

#### 1. WhatsApp Alerts & Login
1. Setiap kali ada siswa dari sekolah Anda yang mengirim ulasan makanan baru, sistem akan mengirimkan pesan WhatsApp notifikasi real-time ke nomor HP Anda.
2. Buka HaloMBG, pilih peran **Guru**, lalu login dengan akun Anda.

#### 2. Moderasi Ulasan Siswa
1. Di dashboard guru, masuk ke menu **Kelola Ulasan Siswa**.
2. Tinjau ulasan-ulasan yang dikirim siswa sekolah Anda pada hari ini.
3. **Melaporkan Ulasan (Flagging)**:
   - Jika ulasan mengandung keluhan masukan gizi yang mencurigakan tetapi belum terkonfirmasi, klik tombol **Tandai (Flag)**.
   - Masukkan alasan penandaan ulasan. Ulasan publik akan dilabeli badge kuning *"Dalam Peninjauan Guru"* dan dikirim ke Admin Pusat untuk ditinjau.
4. **Menghapus Ulasan (Delete)**:
   - Jika ulasan terbukti melanggar ketentuan (misal: berkata tidak sopan, mengunggah foto selfie/bukan makanan), klik tombol **Hapus**.
   - Tuliskan alasan penghapusan ulasan pada form konfirmasi, klik **Hapus**. Ulasan akan segera disembunyikan dari profil publik.

### Panduan untuk Administrator

Admin pusat memiliki kendali pengawasan makro atas seluruh entitas dapur SPPG, sekolah, dan moderasi akhir ulasan di tingkat regional.

#### 1. Dashboard Analitik Nasional
1. Di dashboard Admin, tinjau metrik agregat di bagian atas dasbor:
   - Total Dapur SPPG aktif.
   - Total Sekolah Terlayani.
   - Persentase Kelancaran Distribusi Harian.
2. Pantau grafik garis untuk mendeteksi tren keterlambatan pengantaran makanan di daerah tertentu.

#### 2. Mengelola Master Data SPPG & Sekolah
- **Mendaftarkan SPPG**: Masuk ke menu **Data Master -> SPPG**, klik *Tambah SPPG Baru*. Isi kapasitas dapur, wilayah operasional, dan akun email login dapur.
- **Memetakan Relasi Dapur ke Sekolah**:
  1. Buka menu **Data Master -> Sekolah**.
  2. Klik tombol **Edit Pemetaan** pada sekolah yang dituju.
  3. Pada kolom *Dapur Penanggung Jawab*, pilih nama dapur SPPG terdekat yang akan melayani sekolah tersebut.
  4. Klik **Simpan Pemetaan**.

#### 3. Moderasi Ulasan Flagged (Laporan Guru)
1. Masuk ke modul **Moderasi Ulasan (Flagged)** di sidebar Admin.
2. Tinjau ulasan-ulasan yang telah diberi tanda bendera (flag) oleh guru sekolah di daerah Anda.
3. Klik **Setujui Penghapusan** jika ulasan terbukti melanggar pedoman publikasi, atau klik **Abaikan Laporan** jika ulasan dinilai layak tampil kembali tanpa label peringatan.

### Troubleshooting

Berikut adalah solusi cepat untuk kendala yang sering ditemui pada aplikasi:

| Gejala Kendala | Kemungkinan Penyebab | Solusi Penanganan |
| :--- | :--- | :--- |
| **Pencarian NISN Siswa Gagal** | NISN salah input atau belum dimasukkan ke database simulasi Dapodik. | Pastikan 10 digit NISN diinput dengan benar. Untuk testing, silakan gunakan daftar NISN dummy yang tertera pada panduan pendaftaran siswa. |
| **Kamera Web tidak dapat diakses** | Perizinan akses kamera di peramban (browser) diblokir oleh pengguna. | Klik ikon gembok di sebelah kiri bilah alamat URL browser Anda, lalu ubah izin akses **Kamera** menjadi *Izinkan (Allow)*. |
| **Pop-up AI Nutrisi terus muncul** | Angka kandungan gizi yang diinput terlalu jauh melenceng dari takaran visual makanan. | Perbaiki takaran gizi sesuai petunjuk analisis visual AI, atau Anda dapat melewati pemeriksaan dengan mengklik tombol *Konfirmasi Tetap Simpan*. |
| **Pesan WhatsApp Notifikasi Terlambat** | Nomor telepon WhatsApp Guru / Admin di sistem salah format. | Masuk ke menu Master Data, pastikan format nomor HP diawali kode negara tanpa tanda plus (misal: `628123456789`). |

### FAQ

**Q: Bagaimana cara kerja verifikasi gizi AI di HaloMBG?**  
A: Sistem menggunakan API Vision dari Gemini AI untuk mengenali jenis makanan di dalam foto. AI kemudian mencocokkannya dengan estimasi gizi (kalori, protein, lemak, karbohidrat) yang dimasukkan oleh SPPG. Jika rentang nilai gizi terlalu jauh atau foto tidak menampilkan makanan, sistem akan memberikan peringatan visual.

**Q: Siapa yang dapat melihat ulasan dari siswa?**  
A: Semua orang dapat melihat ulasan siswa di tab "Ulasan" pada halaman detail dapur publik. Namun, ulasan yang melanggar pedoman kesopanan dapat dihapus oleh Guru sekolah atau Administrator pusat.

**Q: Mengapa status pengiriman sekolah saya otomatis berubah warna menjadi merah?**  
A: Jika waktu menunjukkan lewat pukul 11.00 WIB dan status distribusi harian sekolah belum diperbarui menjadi "Sudah Diantar" oleh pihak dapur, sistem secara otomatis menandai pengiriman tersebut terlambat (merah) dan mengirimkan notifikasi peringatan.

### Lampiran Screenshot

Tabel ini merinci target visual screenshot yang harus disertakan dalam implementasi dokumen panduan versi cetak/PDF:

| Kode Gambar | Judul Visual Halaman | Dimensi Target | Area Fokus Kotak Sorotan (Highlight Area) |
| :--- | :--- | :--- | :--- |
| **Gambar 1** | Halaman Utama & Pencarian | 1920x1080 (Desktop) | **Merah**: Search Box universal.
**Biru**: Hasil filter sekolah terverifikasi. |
| **Gambar 2** | Detail Profil Dapur SPPG | 1920x1080 (Desktop) | **Merah**: Area kontak & tombol WhatsApp.
**Kuning**: Tab navigasi utama profil dapur. |
| **Gambar 3** | Form Input Menu & Gizi | 1920x1080 (Desktop) | **Merah**: Input nutrisi makro.
**Biru**: Dropzone unggah file foto porsi makanan. |
| **Gambar 4** | Warning Ketidakwajaran AI | 900x600 (Pop-up) | **Merah**: Teks penjelasan visual mismatch dari AI.
**Biru**: Tombol "Revisi Data" & "Tetap Simpan". |
| **Gambar 5** | Antarmuka Ulasan Siswa | 375x812 (Mobile) | **Merah**: Pilihan bintang ulasan.
**Hijau**: Modul tangkapan kamera WebRTC. |
| **Gambar 6** | Dashboard Moderasi Guru | 1920x1080 (Desktop) | **Merah**: Tombol bendera (Flag).
**Biru**: Tombol hapus komentar melanggar. |
| **Gambar 7** | Pemetaan Sekolah Admin | 1920x1080 (Desktop) | **Merah**: Dropdown daftar SPPG Dapur.
**Biru**: Tombol simpan pemetaan. |

*Dokumen User Manual HaloMBG ini disiapkan oleh Tim Pengembang Aplikasi untuk memandu implementasi operasional sistem di lapangan. Terakhir diperbarui Juni 2026.*


# BAB V: PENGUJIAN SISTEM (TESTING)

## 5.1 Rencana Pengujian dan Detail Kasus Uji (Test Cases)
Laporan ini memuat daftar test case manual beserta hasil eksekusinya pada aplikasi HaloMBG. Semua pengujian dilakukan pada lingkungan lokal dengan database yang telah di-seeding secara terstandar.

### Tabel Detail Test Cases

| TC-ID | Skenario / Fitur | Prekondisi | Langkah-langkah | Hasil yang Diharapkan | Hasil Aktual | Status | Tangkapan Layar |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-01** | **Landing Page - Pencarian Sekolah** | Pengguna belum login, membuka beranda. | 1. Buka beranda utama.
2. Ketik "Bocor" di kolom pencarian.
3. Pilih "SD NEGERI 1 BOCOR" dari daftar hasil. | Sistem mengarahkan ke halaman profil publik dapur SPPG Kebumen Buayan Rangkah beserta tab Profil Dapur, Menu Harian, Status Distribusi, Ulasan, dan Evaluasi AI. | Sistem berhasil mengarahkan ke profil SPPG Kebumen Buayan Rangkah dan memuat seluruh tab informasi secara lengkap. | **Pass** | [landing_page.png](screenshots/landing_page.png) 
 [public_profile.png](screenshots/public_kitchen_profile.png) |
| **TC-02** | **Registrasi Siswa - NISN Terdaftar** | Membuka form registrasi Siswa. | 1. Ketik NISN valid `0080000102`.
2. Klik "Cari" (Verifikasi Dapodik). | Nama siswa "Budi Santoso" otomatis terisi dan muncul alert keberhasilan berwarna hijau ("✓ NISN Terverifikasi: Budi Santoso dari sekolah SD NEGERI 1 BOCOR"). | Nama Budi Santoso berhasil dimuat dari database Dapodik dan muncul alert verifikasi hijau. | **Pass** | [siswa_register_dapodik.png](screenshots/siswa_register_dapodik.png) |
| **TC-03** | **Registrasi Siswa - NISN Tidak Valid** | Membuka form registrasi Siswa. | 1. Ketik NISN tidak terdaftar `9999999999`.
2. Klik "Cari". | Sistem menolak verifikasi dan memunculkan error merah "NISN tidak terdaftar dalam database penerima program MBG." | Sistem mendeteksi NISN tidak valid dan memunculkan pesan kesalahan merah "NISN tidak terdaftar dalam database penerima program MBG." di bawah input. | **Pass** | [siswa_register_invalid_nisn.png](screenshots/siswa_register_invalid_nisn.png) |
| **TC-04** | **Siswa - Dashboard Nutrisi** | Login sebagai Budi (`budi.baru@example.com`). | 1. Masuk ke Dashboard Utama Siswa. | Dashboard menampilkan grafik info kandungan nutrisi (Kalori, Protein, Karbo, Lemak) menu hari ini. | Infografis nutrisi and detail menu harian berhasil dimuat dan divisualisasikan dengan rapi. | **Pass** | [siswa_dashboard.png](screenshots/siswa_dashboard.png) |
| **TC-05** | **Siswa - Kirim Ulasan Valid** | Login sebagai Siswa, masuk menu ulasan. | 1. Ketik ulasan positif minimal 10 karakter.
2. Klik "Kirim Ulasan". | Ulasan berhasil dikirim dan sistem menampilkan layar sukses ulasan terkirim. | Ulasan berhasil disimpan ke database dan memunculkan layar sukses "Ulasan Terkirim!". | **Pass** | [siswa_riwayat_ulasan.png](screenshots/siswa_riwayat_ulasan.png) (Riwayat) |
| **TC-06** | **Siswa - Kirim Ulasan Kosong** | Login sebagai Siswa, masuk menu ulasan. | 1. Kosongkan kolom ulasan.
2. Klik "Kirim Ulasan". | Form validation bawaan browser memblokir pengiriman karena kolom bersifat wajib diisi (*required*). | Browser menolak submit form dan memunculkan tooltip validasi "Harap isi bidang ini". | **Pass** | [siswa_ulasan_kosong.png](screenshots/siswa_kirim_ulasan_kosong.png) |
| **TC-07** | **Registrasi Guru - Akun Baru** | Membuka form registrasi Guru. | 1. Masukkan NIP `198710102010121101`.
2. Klik "Cari".
3. Lengkapi email/sandi dan klik "Daftar". | Muncul alert keberhasilan berwarna hijau ("✓ NIP Terverifikasi: Heri Setiawan mengajar di SD NEGERI 1 BOCOR") dan form registrasi akun guru baru terbuka untuk melengkapi pendaftaran. | NIP berhasil terverifikasi (ditandai dengan alert keberhasilan hijau), form registrasi terbuka, dan pendaftaran berhasil diselesaikan. | **Pass** | [guru_dashboard.png](screenshots/guru_dashboard.png) |
| **TC-08** | **Guru - Dashboard Pemantauan** | Login sebagai Heri Setiawan (`guru.baru@example.com`). | 1. Masuk ke Dashboard Utama Guru. | Dashboard guru memuat menu Beranda, Ulasan Siswa, Profil Dapur, dan Notifikasi. Halaman Beranda menampilkan statistik umum program. | Dashboard Guru berhasil dimuat dengan menu Ulasan Siswa dan Notifikasi, serta menampilkan data statistik umum program. | **Pass** | [guru_dashboard.png](screenshots/guru_dashboard.png) |
| **TC-09** | **Guru - Moderasi (Flag) Ulasan** | Login sebagai Guru, masuk menu "Ulasan Siswa". | 1. Pilih ulasan siswa aktif.
2. Klik tombol "Tandai Ulasan" (Flag). | Ulasan tersebut diberi tanda merah "⚑ Ditandai" dan tombol berubah menjadi "Hapus Tanda" untuk penanganan oleh SPPG. | Status ulasan berubah menjadi "flagged" secara instan dan label penanda merah muncul dengan benar. | **Pass** | [guru_flag_ulasan.png](screenshots/guru_flag_ulasan.png) |
| **TC-10** | **SPPG - Kelola Menu Harian** | Login sebagai SPPG (`sppg@halombg.com`), masuk menu "Menu Harian". | 1. Tinjau menu harian yang terdaftar. | Daftar menu harian beserta berat kalori/makronutrisi dan status verifikasi foto AI dimuat secara teratur. | Halaman pengelolaan menu berhasil menampilkan data porsi gizi makro dan status verifikasi AI. | **Pass** | [sppg_menu_harian.png](screenshots/sppg_menu_harian.png) |
| **TC-11** | **SPPG - Status Distribusi** | Login sebagai SPPG, masuk menu "Distribusi". | 1. Cari sekolah yang dituju.
2. Ubah status pengiriman/distribusi sekolah menjadi "Sudah Diantar" dan unggah bukti foto. | Status pengiriman terupdate menjadi "Sudah Diantar" beserta visual bukti foto distribusi makanan di sekolah. | Status pengiriman berhasil diperbarui menjadi "Sudah Diantar" ke database, bukti foto terunggah, dan riwayat log distribusi tercatat. | **Pass** | [sppg_distribusi.png](screenshots/sppg_distribusi.png) |
| **TC-12** | **SPPG - Tindak Lanjut Ulasan Kritis** | Login sebagai SPPG (`sppg@halombg.com`), masuk menu "Tindak Lanjut". | 1. Tinjau ulasan siswa yang ditandai (flagged) oleh guru sekolah.
2. Klik tombol "Tindak Lanjut & Detail".
3. Ubah status penanganan (misal menjadi "Selesai") dan isi catatan penanganan. | Panel menampilkan daftar ulasan kritis/bermasalah untuk keputusan tindak lanjut (Belum Diproses, Dalam Proses, Selesai) beserta riwayat log audit. | Ulasan yang di-flag oleh Guru Heri Setiawan muncul di panel Tindak Lanjut secara real-time dan statusnya berhasil diperbarui menjadi "Selesai" dengan catatan penanganan. | **Pass** | [sppg_tindak_lanjut.png](screenshots/sppg_tindak_lanjut.png) |

## 5.2 Skenario Demo Pengujian
Dokumen ini memuat skenario uji coba (*demo script*) untuk mempresentasikan seluruh fitur utama sistem **HaloMBG** secara langsung (live demo). Skenario ini membagi pengguna menjadi dua tipe: **Akun Ter-seed (Bawaan)** untuk peninjauan cepat, dan **Akun Baru (Registrasi Live)** untuk mendemonstrasikan proses integrasi data riil (seperti integrasi NIP/NISN Dapodik dan pengiriman notifikasi WhatsApp secara instan).

### Matriks Akun Demo

Untuk demo ini, kita menggunakan total **7 akun** yang mewakili seluruh peran di sistem:

| Role | Tipe Akun | Kredensial / ID | Nama Simulasi | Tujuan Demo |
|---|---|---|---|---|
| **Admin** | Ter-seed | Email: `admin@halombg.com`
Password: `password` | Test Admin | Mengelola master data, membuat dapur SPPG baru, dan memetakan sekolah. |
| **Siswa 1** | Ter-seed | Email: `siswa@halombg.com`
Password: `password` | Test Siswa | Melihat menu harian dan mengirimkan ulasan baru secara *live* saat demo. |
| **Siswa 2** | **Akun Baru** | NISN: `0080000102` | Budi Santoso
*(SD Negeri 1 Bocor)* | Demo register siswa baru dengan **validasi NISN Dapodik** asli secara live. |
| **Guru 1** | Ter-seed | Email: `guru@halombg.com`
Password: `password` | Test Guru | Meninjau dasbor guru dan notifikasi web lonceng historis. |
| **Guru 2** | **Akun Baru** | NIP: `198710102010121101` | Heri Setiawan
*(SD Negeri 1 Bocor)* | Demo register guru baru dengan **validasi NIP Dapodik** secara live. |
| **SPPG 1** | Ter-seed | Email: `sppg@halombg.com`
Password: `password` | Test SPPG | Menampilkan dasbor dapur bawaan dengan data menu terisi. |
| **SPPG 2** | **Akun Baru** | Email: *Ditentukan saat buat*
Password: *Ditentukan saat buat* | Dapur Demo Gizi | Dibuat oleh Admin secara live dengan memasukkan **Nomor WhatsApp Riil Demonstrator** untuk demo WhatsApp Notifikasi. |

#### Akun Siswa dengan Riwayat Ulasan (Ter-seed)
Untuk meninjau riwayat ulasan historis yang sudah terisi di sistem (misal untuk menampilkan daftar ulasan di dashboard SPPG/Admin/Guru), Anda dapat login menggunakan salah satu akun siswa bawaan seeder berikut (semuanya dari sekolah **SD Negeri 1 Bocor**):

| Nama Siswa | Email Login | Password | NISN Dapodik | Status Ulasan |
|---|---|---|---|---|
| **Guntur Kusuma** | `guntur@example.com` | `password` | `0080000107` | Memiliki ulasan historis selama 3 hari terakhir |
| **Siti Rahmawati** | `siti@example.com` | `password` | `0080000103` | Memiliki ulasan historis selama 3 hari terakhir |
| **Dewi Lestari** | `dewi@example.com` | `password` | `0080000104` | Memiliki ulasan historis selama 3 hari terakhir |
| **Eko Wibowo** | `eko@example.com` | `password` | `0080000105` | Memiliki ulasan historis selama 3 hari terakhir |
| **Fitri Hidayat** | `fitri@example.com` | `password` | `0080000106` | Memiliki ulasan historis selama 3 hari terakhir |

### Alur Skenario Demo (Langkah Demi Langkah)

#### Langkah 1: Persiapan Awal (.env, Docker, & Seeding Database)

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

#### Langkah 2: Demo Registrasi Akun Baru (Siswa & Guru)

##### A. Registrasi Siswa Baru (Siswa 2)
1. Buka halaman utama [http://localhost:5173](http://localhost:5173) lalu klik **Daftar Sebagai Siswa**.
2. Masukkan **NISN: `0080000102`** (Budi Santoso).
3. Klik **Verifikasi NISN**. Sistem akan mencocokkan data ke database simulasi Dapodik secara otomatis dan memunculkan nama *"Budi Santoso"*.
4. Lengkapi formulir dengan email (misal: `budi@gmail.com`) dan password, lalu klik **Daftar**.
5. Akun siswa baru berhasil dibuat dan otomatis terhubung dengan sekolah asalnya di Dapodik.

##### B. Registrasi Guru Baru (Guru 2)
1. Kembali ke halaman utama, klik **Daftar Sebagai Guru**.
2. Masukkan **NIP: `198710102010121101`** (Heri Setiawan).
3. Klik **Verifikasi NIP**. Sistem akan mencocokkan data ke Dapodik dan menampilkan nama *"Heri Setiawan"*.
4. Lengkapi email (misal: `heri@gmail.com`) dan password, lalu klik **Daftar**.
5. Akun guru baru berhasil dibuat.

#### Langkah 3: Demo Tambah SPPG Baru oleh Admin (SPPG 2)
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


#### Langkah 4: Demo Input Menu & Validasi AI Vision oleh SPPG

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

#### Langkah 5: Demo Ulasan Kritis & Live Notifikasi WhatsApp (Siswa ➔ SPPG)

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

#### Langkah 6: Demo Moderasi Guru & Notifikasi Lonceng Web

1. Logout dari Siswa, lalu login sebagai Guru Baru: `heri@gmail.com` (password saat daftar).
2. Di pojok kanan atas, perhatikan **ikon lonceng** menyala merah. Klik lonceng tersebut, akan muncul notifikasi web: *"Ulasan Baru dari Siswa Budi Santoso"*.
3. Masuk ke halaman **Moderasi Ulasan**. Ulasan dari Budi Santoso akan terlihat.
4. Klik tombol **Tandai Ulasan** (flagged), lalu masukkan alasan moderasinya (misal: *"Ulasan mengandung keluhan fatal gizi buruk"*).
5. Logout dari Guru, lalu login kembali sebagai Siswa: `budi@gmail.com`.
6. Klik **ikon lonceng** pada akun Budi Santoso.
7. Tunjukkan notifikasi web yang masuk: *"Ulasan Anda pada tanggal [Tanggal] telah ditandai oleh guru. Alasan: Ulasan mengandung keluhan fatal gizi buruk."* *(Tunjukkan bahwa notifikasi ini hanya masuk ke web lonceng saja, tidak mengirim pesan WhatsApp ke siswa).*

#### Langkah 7: Demo Ringkasan Evaluasi AI Publik
1. Logout dari semua akun (menjadi pengunjung publik anonim).
2. Masuk ke menu **Peta Sekolah & SPPG**, lalu cari sekolah SD Negeri 1 Bocor atau dapur `Dapur Demo Gizi`.
3. Buka tab **Evaluasi Dapur**.
4. Tunjukkan visualisasi grafik tingkat kepuasan ulasan siswa serta **Ringkasan Analisis Sentimen AI** (dirangkum oleh Gemini API menjadi 2 paragraf evaluasi berkala) yang dapat diakses secara transparan oleh publik umum.


# BAB VI: MANAJEMEN TIM, KONTRAK TIM, DAN RETROSPEKTIF

## 6.1 Identitas dan Pembagian Peran Tim (Team Contract)
**Versi:** 2.0  
**Tanggal Efektif:** 30 Maret 2026  
**Durasi Proyek:** 12 Minggu  
**Nama Tim:** CEO MBG  
**Nama Proyek:** HaloMBG  

### 1. Identitas Tim

| Nama Lengkap | NIM | Email |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | adityamulyaf@gmail.com |
| Fairuz Shiba Alkhirza | L0124014 | fairuzziba@gmail.com |
| Yashif Victoriawan | L0124124 | yashif.vkt@gmail.com |
| Nurman Aqil Wicakcono | L0124139 | nurmanaqil.25@gmail.com |

### 2. Peran dan Tanggung Jawab

#### 2.1 Rolling Peran

Peran anggota tim dirotasi setiap 3 minggu.

| Minggu | Project Manager | Developer 1 | Developer 2 | QA/Docs |
|---|---|---|---|---|
| 1–3 | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono |
| 3–6 | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya |
| 6–9 | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza |
| 9–12 | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan |

#### 2.2 Deskripsi Peran

##### Project Manager
- Memimpin sprint planning dan sprint review.
- Memastikan semua task ter-assign dan memiliki deadline yang jelas di Notion.
- Memantau progres tim dan mengidentifikasi blocker.
- Menjadi representasi tim dalam komunikasi eksternal (asisten/dosen/klien).
- Membuat sprint summary di akhir setiap minggu.
- Memfasilitasi pengambilan keputusan teknis jika terjadi perbedaan pendapat.

##### Developer
- Mengimplementasikan fitur sesuai spesifikasi yang telah disepakati.
- Menulis unit test untuk kode yang dibuat.
- Melakukan code review terhadap pull request dari anggota lain.
- Mengikuti standar commit message yang ditetapkan (lihat Bagian 7).
- Mendokumentasikan perubahan teknis yang signifikan.

##### QA/Docs
- Melakukan testing (fungsional, integrasi, regression) terhadap fitur yang dikembangkan.
- Membuat dan memperbarui test case di Notion.
- Menulis dan memperbarui dokumentasi teknis dan user guide.
- Melaporkan bug melalui mekanisme yang disepakati (GitHub Issues / Notion).
- Memastikan Definition of Done (DoD) terpenuhi sebelum fitur di-merge.

### 3. Tech Stack & Environment


Seluruh anggota tim wajib menggunakan tech stack yang sama untuk menghindari konflik environment.


| Kategori | Teknologi |
|---|---|
| Bahasa Pemrograman | *PHP, JavaScript* |
| Framework | *Laravel, ReactJS* |
| Database | *PostgreSQL* |
| Version Control | Git & GitHub |
| Project Management | GitHub Project |
| Komunikasi | WhatsApp Group |
| Code Editor | *Visual Studio Code* |


### 4. Jadwal Meeting & Ritme Sprint


#### 4.1 Meeting Rutin
- **Sprint Planning:** Setiap awal minggu pertama sprint (sesuai jadwal Praktikum RPL).
- **Sprint Review & Retrospective:** Setiap akhir sprint.
- **Daily Standup (opsional):** Melalui WhatsApp Group — setiap anggota melaporkan: *apa yang sudah dikerjakan, apa yang akan dikerjakan, ada blocker atau tidak*.


#### 4.2 Durasi Sprint
- 1 sprint = **3 minggu**, mengikuti rotasi peran.


#### 4.3 Kebijakan Ketidakhadiran
- Anggota yang tidak bisa hadir meeting **wajib izin** kepada Project Manager minimal **2 jam sebelum** meeting dimulai.
- Anggota yang tidak hadir tetap bertanggung jawab membaca notulensi dan mengerjakan task yang sudah di-assign.
- Lebih dari **2 kali absen tanpa izin** dalam satu sprint akan dilaporkan ke mekanisme eskalasi (lihat Bagian 9).


### 5. Channel Komunikasi


| Channel | Kegunaan | Response Time |
|---|---|---|
| WhatsApp Group | Komunikasi cepat, info mendadak, daily standup | Maks. **2 jam** di jam aktif (08.00–22.00) |
| GitHub Project | Dokumentasi, sprint board, task management, test case | Diperbarui setiap kali ada perubahan task |
| GitHub Issues | Pelaporan bug dan diskusi teknis | Maks. **1 hari kerja** |
| Pull Request (GitHub) | Code review dan feedback teknis | Review dalam **1 hari kerja** setelah PR dibuat |


### 6. Branching Rule


#### Struktur Branch
```
main
├── staging
│   └── dev
│       └── feature/nama-fitur
```


#### Flow
```
feature/nama-fitur → dev → staging → main
```


#### Aturan
- **Dilarang** push langsung ke `main` atau `staging`.
- Setiap fitur baru harus dibuat di branch `feature/nama-fitur`.
- Merge ke `dev` melalui Pull Request dan memerlukan minimal **1 review** dari anggota lain.
- Merge ke `staging` dilakukan setelah QA sign-off.
- Merge ke `main` dilakukan hanya untuk release resmi dan disetujui oleh Project Manager.


### 7. Standar Commit Message


#### Format
```
<type>(<scope>): <short description>
```


#### Tipe Commit


| Tipe | Kegunaan |
|---|---|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan pada dokumentasi |
| `style` | Perubahan formatting, tanpa perubahan logika |
| `refactor` | Refactoring kode |
| `test` | Menambah atau memperbaiki test |
| `chore` | Pembaruan konfigurasi, dependency, build tools |


#### Contoh
```
feat(auth): add JWT token validation on login endpoint
fix(cart): resolve null pointer when cart is empty
docs(api): update endpoint documentation for /products
test(user): add unit tests for password hashing utility
refactor(database): extract connection logic into separate module
```

### 8. Standar Kualitas & Definition of Done (DoD)


Sebuah task dianggap **Done** jika memenuhi **semua** kriteria berikut:


- [ ] Kode telah di-review dan disetujui oleh minimal **1 anggota** lain via Pull Request.
- [ ] Unit test ditulis dan semua test **lolos (pass)**.
- [ ] Tidak ada breaking changes pada fitur yang sudah ada (regression test lolos).
- [ ] Kode sudah di-merge ke branch `dev`.
- [ ] Dokumentasi teknis terkait sudah diperbarui di Notion.
- [ ] Task di sprint board sudah dipindahkan ke kolom **Done**.
- [ ] QA minggu berjalan telah memberikan **sign-off**.


### 9. Mekanisme Eskalasi


#### 9.1 Konflik Teknis (Perbedaan Pendapat Implementasi)
1. Diskusikan di thread GitHub PR atau WhatsApp Group — beri batas waktu **24 jam**.
2. Jika tidak ada kesepakatan, Project Manager mengambil keputusan final.
3. Jika Project Manager terlibat dalam konflik, keputusan diambil melalui **voting** (suara terbanyak).


#### 9.2 Anggota Tidak Memenuhi Tanggung Jawab
1. **Peringatan lisan** dari Project Manager (via WhatsApp/meeting).
2. Jika berlanjut dalam sprint yang sama: **peringatan tertulis** di Notion, dicatat dalam sprint summary.
3. Jika berlanjut ke sprint berikutnya: **eskalasi ke asisten/dosen** pembimbing.


#### 9.3 Anggota Tidak Aktif / Ghosting
- Jika anggota tidak memberikan kabar selama **lebih dari 3 hari kerja berturut-turut** tanpa alasan yang jelas, Project Manager langsung melaporkan ke asisten/dosen pembimbing.


#### 9.4 Kontak Eskalasi Eksternal
| Pihak | Kontak |
|---|---|
| Asisten Praktikum | *Rifqi Makarim, Ravelin Lutfhan Syach Putra* |
| Dosen Pengampu | *Haryono Setiadi, S.T., M.Eng.* |


### 10. Konsekuensi Pelanggaran


| Pelanggaran | Konsekuensi |
|---|---|
| Absen meeting tanpa izin (1–2x) | Peringatan lisan dari PM |
| Absen meeting tanpa izin (>2x dalam 1 sprint) | Eskalasi |
| Tidak menyelesaikan task tanpa alasan | Beban task tidak ditransfer otomatis |
| Melanggar branching rule (push ke main/staging langsung) | Wajib memperbaiki sendiri |
| Tidak melakukan code review dalam 1 hari kerja | Diingatkan PM; jika berulang, dicatat di sprint summary |


### 11. Perubahan Kontrak


- Setiap perubahan kontrak harus diusulkan secara tertulis di WhatsApp Group atau GitHub Project.
- Perubahan dianggap sah jika disetujui oleh **minimal 3 dari 4 anggota**.
- Kontrak yang diperbarui diberi versi baru (misal: v1.0 → v1.1) dan dicatat tanggal perubahannya.


*Dokumen ini berlaku sejak tanggal efektif dan dapat diperbarui sesuai prosedur pada Bagian 11.*

## 6.2 Evaluasi & Retrospektif Kerja Kelompok
**Tim:** CEO MBG  
**Proyek:** HaloMBG — Aplikasi Monitoring Program Makan Bergizi Gratis  
**Periode:** Sprint 1–4 (Minggu 1–12)  
**Tanggal Penyusunan:** 29 Juni 2026  

Retrospektif adalah salah satu praktik terpenting dalam metodologi Agile. Tujuannya bukan mencari siapa yang salah, melainkan menemukan cara tim bisa berkembang bersama. Dokumen ini disusun secara jujur dan terbuka oleh seluruh anggota tim CEO MBG setelah menyelesaikan pengembangan platform HaloMBG dari tahap perencanaan (SRS, backlog, user stories) hingga implementasi fitur BL-01 sampai BL-13.

### What Went Well ✅
Hal-hal positif yang berhasil dilakukan tim dan perlu dipertahankan.

* **Backlog dan SRS yang jelas sejak awal.** Penyusunan backlog.md, srs.md, dan user-stories.md di tahap awal membuat prioritas fitur (Must-have, Should-have, Could-have) selalu jelas, sehingga tim tidak kebingungan menentukan apa yang harus dikerjakan lebih dulu — misalnya BL-01 (autentikasi) dan BL-06 (master data) dikerjakan sebagai fondasi sebelum fitur lain seperti validasi AI atau ulasan siswa.
* **Branching workflow konsisten.** Alur `feature/nama-fitur` → `dev` → `staging` → `main` yang disepakati di Team Contract benar-benar dijalankan, terlihat dari riwayat commit yang rapi dengan puluhan Pull Request bertahap (autentikasi, profil SPPG, distribusi, AI validation, AI summary, WhatsApp API, notifikasi kritis, statistik admin, hingga Google Auth).
* **Integrasi AI berjalan sesuai rencana.** Validasi nutrisi berbasis foto (BL-05) dan ringkasan evaluasi sentimen (BL-13) berhasil diimplementasikan menggunakan model AI vision, sesuai kriteria selesai yang sudah dirancang sejak tahap backlog.
* **Dokumentasi berjalan beriringan dengan development.** Selain kode, tim konsisten memperbarui README.md, user-manual.md, test-cases.md, dan api.md di setiap sprint.
* **Rolling peran membuat semua anggota merasakan setiap tanggung jawab.** Setiap anggota bergiliran menjadi Project Manager, Developer, dan QA/Docs setiap 3 minggu sehingga beban kerja tersebar rata.
* **Notifikasi WhatsApp dan deteksi ulasan kritis berhasil terintegrasi end-to-end**, termasuk perbaikan bug sinkronisasi notifikasi antar role yang ditemukan saat testing.

### What Didn't Go Well ⚠️
Hambatan dan masalah yang muncul selama pengerjaan proyek.

* *Beberapa bug ditemukan cukup larut*, seperti masalah sinkronisasi notifikasi antar role dan bug tampilan (white blur berlebihan, scroll yang dimulai di tengah halaman), yang menunjukkan testing manual di beberapa fitur baru dilakukan setelah merge, bukan sebelum.
* *Beberapa fitur Could-have (BL-10, BL-11, BL-12, BL-13) sempat tertunda* karena dependensinya terhadap fitur ulasan siswa (BL-09) yang juga masih berkembang, sehingga sebagian pekerjaan menumpuk di sprint-sprint akhir.
* *Resolusi konflik merge cukup sering terjadi*, terutama pada branch dev saat beberapa fitur besar (notifikasi kritis, AI validation) dikerjakan paralel oleh anggota berbeda dalam rentang waktu yang berdekatan.
* *Refactor struktural* (misalnya pemindahan logika resolusi profil SPPG ke model User) dilakukan agak terlambat di tengah-tengah proyek, alih-alih direncanakan sejak desain awal.
* *Komunikasi async via WhatsApp Group kadang terlambat direspons* di luar jam aktif yang disepakati (08.00–22.00), terutama saat anggota memiliki kesibukan akademik lain di luar praktikum.


### What Can We Improve 💡
Ide konkret untuk perbaikan di proyek atau kerja tim berikutnya.

* **Tambahkan code review checklist dan testing minimal sebelum merge ke dev**, bukan hanya mengandalkan satu reviewer, agar bug UI dan sinkronisasi bisa tertangkap lebih awal.
* **Rencanakan struktur data dan refactor besar di awal sprint**, bukan menyisipkannya di tengah pengerjaan fitur lain, untuk mengurangi risiko regresi pada fitur yang sudah stabil.
* **Pecah fitur dengan dependensi panjang** (seperti BL-09 → BL-10 → BL-12 → BL-13) menjadi sub-task yang lebih granular di awal sprint planning.
* **Gunakan branch staging lebih aktif untuk uji integrasi sebelum ke main**, terutama untuk fitur yang melibatkan integrasi pihak ketiga (WhatsApp Gateway, Google OAuth, AI Vision) yang rawan gagal di environment berbeda.
* **Tetapkan jadwal review berkala untuk dokumentasi teknis** (API docs, data dictionary) agar selalu sinkron dengan perubahan kode, tidak hanya diperbarui saat akan submit.

### Shout-outs 🌟
Apresiasi tulus untuk anggota tim yang berkontribusi luar biasa.

* **Firizqi Aditya Mulya** — kontribusi commit terbanyak dan menjadi tulang punggung pada fitur-fitur kompleks seperti integrasi AI, WhatsApp API, dan perbaikan bug lintas role. Inisiatifnya menjaga README.md selalu mutakhir sangat membantu tim.
* **Fairuz Shiba Alkhirza** — konsisten mengerjakan fitur-fitur notifikasi dan distribusi yang krusial bagi alur utama aplikasi, serta aktif dalam penulisan user manual untuk audiens awam.
* **Yashif Victoriawan** — kontribusi solid pada perbaikan UI/UX dan stabilitas fitur, membantu menjaga kualitas tampilan aplikasi tetap rapi di tengah padatnya fitur baru yang masuk.
* **Nurman Aqil Wicaksono** — peran QA/Docs yang konsisten dalam menyusun test case dan memastikan Definition of Done terpenuhi sebelum fitur dianggap selesai, menjaga kualitas rilis tetap terjaga.

Secara keseluruhan, tim CEO MBG berhasil membawa HaloMBG dari sekadar dokumen SRS dan backlog menjadi platform yang fungsional dengan 13 backlog item terimplementasi, lengkap dengan integrasi AI, notifikasi WhatsApp, dan dokumentasi yang menyertainya. Pelajaran dari retrospektif ini akan menjadi bekal untuk pengembangan lanjutan maupun proyek-proyek berikutnya.

> Dokumen ini disusun bersama oleh seluruh anggota Tim CEO MBG sebagai bagian dari proses Sprint Review & Retrospective sesuai Team Contract Bagian 4.1.


# BAB VII: PENUTUP

## 7.1 Kesimpulan
Berdasarkan pengerjaan Tugas Praktikum Bersama ini, tim **CEO MBG** telah berhasil menyelesaikan dan mengimplementasikan seluruh item backlog aplikasi **HaloMBG** (BL-01 sampai BL-13) dengan sukses. Aplikasi ini berhasil mengintegrasikan framework Laravel 13, ReactJS, basis data PostgreSQL, Docker Compose, serta layanan pihak ketiga berupa Google Gemini AI (untuk analisis foto makanan dan sentimen teks) serta WhatsApp Gateway Fonnte (untuk push notification). Pengujian manual UAT menunjukkan seluruh skenario utama berjalan dengan status **PASSED**.

## 7.2 Saran dan Pengembangan Masa Depan
1.  **Pengembangan Unit Testing & Integration Testing**: Menambahkan testing otomatis untuk menekan tingkat bug visual dan logika saat integrasi kode paralel.
2.  **Optimalisasi Model AI**: Mengeksplorasi fine-tuning model AI lokal atau penyesuaian prompt gizi agar validasi foto gizi makanan semakin presisi.
3.  **Integrasi Data Pemerintah**: Menghubungkan secara langsung basis data Dapodik sekolah dan NISN siswa dengan API Kemendikbud di masa depan untuk otomasi data registrasi.


# LAMPIRAN

## Lampiran A: Log Penggunaan AI (AI Usage Log)
Berikut adalah catatan terperinci mengenai penggunaan alat bantu AI oleh tim pengembang dalam proses perancangan, implementasi, dan pengujian sistem **HaloMBG**.

| No | Tanggal | Nama Anggota | Peran Aktif | Fitur / Task (Commit Terkait) | Alat AI | Prompt yang Digunakan | Kode/Solusi yang Dihasilkan AI | Modifikasi & Verifikasi Mandiri (Oleh Manusia) |
|---|---|---|---|---|---|---|---|---|
| 1 | 02 Apr 2026 | Fairuz Shiba A. | Developer 1 | Draf Kontrak Tim (`add: contract team` - a9c52241) | ChatGPT | "Bantu buat draf dokumen Team Contract untuk praktikum kuliah RPL. Kami ada 4 orang anggota tim, peran PM, Dev, dan QA dirotasi tiap 3 minggu. Stack kami PHP Laravel + React. Sebutkan poin-poin standar branching rules, jadwal rapat, dan konsekuensi jika melanggar." | Templat markdown dasar berisi deskripsi peran, rotasi periodik, jadwal rapat mingguan, dan branching rule standar. | Menyesuaikan jadwal praktikum riil, memasukkan nama asisten praktikum UNS (Rifqi/Ravelin), dan dosen pengampu asli. |
| 2 | 05 Apr 2026 | Nurman Aqil W. | QA/Docs | Finalisasi Isi Kontrak Tim (`Docs: Menambahkan isi kontrak tim HeloMBG` - 7b39163a) | ChatGPT | "Saya punya draf tim kontrak praktikum RPL. Tolong rapikan format markdown-nya terutama bagian tabel rotasi peran dan daftar anggota agar rapi dan tidak typo." | Format tabel markdown rotasi peran v2.0 yang presisi dan pembagian subbab penanganan konflik tim. | Memasukkan NIM dan email resmi seluruh anggota tim (Firizqi, Fairuz, Yashif, Nurman). |
| 3 | 14 Apr 2026 | Fairuz Shiba A. | Developer 1 | Draf Awal Product Backlog (`docs: add Backlog` - 473ff001) | ChatGPT | "Saya ingin menyusun product backlog berbentuk tabel untuk aplikasi monitoring program makan bergizi gratis sekolah (HaloMBG). Fiturnya: login multi-role, profil dapur, menu harian, status pengiriman, rating/ulasan siswa, moderasi ulasan oleh guru, notifikasi WA, dan evaluasi dapur pakai AI. Berikan estimasi T-shirt size (S/M/L) dan dependensinya." | Struktur tabel backlog dengan kode BL-01 sampai BL-13 lengkap dengan skala prioritas MoSCoW (Must, Should, Could, Won't-have) dan estimasi awal. | Menyaring prioritas backlog agar fokus pada target MVP utama dan menyambungkannya dengan User Stories. |
| 4 | 14 Apr 2026 | Firizqi Aditya | Project Manager | Penyusunan Problem Statement (`docs: add problem statement` - 8382bfcc) | ChatGPT | "Tolong buatkan problem statement yang formal dalam Bahasa Indonesia untuk aplikasi HaloMBG. Fokus masalahnya adalah kurangnya transparansi distribusi makanan bergizi gratis dari dapur ke sekolah, tidak adanya verifikasi gizi menu harian secara real-time, dan belum ada wadah bagi siswa untuk melapor makanan basi atau terlambat." | Paragraf problem statement terstruktur yang menjelaskan isu akuntabilitas distribusi makanan gratis serta pentingnya solusi terintegrasi AI HaloMBG. | Menyesuaikan istilah-istilah di lapangan agar sesuai dengan konsep Satuan Pelayanan Pemenuhan Gizi (SPPG) di Indonesia. |
| 5 | 15 Apr 2026 | Yashif V. | Developer 2 | Pembuatan Berkas User Stories (`adding new docs:user-story.md` - b7e1d508) | Claude 3.5 | "Bantu buatkan daftar User Stories (US) dalam format 'As a... I want to... So that...' untuk 4 role di aplikasi HaloMBG: Operator SPPG, Siswa, Guru, dan Administrator." | Daftar User Stories standar agile untuk seluruh fungsionalitas monitoring dan pelaporan gizi. | Mengelompokkan kode US-01 s.d US-12 dan mencocokkannya dengan ID Backlog proyek. |
| 6 | 20 Apr 2026 | Nurman Aqil W. | Developer 2 | Penyusunan Berkas Spesifikasi SRS (`Docs: Menambahkan Software Requirements Specification (SRS) untuk P3` - fbd22c67) | ChatGPT | "Buatkan templat dan draf awal dokumen SRS (Software Requirements Specification) standar IEEE 830 dalam bahasa Indonesia untuk aplikasi monitoring program makan bergizi sekolah (HaloMBG). Cantumkan deskripsi umum sistem dan kebutuhan antarmuka eksternal." | Kerangka dokumen SRS formal dengan subbab spesifikasi kebutuhan fungsional dan non-fungsional. | Menambahkan use case diagram tim, merinci kebutuhan hardware/software minimal pengembangan, dan menyelaraskan dengan backlog. |
| 7 | 04 Mei 2026 | Fairuz Shiba A. | Project Manager | Pembuatan Kamus Data Proyek (`add data-dictionary` - 4c2fc27c) | ChatGPT | "Tolong buatkan tabel kamus data markdown untuk database aplikasi HaloMBG. Tabelnya: users, sppg_profiles, schools, daily_menus, dan reviews. Jelaskan tipe data, panjang kolom, nullability, dan keterangannya." | Skema kamus data berformat markdown untuk tabel-tabel utama PostgreSQL. | Menambahkan kolom relasi pivot (seperti `sppg_schools`), menyesuaikan dengan constraint DB, dan mendaftarkan tipe data gizi makro. |
| 8 | 08 Mei 2026 | Yashif V. | Developer 1 | Perancangan Class Diagram (`added class-diagram.png` - db108034) | Claude 3.5 | "Bagaimana cara merepresentasikan relasi antarentitas dalam class diagram untuk sistem monitoring sekolah ini? Relasi: User punya profile (student/teacher/sppg), SPPG melayani banyak sekolah, SPPG menginput menu harian, menu harian punya status distribusi, dan siswa memberikan review." | Penjelasan jenis hubungan antarentitas (association, aggregation, composition) serta representasi atribut dan method-nya. | Menggambar model kelas secara visual menggunakan draw.io dan mengekspornya ke folder `docs/uml`. |
| 9 | 08 Mei 2026 | Nurman Aqil W. | Developer 2 | Perancangan Activity Diagram (`Menambahkan activity diagram` - b45fa3a8) | ChatGPT | "Jelaskan alur activity diagram untuk proses 'Input Menu Harian & Validasi Gizi oleh AI' di aplikasi HaloMBG, dimulai dari operator masuk ke dashboard sampai status nutrisi tervalidasi oleh sistem." | Deskripsi langkah demi langkah alur kerja proses input menu oleh operator, pemanggilan API AI backend, hingga perubahan status data di DB. | Menggambar diagram aktivitas menggunakan alat visualisasi UML untuk diletakkan di repositori. |
| 10 | 18 Mei 2026 | Fairuz Shiba A. | QA/Docs | Penambahan Fitur Soft Deletes (`add-delete_at` - 02d1d7ef) | GitHub Copilot | "Cara menambahkan field deleted_at (soft deletes) ke tabel migration Laravel yang sudah ada." | Kode migration laravel menggunakan method `$table->softDeletes();` dan import trait `SoftDeletes` di model. | Mengonfigurasi seluruh migration utama master data (SPPG, Sekolah, User) agar aman dari penghapusan permanen tidak sengaja. |
| 11 | 20 Mei 2026 | Fairuz Shiba A. | QA/Docs | Konfigurasi Otentikasi API Token (`add-sanctum-lib-to-make-login-panel` - 37709d5c) | ChatGPT | "Bagaimana cara setup Laravel Sanctum untuk aplikasi SPA React agar otentikasinya menggunakan API Token?" | Perintah instalasi paket Laravel Sanctum, konfigurasi middleware API di `bootstrap/app.php`, dan login handler returning token. | Menambahkan modifikasi response JSON login agar menyertakan data profile lengkap (NIP/NISN) dan role pengguna untuk keperluan routing. |
| 12 | 21 Mei 2026 | Firizqi Aditya | Developer 2 | CRUD Master SPPG & Sekolah (`feat: implement and test US-13 admin manage SPPG and schools` - 6b8de086) | GitHub Copilot | "Buat controller Laravel CRUD lengkap untuk model SppgProfile dengan validasi data masukan nama dapur, alamat, kecamatan, dan nomor telepon." | Controller boilerplate untuk proses index, store, update, destroy beserta penulisan file FormRequest-nya. | Menambahkan logika transaksional database (`DB::transaction`) untuk mengotomatisasi pembuatan user login baru ber-role SPPG saat profil dapur baru disimpan admin. |
| 13 | 25 Mei 2026 | Yashif V. | Project Manager | Kontainerisasi Multi-Service (`feat/docker-setup-yz` - ab6b2c94) | Claude 3.5 | "Buat file docker-compose.yml untuk stack Laravel (backend) + React Vite (frontend) + PostgreSQL + Nginx. Pastikan container backend bisa mengakses database setelah database selesai booting." | Konfigurasi file `compose.yaml` lengkap dengan dependensi service database dan mount volume persisten PostgreSQL. | Mengubah port postgres host luar ke `5433` untuk mencegah tabrakan port dengan database lokal di laptop tim, dan menyusun docker-entrypoint backend. |
| 14 | 25 Mei 2026 | Firizqi Aditya | Developer 2 | Proteksi Route Frontend SPA (`feat: complete login frontend: role redirect, env config, and role routes` - 6522372d) | ChatGPT | "Buat sistem proteksi rute di React Router v6 berdasarkan role user (admin, sppg, guru, siswa) yang didapat dari AuthContext." | Komponen protektor React (`ProtectedRoute.jsx`) menggunakan React Router DOM untuk mengecek token aktif dan me-redirect paksa jika role tidak cocok. | Menambahkan loader spinner estetik dari Tailwind CSS saat menunggu proses verifikasi token ke API backend. |
| 15 | 26 Mei 2026 | Firizqi Aditya | Developer 2 | Seeder Sekolah Massal (`feat: import school.csv, implement search for school, SchoolSeeder` - 2e6c206e) | ChatGPT | "Bagaimana cara parsing file CSV data sekolah di Laravel Seeder agar tidak memakan memori berlebih saat melakukan insert ratusan baris?" | Script parsing seeder Laravel menggunakan fungsi `fopen` dan manipulasi file CSV baris-per-baris dengan chunking. | Menggunakan data sekolah asli di wilayah Kebumen dan sekitarnya (seperti SD Negeri 1 Bocor) yang didapat dari data Dapodik tim. |
| 16 | 27 Mei 2026 | Firizqi Aditya | Developer 2 | Layouting Dashboard Publik (`feat: add public landing page and role dashboard` - 42900738) | GitHub Copilot | "Buat layout modern dashboard untuk portal publik HaloMBG menggunakan CSS modern (Flexbox/Grid). Tampilkan peta sekolah dan bar pencarian SPPG." | Struktur markup JSX dan stylesheet CSS untuk dashboard utama pencarian informasi sekolah dan dapur. | Menyesuaikan palet warna primer Navy (`#071E49`) dan Spacing Grid berkelipatan `8px` sesuai panduan `DESIGN.md`. |
| 17 | 31 Mei 2026 | Fairuz Shiba A. | QA/Docs | Definisi Model Relasi Dapur (`add-profil-dapur` - 58e8aa28) | GitHub Copilot | "Definisikan relasi Eloquent di model Laravel untuk SppgProfile yang terhubung dengan User (one-to-one) dan School (many-to-many)." | Method penulisan relasi `belongsTo(User::class)` dan `belongsToMany(School::class)` pada model Eloquent. | Menambahkan setup kolom pivot tambahan `sppg_schools` untuk menyimpan informasi status keaktifan hubungan dapur-sekolah. |
| 18 | 05 Jun 2026 | Yashif V. | QA/Docs | WebRTC Kamera Input Menu (`feat: input menu with integrated validation ai nutrition check` - 65971b43) | Claude 3.5 | "Di React, buat form input menu harian (nama menu, kalori, protein, karbohidrat, lemak, foto) yang terintegrasi dengan akses kamera WebRTC menggunakan tag video, canvas capture, dan mengirimkan datanya ke API Laravel sebagai JSON base64." | Komponen fungsional React untuk menangkap stream WebRTC dari kamera, mentransfer frame ke canvas, mengekstraksi base64 string, dan mengirimkannya dalam form submit. | Menambahkan styling kotak pembatas visual kamera dan notifikasi transparan pop-up jika status verifikasi AI backend mengembalikan peringatan nutrisi tidak wajar. |
| 19 | 05 Jun 2026 | Nurman Aqil W. | Project Manager | Pencarian Fuzzy SPPG Publik (`Lengkapi fitur pencarian SPPG` - 87b81842) | ChatGPT | "Buat controller Laravel API untuk mencari dapur SPPG berdasarkan nama kecamatan atau nama sekolah terdekat yang dilayani menggunakan pencarian SQL LIKE." | Query Eloquent Laravel dengan klausa `where` bertingkat dan `orWhereHas` untuk relasi pencarian sekolah. | Memperbaiki fungsionalitas input search di React agar melakukan debounce (menunda request) selama 500ms agar server tidak kelebihan beban saat user mengetik. |
| 20 | 07 Jun 2026 | Firizqi Aditya | Developer 1 | Integrasi Google Gemini Vision API (`feat: ai api` - 18764e03) | Gemini | "Tulis service PHP Laravel untuk mengirim foto base64 ke Google Gemini Vision API (`gemini-flash-lite-latest`). Tujuannya memvalidasi kesesuaian antara foto porsi makanan dengan angka klaim kandungan gizi makro yang diinput user. Return format harus JSON: {is_valid: boolean, warning_message: string}." | Kelas service Laravel `GeminiValidationService` menggunakan HTTP Client Laravel untuk memosting gambar base64 ke REST API Google Gemini beserta prompt ahli gizi terstruktur. | Menghapus bagian header format data URI base64 dari frontend (`data:image/jpeg;base64,`) menggunakan fungsi PHP Regex sebelum dikirimkan ke model Gemini, dan mencatat log mentah respons jika format error. |
| 21 | 08 Jun 2026 | Fairuz Shiba A. | Developer 2 | Scheduler Keterlambatan Distribusi (`feature: notivication via whatsapp for late distribution` - 5594d0f4) | Gemini | "Buat custom Artisan Command di Laravel untuk memeriksa tabel `distribution_statuses` yang belum diantar setelah jam 12.00 siang, lalu otomatis kirim notifikasi WhatsApp ke nomor dapur SPPG menggunakan REST API WhatsApp gateway." | Kerangka file perintah Artisan Laravel (`app/Console/Commands/CheckLateDistribution.php`) dengan logika looping data bermasalah dan integrasi cURL WhatsApp. | Mengintegrasikan file perintah dengan Laravel Task Scheduler di `routes/console.php` agar dieksekusi otomatis secara berkala di latar belakang server. |
| 22 | 08 Jun 2026 | Nurman Aqil W. | Project Manager | Otomasi Seeder Relasi Wilayah (`Aligning schools with SPPG based on their  address` - f6a2d62b) | GitHub Copilot | "Tulis database seeder Laravel untuk menghubungkan sekolah-sekolah ke dapur SPPG terdekat secara otomatis berdasarkan kesamaan string nama kecamatan atau wilayah." | Struktur perulangan seeder menggunakan query database dengan pencocokan substring `like` untuk alamat. | Mengarahkan seeder agar secara khusus mengaitkan Dapur SPPG dengan SD Negeri 1 Bocor sebagai data uji coba utama. |
| 23 | 08 Jun 2026 | Fairuz Shiba A. | Developer 2 | Dropdown Polling Notifikasi React (`feature: notification for guru and admin on bell icon` - 756109e4) | ChatGPT | "Di ReactJS, buat komponen bell notification dropdown yang polling ke backend Laravel setiap 30 detik untuk menarik notifikasi baru belum terbaca." | State hooks React untuk menampung data notifikasi, pemanggilan interval Axios, dan dropdown rendering. | Mengoptimasi performa rendering agar tidak terjadi re-render seluruh halaman saat data notifikasi baru ditarik, dan merapikan layout list. |
| 24 | 09 Jun 2026 | Firizqi Aditya | Developer 1 | Integrasi Notifikasi WA Ulasan Kritis (`feat: whatsapp api` - a2790398) | ChatGPT | "Tulis fungsi backend Laravel untuk mengirim notifikasi WhatsApp otomatis ke nomor dapur SPPG ketika sistem mendeteksi ada ulasan dari siswa dengan rating < 3 atau ulasan berisi kata 'basi', 'tidak layak', atau 'busuk'." | Event listener di Laravel yang memicu pengiriman notifikasi WhatsApp via API gateway jika ulasan siswa memenuhi kriteria negatif. | Menyimpan endpoint gateway dan token keamanan API ke dalam berkas konfigurasi `.env`, serta menambahkan *queue listener* agar proses pengiriman berjalan asinkron. |
| 25 | 11 Jun 2026 | Firizqi Aditya | Developer 1 | AI Ringkasan Sentimen Dapur (`feat: ai summary` - e548d1db) | Gemini | "Bagaimana cara mengambil semua teks ulasan siswa untuk dapur SPPG tertentu dalam 24 jam terakhir, lalu mengirimkannya ke Gemini API untuk dirangkum menjadi 2 paragraf evaluasi sentimen publik berbahasa Indonesia?" | Query penarikan ulasan harian, serialisasi ulasan ke dalam prompt Gemini, dan API call untuk meminta rangkuman evaluasi. | Membuat tabel migrasi database `ai_sentiment_summaries` untuk mencache hasil analisis sentimen harian agar tidak membebani kuota API Gemini pada setiap kunjungan halaman dapur. |
| 26 | 17 Jun 2026 | Firizqi Aditya | Developer 1 | Pendaftaran Guru dengan Validasi Dapodik (`feat: guru nip & google auth` - dc5c25c6) | Claude 3.5 | "Bagaimana cara mengintegrasikan Laravel Socialite untuk login Google SSO di React Frontend agar backend menerima authorization code dan membuat token akses Sanctum?" | Mekanisme callback controller di backend untuk menukar kode Google auth dengan email pengguna, dan membuat session login. | Menambahkan validasi silang NIP Guru terhadap data Dapodik lokal: pendaftaran hanya diloloskan jika email/NIP terverifikasi di sekolah terkait. |
| 27 | 23 Jun 2026 | Nurman Aqil W. | Project Manager | Kontrol Navigasi Footer (`feat(frontend): Fucntionalize footer as authentification rules` - 1c88a0d4) | ChatGPT | "Buat komponen Footer di React agar elemen navigasi admin atau tautan internal hanya tampil jika role user yang login di AuthContext memiliki izin akses." | Kode JSX kondisional render untuk membatasi link navigasi berdasarkan array roles pengguna. | Menyesuaikan warna latar footer dengan Navy pekat (`#071E49`) dan menyisipkan teks merek HaloMBG berukuran besar sesuai pedoman `DESIGN.md`. |

## Lampiran B: Spesifikasi & Dokumentasi API Backend
Proyek ini menggunakan **[Dedoc Scramble](https://scramble.dedoc.co/)** untuk membuat dokumentasi API secara otomatis tanpa perlu menulis anotasi/atribut OpenAPI secara manual. Scramble menganalisis route, controller, Form Request, dan API Resource Anda secara dinamis untuk menyusun spesifikasi API.

### Cara Mengakses Dokumentasi

Setelah container Docker berjalan, Anda dapat mengakses dokumentasi interaktif melalui:

**URL Backend (Nginx):** [http://localhost/docs/api](http://localhost/docs/api)

> [!NOTE]
> Secara default, dokumentasi ini hanya dapat diakses pada lingkungan lokal (`APP_ENV=local`). Pada lingkungan produksi, akses akan dibatasi oleh middleware bawaan untuk alasan keamanan.

### Best Practices Penulisan Kode untuk Dokumentasi

Agar dokumentasi yang dihasilkan otomatis oleh Scramble lengkap dan informatif, ikuti panduan penulisan kode Laravel di bawah ini:

#### 1. Deskripsi Endpoint (PHPDoc)
Tambahkan komentar PHPDoc di atas method Controller Anda. Baris pertama akan menjadi ringkasan (summary), dan baris berikutnya akan menjadi deskripsi detail endpoint.

```php
/**
 * Mengambil menu harian sekolah.
 *
 * Endpoint ini digunakan untuk mengambil menu makanan bergizi harian beserta
 * detail nutrisinya yang disediakan oleh SPPG untuk sekolah tujuan.
 */
public function getMenuHarian(Request $request)
{
    // ...
}
```

#### 2. Parameter Input (Form Request)
Selalu gunakan **Form Request** untuk validasi data input. Scramble membaca aturan validasi (`rules()`) untuk menentukan field mana yang wajib (`required`), tipe data, limitasi string/angka, dan parameter query/body.

```php
// app/Http/Requests/StoreMenuRequest.php
public function rules(): array
{
    return [
        'nama_menu' => 'required|string|max:100',
        'foto_makanan' => 'required|image|mimes:jpeg,png|max:2048',
        'kalori' => 'required|numeric|min:0',
        'protein' => 'required|numeric|min:0',
    ];
}
```

#### 3. Struktur Output (API Resource / JsonResource)
Gunakan **Eloquent API Resources** untuk mengembalikan response dari controller. Scramble akan menganalisis array pengembalian untuk mendokumentasikan skema JSON response.

```php
// app/Http/Resources/MenuResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'nama_menu' => $this->nama_menu,
        'kalori' => (float) $this->kalori,
        'protein' => (float) $this->protein,
        'created_at' => $this->created_at->toIso8601String(),
    ];
}
```

### Konfigurasi & Keamanan

#### Pembatasan Akses (Production)
Konfigurasi utama terletak di [scramble.php](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/backend/config/scramble.php). 
Secara default, class `RestrictedDocsAccess` membatasi akses di luar `local`. Jika Anda ingin mendefinisikan siapa saja yang boleh mengakses di production (misal Admin), Anda bisa mendaftarkan gate otorisasi di `app/Providers/AppServiceProvider.php` (atau register method Gate Scramble):

```php
use Dedoc\Scramble\Scramble;

public function boot(): void
{
    Scramble::auth(function (Request $request) {
        // Logika otorisasi Anda, misal:
        return $request->user()?->isAdmin() ?? false;
    });
}
```

### Perintah Berguna

Jika Anda melakukan perubahan konfigurasi atau ingin mengoptimalkan dokumentasi:

- **Publish file konfigurasi & view:**
  ```bash
  docker compose exec backend php artisan vendor:publish --provider="Dedoc\Scramble\ScrambleServiceProvider"
  ```
- **Membersihkan cache dokumentasi:**
  ```bash
  docker compose exec backend php artisan scramble:clear
  ```
- **Melakukan caching dokumentasi (untuk produksi):**
  ```bash
  docker compose exec backend php artisan scramble:cache
  ```
