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

# DAFTAR ISI

*   **HALAMAN JUDUL**
*   **PEMBAGIAN PENULISAN LAPORAN**
*   **BAB I: PENDAHULUAN**
    *   1.1 Latar Belakang dan Rumusan Masalah
    *   1.2 Tujuan Proyek
    *   1.3 Ruang Lingkup Proyek
    *   1.4 Definisi dan Akronim
*   **BAB II: ANALISIS KEBUTUHAN SISTEM**
    *   2.1 Deskripsi Umum Sistem
    *   2.2 Kebutuhan Fungsional (Functional Requirements)
    *   2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)
    *   2.4 Ringkasan Product Backlog Kerja Kelompok
*   **BAB III: PERANCANGAN SISTEM**
    *   3.1 Arsitektur Aplikasi dan Tech Stack
    *   3.2 Pemodelan Fungsionalitas Sistem (Diagram UML)
    *   3.3 Desain Database & Ringkasan Kamus Data
    *   3.4 Desain Antarmuka (Figma Wireframe)
*   **BAB IV: IMPLEMENTASI SISTEM**
    *   4.1 Setup Deployment (Docker Compose)
    *   4.2 Screenshot Antarmuka Aplikasi
    *   4.3 Panduan Penggunaan Singkat (User Manual)
*   **BAB V: PENGUJIAN SISTEM (TESTING)**
    *   5.1 Rencana dan Hasil Pengujian (UAT)
    *   5.2 Skenario Demo Pengujian
*   **BAB VI: MANAJEMEN TIM, KONTRAK TIM, DAN RETROSPEKTIF**
    *   6.1 Identitas dan Pembagian Peran Tim (Team Contract)
    *   6.2 Evaluasi & Retrospektif Kerja Kelompok
*   **BAB VII: PENUTUP**
    *   7.1 Kesimpulan
    *   7.2 Saran dan Pengembangan Masa Depan
*   **LAMPIRAN**
    *   Lampiran A: Log Kepatuhan Penggunaan AI (AI Usage Log)
    *   Lampiran B: Spesifikasi & Dokumentasi API Backend

---

\pagebreak

# PEMBAGIAN PENULISAN LAPORAN

Untuk memastikan kontribusi yang adil, pengerjaan draf laporan Word dibagi secara berurutan (linear) dari awal dokumen hingga akhir di antara 4 anggota tim sebagai berikut:

| Nama Anggota Tim | NIM | Bagian / Bab Laporan yang Ditulis | Cakupan Detail Dokumen |
|---|---|---|---|
| **Firizqi Aditya Mulya** | L0124016 | • **Halaman Awal** s.d. **BAB II (Poin 2.2)** | Cover, Daftar Isi, Pembagian Penulisan, BAB I (1.1 s.d 1.4), dan BAB II (2.1 Deskripsi Umum & 2.2 Kebutuhan Fungsional) |
| **Fairuz Shiba Alkhirza** | L0124014 | • **BAB II (Poin 2.3)** s.d. **BAB III (Poin 3.2)** | BAB II (2.3 Kebutuhan Non-Fungsional & 2.4 Ringkasan Backlog), BAB III (3.1 Arsitektur & Tech Stack & 3.2 Pemodelan UML) |
| **Yashif Victoriawan** | L0124124 | • **BAB III (Poin 3.3)** s.d. **BAB IV (Poin 4.3)** | BAB III (3.3 Desain Database/Kamus Data & 3.4 Wireframe Figma), BAB IV (4.1 Docker Setup, 4.2 Screenshots, & 4.3 User Manual) |
| **Nurman Aqil Wicaksono** | L0124139 | • **BAB V** s.d. **LAMPIRAN** | BAB V (5.1 Hasil UAT & 5.2 Skenario Demo), BAB VI (6.1 Kontrak Tim & 6.2 Retrospektif), BAB VII (Penutup), Lampiran A (Log AI) & Lampiran B (API) |

---

\pagebreak



# BAB I: PENDAHULUAN

