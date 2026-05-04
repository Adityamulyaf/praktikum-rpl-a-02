# Data Dictionary — HaloMBG


**Versi:** 1.0
**Tanggal:** April 2026
**Proyek:** HaloMBG — Platform Monitoring Program Makan Bergizi Gratis (MBG)
**Referensi Dokumen:** SRS, Backlog, User Stories


---


## Daftar Isi


1. [Konvensi Penulisan](#1-konvensi-penulisan)
2. [Entitas dan Atribut](#2-entitas-dan-atribut)
   - [2.1 users](#21-users)
   - [2.2 sppg](#22-sppg-dapur-mbg)
   - [2.3 schools](#23-schools-sekolah)
   - [2.4 sppg\_school](#24-sppg_school-relasi-sppgsekolah)
   - [2.5 daily\_menus](#25-daily_menus-menu-harian)
   - [2.6 menu\_nutrition](#26-menu_nutrition-klaim-nutrisi-menu)
   - [2.7 ai\_validations](#27-ai_validations-hasil-validasi-ai-nutrisi)
   - [2.8 distribution\_statuses](#28-distribution_statuses-status-distribusi)
   - [2.9 student\_reviews](#29-student_reviews-ulasan-siswa)
   - [2.10 review\_flags](#210-review_flags-flag-ulasan-oleh-guru)
   - [2.11 critical\_review\_followups](#211-critical_review_followups-tindak-lanjut-ulasan-kritis)
   - [2.12 ai\_sentiment\_summaries](#212-ai_sentiment_summaries-ringkasan-sentimen-ai)
   - [2.13 notifications](#213-notifications-notifikasi)
   - [2.14 audit\_logs](#214-audit_logs-log-audit)
3. [Ringkasan Relasi Antar Entitas](#3-ringkasan-relasi-antar-entitas)
4. [Kode dan Nilai Enumerasi](#4-kode-dan-nilai-enumerasi)


---


## 1. Konvensi Penulisan


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


---


## 2. Entitas dan Atribut


---


### 2.1 `users`


Menyimpan data seluruh pengguna terdaftar di platform HaloMBG, mencakup semua role.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | UUID / BIGINT | PK, NOT NULL | Identifikasi unik pengguna |
| `name` | VARCHAR(255) | NOT NULL | Nama lengkap pengguna |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Alamat email untuk login |
| `password` | VARCHAR(255) | NOT NULL | Hash bcrypt (cost factor ≥ 10); tidak disimpan plaintext |
| `role` | ENUM | NOT NULL | Nilai: `admin`, `sppg`, `siswa`, `guru` |
| `phone_number` | VARCHAR(20) | NULL | Nomor WhatsApp aktif; digunakan untuk notifikasi |
| `school_id` | BIGINT | FK → schools.id, NULL | Diisi untuk role `siswa` dan `guru`; NULL untuk `admin` dan `sppg` |
| `sppg_id` | BIGINT | FK → sppg.id, NULL | Diisi untuk role `sppg`; NULL untuk role lainnya |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Status akun aktif atau dinonaktifkan oleh Admin |
| `created_at` | TIMESTAMP | NOT NULL | Waktu akun dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data akun diperbarui |


> **Catatan:**
> - Satu akun siswa hanya terhubung dengan satu sekolah pada satu waktu. Perpindahan sekolah memerlukan pembaruan oleh Admin.
> - Field `phone_number` diasumsikan merupakan nomor aktif WhatsApp. Jika tidak valid, notifikasi dicatat sebagai gagal di `notifications`.


---


### 2.2 `sppg` (Dapur MBG)


Menyimpan profil setiap Satuan Pelayanan Pemenuhan Gizi (SPPG) atau dapur MBG yang terdaftar.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik dapur SPPG |
| `name` | VARCHAR(255) | NOT NULL | Nama resmi dapur MBG |
| `address` | TEXT | NOT NULL | Alamat lengkap lokasi dapur |
| `district` | VARCHAR(100) | NOT NULL | Nama kabupaten/kota tempat dapur beroperasi |
| `province` | VARCHAR(100) | NOT NULL | Nama provinsi |
| `contact_person_name` | VARCHAR(255) | NOT NULL | Nama penanggung jawab yang dapat dihubungi |
| `contact_phone` | VARCHAR(20) | NOT NULL | Nomor WhatsApp/telepon contact person |
| `contact_email` | VARCHAR(255) | NULL | Alamat email contact person (opsional) |
| `description` | TEXT | NULL | Deskripsi singkat dapur; dapat diedit oleh SPPG |
| `production_capacity` | INT | NULL | Estimasi kapasitas produksi porsi per hari |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Status operasional dapur; dikelola oleh Admin |
| `created_by` | BIGINT | FK → users.id, NOT NULL | Admin yang pertama kali mendaftarkan dapur ini |
| `created_at` | TIMESTAMP | NOT NULL | Waktu dapur didaftarkan |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil diperbarui |


> **Catatan:**
> - Profil awal dibuat oleh Admin. SPPG yang sudah login dapat mengedit `description`, `contact_person_name`, `contact_phone`, `contact_email`, dan `production_capacity`.
> - Setiap perubahan dicatat di `audit_logs`.


---


### 2.3 `schools` (Sekolah)


Menyimpan data sekolah yang menjadi penerima program MBG.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik sekolah |
| `name` | VARCHAR(255) | NOT NULL | Nama lengkap sekolah |
| `district` | VARCHAR(100) | NOT NULL | Nama kabupaten/kota lokasi sekolah |
| `province` | VARCHAR(100) | NOT NULL | Nama provinsi lokasi sekolah |
| `address` | TEXT | NULL | Alamat lengkap sekolah |
| `level` | ENUM | NULL | Jenjang sekolah: `SD`, `SMP`, `SMA`, `SMK` |
| `created_at` | TIMESTAMP | NOT NULL | Waktu data sekolah ditambahkan |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data sekolah diperbarui |


> **Catatan:**
> - Data awal sekolah diimport dari dataset CSV yang disediakan tim.
> - Sekolah tidak dapat dihapus jika masih memiliki relasi aktif dengan SPPG.


---


### 2.4 `sppg_school` (Relasi SPPG–Sekolah)


Tabel pivot yang memetakan sekolah-sekolah yang dilayani oleh setiap dapur SPPG.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik relasi |
| `sppg_id` | BIGINT | FK → sppg.id, NOT NULL | Dapur MBG yang melayani |
| `school_id` | BIGINT | FK → schools.id, NOT NULL | Sekolah yang dilayani |
| `assigned_by` | BIGINT | FK → users.id, NOT NULL | Admin yang memetakan relasi ini |
| `assigned_at` | TIMESTAMP | NOT NULL | Waktu relasi ditetapkan |


> **Constraint tambahan:** `UNIQUE(sppg_id, school_id)` — satu sekolah hanya boleh dipetakan ke satu SPPG pada satu waktu.


---


### 2.5 `daily_menus` (Menu Harian)


Menyimpan data menu makanan harian yang diinput oleh SPPG untuk setiap tanggal distribusi.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri menu |
| `sppg_id` | BIGINT | FK → sppg.id, NOT NULL | Dapur yang menginput menu |
| `menu_date` | DATE | NOT NULL | Tanggal menu berlaku |
| `menu_name` | VARCHAR(255) | NOT NULL | Nama menu harian (contoh: "Nasi Ayam Semur") |
| `components` | TEXT | NOT NULL | Deskripsi komponen makanan (lauk, sayur, buah, dll.) |
| `photo_url` | VARCHAR(500) | NOT NULL | URL foto makanan yang diunggah; wajib ada saat input |
| `photo_size_kb` | INT | NOT NULL | Ukuran file foto dalam KB; maksimum 5.120 KB (5 MB) |
| `ai_validation_status` | ENUM | NOT NULL, DEFAULT `pending` | Nilai: `pending`, `validated`, `flagged`, `skipped` |
| `is_published` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE setelah SPPG mengonfirmasi dan menu siap ditampilkan publik |
| `created_by` | BIGINT | FK → users.id, NOT NULL | Akun SPPG yang menginput menu |
| `created_at` | TIMESTAMP | NOT NULL | Waktu menu pertama kali diinput |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir data menu diperbarui |


> **Catatan:**
> - `ai_validation_status = skipped` digunakan ketika layanan AI eksternal tidak tersedia. Menu tetap dapat disimpan tanpa validasi.
> - `is_published` hanya menjadi TRUE setelah SPPG mengonfirmasi atau merevisi hasil peringatan AI.
> - Satu SPPG hanya dapat memiliki satu menu aktif per tanggal — `UNIQUE(sppg_id, menu_date)` direkomendasikan.


---


### 2.6 `menu_nutrition` (Klaim Nutrisi Menu)


Menyimpan klaim kandungan nutrisi yang diinput SPPG bersamaan dengan menu harian.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri nutrisi |
| `menu_id` | BIGINT | FK → daily_menus.id, NOT NULL, UNIQUE | Relasi satu-ke-satu dengan menu harian |
| `calories_kcal` | DECIMAL(8,2) | NOT NULL | Klaim kandungan kalori dalam kkal |
| `protein_g` | DECIMAL(8,2) | NOT NULL | Klaim kandungan protein dalam gram |
| `carbohydrate_g` | DECIMAL(8,2) | NOT NULL | Klaim kandungan karbohidrat dalam gram |
| `fat_g` | DECIMAL(8,2) | NOT NULL | Klaim kandungan lemak dalam gram |
| `created_at` | TIMESTAMP | NOT NULL | Waktu klaim nutrisi diinput |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir klaim nutrisi diperbarui |


> **Catatan:**
> - Nilai nutrisi bersifat **klaim dari SPPG**, bukan hasil analisis laboratorium.
> - Klaim ini yang menjadi input utama untuk proses validasi AI di tabel `ai_validations`.


---


### 2.7 `ai_validations` (Hasil Validasi AI Nutrisi)


Menyimpan hasil analisis kewajaran nutrisi berbasis AI untuk setiap menu yang diunggah dengan foto.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik hasil validasi |
| `menu_id` | BIGINT | FK → daily_menus.id, NOT NULL, UNIQUE | Menu yang dianalisis |
| `result` | ENUM | NOT NULL | Nilai: `no_anomaly`, `anomaly_detected` |
| `warning_message` | TEXT | NULL | Pesan peringatan spesifik dari AI; diisi jika `result = anomaly_detected` |
| `visual_aspects_flagged` | TEXT | NULL | Aspek visual yang dinilai tidak sebanding dengan klaim nutrisi |
| `sppg_action` | ENUM | NOT NULL, DEFAULT `pending` | Respon SPPG: `pending`, `confirmed`, `revised` |
| `sppg_action_note` | TEXT | NULL | Catatan opsional dari SPPG saat mengonfirmasi atau merevisi |
| `analyzed_at` | TIMESTAMP | NOT NULL | Waktu analisis AI selesai |
| `confirmed_at` | TIMESTAMP | NULL | Waktu SPPG melakukan konfirmasi atau revisi |


> **Catatan:**
> - Validasi bersifat **visual dan indikatif**, bukan pengganti penilaian ahli gizi.
> - Badge "Tervalidasi AI" hanya ditampilkan jika `result = no_anomaly` DAN `sppg_action != pending`.
> - Seluruh riwayat peringatan disimpan untuk keperluan audit, termasuk jika SPPG memilih `confirmed` meskipun ada peringatan.


---


### 2.8 `distribution_statuses` (Status Distribusi)


Menyimpan status distribusi harian makanan dari setiap SPPG ke setiap sekolah yang dilayani.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri status distribusi |
| `sppg_id` | BIGINT | FK → sppg.id, NOT NULL | Dapur yang mendistribusikan |
| `school_id` | BIGINT | FK → schools.id, NOT NULL | Sekolah tujuan distribusi |
| `distribution_date` | DATE | NOT NULL | Tanggal distribusi |
| `status` | ENUM | NOT NULL, DEFAULT `belum_diantar` | Nilai: `siap_diantar`, `sudah_diantar`, `belum_diantar`, `batal` |
| `proof_photo_url` | VARCHAR(500) | NULL | URL foto bukti pengiriman; diunggah oleh SPPG |
| `proof_photo_size_kb` | INT | NULL | Ukuran file foto bukti dalam KB |
| `updated_by` | BIGINT | FK → users.id, NOT NULL | Akun SPPG yang memperbarui status |
| `status_updated_at` | TIMESTAMP | NOT NULL | Timestamp pembaruan status terakhir (tampil di halaman publik) |
| `created_at` | TIMESTAMP | NOT NULL | Waktu entri pertama kali dibuat untuk tanggal tersebut |


> **Constraint tambahan:** `UNIQUE(sppg_id, school_id, distribution_date)` — satu entri distribusi per kombinasi dapur, sekolah, dan tanggal.
>
> **Catatan:**
> - Status diinisialisasi sebagai `belum_diantar` pada setiap hari distribusi.
> - Sistem memeriksa entri dengan status `belum_diantar` pada pukul **11.00 WIB** dan memicu notifikasi keterlambatan.


---


### 2.9 `student_reviews` (Ulasan Siswa)


Menyimpan ulasan harian yang dikirimkan siswa beserta foto makanan yang diterima.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik ulasan |
| `student_id` | BIGINT | FK → users.id, NOT NULL | Siswa yang memberikan ulasan |
| `school_id` | BIGINT | FK → schools.id, NOT NULL | Sekolah siswa (disalin dari profil siswa saat submit) |
| `menu_id` | BIGINT | FK → daily_menus.id, NOT NULL | Menu yang diulas (berdasarkan tanggal dan SPPG terkait) |
| `review_date` | DATE | NOT NULL | Tanggal ulasan diberikan |
| `review_text` | TEXT | NOT NULL | Isi ulasan dari siswa |
| `photo_url` | VARCHAR(500) | NULL | URL foto makanan yang diunggah siswa (opsional) |
| `photo_size_kb` | INT | NULL | Ukuran file foto ulasan dalam KB |
| `ai_sentiment` | ENUM | NULL | Klasifikasi sentimen oleh AI: `positif`, `netral`, `negatif`, `kritis` |
| `is_visible` | BOOLEAN | NOT NULL, DEFAULT TRUE | FALSE jika ulasan dihapus oleh guru; tidak tampil di publik |
| `is_flagged` | BOOLEAN | NOT NULL, DEFAULT FALSE | TRUE jika guru men-flag ulasan untuk ditinjau Admin |
| `created_at` | TIMESTAMP | NOT NULL | Waktu ulasan dikirimkan |


> **Catatan:**
> - Ulasan langsung tampil di halaman publik setelah dikirim (`is_visible = TRUE` secara default).
> - `ai_sentiment = kritis` memicu notifikasi ke SPPG dan pembuatan entri di `critical_review_followups`.
> - Analisis sentimen dapat kurang akurat pada teks ambigu, sarkasme, atau bahasa daerah.


---


### 2.10 `review_flags` (Flag Ulasan oleh Guru)


Menyimpan catatan tindakan moderasi yang dilakukan guru terhadap ulasan siswa.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri flag |
| `review_id` | BIGINT | FK → student_reviews.id, NOT NULL | Ulasan yang ditindak |
| `teacher_id` | BIGINT | FK → users.id, NOT NULL | Guru yang melakukan tindakan |
| `action` | ENUM | NOT NULL | Tindakan: `flag` (tandai untuk ditinjau), `delete` (hapus langsung) |
| `reason` | TEXT | NOT NULL | Alasan guru melakukan flag atau penghapusan |
| `admin_decision` | ENUM | NULL | Keputusan Admin: `approved` (flag diterima), `rejected` (flag ditolak, ulasan dipulihkan) |
| `admin_decision_note` | TEXT | NULL | Catatan Admin terkait keputusannya |
| `actioned_at` | TIMESTAMP | NOT NULL | Waktu guru melakukan tindakan |
| `admin_reviewed_at` | TIMESTAMP | NULL | Waktu Admin memutuskan tindak lanjut flag |


> **Catatan:**
> - Jika `action = delete`, `student_reviews.is_visible` langsung diubah ke FALSE dan siswa menerima notifikasi.
> - Jika `action = flag`, `student_reviews.is_flagged` diubah ke TRUE dan ulasan diberi label peringatan sementara hingga keputusan Admin.


---


### 2.11 `critical_review_followups` (Tindak Lanjut Ulasan Kritis)


Menyimpan catatan penanganan SPPG atas ulasan siswa yang terklasifikasi kritis oleh AI.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri tindak lanjut |
| `review_id` | BIGINT | FK → student_reviews.id, NOT NULL, UNIQUE | Ulasan kritis yang ditindaklanjuti |
| `sppg_id` | BIGINT | FK → sppg.id, NOT NULL | Dapur yang bertanggung jawab |
| `followup_status` | ENUM | NOT NULL, DEFAULT `belum_diproses` | Nilai: `belum_diproses`, `dalam_proses`, `selesai` |
| `handler_note` | TEXT | NULL | Catatan penanganan dari SPPG; diperbarui setiap perubahan status |
| `notified_at` | TIMESTAMP | NOT NULL | Waktu notifikasi kritis pertama dikirim ke dashboard SPPG |
| `status_updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir status tindak lanjut diperbarui |


> **Catatan:**
> - Entri dibuat otomatis ketika AI mendeteksi `student_reviews.ai_sentiment = kritis`.
> - Seluruh riwayat perubahan status tersimpan untuk keperluan audit dan evaluasi internal.


---


### 2.12 `ai_sentiment_summaries` (Ringkasan Sentimen AI)


Menyimpan ringkasan analisis sentimen harian per dapur yang dihasilkan oleh AI berdasarkan kumpulan ulasan siswa.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik ringkasan |
| `sppg_id` | BIGINT | FK → sppg.id, NOT NULL | Dapur yang dianalisis |
| `school_id` | BIGINT | FK → schools.id, NULL | Jika diisi: ringkasan per-sekolah; NULL: ringkasan keseluruhan dapur |
| `summary_date` | DATE | NOT NULL | Tanggal ulasan yang dirangkum |
| `total_reviews` | INT | NOT NULL, DEFAULT 0 | Jumlah total ulasan yang masuk pada tanggal tersebut |
| `positive_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen positif |
| `neutral_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen netral |
| `negative_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen negatif |
| `critical_count` | INT | NOT NULL, DEFAULT 0 | Jumlah ulasan bersentimen kritis |
| `key_points` | TEXT | NULL | Poin-poin utama yang sering disebut dalam ulasan; dihasilkan AI |
| `generated_at` | TIMESTAMP | NOT NULL | Waktu ringkasan ini dihasilkan oleh AI |


> **Constraint tambahan:** `UNIQUE(sppg_id, school_id, summary_date)` — satu ringkasan per kombinasi dapur, sekolah (atau NULL), dan tanggal.
>
> **Catatan:**
> - `school_id IS NULL` → ringkasan agregat seluruh sekolah untuk dapur (ditampilkan di halaman publik).
> - `school_id IS NOT NULL` → breakdown per sekolah (hanya untuk dashboard internal SPPG).


---


### 2.13 `notifications` (Notifikasi)


Menyimpan log seluruh notifikasi yang dikirim atau dicoba kirim oleh sistem, baik melalui WhatsApp maupun in-app.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik notifikasi |
| `recipient_id` | BIGINT | FK → users.id, NOT NULL | Pengguna penerima notifikasi |
| `type` | ENUM | NOT NULL | Jenis notifikasi (lihat [Bagian 4](#4-kode-dan-nilai-enumerasi)) |
| `channel` | ENUM | NOT NULL | Media pengiriman: `whatsapp`, `in_app` |
| `message` | TEXT | NOT NULL | Isi pesan notifikasi |
| `reference_id` | BIGINT | NULL | ID entitas terkait (contoh: ID distribusi, ID ulasan) |
| `reference_type` | VARCHAR(100) | NULL | Nama tabel referensi (contoh: `distribution_statuses`, `student_reviews`) |
| `status` | ENUM | NOT NULL, DEFAULT `pending` | Status pengiriman: `pending`, `sent`, `failed` |
| `failure_reason` | TEXT | NULL | Alasan kegagalan pengiriman; diisi jika `status = failed` |
| `sent_at` | TIMESTAMP | NULL | Waktu notifikasi berhasil terkirim |
| `created_at` | TIMESTAMP | NOT NULL | Waktu notifikasi dibuat oleh sistem |


> **Catatan:**
> - Notifikasi yang gagal (misalnya nomor WhatsApp tidak valid) dicatat dengan `status = failed` dan `failure_reason` yang relevan.
> - Notifikasi in-app dapat dilihat melalui panel notifikasi di dalam aplikasi.


---


### 2.14 `audit_logs` (Log Audit)


Mencatat seluruh perubahan pada master data yang dilakukan oleh Admin, sebagai jejak aktivitas yang dapat diaudit.


| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGINT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri log |
| `actor_id` | BIGINT | FK → users.id, NOT NULL | Pengguna yang melakukan perubahan |
| `action` | ENUM | NOT NULL | Jenis aksi: `create`, `update`, `delete`, `deactivate` |
| `entity_type` | VARCHAR(100) | NOT NULL | Nama tabel yang terpengaruh (contoh: `sppg`, `schools`, `users`) |
| `entity_id` | BIGINT | NOT NULL | ID baris yang terpengaruh |
| `old_value` | JSONB / TEXT | NULL | Nilai data sebelum perubahan (format JSON) |
| `new_value` | JSONB / TEXT | NULL | Nilai data setelah perubahan (format JSON) |
| `created_at` | TIMESTAMP | NOT NULL | Waktu perubahan dilakukan |


> **Catatan:**
> - Log ini tidak dapat dihapus atau diubah; bersifat **append-only** untuk menjaga integritas audit trail.
> - Digunakan untuk keperluan investigasi, kepatuhan, dan evaluasi administratif.


---


## 3. Ringkasan Relasi Antar Entitas


| Relasi | Tipe | Keterangan |
|---|---|---|
| `users` → `schools` | Many-to-One (N:1) | Siswa dan guru terhubung ke satu sekolah |
| `users` → `sppg` | Many-to-One (N:1) | Pengguna dengan role SPPG terhubung ke satu dapur |
| `sppg` ↔ `schools` | Many-to-Many (M:N) | Melalui tabel pivot `sppg_school` |
| `sppg` → `daily_menus` | One-to-Many (1:N) | Satu dapur memiliki banyak entri menu (per tanggal) |
| `daily_menus` → `menu_nutrition` | One-to-One (1:1) | Setiap menu memiliki tepat satu klaim nutrisi |
| `daily_menus` → `ai_validations` | One-to-One (1:1) | Setiap menu memiliki satu hasil validasi AI |
| `sppg` → `distribution_statuses` | One-to-Many (1:N) | Satu dapur memiliki banyak entri status distribusi |
| `schools` → `distribution_statuses` | One-to-Many (1:N) | Satu sekolah memiliki banyak entri status distribusi |
| `users` → `student_reviews` | One-to-Many (1:N) | Satu siswa dapat memberi banyak ulasan (berbeda tanggal) |
| `daily_menus` → `student_reviews` | One-to-Many (1:N) | Satu menu dapat memiliki banyak ulasan |
| `student_reviews` → `review_flags` | One-to-Many (1:N) | Satu ulasan dapat memiliki lebih dari satu entri flag |
| `student_reviews` → `critical_review_followups` | One-to-One (1:1) | Ulasan kritis memiliki satu entri tindak lanjut |
| `sppg` → `ai_sentiment_summaries` | One-to-Many (1:N) | Satu dapur memiliki banyak ringkasan sentimen (per tanggal) |
| `users` → `notifications` | One-to-Many (1:N) | Satu pengguna dapat menerima banyak notifikasi |
| `users` → `audit_logs` | One-to-Many (1:N) | Satu Admin dapat memiliki banyak entri log aksi |


---


## 4. Kode dan Nilai Enumerasi


### Role Pengguna (`users.role`)


| Nilai | Deskripsi |
|---|---|
| `admin` | Administrator sistem dengan akses penuh ke master data |
| `sppg` | Operator dapur MBG; mengelola menu, distribusi, dan tindak lanjut ulasan |
| `siswa` | Pelajar penerima MBG; dapat memberikan ulasan harian |
| `guru` | Tenaga pendidik; dapat memoderasi ulasan siswa di sekolahnya |


### Status Validasi AI Menu (`daily_menus.ai_validation_status`)


| Nilai | Deskripsi |
|---|---|
| `pending` | Analisis AI sedang berjalan atau belum dilakukan |
| `validated` | AI tidak mendeteksi ketidakwajaran; menu dapat diberi badge |
| `flagged` | AI mendeteksi ketidakwajaran; SPPG perlu mengonfirmasi atau merevisi |
| `skipped` | Layanan AI tidak tersedia saat input; menu disimpan tanpa validasi |


### Status Distribusi (`distribution_statuses.status`)


| Nilai | Deskripsi |
|---|---|
| `belum_diantar` | Makanan belum dikirim ke sekolah (status default) |
| `siap_diantar` | Makanan sudah disiapkan dan siap dikirim |
| `sudah_diantar` | Pengiriman telah dilakukan dan dikonfirmasi SPPG |
| `batal` | Distribusi dibatalkan untuk hari ini |


### Sentimen Ulasan AI (`student_reviews.ai_sentiment`)


| Nilai | Deskripsi |
|---|---|
| `positif` | Ulasan mengandung ekspresi kepuasan atau pujian |
| `netral` | Ulasan bersifat deskriptif tanpa muatan emosi yang jelas |
| `negatif` | Ulasan mengandung ketidakpuasan atau keluhan umum |
| `kritis` | Ulasan mengandung sentimen sangat negatif atau kata kunci kritis (contoh: "basi", "bau"); memicu notifikasi ke SPPG |


### Status Tindak Lanjut Ulasan Kritis (`critical_review_followups.followup_status`)


| Nilai | Deskripsi |
|---|---|
| `belum_diproses` | SPPG belum memulai penanganan (status awal saat notifikasi masuk) |
| `dalam_proses` | SPPG sedang melakukan investigasi atau penanganan |
| `selesai` | Penanganan telah selesai dilakukan oleh SPPG |


### Jenis Notifikasi (`notifications.type`)


| Nilai | Deskripsi |
|---|---|
| `distribution_late` | Peringatan keterlambatan distribusi ke Admin dan Guru (dipicu pukul 11.00 WIB) |
| `review_new` | Pemberitahuan ulasan baru dari siswa ke Guru |
| `review_deleted` | Pemberitahuan penghapusan ulasan beserta alasan ke Siswa |
| `review_critical` | Peringatan ulasan kritis dari AI ke SPPG |


### Tindakan Audit (`audit_logs.action`)


| Nilai | Deskripsi |
|---|---|
| `create` | Pembuatan entri baru (contoh: pendaftaran SPPG baru) |
| `update` | Perubahan data pada entri yang sudah ada |
| `delete` | Penghapusan permanen entri |
| `deactivate` | Penonaktifan akun atau entri tanpa menghapus data |


---


*Dokumen ini disusun berdasarkan SRS, Product Backlog, dan User Stories HaloMBG versi yang berlaku. Setiap perubahan skema harus diperbarui pada dokumen ini dan dicatat dalam changelog proyek.*



