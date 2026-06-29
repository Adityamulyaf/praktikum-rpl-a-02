<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Review;
use App\Models\SppgProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReviewTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $teacherUser;
    private $studentUser;
    private $sppgProfile;
    private $school;
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

        // 2. Create Admin User
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 3. Create Teacher User
        $this->teacherUser = User::create([
            'name' => 'Pak Budi',
            'email' => 'budi@example.com',
            'password' => bcrypt('password123'),
            'role' => 'guru',
            'is_active' => true,
        ]);

        // 4. Create Student User
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

        // 5. Create SPPG Profile
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

        // 6. Create a flagged review
        $this->review = Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => now()->toDateString(),
            'content' => 'Makanan basi dan tidak layak dimakan.',
            'flag_status' => 'flagged',
            'flag_reason' => 'Mengandung unsur keluhan fatal',
        ]);
    }

    public function test_admin_can_view_flagged_reviews()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/reviews');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($this->review->content, $response->json('data.0.content'));
        $this->assertEquals('flagged', $response->json('data.0.flag_status'));
        $this->assertEquals('Mengandung unsur keluhan fatal', $response->json('data.0.flag_reason'));
    }

    public function test_admin_can_approve_flagged_review_deletion()
    {
        $response = $this->actingAs($this->admin)->putJson("/api/admin/reviews/{$this->review->id}/resolve", [
            'action' => 'approve'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('deleted', $response->json('review.flag_status'));

        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'flag_status' => 'deleted',
        ]);
    }

    public function test_admin_can_dismiss_flagged_review_report()
    {
        $response = $this->actingAs($this->admin)->putJson("/api/admin/reviews/{$this->review->id}/resolve", [
            'action' => 'dismiss'
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

    public function test_non_admin_cannot_access_flagged_reviews_api()
    {
        // Test fetch
        $response = $this->actingAs($this->teacherUser)->getJson('/api/admin/reviews');
        $response->assertStatus(403);

        // Test resolve
        $response = $this->actingAs($this->teacherUser)->putJson("/api/admin/reviews/{$this->review->id}/resolve", [
            'action' => 'approve'
        ]);
        $response->assertStatus(403);
    }
}