## 1.1 Latar Belakang dan Rumusan Masalah
Program Makan Bergizi Gratis (MBG) yang dijalankan oleh pemerintah Indonesia melibatkan ribuan Satuan Pelayanan Pemenuhan Gizi (SPPG) atau Dapur MBG yang tersebar di seluruh kabupaten/kota. Namun, hingga saat ini belum tersedia platform terpusat yang memungkinkan publik, termasuk siswa, orang tua, guru, dan masyarakat umum, untuk memantau secara transparan profil dapur, menu harian, kandungan nutrisi, serta status distribusi makanan. Akibatnya, informasi terkait MBG tersebar tidak merata, sulit diverifikasi, dan rentan terhadap penyimpangan yang tidak terdeteksi.

Di sisi lain, berbagai permasalahan operasional telah muncul di lapangan. Kandungan nutrisi yang dipublikasikan oleh dapur MBG kerap tidak akurat karena keterbatasan tenaga ahli gizi serta tidak adanya mekanisme verifikasi silang antara klaim nutrisi dan makanan yang benar-benar disajikan. Selain itu, menu yang diumumkan tidak selalu sesuai dengan yang diterima oleh siswa di sekolah, dan penerima manfaat belum memiliki wadah resmi yang aman untuk menyampaikan ulasan maupun keluhan.

**HaloMBG** hadir sebagai solusi monitoring berbasis web yang mengintegrasikan transparansi data, validasi nutrisi berbasis kecerdasan buatan (AI) melalui analisis foto dan teks, serta partisipasi komunitas. Platform ini bertujuan untuk memastikan program MBG berjalan sesuai standar, meningkatkan akuntabilitas, dan memberikan akses informasi yang terbuka bagi publik.

## 1.2 Tujuan Proyek
Tujuan utama pengembangan platform **HaloMBG** adalah sebagai berikut:
1.  **Transparansi & Akuntabilitas**: Menyediakan platform terpusat bagi publik (orang tua, siswa, guru, dan pemerintah) untuk memantau menu harian, kandungan gizi, dan status distribusi secara terbuka.
2.  **Validasi Nutrisi Otomatis**: Memanfaatkan teknologi Kecerdasan Buatan (AI Vision) untuk melakukan verifikasi visual silang antara klaim kandungan gizi dengan foto asli makanan yang disajikan oleh SPPG.
3.  **Partisipasi Komunitas**: Memberikan wadah umpan balik berupa ulasan, rating bintang, dan unggah foto bagi siswa penerima manfaat, serta mekanisme moderasi bagi guru sekolah.

## 1.3 Ruang Lingkup Proyek
Aplikasi HaloMBG mencakup:
*   Melihat profil dapur SPPG dan sekolah yang dilayani oleh publik tanpa perlu login.
*   Pencarian dapur SPPG berdasarkan nama sekolah atau kabupaten/kota.
*   Pencatatan menu makanan harian lengkap dengan foto dan takaran gizi makro (kalori, protein, lemak, karbohidrat).
*   Analisis otomatis visual porsi makanan menggunakan AI untuk mendeteksi ketidakwajaran nutrisi.
*   Pengunggahan bukti foto distribusi makanan real-time dari dapur ke sekolah.
*   Notifikasi WhatsApp keterlambatan distribusi dan ulasan kritis dari siswa.
*   Pemberian ulasan oleh siswa serta moderasi ulasan tidak layak oleh guru.
*   Ringkasan evaluasi sentimen ulasan harian otomatis menggunakan AI.

*Di luar ruang lingkup (Out of Scope):* Integrasi langsung dengan Dapodik pusat, pengelolaan anggaran keuangan internal SPPG, sistem absensi pengantar, serta aplikasi native mobile.

