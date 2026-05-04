# Data Dictionary — Sistem HaloMBG

Dokumen ini mendeskripsikan struktur basis data sistem HaloMBG secara lengkap, mencakup seluruh tabel, kolom, tipe data, constraint, dan keterangan fungsional setiap atribut.

---

## Daftar Tabel

1. [users](#1-users)
2. [sppg_profiles](#2-sppg_profiles)
3. [student_profiles](#3-student_profiles)
4. [teacher_profiles](#4-teacher_profiles)
5. [schools](#5-schools)
6. [daily_menus](#6-daily_menus)
7. [sppg_schools](#7-sppg_schools)
8. [student_reviews](#8-student_reviews)
9. [distribution_statuses](#9-distribution_statuses)
10. [ai_sentiment_summaries](#10-ai_sentiment_summaries)
11. [ai_validation_logs](#11-ai_validation_logs)
12. [critical_review_followups](#12-critical_review_followups)
13. [critical_review_followup_histories](#13-critical_review_followup_histories)
14. [notifications](#14-notifications)
15. [notification_logs](#15-notification_logs)
16. [audit_logs](#16-audit_logs)

---

## 1. users

**Deskripsi:** Menyimpan data akun pengguna sistem (SPPG, siswa, guru).

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik pengguna |
| name | VARCHAR(255) | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email untuk login |
| password | VARCHAR(255) | NOT NULL | Password (hashed dengan bcrypt) |
| role | ENUM | NOT NULL | Peran: sppg / student / teacher / admin |
| title | ENUM | | Gelar pengguna (opsional) |
| phone_number | VARCHAR(20) | | Nomor telepon pengguna |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif akun |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan akun |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 2. sppg_profiles

**Deskripsi:** Profil detail untuk pengguna dengan peran SPPG (penyedia makan siang).

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik profil SPPG |
| user_id | INT | FK → users.id | Referensi ke tabel users |
| kitchen_name | VARCHAR(255) | NOT NULL | Nama dapur/usaha |
| address | TEXT | | Alamat lengkap dapur |
| district | VARCHAR(100) | | Kecamatan lokasi dapur |
| province | VARCHAR(100) | | Provinsi lokasi dapur |
| contact_person_name | VARCHAR(255) | | Nama penanggung jawab |
| contact_phone | VARCHAR(20) | | Nomor telepon kontak |
| contact_email | VARCHAR(255) | | Email kontak SPPG |
| description | TEXT | | Deskripsi umum SPPG |
| production_capacity | INT | | Kapasitas produksi per hari |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif SPPG |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan profil |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 3. student_profiles

**Deskripsi:** Profil detail untuk pengguna dengan peran siswa.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik profil siswa |
| user_id | INT | FK → users.id | Referensi ke tabel users |
| school_id | INT | FK → schools.id | Referensi ke sekolah siswa |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan profil |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 4. teacher_profiles

**Deskripsi:** Profil detail untuk pengguna dengan peran guru.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik profil guru |
| user_id | INT | FK → users.id | Referensi ke tabel users |
| school_id | INT | FK → schools.id | Referensi ke sekolah guru |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan profil |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 5. schools

**Deskripsi:** Menyimpan data sekolah yang terdaftar dalam sistem.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik sekolah |
| name | VARCHAR(255) | NOT NULL | Nama sekolah |
| address | TEXT | | Alamat lengkap sekolah |
| district | VARCHAR(100) | | Kecamatan lokasi sekolah |
| province | VARCHAR(100) | | Provinsi lokasi sekolah |
| sort_at | VARCHAR(255) | | Informasi pengurutan sekolah |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan data |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 6. daily_menus

**Deskripsi:** Menyimpan data menu makanan harian yang disediakan oleh SPPG.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik menu harian |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| menu_date | DATE | NOT NULL | Tanggal menu berlaku |
| menu_name | VARCHAR(255) | NOT NULL | Nama menu makanan |
| components | TEXT | | Komponen/bahan menu |
| calories | DECIMAL | | Jumlah kalori menu |
| protein | DECIMAL | | Kandungan protein (gram) |
| carbohydrate | DECIMAL | | Kandungan karbohidrat (gram) |
| fat | DECIMAL | | Kandungan lemak (gram) |
| photo_url | VARCHAR(500) | | URL foto menu makanan |
| ai_validation_status | ENUM | | Status validasi AI: pending / approved / rejected |
| ai_warning_message | TEXT | | Pesan peringatan dari validasi AI |
| is_published | BOOLEAN | DEFAULT FALSE | Status publikasi menu |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan data |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 7. sppg_schools

**Deskripsi:** Tabel relasi antara SPPG dan sekolah yang dilayani.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik relasi |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| school_id | INT | FK → schools.id | Referensi ke sekolah |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan relasi |

---

## 8. student_reviews

**Deskripsi:** Menyimpan ulasan/review dari siswa terhadap menu makanan.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik ulasan |
| student_id | INT | FK → student_profiles.id | Referensi ke profil siswa |
| menu_id | INT | FK → daily_menus.id | Referensi ke menu harian |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| review_text | TEXT | | Teks ulasan dari siswa |
| photo_url | VARCHAR(500) | | URL foto yang diunggah siswa |
| sentiment | ENUM | | Sentimen: positive / neutral / negative |
| is_critical | BOOLEAN | DEFAULT FALSE | Menandai ulasan kritis |
| moderation_status | ENUM | | Status moderasi: pending / approved / rejected |
| flagged_by | INT | FK → users.id | ID pengguna yang menandai ulasan |
| flag_reason | TEXT | | Alasan penandaan ulasan |
| removed_by | INT | FK → users.id | ID pengguna yang menghapus ulasan |
| removal_reason | TEXT | | Alasan penghapusan ulasan |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan ulasan |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 9. distribution_statuses

**Deskripsi:** Menyimpan status distribusi makanan dari SPPG ke sekolah.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik status distribusi |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| school_id | INT | FK → schools.id | Referensi ke sekolah tujuan |
| distribution_date | DATE | NOT NULL | Tanggal distribusi |
| status | ENUM | NOT NULL | Status: pending / delivered / failed |
| proof_photo_url | VARCHAR(500) | | URL foto bukti pengiriman |
| updated_by | INT | FK → users.id | ID pengguna yang memperbarui |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan data |

---

## 10. ai_sentiment_summaries

**Deskripsi:** Menyimpan ringkasan analisis sentimen yang dihasilkan oleh AI.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik ringkasan |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| summary_date | DATE | NOT NULL | Tanggal ringkasan dibuat |
| total_reviews | INT | | Total ulasan yang dianalisis |
| positive_count | INT | | Jumlah ulasan positif |
| neutral_count | INT | | Jumlah ulasan netral |
| negative_count | INT | | Jumlah ulasan negatif |
| key_points | TEXT | | Poin-poin kunci hasil analisis AI |
| generated_at | TIMESTAMP | | Waktu ringkasan digenerate |

---

## 11. ai_validation_logs

**Deskripsi:** Log hasil validasi AI terhadap menu makanan yang diunggah SPPG.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik log validasi |
| menu_id | INT | FK → daily_menus.id | Referensi ke menu yang divalidasi |
| validation_result | ENUM | | Hasil: approved / rejected / warning |
| warning_details | TEXT | | Detail peringatan dari AI |
| sppg_action | ENUM | | Tindakan SPPG: accepted / revised / ignored |
| sppg_action_note | TEXT | | Catatan tindakan dari SPPG |
| validated_at | TIMESTAMP | DEFAULT NOW() | Waktu validasi dilakukan |

---

## 12. critical_review_followups

**Deskripsi:** Menyimpan tindak lanjut terhadap ulasan kritis dari siswa.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik tindak lanjut |
| review_id | INT | FK → student_reviews.id | Referensi ke ulasan kritis |
| sppg_id | INT | FK → sppg_profiles.id | Referensi ke profil SPPG |
| followup_status | ENUM | NOT NULL | Status: pending / in_progress / resolved |
| handling_note | TEXT | | Catatan penanganan dari SPPG |
| updated_by | INT | FK → users.id | ID pengguna yang memperbarui |
| created_by | INT | FK → users.id | ID pengguna yang membuat |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Waktu pembaruan terakhir |

---

## 13. critical_review_followup_histories

**Deskripsi:** Riwayat perubahan status tindak lanjut ulasan kritis.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik riwayat |
| followup_id | INT | FK → critical_review_followups.id | Referensi ke tindak lanjut |
| previous_status | ENUM | | Status sebelum perubahan |
| new_status | ENUM | | Status baru setelah perubahan |
| note | TEXT | | Catatan perubahan status |
| changed_by | INT | FK → users.id | ID pengguna yang mengubah |
| changed_at | TIMESTAMP | DEFAULT NOW() | Waktu perubahan dilakukan |

---

## 14. notifications

**Deskripsi:** Menyimpan notifikasi yang dikirim kepada pengguna sistem.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik notifikasi |
| recipient_id | INT | FK → users.id | ID penerima notifikasi |
| type | ENUM | | Jenis notifikasi (review, distribusi, dll) |
| related_id | INT | | ID entitas terkait notifikasi |
| message | TEXT | NOT NULL | Isi pesan notifikasi |
| channel | ENUM | | Saluran: in_app / email / sms |
| is_read | BOOLEAN | DEFAULT FALSE | Status dibaca/belum |
| sent_at | TIMESTAMP | | Waktu notifikasi dikirim |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan notifikasi |

---

## 15. notification_logs

**Deskripsi:** Log pengiriman notifikasi beserta status pengirimannya.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik log notifikasi |
| notification_id | INT | FK → notifications.id | Referensi ke notifikasi |
| status | ENUM | NOT NULL | Status: sent / failed / pending |
| failure_reason | TEXT | | Alasan kegagalan pengiriman |
| attempted_at | TIMESTAMP | DEFAULT NOW() | Waktu percobaan pengiriman |

---

## 16. audit_logs

**Deskripsi:** Menyimpan catatan audit semua aktivitas penting dalam sistem.

| Kolom | Tipe Data | Constraint | Keterangan |
|-------|-----------|------------|------------|
| id | INT | PK, AUTO_INCREMENT | ID unik log audit |
| actor_id | INT | FK → users.id | ID pengguna yang melakukan aksi |
| action | ENUM | NOT NULL | Jenis aksi: create / update / delete / login |
| target_table | ENUM | | Nama tabel yang terdampak |
| target_id | INT | | ID record yang terdampak |
| old_value | JSON | | Nilai lama sebelum perubahan |
| new_value | JSON | | Nilai baru setelah perubahan |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu aksi dilakukan |