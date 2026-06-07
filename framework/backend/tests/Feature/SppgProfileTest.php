<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\TeacherProfile;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\SppgProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SppgProfileTest extends TestCase
{
    use RefreshDatabase;

    private $school;
    private $sppgProfile;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::create([
            'name' => 'SMP SATAP KAGI',
            'address' => 'Gilubandu',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
        ]);

        $sppgUser = User::create([
            'name' => 'Test SPPG',
            'email' => 'sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
        ]);
        $this->sppgProfile = SppgProfile::create([
            'user_id' => $sppgUser->ssid,
            'kitchen_name' => 'SPPG Kagi Kitchen',
            'address' => 'Kagi Address',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
            'contact_person_name' => 'Contact SPPG',
            'contact_phone' => '0812345678',
        ]);
        $this->sppgProfile->schools()->attach($this->school->id);
    }

    public function test_siswa_can_view_profile_but_cannot_edit()
    {
        $user = User::create([
            'name' => 'Siswa Test',
            'email' => 'siswa@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // 1. View profile
        $response = $this->actingAs($user)->getJson('/api/sppg/profile');
        $response->assertStatus(200)
            ->assertJson(['kitchen_name' => 'SPPG Kagi Kitchen']);

        // 2. Attempt update (should be forbidden)
        $response = $this->actingAs($user)->putJson('/api/sppg/profile', [
            'kitchen_name' => 'Hack Kitchen',
        ]);
        $response->assertStatus(403);
    }

    public function test_guru_can_view_profile_but_cannot_edit()
    {
        $user = User::create([
            'name' => 'Guru Test',
            'email' => 'guru@example.com',
            'password' => bcrypt('password123'),
            'role' => 'guru',
            'is_active' => true,
        ]);
        TeacherProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nip' => '198710102010121002',
        ]);

        // 1. View profile
        $response = $this->actingAs($user)->getJson('/api/sppg/profile');
        $response->assertStatus(200)
            ->assertJson(['kitchen_name' => 'SPPG Kagi Kitchen']);

        // 2. Attempt update (should be forbidden)
        $response = $this->actingAs($user)->putJson('/api/sppg/profile', [
            'kitchen_name' => 'Hack Kitchen',
        ]);
        $response->assertStatus(403);
    }

    public function test_sppg_can_view_and_edit_own_profile()
    {
        $user = User::where('role', 'sppg')->first();

        // 1. View profile
        $response = $this->actingAs($user)->getJson('/api/sppg/profile');
        $response->assertStatus(200)
            ->assertJson(['kitchen_name' => 'SPPG Kagi Kitchen']);

        // 2. Edit profile
        $response = $this->actingAs($user)->putJson('/api/sppg/profile', [
            'kitchen_name' => 'Updated Kagi Kitchen',
            'address' => 'New Kagi Address',
        ]);
        $response->assertStatus(200)
            ->assertJson([
                'kitchen_name' => 'Updated Kagi Kitchen',
                'address' => 'New Kagi Address',
            ]);
    }

    public function test_admin_can_view_and_edit_any_profile()
    {
        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 1. View profile by passing sppg_id
        $response = $this->actingAs($user)->getJson('/api/sppg/profile?sppg_id=' . $this->sppgProfile->id);
        $response->assertStatus(200)
            ->assertJson(['kitchen_name' => 'SPPG Kagi Kitchen']);

        // 2. Edit profile by passing sppg_id
        $response = $this->actingAs($user)->putJson('/api/sppg/profile', [
            'sppg_id' => $this->sppgProfile->id,
            'kitchen_name' => 'Admin Updated Kitchen',
        ]);
        $response->assertStatus(200)
            ->assertJson(['kitchen_name' => 'Admin Updated Kitchen']);
    }
}
