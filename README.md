# HaloMBG

Aplikasi Monitoring Program Makan Bergizi Gratis (MBG) untuk memantau distribusi makanan, menu harian, dan kualitas gizi sekolah.

## Identitas Tim

| Nama Lengkap | NIM | Email |
|---|---|---|
| Firizqi Aditya Mulya | L0124016 | adityamulyaf@gmail.com |
| Yashif Victoriawan | L0124124 | yashif.vkt@gmail.com |
| Fairuz Shiba Alkhirza | L0124014 | fairuzziba@gmail.com |
| Nurman Aqil Wicaksono | L0124139 | nurmanaqil.25@gmail.com |

## Status Fitur Aplikasi

Berikut adalah pembagian status fitur aplikasi HaloMBG berdasarkan dokumen kebutuhan perangkat lunak (SRS) dan backlog pengembangan.

### Fitur yang Sudah Diimplementasikan

* BL-01: Sistem Autentikasi dan Manajemen Role
  Sistem login dan pembedaan akses untuk empat role: Admin, Dapur (SPPG), Siswa, dan Guru.
* BL-02: Profil Dapur MBG (SPPG) dan Daftar Sekolah
  Halaman profil dapur yang dapat diakses publik, dan opsi bagi dapur untuk memperbarui data operasional mereka setelah login.
* BL-03: Pencarian SPPG melalui Wilayah dan Nama Sekolah
  Fitur pencarian dapur penyedia makanan berdasarkan lokasi kabupaten/kota atau nama sekolah langsung dari halaman utama publik.
* BL-04: Input Menu Harian oleh SPPG
  Formulir bagi dapur untuk memasukkan menu makanan harian lengkap dengan komponen dan klaim nilai gizi makro.
* BL-05: Validasi Nutrisi Berbasis AI (Foto dan Teks)
  Integrasi dengan Google Gemini API untuk mengevaluasi kewajaran klaim nilai gizi (kalori, karbohidrat, protein, lemak) secara visual berdasarkan foto makanan yang diunggah oleh dapur.
* BL-06: Panel Admin: Master Data SPPG dan Sekolah
  Halaman khusus Admin untuk mendaftarkan dapur baru, menambahkan data sekolah, serta memetakan hubungan distribusi antara sekolah dengan dapur terkait.
* BL-07: Status Distribusi Harian
  Pencatatan status pengiriman makanan harian oleh dapur (Memasak, Pengiriman, Terkirim, Diterima) ke masing-masing sekolah yang dilayani.
* BL-08: Notifikasi Keterlambatan Distribusi
  Sistem pemantauan otomatis yang mengirimkan peringatan WhatsApp kepada Admin dan Guru jika status pengiriman makanan dari dapur belum diperbarui menjadi Terkirim hingga pukul 11.00 WIB.
* BL-09: Ulasan dan Foto dari Siswa
  Siswa yang terdaftar dapat mengirimkan ulasan, rating bintang, ulasan teks, dan mengunggah foto makanan nyata yang mereka terima pada hari tersebut.
* BL-10: Moderasi Post-Publish Ulasan oleh Guru
  Guru dapat melakukan moderasi terhadap ulasan siswa dari sekolahnya sendiri dengan memberikan tanda (flag) jika terdapat ulasan yang tidak pantas.
* BL-11: Sistem Notifikasi In-App dan WhatsApp
  Sistem pengiriman notifikasi real-time di dalam aplikasi atau melalui pesan WhatsApp untuk memberi tahu Guru jika ada ulasan baru dari siswa, dan memberi tahu Siswa jika ulasannya dimoderasi.
* BL-12: Notifikasi Ulasan Kritis dan Tindak Lanjut SPPG
  Sistem otomatis untuk menyaring ulasan siswa dengan kata kunci negatif ekstrem (seperti basi atau bau) dan memasukkannya ke daftar penanganan dapur dengan status: Belum Diproses, Dalam Proses Tindak Lanjut, dan Selesai.
* BL-13: Ringkasan Evaluasi Dapur Berbasis AI (Publik)
  Sistem AI untuk merangkum sentimen ulasan harian siswa menjadi statistik (positif, netral, negatif) yang ditampilkan pada profil dapur publik.

## Teknologi Utama
* Backend: Laravel (PHP) dengan Laravel Sanctum untuk sistem otentikasi berbasis token API.
* Frontend: React dengan Vite, Tailwind CSS untuk visual antarmuka, dan sistem WebRTC untuk integrasi kamera.
* Basis Data: PostgreSQL.
* Integrasi AI: Google Gemini API untuk analisis visual porsi dan validasi nutrisi makanan.
