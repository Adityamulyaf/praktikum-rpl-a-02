# Team Contract
**Versi:** 2.0  
**Tanggal Efektif:** 30 Maret 2026  
**Durasi Proyek:** 12 Minggu  
**Nama Tim:** CEO MBG  
**Nama Proyek:** HaloMBG  

---

## 1. Identitas Tim

| Nama Lengkap | NIM | Email |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | adityamulyaf@gmail.com |
| Fairuz Shiba Alkhirza | L0124014 | fairuzziba@gmail.com |
| Yashif Victoriawan | L0124124 | yashif.vkt@gmail.com |
| Nurman Aqil Wicakcono | L0124139 | nurmanaqil.25@gmail.com |

---

## 2. Peran dan Tanggung Jawab

### 2.1 Rolling Peran

Peran anggota tim dirotasi setiap 3 minggu.

| Minggu | Project Manager | Developer 1 | Developer 2 | QA/Docs |
|---|---|---|---|---|
| 1–3 | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono |
| 3–6 | Fairuz Shiba Alkhirza | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya |
| 6–9 | Yashif Victoriawan | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza |
| 9–12 | Nurman Aqil Wicakcono | Firizqi Aditya Mulya | Fairuz Shiba Alkhirza | Yashif Victoriawan |

### 2.2 Deskripsi Peran

#### Project Manager
- Memimpin sprint planning dan sprint review.
- Memastikan semua task ter-assign dan memiliki deadline yang jelas di Notion.
- Memantau progres tim dan mengidentifikasi blocker.
- Menjadi representasi tim dalam komunikasi eksternal (asisten/dosen/klien).
- Membuat sprint summary di akhir setiap minggu.
- Memfasilitasi pengambilan keputusan teknis jika terjadi perbedaan pendapat.

#### Developer
- Mengimplementasikan fitur sesuai spesifikasi yang telah disepakati.
- Menulis unit test untuk kode yang dibuat.
- Melakukan code review terhadap pull request dari anggota lain.
- Mengikuti standar commit message yang ditetapkan (lihat Bagian 7).
- Mendokumentasikan perubahan teknis yang signifikan.

#### QA/Docs
- Melakukan testing (fungsional, integrasi, regression) terhadap fitur yang dikembangkan.
- Membuat dan memperbarui test case di Notion.
- Menulis dan memperbarui dokumentasi teknis dan user guide.
- Melaporkan bug melalui mekanisme yang disepakati (GitHub Issues / Notion).
- Memastikan Definition of Done (DoD) terpenuhi sebelum fitur di-merge.

---

## 3. Tech Stack & Environment


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


---


## 4. Jadwal Meeting & Ritme Sprint


### 4.1 Meeting Rutin
- **Sprint Planning:** Setiap awal minggu pertama sprint (sesuai jadwal Praktikum RPL).
- **Sprint Review & Retrospective:** Setiap akhir sprint.
- **Daily Standup (opsional):** Melalui WhatsApp Group — setiap anggota melaporkan: *apa yang sudah dikerjakan, apa yang akan dikerjakan, ada blocker atau tidak*.


### 4.2 Durasi Sprint
- 1 sprint = **3 minggu**, mengikuti rotasi peran.


### 4.3 Kebijakan Ketidakhadiran
- Anggota yang tidak bisa hadir meeting **wajib izin** kepada Project Manager minimal **2 jam sebelum** meeting dimulai.
- Anggota yang tidak hadir tetap bertanggung jawab membaca notulensi dan mengerjakan task yang sudah di-assign.
- Lebih dari **2 kali absen tanpa izin** dalam satu sprint akan dilaporkan ke mekanisme eskalasi (lihat Bagian 9).


---


## 5. Channel Komunikasi


| Channel | Kegunaan | Response Time |
|---|---|---|
| WhatsApp Group | Komunikasi cepat, info mendadak, daily standup | Maks. **2 jam** di jam aktif (08.00–22.00) |
| GitHub Project | Dokumentasi, sprint board, task management, test case | Diperbarui setiap kali ada perubahan task |
| GitHub Issues | Pelaporan bug dan diskusi teknis | Maks. **1 hari kerja** |
| Pull Request (GitHub) | Code review dan feedback teknis | Review dalam **1 hari kerja** setelah PR dibuat |


---

## 6. Branching Rule


### Struktur Branch
```
main
├── staging
│   └── dev
│       └── feature/nama-fitur
```


