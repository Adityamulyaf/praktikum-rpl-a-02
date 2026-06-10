# Panduan Docker - HaloMBG

Dokumen ini menjelaskan prosedur wajib sebelum dan selama bekerja dengan Docker di project ini.

---

## Prasyarat

Pastikan sudah terinstall di komputer kamu:

- **Docker Desktop** — [download di sini](https://www.docker.com/products/docker-desktop/)
- **WSL 2** (Windows Subsystem for Linux) — wajib untuk Windows

> Cek versi Docker: `docker --version` dan `docker compose version`

---

## Prosedur Wajib Sebelum Mulai

### 1. Buka Docker Desktop dulu

Docker Desktop **harus running** sebelum menjalankan command apapun. Pastikan icon Docker di taskbar tidak menunjukkan "Starting..." atau error.

### 2. Masuk ke WSL (khusus pengguna Windows)

Buka terminal, lalu masuk ke WSL:

```bash
wsl
```

Atau buka langsung dari **Windows Terminal** dengan memilih distro Ubuntu/WSL kamu.

> Kenapa harus di WSL? Karena Docker di Windows berjalan melalui WSL 2. Menjalankan command Docker dari PowerShell/CMD bisa, tapi path file dan permission sering bermasalah.

### 3. Masuk ke direktori yang benar

Semua file Docker ada di folder `framework/`. **Selalu** jalankan command Docker dari sana:

```bash
cd ~/praktikum-rpl-a-02/framework
```

Kalau tidak di direktori ini, `docker compose` tidak akan menemukan file `compose.yaml` dan akan error.

---

## Menjalankan Project

### Pertama kali / setelah ada perubahan Dockerfile

```bash
docker compose up --build -d
```

- `up` — membuat dan menjalankan semua container yang didefinisikan di `compose.yaml`
- `--build` — paksa build ulang image Docker sebelum dijalankan (wajib kalau ada perubahan `Dockerfile`)
- `-d` — *detached mode*, container jalan di background sehingga terminal kamu tidak tertahan

### Normal (sudah pernah build sebelumnya)

```bash
docker compose up -d
```

Sama seperti di atas tapi tanpa build ulang — lebih cepat karena memakai image yang sudah ada.

### Cek semua container berjalan

```bash
docker compose ps
```

Menampilkan daftar semua container beserta statusnya. Kalau ada yang `Exit` atau `Restarting`, berarti ada yang error — cek log-nya.

Semua container harus berstatus `Up` atau `running`:

| Container       | Port           | Fungsi              |
|-----------------|----------------|---------------------|
| `pgsql_db`      | 5433 (host)    | Database PostgreSQL |
| `laravel_api`   | —              | Backend Laravel     |
| `nginx_server`  | 80 (host)      | Web server / API    |
| `vite_frontend` | 5173 (host)    | Frontend Vite       |

---

## Akses Aplikasi

| Layanan  | URL                      |
|----------|--------------------------|
| API      | http://localhost:80      |
| Frontend | http://localhost:5173    |
| Database | `localhost:5433` (via DB client seperti DBeaver/TablePlus) |

Kredensial database:
- **Host:** `localhost`
- **Port:** `5433`
- **Database:** `laravel`
- **User:** `sail`
- **Password:** `password`

---

## Command Sehari-hari

### Melihat log container

Log berguna untuk debug — kalau ada error di backend atau frontend, ini tempat pertama yang dicek.

```bash
# Semua container sekaligus
docker compose logs -f

# Hanya backend (Laravel)
docker compose logs -f backend

# Hanya frontend (Vite)
docker compose logs -f frontend
```

Flag `-f` (*follow*) artinya log terus muncul secara real-time. Tekan `Ctrl+C` untuk berhenti.

### Masuk ke dalam container (shell)

Kadang kamu perlu "masuk ke dalam" container untuk menjalankan perintah langsung di dalamnya, seperti saat debug atau install sesuatu secara manual.

```bash
# Masuk ke container backend (Laravel) — dapat bash shell
docker compose exec backend bash

# Untuk keluar dari dalam container
exit
```

```bash
# Masuk ke database PostgreSQL secara interaktif
# -U sail = login sebagai user 'sail', -d laravel = buka database 'laravel'
docker compose exec db psql -U sail -d laravel
```

Setelah masuk ke psql, kamu bisa jalankan query SQL langsung. Ketik `\q` untuk keluar.

### Menjalankan Artisan (Laravel)

**Artisan** adalah CLI bawaan Laravel untuk mengelola backend. Semua command artisan dijalankan dari luar container dengan prefix `docker compose exec backend`.

```bash
# Jalankan semua file migration yang belum pernah dijalankan
# → Membuat/mengupdate tabel di database sesuai file di database/migrations/
docker compose exec backend php artisan migrate
```

```bash
# Hapus SEMUA tabel, jalankan ulang semua migration, lalu isi data awal (seed)
# → Dipakai saat ingin reset database ke kondisi bersih
# HATI-HATI: semua data hilang
docker compose exec backend php artisan migrate:fresh --seed
```

```bash
# Tampilkan semua endpoint/route yang terdaftar di backend
# → Berguna untuk cek apakah route yang kamu buat sudah benar
docker compose exec backend php artisan route:list
```

```bash
# Bersihkan cache konfigurasi (pakai ini kalau perubahan .env tidak ke-load)
docker compose exec backend php artisan config:clear
```

### Mengelola Dependency

```bash
# Install semua package PHP dari composer.json
# → Wajib dijalankan setelah pull kalau composer.json berubah
docker compose exec backend composer install
```

```bash
# Tambah package PHP baru (contoh: tambah package spatie/laravel-permission)
docker compose exec backend composer require nama/package
```

```bash
# Install semua package JS dari package.json
# → Wajib dijalankan setelah pull kalau package.json berubah
docker compose exec frontend npm install
```

### Mematikan container

```bash
# Matikan semua container — data database tetap tersimpan di volume pgdata
docker compose down
```

```bash
# Matikan semua container DAN hapus volume (termasuk data database)
docker compose down -v
```

> **Hati-hati** dengan `down -v` — ini menghapus volume `pgdata`, artinya semua data database hilang permanen. Koordinasi dengan tim sebelum pakai ini.

---

## Prosedur Kalau Ada Perubahan Kode

Kenapa file PHP/frontend tidak perlu restart? Karena kita pakai **volume mount** — folder di komputermu (`./backend`) langsung "ditempel" ke dalam container. Jadi apapun yang kamu edit di VS Code langsung terlihat di dalam container tanpa perlu rebuild.

| Apa yang berubah | Yang perlu dilakukan | Kenapa |
|---|---|---|
| File PHP / Laravel | Tidak perlu apa-apa | Volume mount, perubahan langsung terdeteksi |
| File frontend (JS/CSS) | Tidak perlu apa-apa | Vite hot-reload otomatis di browser |
| `Dockerfile` | `docker compose up --build -d` | Image container harus dibangun ulang |
| `compose.yaml` | `docker compose down && docker compose up -d` | Konfigurasi Docker berubah, perlu restart |
| `docker-entrypoint.sh` | `docker compose up --build -d` | Script ini di-copy ke dalam image saat build |
| `composer.json` / `composer.lock` | `docker compose exec backend composer install` | Download package PHP baru ke dalam container |
| `package.json` / `package-lock.json` | `docker compose exec frontend npm install` | Download package JS baru ke dalam container |
| File di `database/migrations/` | `docker compose exec backend php artisan migrate` | Tabel baru/perubahan schema perlu diterapkan ke database |

---

## Troubleshooting Umum

### Container tidak mau jalan / error saat build

```bash
docker compose up --build
```
Jalankan tanpa `-d` untuk melihat error secara langsung di terminal.

### Port sudah dipakai (port conflict)

Error: `Bind for 0.0.0.0:80 failed: port is already allocated`

Cari dan matikan proses yang memakai port tersebut:
```bash
# Di WSL/Linux
sudo lsof -i :80
sudo kill -9 <PID>
```

### Database tidak bisa diakses / migration gagal

Pastikan container `pgsql_db` sudah benar-benar running sebelum backend mencoba konek:
```bash
docker compose ps db
```

Kalau masih bermasalah, coba restart hanya container database:
```bash
docker compose restart db
```

### Reset total (kalau semua sudah kacau)

```bash
docker compose down -v
docker compose up --build -d
```

### API / Login Mengembalikan Error 404, `Connection Refused`, atau "Autentikasi Gagal" (Proxy Error)

**Gejala:**
Aplikasi web berjalan, tetapi saat mencoba login atau memanggil API, sistem mengembalikan error `404 Not Found`, `Request failed with status code 404`, atau error `Autentikasi gagal` padahal kredensial seeder yang dimasukkan sudah benar. Di log container frontend (`docker compose logs frontend`), terlihat pesan seperti:
`[vite] http proxy error: /api/login Error: connect ECONNREFUSED 172.18.0.x:80`

**Penyebab:**
1. **Sinkronisasi Volume Nginx Kosong:** Kendala sinkronisasi volume (*bind-mount sync*) Docker di WSL2 membuat folder `./nginx/conf.d` kosong di dalam kontainer `nginx_server`. Akibatnya, Nginx tidak membaca file `default.conf` (tidak berjalan di port 80).
2. **Resolusi IP Container Nginx Kadaluarsa:** Saat container di-down/up, Docker memberikan IP internal baru ke container Nginx. Namun, Vite Dev Server di container `frontend` men-cache IP lama dari kontainer `webserver`, mengakibatkan koneksi proxy ditolak (`ECONNREFUSED`).

**Solusi:**
1. Hentikan dan jalankan kembali kontainer Docker agar pemetaan volume diperbarui:
   ```bash
   docker compose down
   docker compose up -d
   ```
2. Pastikan file konfigurasi berhasil terpasang di dalam kontainer dengan menjalankan:
   ```bash
   docker exec nginx_server ls -la /etc/nginx/conf.d
   ```
   *(Harus menampilkan file `default.conf`)*
3. **Mulai Ulang Container Frontend (Penting):** Jalankan perintah berikut agar Vite Dev Server melakukan pencarian/resolusi ulang alamat IP kontainer Nginx yang baru:
   ```bash
   docker compose restart frontend
   ```
4. Muat ulang (*refresh*) halaman browser Anda (`F5` atau `Ctrl+F5`) agar browser memuat ulang JavaScript dan membuat koneksi baru.

**Catatan Tambahan:**
Jika Nginx sudah dikonfigurasi dengan benar tetapi error 404 pada `/api` masih terjadi di browser, pastikan volume mount untuk file `vite.config.js` di dalam file `compose.yaml` ditulis dengan benar (`/app/vite.config.js`, bukan `/app/vite.config.jss`). Kesalahan ketik (*typo*) tersebut menyebabkan kontainer Vite menggunakan konfigurasi bawaan tanpa *proxy* `/api`, sehingga semua panggilan API langsung diarahkan ke Vite dev server dan menghasilkan error 404.

---

## Checklist Sebelum Push / Pull Request

- [ ] `docker compose up -d` berjalan tanpa error
- [ ] Semua container berstatus `Up` (`docker compose ps`)
- [ ] API dapat diakses di `http://localhost:80`
- [ ] Frontend dapat diakses di `http://localhost:5173`
- [ ] Kalau ada perubahan schema database, sudah menjalankan migration
