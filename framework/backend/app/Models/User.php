<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'is_active', 'phone_number'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasUuids;

    protected $primaryKey = 'ssid';
    public $incrementing = false;
    protected $keyType = 'string';

    public function uniqueIds(): array
    {
        return ['ssid'];
    }

    public function getKey()
    {
        return $this->ssid;
    }

    // Explicitly use UUID v7
    public function newUniqueId(): string
    {
        return (string) Str::uuid7(); // force UUID v7
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Role helpers
    public function isAdmin() { return $this->role === 'admin'; }
    public function isSppg()  { return $this->role === 'sppg'; }
    public function isSiswa() { return $this->role === 'siswa'; }
    public function isGuru()  { return $this->role === 'guru'; }

    // Relationships
    public function sppgProfile()
    {
        return $this->hasOne(SppgProfile::class, 'user_id', 'ssid');
    }

    public function studentProfile()
    {
        return $this->hasOne(StudentProfile::class, 'user_id', 'ssid');
    }

    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class, 'user_id', 'ssid');
    }

    /**
     * Get the query builder for the user's associated SPPG profile.
     */
    public function sppgQuery()
    {
        if ($this->isSppg()) {
            return SppgProfile::where('user_id', $this->ssid);
        }

        if ($this->isSiswa()) {
            $schoolId = $this->studentProfile?->school_id;
            if (!$schoolId) return null;
            return SppgProfile::whereHas('schools', function ($q) use ($schoolId) {
                $q->where('schools.id', $schoolId);
            });
        }

        if ($this->isGuru()) {
            $schoolId = $this->teacherProfile?->school_id;
            if (!$schoolId) return null;
            return SppgProfile::whereHas('schools', function ($q) use ($schoolId) {
                $q->where('schools.id', $schoolId);
            });
        }

        return null;
    }

    /**
     * Get the associated SPPG profile instance.
     */
    public function sppg()
    {
        $query = $this->sppgQuery();
        return $query ? $query->first() : null;
    }
}