# BL-01 Siswa & Guru Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambahkan alur registrasi terpisah untuk role `siswa` dan `guru` — masing-masing memilih sekolah saat mendaftar, tanpa role-picker di satu form umum.

**Architecture:** Dua endpoint publik (`POST /register/siswa`, `POST /register/guru`) masing-masing membuat User + profil spesifik (StudentProfile / TeacherProfile) dalam satu transaksi. Frontend menambahkan langkah pilih-role sebelum form register. Sekolah diambil dari endpoint publik `GET /public/schools` tanpa autentikasi.

**Tech Stack:** Laravel 11 (Sanctum, Eloquent), React 18 (Vite), CSS variables (existing design system)

---

## File Map

### Backend — buat
| File | Tanggung jawab |
|------|---------------|
| `database/migrations/2026_05_26_000001_create_student_profiles_table.php` | Tabel profil siswa (`user_id`, `school_id`, `nisn`) |
| `database/migrations/2026_05_26_000002_create_teacher_profiles_table.php` | Tabel profil guru (`user_id`, `school_id`, `nip`) |
| `app/Models/StudentProfile.php` | Eloquent model + relasi ke User & School |
| `app/Models/TeacherProfile.php` | Eloquent model + relasi ke User & School |
| `app/Http/Controllers/Api/RegisterController.php` | `registerSiswa()` + `registerGuru()` |
| `app/Http/Controllers/Api/PublicController.php` | `schools()` — daftar sekolah tanpa auth |

### Backend — ubah
| File | Perubahan |
|------|-----------|
| `routes/api.php` | Tambah route publik schools + register siswa/guru |

### Frontend — buat
| File | Tanggung jawab |
|------|---------------|
| `src/api/auth.js` | `registerSiswa()`, `registerGuru()`, `getPublicSchools()` |
| `src/pages/RegisterSelectForm.jsx` | Step pilih role: tombol Siswa vs Guru |
| `src/pages/SiswaRegisterForm.jsx` | Form register siswa: nama, email, password, sekolah, NISN (opsional) |
| `src/pages/GuruRegisterForm.jsx` | Form register guru: nama, email, password, sekolah, NIP (opsional) |

### Frontend — ubah
| File | Perubahan |
|------|-----------|
| `src/pages/Login.jsx` | Tambah view `register-select`, `register-siswa`, `register-guru` |

---

## Task 1: Migrasi student_profiles

**Files:**
- Create: `framework/backend/database/migrations/2026_05_26_000001_create_student_profiles_table.php`

- [ ] **Buat file migrasi**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->unique();
            $table->foreign('user_id')->references('ssid')->on('users')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('nisn', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
```

- [ ] **Jalankan migrasi**

```bash
cd framework/backend && php artisan migrate
```

Expected output: `... student_profiles table created`

---

## Task 2: Migrasi teacher_profiles

**Files:**
- Create: `framework/backend/database/migrations/2026_05_26_000002_create_teacher_profiles_table.php`

- [ ] **Buat file migrasi**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->unique();
            $table->foreign('user_id')->references('ssid')->on('users')->cascadeOnDelete();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('nip', 30)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
```

- [ ] **Jalankan migrasi**

```bash
php artisan migrate
```

Expected output: `... teacher_profiles table created`

---

## Task 3: Model StudentProfile & TeacherProfile

**Files:**
- Create: `framework/backend/app/Models/StudentProfile.php`
- Create: `framework/backend/app/Models/TeacherProfile.php`

- [ ] **Buat StudentProfile.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'school_id', 'nisn'])]
class StudentProfile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
```

- [ ] **Buat TeacherProfile.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'school_id', 'nip'])]
class TeacherProfile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
```

---

## Task 4: PublicController — daftar sekolah

**Files:**
- Create: `framework/backend/app/Http/Controllers/Api/PublicController.php`

- [ ] **Buat PublicController.php**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;

