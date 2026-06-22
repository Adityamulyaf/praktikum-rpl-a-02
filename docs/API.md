# Dokumentasi API (Scramble)

Proyek ini menggunakan **[Dedoc Scramble](https://scramble.dedoc.co/)** untuk membuat dokumentasi API secara otomatis tanpa perlu menulis anotasi/atribut OpenAPI secara manual. Scramble menganalisis route, controller, Form Request, dan API Resource Anda secara dinamis untuk menyusun spesifikasi API.

---

## Cara Mengakses Dokumentasi

Setelah container Docker berjalan, Anda dapat mengakses dokumentasi interaktif melalui:

**URL Backend (Nginx):** [http://localhost/docs/api](http://localhost/docs/api)

> [!NOTE]
> Secara default, dokumentasi ini hanya dapat diakses pada lingkungan lokal (`APP_ENV=local`). Pada lingkungan produksi, akses akan dibatasi oleh middleware bawaan untuk alasan keamanan.

---

## Best Practices Penulisan Kode untuk Dokumentasi

Agar dokumentasi yang dihasilkan otomatis oleh Scramble lengkap dan informatif, ikuti panduan penulisan kode Laravel di bawah ini:

### 1. Deskripsi Endpoint (PHPDoc)
Tambahkan komentar PHPDoc di atas method Controller Anda. Baris pertama akan menjadi ringkasan (summary), dan baris berikutnya akan menjadi deskripsi detail endpoint.

```php
/**
 * Mengambil menu harian sekolah.
 *
 * Endpoint ini digunakan untuk mengambil menu makanan bergizi harian beserta
 * detail nutrisinya yang disediakan oleh SPPG untuk sekolah tujuan.
 */
public function getMenuHarian(Request $request)
{
    // ...
}
```

### 2. Parameter Input (Form Request)
Selalu gunakan **Form Request** untuk validasi data input. Scramble membaca aturan validasi (`rules()`) untuk menentukan field mana yang wajib (`required`), tipe data, limitasi string/angka, dan parameter query/body.

```php
// app/Http/Requests/StoreMenuRequest.php
public function rules(): array
{
    return [
        'nama_menu' => 'required|string|max:100',
        'foto_makanan' => 'required|image|mimes:jpeg,png|max:2048',
        'kalori' => 'required|numeric|min:0',
        'protein' => 'required|numeric|min:0',
    ];
}
```

### 3. Struktur Output (API Resource / JsonResource)
Gunakan **Eloquent API Resources** untuk mengembalikan response dari controller. Scramble akan menganalisis array pengembalian untuk mendokumentasikan skema JSON response.

```php
// app/Http/Resources/MenuResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'nama_menu' => $this->nama_menu,
        'kalori' => (float) $this->kalori,
        'protein' => (float) $this->protein,
        'created_at' => $this->created_at->toIso8601String(),
    ];
}
```

---

## Konfigurasi & Keamanan

### Pembatasan Akses (Production)
Konfigurasi utama terletak di [scramble.php](file:///home/adityamulyaf/praktikum-rpl-a-02/framework/backend/config/scramble.php). 
Secara default, class `RestrictedDocsAccess` membatasi akses di luar `local`. Jika Anda ingin mendefinisikan siapa saja yang boleh mengakses di production (misal Admin), Anda bisa mendaftarkan gate otorisasi di `app/Providers/AppServiceProvider.php` (atau register method Gate Scramble):

```php
use Dedoc\Scramble\Scramble;

public function boot(): void
{
    Scramble::auth(function (Request $request) {
        // Logika otorisasi Anda, misal:
        return $request->user()?->isAdmin() ?? false;
    });
}
```

---

## Perintah Berguna

Jika Anda melakukan perubahan konfigurasi atau ingin mengoptimalkan dokumentasi:

- **Publish file konfigurasi & view:**
  ```bash
  docker compose exec backend php artisan vendor:publish --provider="Dedoc\Scramble\ScrambleServiceProvider"
  ```
- **Membersihkan cache dokumentasi:**
  ```bash
  docker compose exec backend php artisan scramble:clear
  ```
- **Melakukan caching dokumentasi (untuk produksi):**
  ```bash
  docker compose exec backend php artisan scramble:cache
  ```
