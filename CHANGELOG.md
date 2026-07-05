# Changelog

## [1.0.0] - 2026-07-05

### Added
- Fitur Sistem Autentikasi dan Manajemen Role (BL-01): Login multi-role (Admin, SPPG, Siswa, Guru) dan Google Auth.
- Fitur Profil Dapur MBG (SPPG) dan Daftar Sekolah (BL-02): Halaman profil publik dapur MBG, daftar sekolah yang dilayani, dan pengelolaan profil oleh SPPG.
- Fitur Pencarian SPPG melalui Wilayah dan Nama Sekolah (BL-03): Kolom pencarian dapur MBG di halaman utama berdasarkan wilayah kabupaten/kota atau nama sekolah.
- Fitur Input Menu Harian oleh SPPG (BL-04): Form input menu harian beserta klaim kandungan nutrisi (kalori, protein, karbohidrat, lemak) dan riwayat menu.
- Fitur Validasi Nutrisi Berbasis AI (BL-05): Validasi foto makanan dan analisis keselarasan klaim nutrisi menggunakan AI Vision sebelum menu dipublikasikan.
- Fitur Panel Admin: Master Data SPPG & Sekolah (BL-06): Manajemen pendaftaran akun SPPG, pemetaan relasi sekolah ke dapur, dan pencatatan audit log perubahan data.
- Fitur Status Distribusi Harian dan Bukti Foto (BL-07): Pembaruan status distribusi makanan (siap diantar, sudah diantar, dll.) beserta unggahan bukti foto secara real-time.
- Fitur Notifikasi Keterlambatan Distribusi (BL-08): Pemicu otomatis notifikasi WhatsApp kepada Admin dan Guru pada pukul 11:00 WIB jika status distribusi masih belum dikirim.
- Fitur Ulasan dan Foto dari Siswa (BL-09): Pengiriman ulasan harian, rating bintang, dan unggahan foto makanan oleh siswa yang terhubung dengan menu harian.
- Fitur Moderasi Post-Publish Ulasan oleh Guru (BL-10): Hak moderasi bagi Guru untuk melakukan flagging atau menghapus ulasan siswa yang bermasalah.
- Fitur Sistem Notifikasi (BL-11): Panel notifikasi dalam aplikasi (in-app notification) untuk memantau aktivitas ulasan baru dan status moderasi.
- Fitur Notifikasi Ulasan Kritis dan Tindak Lanjut SPPG (BL-12): Deteksi kata kunci ulasan kritis (seperti "basi", "bau", "kotor") untuk dikirim ke dashboard SPPG beserta status tindak lanjut penanganan.
- Fitur Ringkasan Evaluasi Dapur Berbasis AI (BL-13): Ringkasan analisis sentimen harian (positif, netral, negatif) dan poin evaluasi utama berbasis AI.

### Fixed
- Perbaikan bug sinkronisasi notifikasi (unsync) antara peran Admin, Siswa, dan Guru.
- Perbaikan bug scroll otomatis ke atas halaman saat memicu perpindahan menu atau halaman pada dashboard.
- Perbaikan tombol navigasi kembali pada halaman login dan fungsionalitas tombol aksi pada halaman siswa.
- Perbaikan tampilan white blur berlebihan pada visual layout antarmuka.
- Perbaikan bug visual di mana ikon pencarian menimpa card sekolah yang telah dipilih.
- Perbaikan bug visual layout pencarian sekolah dan isu koneksi database (db network) di environment Docker Compose.
- Perbaikan layout offset padding atas halaman detail dapur publik agar tidak tertutup oleh komponen navigation bar.
- Perbaikan bug Framer Motion di mana posisi scroll halaman dimulai dari tengah secara tidak sengaja.
- Perbaikan modal pemilihan wilayah kota/kabupaten pada form kelola data profil SPPG.
- Perbaikan fungsionalitas dan tampilan profil dapur khusus untuk role Guru.
- Perbaikan bug validasi/pembatasan relasi sekolah jika terdapat lebih dari satu sekolah yang terdaftar.
- Perbaikan bug paging (pagination) pada tab daftar profil dapur.