class PublicController extends Controller
{
    public function schools()
    {
        $schools = School::select('id', 'name', 'district', 'province')
            ->orderBy('name')
            ->get();

        return response()->json($schools);
    }
}
```

---

## Task 5: RegisterController

**Files:**
- Create: `framework/backend/app/Http/Controllers/Api/RegisterController.php`

- [ ] **Buat RegisterController.php**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function registerSiswa(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', 'confirmed', Password::min(8)],
            'school_id'             => 'required|exists:schools,id',
            'nisn'                  => 'nullable|string|max:20',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => $request->password,
                'role'     => 'siswa',
                'is_active' => true,
            ]);

            StudentProfile::create([
                'user_id'   => $user->ssid,
                'school_id' => $request->school_id,
                'nisn'      => $request->nisn,
            ]);

            return $user;
        });

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user,
        ], 201);
    }

    public function registerGuru(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', 'confirmed', Password::min(8)],
            'school_id'             => 'required|exists:schools,id',
            'nip'                   => 'nullable|string|max:30',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password,
                'role'      => 'guru',
                'is_active' => true,
            ]);

            TeacherProfile::create([
                'user_id'   => $user->ssid,
                'school_id' => $request->school_id,
                'nip'       => $request->nip,
            ]);

            return $user;
        });

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user,
        ], 201);
    }
}
```

---

## Task 6: Tambah routes

**Files:**
- Modify: `framework/backend/routes/api.php`

- [ ] **Tambah import dan routes**

Tambahkan di bagian atas setelah `use` statements yang ada:
```php
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\PublicController;
```

Tambahkan setelah `Route::post('/login', ...)`:
```php
Route::post('/register/siswa', [RegisterController::class, 'registerSiswa']);
Route::post('/register/guru',  [RegisterController::class, 'registerGuru']);
```

Isi `Route::prefix('public')` yang sudah ada:
```php
Route::prefix('public')->group(function () {
    Route::get('/schools', [PublicController::class, 'schools']);
});
```

- [ ] **Verifikasi routes terdaftar**

```bash
php artisan route:list | grep -E "register|public"
```

Expected:
```
POST  api/register/siswa
POST  api/register/guru
GET   api/public/schools
```

---

## Task 7: Frontend API functions

**Files:**
- Create: `framework/frontend/src/api/auth.js`

- [ ] **Buat auth.js**

```js
import api from './axios';

export const registerSiswa = (data) => api.post('/register/siswa', data);
export const registerGuru  = (data) => api.post('/register/guru', data);
export const getPublicSchools = ()  => api.get('/public/schools');
```

---

## Task 8: RegisterSelectForm

**Files:**
- Create: `framework/frontend/src/pages/RegisterSelectForm.jsx`

- [ ] **Buat RegisterSelectForm.jsx**

```jsx
export default function RegisterSelectForm({ onSelect, onBack }) {
  return (
    <>
      <div className="lp-header">
        <h2>Daftar Akun</h2>
        <p>Pilih peran Anda di platform HaloMBG</p>
      </div>

      <div className="rg-select-grid">
        <button type="button" className="rg-role-card" onClick={() => onSelect('siswa')}>
          <span className="rg-role-icon">🎒</span>
          <span className="rg-role-label">Siswa</span>
          <span className="rg-role-desc">Saya adalah siswa penerima MBG</span>
        </button>
        <button type="button" className="rg-role-card" onClick={() => onSelect('guru')}>
          <span className="rg-role-icon">📋</span>
          <span className="rg-role-label">Guru</span>
          <span className="rg-role-desc">Saya adalah guru atau pengawas sekolah</span>
        </button>
      </div>

      <p className="lp-switch">
        Sudah punya akun?{' '}
        <button type="button" className="lp-switch-btn" onClick={onBack}>Masuk</button>
      </p>
    </>
  );
}
```

Tambahkan CSS berikut ke `Login.css`:

```css
/* ── REGISTER SELECT ─────────────────────────────────────── */

.rg-select-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.rg-role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
  background: var(--surface-1);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 150ms, box-shadow 150ms;
  font-family: var(--font-sans);
  text-align: center;
}

.rg-role-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(7, 30, 73, 0.1);
}

.rg-role-icon  { font-size: 28px; line-height: 1; }
.rg-role-label { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.rg-role-desc  { font-size: 12px; color: var(--text-secondary); line-height: 16px; }
```

---

## Task 9: SiswaRegisterForm

**Files:**
- Create: `framework/frontend/src/pages/SiswaRegisterForm.jsx`

- [ ] **Buat SiswaRegisterForm.jsx**

