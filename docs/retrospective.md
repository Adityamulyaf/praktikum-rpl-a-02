# Retrospektif Tim — HaloMBG

**Tim:** CEO MBG  
**Proyek:** HaloMBG — Aplikasi Monitoring Program Makan Bergizi Gratis  
**Periode:** Sprint 1–4 (Minggu 1–12)  
**Tanggal Penyusunan:** 29 Juni 2026  

Retrospektif adalah salah satu praktik terpenting dalam metodologi Agile. Tujuannya bukan mencari siapa yang salah, melainkan menemukan cara tim bisa berkembang bersama. Dokumen ini disusun secara jujur dan terbuka oleh seluruh anggota tim CEO MBG setelah menyelesaikan pengembangan platform HaloMBG dari tahap perencanaan (SRS, backlog, user stories) hingga implementasi fitur BL-01 sampai BL-13.

## What Went Well ✅
Hal-hal positif yang berhasil dilakukan tim dan perlu dipertahankan.

* **Backlog dan SRS yang jelas sejak awal.** Penyusunan backlog.md, srs.md, dan user-stories.md di tahap awal membuat prioritas fitur (Must-have, Should-have, Could-have) selalu jelas, sehingga tim tidak kebingungan menentukan apa yang harus dikerjakan lebih dulu — misalnya BL-01 (autentikasi) dan BL-06 (master data) dikerjakan sebagai fondasi sebelum fitur lain seperti validasi AI atau ulasan siswa.
* **Branching workflow konsisten.** Alur `feature/nama-fitur` → `dev` → `staging` → `main` yang disepakati di Team Contract benar-benar dijalankan, terlihat dari riwayat commit yang rapi dengan puluhan Pull Request bertahap (autentikasi, profil SPPG, distribusi, AI validation, AI summary, WhatsApp API, notifikasi kritis, statistik admin, hingga Google Auth).
* **Integrasi AI berjalan sesuai rencana.** Validasi nutrisi berbasis foto (BL-05) dan ringkasan evaluasi sentimen (BL-13) berhasil diimplementasikan menggunakan model AI vision, sesuai kriteria selesai yang sudah dirancang sejak tahap backlog.
* **Dokumentasi berjalan beriringan dengan development.** Selain kode, tim konsisten memperbarui README.md, user-manual.md, test-cases.md, dan api.md di setiap sprint.
* **Rolling peran membuat semua anggota merasakan setiap tanggung jawab.** Setiap anggota bergiliran menjadi Project Manager, Developer, dan QA/Docs setiap 3 minggu sehingga beban kerja tersebar rata.
* **Notifikasi WhatsApp dan deteksi ulasan kritis berhasil terintegrasi end-to-end**, termasuk perbaikan bug sinkronisasi notifikasi antar role yang ditemukan saat testing.

## What Didn't Go Well ⚠️
Hambatan dan masalah yang muncul selama pengerjaan proyek.

* *Beberapa bug ditemukan cukup larut*, seperti masalah sinkronisasi notifikasi antar role dan bug tampilan (white blur berlebihan, scroll yang dimulai di tengah halaman), yang menunjukkan testing manual di beberapa fitur baru dilakukan setelah merge, bukan sebelum.
* *Beberapa fitur Could-have (BL-10, BL-11, BL-12, BL-13) sempat tertunda* karena dependensinya terhadap fitur ulasan siswa (BL-09) yang juga masih berkembang, sehingga sebagian pekerjaan menumpuk di sprint-sprint akhir.
* *Resolusi konflik merge cukup sering terjadi*, terutama pada branch dev saat beberapa fitur besar (notifikasi kritis, AI validation) dikerjakan paralel oleh anggota berbeda dalam rentang waktu yang berdekatan.
* *Refactor struktural* (misalnya pemindahan logika resolusi profil SPPG ke model User) dilakukan agak terlambat di tengah-tengah proyek, alih-alih direncanakan sejak desain awal.
* *Komunikasi async via WhatsApp Group kadang terlambat direspons* di luar jam aktif yang disepakati (08.00–22.00), terutama saat anggota memiliki kesibukan akademik lain di luar praktikum.

## Shout-outs 🌟
Apresiasi tulus untuk anggota tim yang berkontribusi luar biasa.

* **Firizqi Aditya Mulya** — kontribusi commit terbanyak dan menjadi tulang punggung pada fitur-fitur kompleks seperti integrasi AI, WhatsApp API, dan perbaikan bug lintas role. Inisiatifnya menjaga README.md selalu mutakhir sangat membantu tim.
* **Fairuz Shiba Alkhirza** — konsisten mengerjakan fitur-fitur notifikasi dan distribusi yang krusial bagi alur utama aplikasi, serta aktif dalam penulisan user manual untuk audiens awam.
* **Yashif Victoriawan** — kontribusi solid pada perbaikan UI/UX dan stabilitas fitur, membantu menjaga kualitas tampilan aplikasi tetap rapi di tengah padatnya fitur baru yang masuk.
* **Nurman Aqil Wicaksono** — peran QA/Docs yang konsisten dalam menyusun test case dan memastikan Definition of Done terpenuhi sebelum fitur dianggap selesai, menjaga kualitas rilis tetap terjaga.

Secara keseluruhan, tim CEO MBG berhasil membawa HaloMBG dari sekadar dokumen SRS dan backlog menjadi platform yang fungsional dengan 13 backlog item terimplementasi, lengkap dengan integrasi AI, notifikasi WhatsApp, dan dokumentasi yang menyertainya. Pelajaran dari retrospektif ini akan menjadi bekal untuk pengembangan lanjutan maupun proyek-proyek berikutnya.

> Dokumen ini disusun bersama oleh seluruh anggota Tim CEO MBG sebagai bagian dari proses Sprint Review & Retrospective sesuai Team Contract Bagian 4.1.