### Flow
```
feature/nama-fitur → dev → staging → main
```


### Aturan
- **Dilarang** push langsung ke `main` atau `staging`.
- Setiap fitur baru harus dibuat di branch `feature/nama-fitur`.
- Merge ke `dev` melalui Pull Request dan memerlukan minimal **1 review** dari anggota lain.
- Merge ke `staging` dilakukan setelah QA sign-off.
- Merge ke `main` dilakukan hanya untuk release resmi dan disetujui oleh Project Manager.


---


## 7. Standar Commit Message


### Format
```
<type>(<scope>): <short description>
```


### Tipe Commit


| Tipe | Kegunaan |
|---|---|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan pada dokumentasi |
| `style` | Perubahan formatting, tanpa perubahan logika |
| `refactor` | Refactoring kode |
| `test` | Menambah atau memperbaiki test |
| `chore` | Pembaruan konfigurasi, dependency, build tools |


### Contoh
```
feat(auth): add JWT token validation on login endpoint
fix(cart): resolve null pointer when cart is empty
docs(api): update endpoint documentation for /products
test(user): add unit tests for password hashing utility
refactor(database): extract connection logic into separate module


---

## 8. Standar Kualitas & Definition of Done (DoD)


Sebuah task dianggap **Done** jika memenuhi **semua** kriteria berikut:


- [ ] Kode telah di-review dan disetujui oleh minimal **1 anggota** lain via Pull Request.
- [ ] Unit test ditulis dan semua test **lolos (pass)**.
- [ ] Tidak ada breaking changes pada fitur yang sudah ada (regression test lolos).
- [ ] Kode sudah di-merge ke branch `dev`.
- [ ] Dokumentasi teknis terkait sudah diperbarui di Notion.
- [ ] Task di sprint board sudah dipindahkan ke kolom **Done**.
- [ ] QA minggu berjalan telah memberikan **sign-off**.


---


## 9. Mekanisme Eskalasi


### 9.1 Konflik Teknis (Perbedaan Pendapat Implementasi)
1. Diskusikan di thread GitHub PR atau WhatsApp Group — beri batas waktu **24 jam**.
2. Jika tidak ada kesepakatan, Project Manager mengambil keputusan final.
3. Jika Project Manager terlibat dalam konflik, keputusan diambil melalui **voting** (suara terbanyak).


### 9.2 Anggota Tidak Memenuhi Tanggung Jawab
1. **Peringatan lisan** dari Project Manager (via WhatsApp/meeting).
2. Jika berlanjut dalam sprint yang sama: **peringatan tertulis** di Notion, dicatat dalam sprint summary.
3. Jika berlanjut ke sprint berikutnya: **eskalasi ke asisten/dosen** pembimbing.


### 9.3 Anggota Tidak Aktif / Ghosting
- Jika anggota tidak memberikan kabar selama **lebih dari 3 hari kerja berturut-turut** tanpa alasan yang jelas, Project Manager langsung melaporkan ke asisten/dosen pembimbing.


### 9.4 Kontak Eskalasi Eksternal
| Pihak | Kontak |
|---|---|
| Asisten Praktikum | *Rifqi Makarim, Ravelin Lutfhan Syach Putra* |
| Dosen Pengampu | *Haryono Setiadi, S.T., M.Eng.* |


---


## 10. Konsekuensi Pelanggaran


| Pelanggaran | Konsekuensi |
|---|---|
| Absen meeting tanpa izin (1–2x) | Peringatan lisan dari PM |
| Absen meeting tanpa izin (>2x dalam 1 sprint) | Eskalasi |
| Tidak menyelesaikan task tanpa alasan | Beban task tidak ditransfer otomatis |
| Melanggar branching rule (push ke main/staging langsung) | Wajib memperbaiki sendiri |
| Tidak melakukan code review dalam 1 hari kerja | Diingatkan PM; jika berulang, dicatat di sprint summary |


---


## 11. Perubahan Kontrak


- Setiap perubahan kontrak harus diusulkan secara tertulis di WhatsApp Group atau GitHub Project.
- Perubahan dianggap sah jika disetujui oleh **minimal 3 dari 4 anggota**.
- Kontrak yang diperbarui diberi versi baru (misal: v1.0 → v1.1) dan dicatat tanggal perubahannya.


---

*Dokumen ini berlaku sejak tanggal efektif dan dapat diperbarui sesuai prosedur pada Bagian 11.*