```jsx
import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import { registerSiswa, getPublicSchools } from '../api/auth';

export default function SiswaRegisterForm({ onSuccess, onBack }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '', school_id: '', nisn: '' });
  const [schools, setSchools] = useState([]);
  const [showPw, setShowPw]         = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicSchools().then(({ data }) => setSchools(data)).catch(() => {});
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await registerSiswa(form);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-header">
        <h2>Daftar sebagai Siswa</h2>
        <p>Masukkan data diri Anda untuk membuat akun</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-name">Nama Lengkap</label>
          <input id="sv-name" className="lp-input" type="text" placeholder="Nama Anda"
            value={form.name} onChange={set('name')} required autoComplete="name" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-email">Email</label>
          <input id="sv-email" className="lp-input" type="email" placeholder="nama@email.com"
            value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-school">Sekolah</label>
          <select id="sv-school" className="lp-input" value={form.school_id} onChange={set('school_id')} required>
            <option value="">-- Pilih sekolah Anda --</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.district}</option>
            ))}
          </select>
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-nisn">NISN <span style={{ fontWeight: 400, opacity: 0.6 }}>(opsional)</span></label>
          <input id="sv-nisn" className="lp-input" type="text" placeholder="Nomor Induk Siswa Nasional"
            value={form.nisn} onChange={set('nisn')} autoComplete="off" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-password">Kata Sandi</label>
          <PasswordInput id="sv-password" value={form.password} onChange={set('password')}
            showPassword={showPw} onToggle={() => setShowPw((v) => !v)}
            placeholder="Minimal 8 karakter" autoComplete="new-password" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="sv-pwconf">Konfirmasi Kata Sandi</label>
          <PasswordInput id="sv-pwconf" value={form.password_confirmation} onChange={set('password_confirmation')}
            showPassword={showPwConf} onToggle={() => setShowPwConf((v) => !v)}
            placeholder="Ulangi kata sandi" autoComplete="new-password" />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? <><span className="lp-spinner" />Memproses...</> : 'Daftar sebagai Siswa'}
        </button>
      </form>

      <button type="button" className="lp-back-btn" onClick={onBack}>← Kembali</button>
    </>
  );
}
```

---

## Task 10: GuruRegisterForm

**Files:**
- Create: `framework/frontend/src/pages/GuruRegisterForm.jsx`

- [ ] **Buat GuruRegisterForm.jsx**

```jsx
import { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput';
import { registerGuru, getPublicSchools } from '../api/auth';

export default function GuruRegisterForm({ onSuccess, onBack }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '', school_id: '', nip: '' });
  const [schools, setSchools] = useState([]);
  const [showPw, setShowPw]         = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicSchools().then(({ data }) => setSchools(data)).catch(() => {});
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await registerGuru(form);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-header">
        <h2>Daftar sebagai Guru</h2>
        <p>Masukkan data diri Anda untuk membuat akun</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-name">Nama Lengkap</label>
          <input id="gr-name" className="lp-input" type="text" placeholder="Nama Anda"
            value={form.name} onChange={set('name')} required autoComplete="name" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-email">Email</label>
          <input id="gr-email" className="lp-input" type="email" placeholder="nama@email.com"
            value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-school">Sekolah</label>
          <select id="gr-school" className="lp-input" value={form.school_id} onChange={set('school_id')} required>
            <option value="">-- Pilih sekolah Anda --</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.district}</option>
            ))}
          </select>
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-nip">NIP <span style={{ fontWeight: 400, opacity: 0.6 }}>(opsional)</span></label>
          <input id="gr-nip" className="lp-input" type="text" placeholder="Nomor Induk Pegawai"
            value={form.nip} onChange={set('nip')} autoComplete="off" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-password">Kata Sandi</label>
          <PasswordInput id="gr-password" value={form.password} onChange={set('password')}
            showPassword={showPw} onToggle={() => setShowPw((v) => !v)}
            placeholder="Minimal 8 karakter" autoComplete="new-password" />
        </div>

        <div className="lp-field">
          <label className="lp-label" htmlFor="gr-pwconf">Konfirmasi Kata Sandi</label>
          <PasswordInput id="gr-pwconf" value={form.password_confirmation} onChange={set('password_confirmation')}
            showPassword={showPwConf} onToggle={() => setShowPwConf((v) => !v)}
            placeholder="Ulangi kata sandi" autoComplete="new-password" />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? <><span className="lp-spinner" />Memproses...</> : 'Daftar sebagai Guru'}
        </button>
      </form>

      <button type="button" className="lp-back-btn" onClick={onBack}>← Kembali</button>
    </>
  );
}
```

