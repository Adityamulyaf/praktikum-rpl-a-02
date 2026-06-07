# Dokumentasi Data NISN Dummy (Simulasi Dapodik)

Untuk kebutuhan pengembangan dan pengujian sistem registrasi siswa berbasis NISN pada project **HaloMBG**, berikut adalah daftar data referensi siswa dummy yang telah ditambahkan ke database (`dapodik_students`).

---

## Ringkasan Aturan Penomoran NISN
Setiap NISN terdiri dari **10 digit** dengan pola:
*   `008` (Tahun lahir dummy) + `0000` + `[ID Sekolah]` + `[Nomor Urut]`
*   Setiap sekolah memiliki **30 siswa dummy**.

---

## Hubungan Sekolah & Dapur SPPG

Semua 5 sekolah dummy di bawah ini telah terhubung ke **1 Dapur SPPG Terdekat** (Dapur SPPG Test yang terasosiasi dengan email `sppg@halombg.com`). 
Hal ini memudahkan pengujian secara menyeluruh:
1. Ketika siswa dari salah satu sekolah ini mengirimkan ulasan (review) harian, ulasan tersebut akan langsung diarahkan ke Dapur SPPG Test tersebut.
2. Ketika Dapur SPPG Test mengumumkan menu harian atau mengubah status distribusi makanan, data tersebut akan langsung terdistribusi ke kelima sekolah ini.

---

## Daftar NISN Per Sekolah

### 1. SMP SATAP KAGI (ID: 1)
*   **Rentang NISN:** `0080000101` s.d. `0080000130`
*   **Contoh Siswa:**
    *   `0080000101` - Ahmad Pratama
    *   `0080000102` - Budi Santoso
    *   `0080000103` - Siti Rahmawati
    *   ... (lihat seeder untuk daftar lengkap)

### 2. SD YPPGI WURINERI (ID: 2)
*   **Rentang NISN:** `0080000201` s.d. `0080000230`
*   **Contoh Siswa:**
    *   `0080000201` - Ahmad Pratama
    *   `0080000210` - Joko Setiawan
    *   `0080000220` - Utami Astuti
    *   ...

### 3. SMAN BOKONDINI (ID: 3)
*   **Rentang NISN:** `0080000301` s.d. `0080000330`
*   **Contoh Siswa:**
    *   `0080000315` - Oki Saputra
    *   `0080000325` - Aditya Nasution
    *   `0080000330` - Gita Wijaya
    *   ...

### 4. SD INPRES KUARI (ID: 4)
*   **Rentang NISN:** `0080000401` s.d. `0080000430`
*   **Contoh Siswa:**
    *   `0080000405` - Eko Wibowo
    *   `0080000412` - Lani Putra
    *   `0080000424` - Zainal Lubis
    *   ...

### 5. SMAS YPPGI KARUBAGA (ID: 5)
*   **Rentang NISN:** `0080000501` s.d. `0080000530`
*   **Contoh Siswa:**
    *   `0080000507` - Guntur Kusuma
    *   `0080000518` - Sari Fitriani
    *   `0080000529` - Farhan Tampubolon
    *   ...

---

## 30 Nama Siswa Dummy yang Digunakan (Berurutan)
Nama-nama siswa di atas di-seed berurutan dari indeks `01` s.d. `30` menggunakan daftar nama berikut:
1. `Ahmad Pratama`
2. `Budi Santoso`
3. `Siti Rahmawati`
4. `Dewi Lestari`
5. `Eko Wibowo`
6. `Fitri Hidayat`
7. `Guntur Kusuma`
8. `Hadi Wijaya`
9. `Indah Purnama`
10. `Joko Setiawan`
11. `Kartika Nugroho`
12. `Lani Putra`
13. `Mulyono Putri`
14. `Novi Gunawan`
15. `Oki Saputra`
16. `Putri Utama`
17. `Rian Ramadhan`
18. `Sari Fitriani`
19. `Taufik Subagyo`
20. `Utami Astuti`
21. `Vina Hadi`
22. `Wawan Firmansyah`
23. `Yanti Siregar`
24. `Zainal Lubis`
25. `Aditya Nasution`
26. `Bambang Ginting`
27. `Cahya Sitorus`
28. `Diana Manurung`
29. `Farhan Tampubolon`
30. `Gita Wijaya`
