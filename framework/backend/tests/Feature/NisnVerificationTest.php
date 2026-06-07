<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\DapodikStudent;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NisnVerificationTest extends TestCase
{
    use RefreshDatabase;

    private $school;
    private $dapodikStudent;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed some basic data
        $this->school = School::create([
            'name' => 'SMP SATAP KAGI',
            'address' => 'Gilubandu',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
        ]);

        $this->dapodikStudent = DapodikStudent::create([
            'nisn' => '0080000101',
            'name' => 'Ahmad Pratama',
            'school_id' => $this->school->id,
        ]);
    }

    public function test_verify_nisn_returns_student_data_if_exists()
    {
        $response = $this->getJson('/api/public/verify-nisn?nisn=0080000101');

        $response->assertStatus(200)
            ->assertJson([
                'nisn' => '0080000101',
                'name' => 'Ahmad Pratama',
                'school_id' => $this->school->id,
                'school_name' => $this->school->name,
            ]);
    }

    public function test_verify_nisn_returns_404_if_not_found()
    {
        $response = $this->getJson('/api/public/verify-nisn?nisn=9999999999');

        $response->assertStatus(404)
            ->assertJsonStructure(['message']);
    }

    public function test_siswa_registration_succeeds_with_correct_nisn_and_school()
    {
        $response = $this->postJson('/api/register/siswa', [
            'email' => 'siswa_test@halombg.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'siswa_test@halombg.com', 'name' => 'Ahmad Pratama']);
        $this->assertDatabaseHas('student_profiles', [
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);
    }

    public function test_siswa_registration_fails_with_wrong_school()
    {
        $wrongSchool = School::create([
            'name' => 'Other School',
            'district' => 'Other',
            'province' => 'Other',
        ]);

        $response = $this->postJson('/api/register/siswa', [
            'email' => 'siswa_test@halombg.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'school_id' => $wrongSchool->id,
            'nisn' => '0080000101',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Asal sekolah tidak cocok dengan data terdaftar NISN.'
            ]);
    }

    public function test_siswa_registration_fails_with_invalid_nisn()
    {
        $response = $this->postJson('/api/register/siswa', [
            'email' => 'siswa_test@halombg.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'school_id' => $this->school->id,
            'nisn' => '9999999999',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'NISN tidak terdaftar dalam database penerima program MBG.'
            ]);
    }

    public function test_siswa_registration_fails_if_nisn_already_registered()
    {
        // First register
        $this->postJson('/api/register/siswa', [
            'email' => 'siswa_test@halombg.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // Second register with same NISN
        $response = $this->postJson('/api/register/siswa', [
            'email' => 'siswa_another@halombg.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'NISN ini sudah terdaftar. Silakan hubungi pihak sekolah jika terjadi kesalahan.'
            ]);
    }

    public function test_student_can_submit_review_with_photo_mapped_to_serving_sppg()
    {
        // 1. Create a student user and their profile
        $user = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // 2. Create an SPPG user and profile, and link to the school
        $sppgUser = User::create([
            'name' => 'Test SPPG',
            'email' => 'sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
        ]);
        $sppgProfile = \App\Models\SppgProfile::create([
            'user_id' => $sppgUser->ssid,
            'kitchen_name' => 'SPPG Kagi Kitchen',
            'address' => 'Kagi Address',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
            'contact_person_name' => 'Contact SPPG',
            'contact_phone' => '0812345678',
        ]);
        $sppgProfile->schools()->attach($this->school->id);

        // 3. Submit review as the student
        $response = $this->actingAs($user)->postJson('/api/siswa/reviews', [
            'content' => 'Makanannya lezat sekali dan bergizi!',
            'photo' => 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'content' => 'Makanannya lezat sekali dan bergizi!',
                'photo' => 'data:image/png;base64,iVBORw0KGgoAAAANS...',
                'school_id' => $this->school->id,
                'sppg_id' => $sppgProfile->id,
            ]);

        $this->assertDatabaseHas('reviews', [
            'content' => 'Makanannya lezat sekali dan bergizi!',
            'photo' => 'data:image/png;base64,iVBORw0KGgoAAAANS...',
            'sppg_id' => $sppgProfile->id,
            'school_id' => $this->school->id,
        ]);
    }

    public function test_student_can_fetch_review_history_containing_photo()
    {
        $user = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // Insert direct review
        \App\Models\Review::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'review_date' => now()->toDateString(),
            'content' => 'Kritik dan saran ulasan.',
            'photo' => 'data:image/jpeg;base64,abc123xyz',
            'flag_status' => 'none',
        ]);

        $response = $this->actingAs($user)->getJson('/api/siswa/reviews');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('data:image/jpeg;base64,abc123xyz', $response->json('data.0.photo'));
    }

    public function test_student_cannot_submit_review_if_school_is_not_served_by_sppg()
    {
        $user = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // School is NOT served by any SPPG
        $response = $this->actingAs($user)->postJson('/api/siswa/reviews', [
            'content' => 'Makanannya lezat sekali dan bergizi!',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun, sehingga Anda belum dapat mengirimkan ulasan.'
            ]);
    }

    public function test_sppg_info_endpoint_returns_served_false_when_not_linked()
    {
        $user = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        $response = $this->actingAs($user)->getJson('/api/siswa/sppg-info');

        $response->assertStatus(200)
            ->assertJson([
                'served' => false,
                'message' => 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun.'
            ]);
    }

    public function test_sppg_info_endpoint_returns_served_true_when_linked()
    {
        $user = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $user->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        $sppgUser = User::create([
            'name' => 'Test SPPG',
            'email' => 'sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
        ]);
        $sppgProfile = \App\Models\SppgProfile::create([
            'user_id' => $sppgUser->ssid,
            'kitchen_name' => 'SPPG Kagi Kitchen',
            'address' => 'Kagi Address',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
            'contact_person_name' => 'Contact SPPG',
            'contact_phone' => '0812345678',
        ]);
        $sppgProfile->schools()->attach($this->school->id);

        $response = $this->actingAs($user)->getJson('/api/siswa/sppg-info');

        $response->assertStatus(200)
            ->assertJson([
                'served' => true,
                'kitchen_name' => 'SPPG Kagi Kitchen',
            ]);
    }
}
