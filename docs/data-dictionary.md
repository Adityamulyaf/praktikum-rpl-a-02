# Data Dictionary - HaloMBG

---

## Daftar Isi

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

---

### 2.2 `sppg_profiles`

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

---

### 2.3 `schools`

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

---

### 2.4 `sppg_schools`

Tabel pivot yang memetakan relasi many-to-many antara dapur SPPG dan sekolah-sekolah yang dilayaninya.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik relasi |
| `sppg_id` | INT | FK → sppg_profiles.id, NOT NULL | Dapur SPPG yang melayani |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah yang dilayani |
| `created_at` | TIMESTAMP | NOT NULL | Waktu relasi ditetapkan oleh Admin |

---

### 2.5 `student_profiles`

Menyimpan data profil spesifik untuk pengguna dengan role `siswa`, termasuk keterhubungan dengan sekolah.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik profil siswa |
| `user_id` | INT | FK → users.id, NOT NULL, UNIQUE | Akun pengguna yang terhubung dengan profil ini |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah tempat siswa terdaftar |
| `created_at` | TIMESTAMP | NOT NULL | Waktu profil siswa dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil siswa diperbarui |

---

### 2.6 `teacher_profiles`

Menyimpan data profil spesifik untuk pengguna dengan role `guru`, termasuk keterhubungan dengan sekolah tempatnya bertugas.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik profil guru |
| `user_id` | INT | FK → users.id, NOT NULL, UNIQUE | Akun pengguna yang terhubung dengan profil ini |
| `school_id` | INT | FK → schools.id, NOT NULL | Sekolah tempat guru bertugas |
| `created_at` | TIMESTAMP | NOT NULL | Waktu profil guru dibuat |
| `updated_at` | TIMESTAMP | NOT NULL | Waktu terakhir profil guru diperbarui |

---

### 2.7 `daily_menus`

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


### 2.8 `ai_validation_logs`

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

---

### 2.9 `distribution_statuses`

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

---

### 2.10 `student_reviews`

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

---

### 2.11 `critical_review_followups`

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


---

### 2.12 `followup_history`

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


---

### 2.13 `ai_sentiment_summaries`

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

---

### 2.14 `notifications`

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


---

### 2.15 `notification_logs`

Menyimpan log detail setiap percobaan pengiriman notifikasi. Digunakan untuk debugging dan pemantauan keandalan layanan notifikasi.

| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO INCREMENT | Identifikasi unik entri log |
| `notification_id` | INT | FK → notifications.id, NOT NULL | Notifikasi yang dicoba kirim |
| `status` | ENUM | NOT NULL | Status percobaan: `sent`, `failed` |
| `failure_reason` | TEXT | NULL | Alasan kegagalan pengiriman (contoh: "Nomor tidak terdaftar di WhatsApp"); diisi jika `status = failed` |
| `attempted_at` | TIMESTAMP | NOT NULL | Waktu percobaan pengiriman dilakukan |


---

### 2.16 `audit_logs`

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

---

## 3. Ringkasan Relasi Antar Entitas

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

---

## 4. Kode dan Nilai Enumerasi

### Role Pengguna (`users.role`)

| Nilai | Deskripsi |
|---|---|
| `admin` | Administrator sistem dengan akses penuh ke master data dan panel manajemen |
| `sppg` | Operator dapur MBG; mengelola menu, distribusi, dan tindak lanjut ulasan kritis |
| `siswa` | Pelajar penerima MBG; dapat memberikan ulasan harian |
| `guru` | Tenaga pendidik; dapat memoderasi ulasan siswa di sekolahnya |

### Status Validasi AI Menu (`daily_menus.ai_validation_status`)

| Nilai | Deskripsi |
|---|---|
| `pending` | Analisis AI sedang berjalan atau antrian belum diproses |
| `validated` | AI tidak mendeteksi ketidakwajaran visual; menu dapat diberi badge "Tervalidasi AI" |
| `flagged` | AI mendeteksi ketidakwajaran; SPPG diminta mengonfirmasi atau merevisi sebelum publikasi |
| `skipped` | Layanan AI tidak tersedia saat input; menu disimpan tanpa proses validasi |

### Hasil Analisis AI (`ai_validation_logs.validation_result`)

| Nilai | Deskripsi |
|---|---|
| `no_anomaly` | AI tidak mendeteksi ketidakwajaran antara klaim nutrisi dan foto makanan |
| `anomaly_detected` | AI mendeteksi ketidakwajaran visual yang signifikan antara klaim nutrisi dan foto |

### Respons SPPG atas Validasi AI (`ai_validation_logs.sppg_action`)

| Nilai | Deskripsi |
|---|---|
| `pending` | SPPG belum merespons peringatan AI |
| `confirmed` | SPPG mengonfirmasi data meskipun ada peringatan AI |
| `revised` | SPPG merevisi klaim nutrisi atau mengganti foto setelah mendapat peringatan |

### Status Distribusi (`distribution_statuses.status`)

| Nilai | Deskripsi |
|---|---|
| `belum_diantar` | Makanan belum dikirim ke sekolah (status default harian) |
| `siap_diantar` | Makanan sudah disiapkan dan dalam proses pengiriman |
| `sudah_diantar` | Pengiriman telah dilakukan dan dikonfirmasi SPPG dengan bukti foto |
| `batal` | Distribusi dibatalkan untuk hari ini |

### Sentimen Ulasan AI (`student_reviews.sentiment`)

| Nilai | Deskripsi |
|---|---|
| `positif` | Ulasan mengandung ekspresi kepuasan atau pujian |
| `netral` | Ulasan bersifat deskriptif tanpa muatan emosi yang jelas |
| `negatif` | Ulasan mengandung ketidakpuasan atau keluhan umum |
| `kritis` | Ulasan mengandung sentimen sangat negatif atau kata kunci kritis (contoh: "basi", "bau"); memicu `is_critical = TRUE` dan notifikasi ke SPPG |

### Status Moderasi Ulasan (`student_reviews.moderation_status`)

| Nilai | Deskripsi |
|---|---|
| `visible` | Ulasan tampil normal di halaman publik (status default) |
| `flagged` | Ulasan ditandai guru untuk ditinjau Admin; tampil dengan label peringatan sementara |
| `removed` | Ulasan dihapus oleh guru; tidak tampil di halaman publik |

### Status Tindak Lanjut Ulasan Kritis (`critical_review_followups.followup_status` dan `followup_history`)

| Nilai | Deskripsi |
|---|---|
| `belum_diproses` | SPPG belum memulai penanganan (status awal saat notifikasi masuk) |
| `dalam_proses` | SPPG sedang melakukan investigasi atau tindakan perbaikan |
| `selesai` | Penanganan telah selesai dan didokumentasikan oleh SPPG |

### Jenis Notifikasi (`notifications.type`)

| Nilai | Deskripsi |
|---|---|
| `distribution_late` | Peringatan keterlambatan distribusi ke Admin dan Guru; dipicu otomatis pukul 11.00 WIB |
| `review_new` | Pemberitahuan ulasan baru dari siswa ke Guru di sekolah yang sama |
| `review_deleted` | Pemberitahuan penghapusan ulasan beserta alasannya ke Siswa |
| `review_critical` | Peringatan ulasan kritis terdeteksi AI; dikirim ke SPPG terkait |

### Status Pengiriman Notifikasi (`notification_logs.status`)

| Nilai | Deskripsi |
|---|---|
| `sent` | Notifikasi berhasil terkirim ke penerima |
| `failed` | Pengiriman gagal; alasan kegagalan dicatat di kolom `failure_reason` |

---