## 1.4 Definisi dan Akronim
| Akronim / Istilah | Definisi |
|---|---|
| **SRS** | *Software Requirements Specification* (Dokumentasi kebutuhan sistem) |
| **MBG** | Makan Bergizi Gratis (Program nasional penyediaan makanan bergizi sekolah) |
| **SPPG** | Satuan Pelayanan Pemenuhan Gizi (Unit dapur pengelola makanan MBG) |
| **FR / NFR** | *Functional Requirement* / *Non-Functional Requirement* |
| **SSO** | *Single Sign-On* (Otentikasi menggunakan akun pihak ketiga, e.g. Google OAuth) |
| **UAT** | *User Acceptance Testing* (Uji penerimaan pengguna) |


# BAB II: ANALISIS KEBUTUHAN SISTEM

## 2.1 Deskripsi Umum Sistem
HaloMBG dibangun dengan arsitektur decoupled (ReactJS frontend + Laravel API backend). Sistem membagi pengguna ke dalam lima aktor: Publik (tanpa login), Operator SPPG, Siswa, Guru, dan Administrator. Batasan sistem meliputi kewajiban memiliki koneksi internet aktif, kapasitas maksimal unggah berkas foto dibatasi 5 MB, dan notifikasi otomatis dikirimkan melalui WhatsApp Gateway.

## 2.2 Kebutuhan Fungsional (Functional Requirements)
Berikut adalah daftar kebutuhan fungsional sistem:
1.  **FR-01 (Autentikasi Multi-Role & Google SSO)**: Login terpisah untuk Admin, SPPG, Siswa (verifikasi NISN Dapodik), Guru (verifikasi NIP), serta Google SSO.
2.  **FR-02 (Profil Dapur & Sekolah)**: Tampilan halaman profil dapur, alamat, sekolah yang dilayani, dan kontak penanggung jawab.
3.  **FR-03 (Pencarian Dapur/Sekolah)**: Fitur pencarian dapur di landing page berbasis nama sekolah atau kecamatan.
4.  **FR-04 (Kelola Menu Gizi)**: Formulir input menu harian (komponen bahan, foto, dan kandungan gizi makro) oleh SPPG.
5.  **FR-05 (Validasi Nutrisi AI)**: Integrasi dengan Gemini AI Vision untuk mengevaluasi kewajaran porsi foto dengan klaim input gizi.
6.  **FR-06 (Master Data & Admin)**: Dashboard administrator untuk mendaftarkan dapur SPPG baru, memetakan sekolah, dan melihat audit logs.
7.  **FR-07 (Status Distribusi)**: Pembaruan status pengantaran real-time (`Siap Diantar` / `Sudah Diantar`) beserta foto bukti serah terima.
8.  **FR-08 (Notifikasi Keterlambatan)**: Peringatan otomatis WhatsApp ke pihak sekolah dan admin jika status belum terantar pada jam makan siang.
9.  **FR-09 (Ulasan & Rating Siswa)**: Pengiriman ulasan teks, rating bintang 1-5, dan foto makanan oleh siswa terdaftar.
10. **FR-10 (Moderasi Guru)**: Penandaan (*flagging*) ulasan siswa yang tidak sopan atau spam oleh guru sekolah terkait.
11. **FR-11 (WhatsApp Alert Keluhan Kritis)**: Notifikasi WhatsApp instan ke pengelola dapur jika siswa mengirim keluhan berkategori kritis (basi, bau, kotor).
12. **FR-12 (Analisis Sentimen & Rangkuman AI)**: Visualisasi grafik kepuasan dan rangkuman evaluasi ulasan oleh AI Gemini di dashboard dapur.

## 2.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)
1.  **Performance**: Waktu muat halaman publik utama < 3 detik dan waktu respons pencarian < 2 detik pada koneksi normal.
2.  **Security**: Keamanan password menggunakan hashing **bcrypt** (cost factor 10), pembatasan akses token sesi maksimal 24 jam, serta enkripsi koneksi HTTPS.
3.  **Usability**: Tampilan web responsif (minimal resolusi lebar layar 375px) dan antarmuka input menu harian selesai < 5 menit bagi pengguna baru.
4.  **Reliability**: Target ketersediaan layanan sistem (*uptime*) minimal 99% setiap bulan.
5.  **Maintainability**: Kepatuhan penulisan kode mengikuti standar PSR-12 untuk Laravel dan ESLint untuk ReactJS.