---

## Task 11: Update Login.jsx

**Files:**
- Modify: `framework/frontend/src/pages/Login.jsx`

- [ ] **Tambah import dan view baru**

Ganti seluruh isi `Login.jsx` dengan:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterSelectForm from './RegisterSelectForm';
import SiswaRegisterForm from './SiswaRegisterForm';
import GuruRegisterForm from './GuruRegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import './Login.css';

const ROLE_PATHS = {
  admin: '/admin',
  sppg:  '/sppg',
  siswa: '/siswa',
  guru:  '/guru',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, token, role } = useAuth();
  const [view, setView] = useState('login');

  useEffect(() => {
    const root = document.getElementById('root');
    root.classList.add('login-page');
    return () => root.classList.remove('login-page');
  }, []);

  useEffect(() => {
    if (token && role) {
      navigate(ROLE_PATHS[role] ?? '/dashboard', { replace: true });
    }
  }, [token, role, navigate]);

  const handleLogin = async ({ email, password }) => {
    const response = await api.post('/login', { email, password });
    login(response.data);
    navigate(ROLE_PATHS[response.data.role] ?? '/dashboard', { replace: true });
  };

  const handleRegistered = (data) => {
    login(data);
    navigate(ROLE_PATHS[data.role] ?? '/dashboard', { replace: true });
  };

  const handleForgot = async ({ email }) => {
    await api.post('/forgot-password', { email });
  };

  return (
    <div className="login-root">
      <div className="lp-center">
        <div className="lp-brand">HaloMBG</div>
        <div className="lp-card">
          <div className="lp-card-body">
            {view === 'login' && (
              <LoginForm
                onSubmit={handleLogin}
                onForgot={() => setView('forgot')}
                onSwitch={() => setView('register-select')}
              />
            )}
            {view === 'register-select' && (
              <RegisterSelectForm
                onSelect={(role) => setView(`register-${role}`)}
                onBack={() => setView('login')}
              />
            )}
            {view === 'register-siswa' && (
              <SiswaRegisterForm
                onSuccess={handleRegistered}
                onBack={() => setView('register-select')}
              />
            )}
            {view === 'register-guru' && (
              <GuruRegisterForm
                onSuccess={handleRegistered}
                onBack={() => setView('register-select')}
              />
            )}
            {view === 'forgot' && (
              <ForgotPasswordForm
                onSubmit={handleForgot}
                onBack={() => setView('login')}
              />
            )}
          </div>
        </div>
        <p className="lp-footer">&copy; 2026 HaloMBG</p>
      </div>
    </div>
  );
}
```

- [ ] **Hapus RegisterForm.jsx yang lama** (sudah tidak dipakai)

```bash
rm framework/frontend/src/pages/RegisterForm.jsx
```

---

## Task 12: Tambah style `select` ke Login.css

**Files:**
- Modify: `framework/frontend/src/pages/Login.css`

- [ ] **Tambah style untuk `<select>` agar seragam dengan `<input>`**

Tambahkan di bawah `.lp-input.with-eye`:

```css
.lp-input[type="date"],
select.lp-input {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E8D88' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  -webkit-appearance: none;
  appearance: none;
}
```

---

## Verifikasi akhir

- [ ] **Test register siswa**: Buka `/login` → Daftar → Siswa → isi form → submit → redirect ke `/siswa`
- [ ] **Test register guru**: Buka `/login` → Daftar → Guru → isi form → submit → redirect ke `/guru`
- [ ] **Test login setelah register**: Logout → login ulang dengan akun yang baru dibuat → redirect benar
- [ ] **Test tombol Kembali**: Pastikan navigasi antar step berjalan (register-select ↔ register-siswa/guru ↔ login)
- [ ] **Test sekolah kosong**: Jika belum ada sekolah di DB, dropdown kosong — tidak error, hanya tidak ada pilihan

---
