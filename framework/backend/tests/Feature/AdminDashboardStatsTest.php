<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\SppgProfile;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\Review;
use App\Models\DistributionStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_dashboard_stats()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $sppgUser = User::create([
            'name' => 'SPPG User',
            'email' => 'sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
        ]);

        $sppg = SppgProfile::create([
            'user_id' => $sppgUser->ssid,
            'kitchen_name' => 'SPPG Kagi Kitchen',
            'address' => 'Kagi Address',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
            'contact_person_name' => 'Contact SPPG',
            'contact_phone' => '0812345678',
        ]);

        $school = School::create([
            'name' => 'SMP SATAP KAGI',
            'address' => 'Gilubandu',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
        ]);

        $student = User::create([
            'name' => 'Siswa User',
            'email' => 'siswa@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);

        StudentProfile::create([
            'user_id' => $student->ssid,
            'school_id' => $school->id,
            'nisn' => '0080000101',
        ]);

        $today = now('Asia/Jakarta')->toDateString();

        DistributionStatus::create([
            'sppg_id' => $sppg->id,
            'school_id' => $school->id,
            'distributed_at' => $today,
            'status' => 'sudah_diantar',
            'status_updated_at' => now(),
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJson([
                'totals' => [
                    'sppg' => 1,
                    'schools' => 1,
                    'siswa' => 1,
                    'guru' => 0,
                    'reviews' => 0,
                ],
                'distribution_today' => [
                    'total' => 1,
                    'details' => [
                        'belum_diantar' => 0,
                        'siap_diantar' => 0,
                        'sudah_diantar' => 1,
                        'batal' => 0,
                    ]
                ]
            ]);
    }

    public function test_non_admin_cannot_access_dashboard_stats()
    {
        $siswa = User::create([
            'name' => 'Siswa User',
            'email' => 'siswa@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);

        $response = $this->actingAs($siswa)->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(403);
    }
}