## 2.4 Ringkasan Product Backlog Kerja Kelompok
### Daftar Backlog

| ID | Judul | Prioritas | Estimasi | Dependensi |
|


# BAB III: PERANCANGAN SISTEM

## 3.1 Arsitektur Aplikasi dan Tech Stack
Aplikasi HaloMBG menggunakan arsitektur *fully decoupled* (terpisah antara frontend dan backend) untuk performa dan fleksibilitas:
*   **Frontend (Client-Side)**: Dibangun menggunakan **ReactJS** (v18) dengan build tool **Vite**, dan styling menggunakan **Tailwind CSS**. Animasi transisi menggunakan **Framer Motion**, sedangkan penanganan request HTTP menggunakan **Axios**.
*   **Backend (Server-Side)**: Menggunakan framework **Laravel 13** dengan **Laravel Sanctum** untuk otentikasi API berbasis token, serta **Laravel Socialite** untuk integrasi Google SSO.
*   **Database & External Service**: **PostgreSQL 15** sebagai database relasional utama. Integrasi AI menggunakan **Google Gemini API** (model `gemini-flash-lite-latest`) dan integrasi WhatsApp Gateway menggunakan **Fonnte API**.

## 3.2 Pemodelan Fungsionalitas Sistem (Diagram UML)
Diagram-diagram UML berikut digunakan sebagai blueprint pengembangan HaloMBG:
*   **Use Case Diagram**: Menggambarkan interaksi 5 aktor (Publik, SPPG, Siswa, Guru, Admin) dengan fungsi sistem. (Dapat dirujuk pada berkas: `docs/uml/use-case-diagram.png`)
*   **Activity Diagram**: Menggambarkan alur aktivitas transaksi utama sistem, mulai dari input gizi oleh dapur hingga ulasan dari siswa. (Dapat dirujuk pada berkas: `docs/uml/activity-diagram.png`)
*   **Class Diagram**: Visualisasi hubungan antar kelas objek di sistem backend. (Dapat dirujuk pada berkas: `docs/uml/class-diagram.png`)

## 3.3 Desain Database dan Kamus Data
Sistem basis data HaloMBG menggunakan **PostgreSQL 15** untuk memastikan integritas data relasional. Berikut adalah ringkasan entitas/tabel utama yang dirancang pada basis data sistem:

| Nama Tabel | Deskripsi Fungsi |
|---|---|
| `users` | Menyimpan data akun login seluruh pengguna terdaftar (Admin, SPPG, Siswa, Guru). |
| `sppg_profiles` | Menyimpan data profil lengkap operasional masing-masing dapur SPPG. |
| `schools` | Menyimpan data master sekolah penerima program Makan Bergizi Gratis. |
| `sppg_schools` | Pemetaan hubungan distribusi antara dapur SPPG dengan sekolah yang dilayani. |
| `student_profiles` | Data profil tambahan siswa, termasuk validasi NISN terintegrasi Dapodik. |
| `teacher_profiles` | Data profil tambahan guru, termasuk validasi NIP terintegrasi Dapodik. |
| `daily_menus` | Daftar menu masakan harian yang diinput oleh SPPG beserta klaim gizi makro. |
| `ai_validation_logs` | Catatan log hasil analisis dan validasi visual kandungan nutrisi berbasis AI. |
| `distribution_statuses` | Pelacakan status pengantaran makanan dan bukti foto serah terima harian. |
| `student_reviews` | Wadah ulasan, rating, dan foto bukti dari siswa penerima manfaat. |
| `critical_review_followups` | Pencatatan status tindak lanjut oleh SPPG untuk ulasan yang bernada kritis. |
| `followup_history` | Log audit riwayat perubahan status penanganan ulasan kritis. |
| `ai_sentiment_summaries` | Hasil ekstraksi rangkuman sentimen ulasan harian siswa menggunakan AI. |
| `notifications` | Sistem notifikasi internal (*in-app notification*) untuk interaksi pengguna. |
| `notification_logs` | Log histori pengiriman push notification WhatsApp Gateway. |
| `audit_logs` | Catatan aktivitas administratif pada pengelolaan master data sekolah dan SPPG. |


