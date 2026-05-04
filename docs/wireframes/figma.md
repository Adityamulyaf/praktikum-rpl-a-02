# Wireframe Antarmuka HaloMBG

Dokumen ini berisi anotasi rancangan awal antarmuka (wireframe) *low-fidelity* untuk platform HaloMBG.

## 🔗 Tautan Wireframe
**[Klik di sini untuk melihat Wireframe Figma HaloMBG](https://www.figma.com/design/coxuNk3Q6XGzJuQqyP9XnI/HaloMBG2?node-id=30-88&t=OA4BmzJjaFL3V54n-1)**

---

## 📝 Anotasi Halaman Utama

Berikut adalah deskripsi fungsi dari tiap elemen pada 3 halaman utama yang telah dirancang:

### 1. Halaman Login (Login Page)
Halaman autentikasi terpadu untuk semua pengguna sistem.
* **Panel Kiri (Branding/Info):** Area dengan latar belakang gelap untuk menampilkan Logo HaloMBG dan informasi atau teks pengantar platform (*Text Content* & *Int section*).
* **Pemilihan Peran (Role Selection):** Terdapat 4 tombol pilihan peran (Admin, SPPG, Guru, Siswa) agar sistem dapat mengenali hak akses sebelum pengguna masuk.
* **Form Kredensial:** Kolom input standar untuk memasukkan *email* dan *kata sandi*.
* **Tombol Masuk:** Tombol aksi ("Masuk ->") untuk memvalidasi kredensial pengguna.

### 2. Halaman Utama (Main Dashboard)
Halaman dasbor analitik untuk melihat ringkasan operasional MBG.
* **Sidebar Navigation:** Menu navigasi tetap di sebelah kiri yang mencakup rute utama: Dashboard, Aktifitas, Data MBG, Monitoring, Laporan, Pengaturan, dan akses Profil di bagian bawah.
* **Top Bar:** Berisi penunjuk halaman aktif, *Search Bar* universal, dan ikon (notifikasi/profil).
* **Kartu Ringkasan (Summary Cards):** 4 blok *text content* di bagian atas untuk menampilkan metrik angka penting secara cepat (misal: total porsi hari ini, total dapur).
* **Visualisasi Data (Graphic & Diagram):** Dua area besar untuk menampilkan grafik analitik (misal: grafik kelancaran distribusi) dan diagram (misal: persentase sentimen ulasan siswa).
* **Aktifitas Dapur Terbaru:** Seksi *carousel* atau daftar kartu yang menampilkan pembaruan terkini dari spesifik dapur (Dapur 1, Dapur 2, Dapur 3).

### 3. Halaman Direktori (Data MBG)
Halaman fitur utama untuk mencari dan melihat daftar lengkap dapur SPPG (sangat berguna bagi Pemantau Publik dan Admin).
* **Advanced Search & Filter:** Selain *Search Bar* di atas, terdapat baris pencarian sekunder yang dilengkapi dengan beberapa tombol filter (berbentuk kotak) untuk menyaring data berdasarkan kategori atau wilayah.
* **Grid Dapur (Kitchen Cards):** Menampilkan daftar dapur MBG dalam bentuk kartu (Dapur 1 hingga Dapur 6). Setiap kartu nantinya akan memuat nama dapur dan status singkat.
* **Page Controller:** Navigasi paginasi di bagian bawah halaman untuk memudahkan pengguna membolak-balik daftar dapur jika datanya sangat banyak.

