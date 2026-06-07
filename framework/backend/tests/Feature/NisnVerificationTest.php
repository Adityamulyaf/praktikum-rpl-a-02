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
}