## 3.4 Desain Antarmuka (Figma Wireframe)
*   Desain visual awal (*wireframe*) dan tautan Figma proyek dapat diakses pada berkas: `docs/wireframes/figma.md`


# BAB IV: IMPLEMENTASI SISTEM

## 4.1 Setup Deployment (Docker Compose)
HaloMBG dikemas menggunakan Docker Compose untuk konsistensi environment pengembangan dan produksi. Komposisi container meliputi:
*   `frontend`: Menjalankan server web statis ReactJS berbasis Nginx.
*   `backend`: Menjalankan server php-fpm (Laravel 13).
*   `db`: Container database PostgreSQL 15 dengan volume persisten data.
*   `nginx`: Proxy server utama untuk routing traffic HTTP.

Panduan instalasi dan menjalankan aplikasi secara lokal tersedia pada berkas [README.md](README.md) dan [DOCKER.md](DOCKER.md).

## 4.2 Screenshot Antarmuka Aplikasi
Berikut adalah halaman-halaman utama sistem HaloMBG yang telah diimplementasikan:
*   **Landing Page**: `docs/screenshots/landing_page.png`
*   **Registrasi Siswa & Guru**: `docs/screenshots/siswa_register_dapodik.png`
*   **Dashboard Siswa (Gizi Harian & Ulasan)**: `docs/screenshots/siswa_dashboard.png`
*   **Dashboard SPPG (Menu & Validasi AI)**: `docs/screenshots/sppg_dashboard.png`
*   **Status Distribusi Makanan**: `docs/screenshots/sppg_distribusi.png`
*   **Tindak Lanjut Keluhan Kritis SPPG**: `docs/screenshots/sppg_tindak_lanjut.png`
*   **Dashboard Guru & Moderasi Ulasan**: `docs/screenshots/guru_dashboard.png`

## 4.3 Panduan Penggunaan Singkat (User Manual)
1.  **Masyarakat**: Cari nama sekolah di Landing Page untuk melihat menu dan status gizi AI dapur terkait.
2.  **Operator SPPG**: Login ke dashboard, pilih **Input Menu Harian**, masukkan foto makanan dan nilai gizi, lalu klik **Validasi AI**. Ubah status di menu **Distribusi** saat makanan siap atau telah diantar.
3.  **Siswa**: Daftar dengan NISN valid, login ke dashboard, tinjau menu gizi, dan berikan rating serta foto makanan yang diterima di halaman **Ulasan**.
4.  **Guru**: Login, buka menu **Ulasan Siswa** untuk memantau rating, dan gunakan tombol **Flag** untuk menandai ulasan spam.
5.  **Admin**: Kelola data master SPPG dan sekolah melalui panel administrasi pusat.


# BAB V: PENGUJIAN SISTEM (TESTING)

## 5.1 Rencana dan Hasil Pengujian (UAT)
Berikut adalah ringkasan hasil pengujian fungsionalitas utama sistem (UAT):

