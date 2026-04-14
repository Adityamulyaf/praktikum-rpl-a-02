# User Stories - Sistem Monitoring MBG

### US-07 — Memantau Status Distribusi MBG
**Sebagai** Pemantau Publik,  
**saya ingin** melihat status distribusi MBG harian per dapur dan per sekolah (siap diantar/sudah diantar/belum diantar/batal),  
**agar** saya dapat memastikan penerima manfaat mendapatkan hak mereka setiap harinya.

**Acceptance Criteria:**
* **Given** saya membuka halaman status distribusi suatu dapur pada hari tertentu, 
* **When** halaman berhasil dimuat, 
* **Then** sistem menampilkan daftar sekolah dengan status distribusi masing-masing beserta timestamp pembaruan terakhir dan foto bukti pengiriman (jika sudah diunggah oleh SPPG).

---

### US-08 — Memperbarui Status Distribusi (SPPG)
**Sebagai** Pihak SPPG,  
**saya ingin** memperbarui status distribusi makanan ke setiap sekolah dan mengunggah foto bukti pengiriman,  
**agar** distribusi yang saya lakukan terdokumentasi secara transparan dan dapat diverifikasi publik.

**Acceptance Criteria:**
* **Given** saya telah login dan membuka dashboard distribusi harian, 
* **When** saya mengubah status pengiriman ke suatu sekolah menjadi "Sudah Diantar" dan mengunggah foto bukti, 
* **Then** status terupdate secara real-time di halaman publik beserta foto dan timestamp pengiriman.

---

### US-09 — Memberikan Ulasan dan Foto Makanan
**Sebagai** Siswa,  
**saya ingin** memberikan ulasan harian tentang makanan MBG yang saya terima, disertai foto sebagai bukti,  
**agar** ada wadah resmi untuk menyampaikan pengalaman saya dan memverifikasi kesesuaian menu yang dipublikasikan.

**Acceptance Criteria:**
* **Given** saya telah login sebagai siswa dan MBG telah terdistribusi hari ini, 
* **When** saya mengisi form ulasan dengan teks dan mengunggah foto makanan lalu mengirim, 
* **Then** ulasan saya langsung tampil di halaman publik dengan nama dan timestamp, sementara guru di sekolah saya menerima notifikasi ulasan baru.

---

### US-10 — Moderasi Post-Publish Ulasan oleh Guru
**Sebagai** Guru,  
**saya ingin** dapat menandai (*flag*) ulasan siswa yang sudah tampil di publik jika kontennya tidak pantas atau menyesatkan,  
**agar** kualitas konten di platform tetap terjaga tanpa menghambat partisipasi siswa.

**Acceptance Criteria:**
* **Given** sebuah ulasan siswa sudah tampil di halaman publik, 
* **When** saya login sebagai guru dan mengklik tombol "Flag" pada ulasan tersebut dengan menyertakan alasan, 
* **Then** ulasan ditandai untuk ditinjau oleh admin dan muncul label peringatan sementara di halaman publik hingga keputusan admin dikeluarkan.
* **Given** saya menilai sebuah ulasan melanggar pedoman komunitas, 
* **When** saya mengklik tombol "Hapus" dan mengisi alasan penghapusan, 
* **Then** ulasan langsung tidak tampil di halaman publik dan siswa menerima notifikasi beserta alasan penghapusannya.

---

### US-11 — Melihat Ringkasan Evaluasi Dapur
**Sebagai** Pemantau Publik,  
**saya ingin** melihat ringkasan evaluasi sentimen harian atas ulasan yang masuk untuk suatu dapur MBG,  
**agar** saya dapat dengan cepat menilai kualitas dan konsistensi pelayanan dapur tersebut dari waktu ke waktu.

**Acceptance Criteria:**
* **Given** saya berada di halaman profil suatu dapur MBG, 
* **When** saya membuka tab "Evaluasi", 
* **Then** sistem menampilkan ringkasan analisis ulasan harian (positif/netral/negatif) beserta poin-poin utama yang sering disebut penerima, yang dihasilkan oleh sistem analisis AI.

---

### US-12 — Melihat Ringkasan Evaluasi Dapur sebagai Bahan Evaluasi Internal (SPPG)
**Sebagai** Pihak SPPG,  
**saya ingin** melihat ringkasan evaluasi sentimen ulasan penerima MBG di dapur saya secara lebih terperinci,  
**agar** saya dapat mengidentifikasi masalah spesifik per sekolah dan memperbaiki kualitas layanan dapur dari waktu ke waktu.

**Acceptance Criteria:**
* **Given** saya telah login sebagai SPPG dan membuka dashboard dapur saya, 
* **When** saya membuka tab "Evaluasi", 
* **Then** sistem menampilkan ringkasan sentimen (positif/netral/negatif) yang dilengkapi dengan breakdown per sekolah dan rekap historis per minggu sebagai bahan evaluasi internal dapur.

---

### US-13 — Pengelolaan Master Data SPPG & Sekolah
**Sebagai** Administrator,  
**saya ingin** dapat mendaftarkan akun SPPG baru dan memetakan sekolah-sekolah yang mereka layani,  
**agar** struktur operasional dan distribusi dalam sistem terbentuk dengan benar sebelum program dimulai.

**Acceptance Criteria:**
* **Given** saya telah login sebagai Admin, 
* **When** saya menginput data dapur (SPPG) baru dan memilih daftar sekolah dari database, 
* **Then** sistem menyimpan relasi tersebut dan memberikan akses login kepada pihak SPPG terkait.

---

### US-14 — Notifikasi Keterlambatan Distribusi
**Sebagai** Administrator atau Guru,  
**saya ingin** menerima peringatan otomatis jika suatu SPPG belum memperbarui status distribusi hingga batas waktu yang ditentukan (misal pukul 11:00 pagi),  
**agar** saya dapat melakukan pengecekan langsung ke pihak dapur.

**Acceptance Criteria:**
* **Given** waktu sistem menunjukkan pukul 11:00 pagi, 
* **When** ada sekolah yang status distribusinya masih "Belum Diantar", 
* **Then** sistem secara otomatis mengirimkan notifikasi peringatan (WhatsApp/Email) kepada Admin pusat dan Guru di sekolah tersebut.

---

### US-15 — Notifikasi Peringatan Ulasan Negatif/Kritis
**Sebagai** Pihak SPPG,  
**saya ingin** menerima notifikasi instan jika ada siswa yang memberikan ulasan dengan sentimen sangat negatif (misal indikasi makanan tidak layak),  
**agar** saya dapat segera melakukan investigasi dan perbaikan kualitas pada hari yang sama.

**Acceptance Criteria:**
* **Given** seorang siswa mengirimkan ulasan, 
* **When** sistem analisis AI mendeteksi sentimen negatif yang ekstrem atau kata kunci kritis (misal: "basi", "bau"), 
* **Then** sistem mengirimkan notifikasi real-time ke dashboard SPPG untuk segera ditindaklanjuti.