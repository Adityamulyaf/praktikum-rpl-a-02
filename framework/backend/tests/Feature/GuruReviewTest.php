<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\TeacherProfile;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Review;
use App\Models\SppgProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuruReviewTest extends TestCase
{
    use RefreshDatabase;

    private $school;
    private $teacherUser;
    private $studentUser;
    private $sppgProfile;
    private $review;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create a School
        $this->school = School::create([
            'name' => 'SMP SATAP KAGI',
            'address' => 'Gilubandu',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
        ]);

        // 2. Create a Teacher User and Profile
        $this->teacherUser = User::create([
            'name' => 'Pak Budi',
            'email' => 'budi@example.com',
            'password' => bcrypt('password123'),
            'role' => 'guru',
            'is_active' => true,
        ]);
        TeacherProfile::create([
            'user_id' => $this->teacherUser->ssid,
            'school_id' => $this->school->id,
            'nip' => '198710102010121002',
        ]);

        // 3. Create a Student User and Profile
        $this->studentUser = User::create([
            'name' => 'Ahmad Pratama',
            'email' => 'ahmad@example.com',
            'password' => bcrypt('password123'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
        StudentProfile::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'nisn' => '0080000101',
        ]);

        // 4. Create an SPPG Profile and link to the school
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

        // 5. Create a Review
        $this->review = Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => now()->toDateString(),
            'content' => 'Makanan bergizi dan lezat sekali.',
            'flag_status' => 'none',
        ]);
    }

    public function test_teacher_can_fetch_reviews_for_their_sppg()
    {
        $response = $this->actingAs($this->teacherUser)->getJson('/api/guru/reviews');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($this->review->content, $response->json('data.0.content'));
    }

    public function test_teacher_can_flag_student_review()
    {
        $response = $this->actingAs($this->teacherUser)->postJson("/api/guru/reviews/{$this->review->id}/flag", [
            'flag_status' => 'flagged',
            'flag_reason' => 'Ulasan tidak pantas',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('flagged', $response->json('review.flag_status'));
        $this->assertEquals('Ulasan tidak pantas', $response->json('review.flag_reason'));

        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'flag_status' => 'flagged',
            'flag_reason' => 'Ulasan tidak pantas',
        ]);
    }

    public function test_teacher_can_unflag_student_review()
    {
        // First flag it
        $this->review->update([
            'flag_status' => 'flagged',
            'flag_reason' => 'Alasan flagging',
        ]);

        $response = $this->actingAs($this->teacherUser)->postJson("/api/guru/reviews/{$this->review->id}/flag", [
            'flag_status' => 'none',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('none', $response->json('review.flag_status'));
        $this->assertNull($response->json('review.flag_reason'));

        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'flag_status' => 'none',
            'flag_reason' => null,
        ]);
    }

    public function test_teacher_cannot_flag_review_from_another_sppg()
    {
        $otherSppgUser = User::create([
            'name' => 'Other SPPG',
            'email' => 'other_sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
        ]);
        $otherSppg = SppgProfile::create([
            'user_id' => $otherSppgUser->ssid,
            'kitchen_name' => 'Other SPPG Kitchen',
            'address' => 'Address Other',
            'district' => 'District Other',
            'province' => 'Province Other',
            'contact_person_name' => 'Contact Other',
            'contact_phone' => '0812345679',
        ]);

        $otherReview = Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $otherSppg->id,
            'review_date' => now()->toDateString(),
            'content' => 'Review for another kitchen.',
            'flag_status' => 'none',
        ]);

        $response = $this->actingAs($this->teacherUser)->postJson("/api/guru/reviews/{$otherReview->id}/flag", [
            'flag_status' => 'flagged',
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_fetch_sppg_profile_with_id()
    {
        $response = $this->actingAs($this->teacherUser)->getJson('/api/guru/sppg-profile');

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $this->sppgProfile->id,
            'kitchen_name' => $this->sppgProfile->kitchen_name,
        ]);
    }
}