| TC-ID | Skenario Pengujian / Fitur | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :---: |
| **TC-01** | Landing Page - Pencarian Sekolah | Mengarahkan ke profil dapur SPPG terkait dengan data lengkap | **Pass** |
| **TC-02** | Registrasi Siswa - NISN Terdaftar | Verifikasi Dapodik sukses, data siswa terisi otomatis | **Pass** |
| **TC-03** | Registrasi Siswa - NISN Tidak Valid | Verifikasi gagal, memunculkan pesan kesalahan | **Pass** |
| **TC-04** | Siswa - Dashboard Nutrisi | Menampilkan grafik kandungan nutrisi menu hari ini | **Pass** |
| **TC-05** | Siswa - Kirim Ulasan Valid | Ulasan terkirim dan disimpan di database | **Pass** |
| **TC-06** | Siswa - Kirim Ulasan Kosong | Browser memblokir submit form (validation error) | **Pass** |
| **TC-07** | Registrasi Guru - Akun Baru | Verifikasi NIP sukses dan akun guru baru terbuat | **Pass** |
| **TC-08** | Guru - Dashboard Pemantauan | Menampilkan statistik umum program dan daftar ulasan | **Pass** |
| **TC-09** | Guru - Moderasi (Flag) Ulasan | Status ulasan berubah menjadi "flagged" dan diberi label | **Pass** |
| **TC-10** | SPPG - Kelola Menu Harian | Menampilkan daftar menu, takaran gizi, dan status validasi AI | **Pass** |
| **TC-11** | SPPG - Status Distribusi | Status pengantaran terupdate dan bukti foto terunggah | **Pass** |
| **TC-12** | SPPG - Tindak Lanjut Ulasan Kritis | Mengubah status penanganan ulasan kritis menjadi "Selesai" | **Pass** |


## 5.2 Skenario Demo Pengujian
Skenario demo pengujian aplikasi dari hulu ke hilir mencakup alur sebagai berikut:
1.  **Langkah 1**: Admin membuat akun SPPG dan memetakan sekolah layanan.
2.  **Langkah 2**: SPPG login, menginput menu makanan, mengunggah foto, dan memicu validasi AI.
3.  **Langkah 3**: SPPG memperbarui status distribusi menjadi `Sudah Diantar` dan mengunggah foto bukti serah terima.
4.  **Langkah 4**: Siswa melakukan registrasi berbasis verifikasi NISN Dapodik.
5.  **Langkah 5**: Siswa login, meninjau menu gizi harian, mengirim rating bintang, dan menulis ulasan.
6.  **Langkah 6**: Guru login untuk memantau ulasan dan menandai ulasan tidak sopan jika ada.
7.  **Langkah 7**: SPPG melihat notifikasi keluhan kritis dan memperbarui status tindak lanjut menjadi selesai.

*Detail skenario demo selengkapnya dapat dirujuk pada berkas `docs/demo-scenario.md`.*


# BAB VI: MANAJEMEN TIM, KONTRAK TIM, DAN RETROSPEKTIF

## 6.1 Identitas dan Pembagian Peran Tim (Team Contract)
### Anggota Tim & Pembagian Peran
Pembagian peran utama anggota tim CEO MBG dalam siklus pengerjaan praktikum dirotasi setiap 3 minggu (1 sprint):

| Nama Lengkap | NIM | Email |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | adityamulyaf@gmail.com |
| Fairuz Shiba Alkhirza | L0124014 | fairuzziba@gmail.com |
| Yashif Victoriawan | L0124124 | yashif.vkt@gmail.com |
| Nurman Aqil Wicaksono | L0124139 | nurmanaqil.25@gmail.com |

| Minggu | Project Manager | Developer 1 | Developer 2 | QA/Docs |
|---|---|---|---|---|
| 1–3 | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono |
| 3–6 | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya |
| 6–9 | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza |
| 9–12 | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan |


*Dokumen kesepakatan tim lengkap beserta hak dan sanksi dapat dilihat di `docs/team-contract.md`.*

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

## Lampiran A: Log Kepatuhan Penggunaan AI (AI Usage Log)
Log penggunaan AI tim dalam pengembangan proyek HaloMBG dapat dirujuk secara utuh pada berkas [ai-usage-log.md](docs/ai-usage-log.md).

## Lampiran B: Spesifikasi & Dokumentasi API Backend
Spesifikasi teknis, skema request/response, dan daftar endpoint API selengkapnya dapat diakses pada berkas dokumentasi terpisah di repositori:
*   Berkas Repositori: [API.md](docs/API.md)
*   Format Dokumentasi: Swagger / OpenAPI specification
