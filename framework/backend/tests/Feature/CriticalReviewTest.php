<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Review;
use App\Models\SppgProfile;
use App\Models\CriticalReviewFollowup;
use App\Models\Notification;
use App\Models\FollowupHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CriticalReviewTest extends TestCase
{
    use RefreshDatabase;

    private $school;
    private $studentUser;
    private $sppgUser;
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

        $this->sppgUser = User::create([
            'name' => 'Test SPPG',
            'email' => 'sppg@example.com',
            'password' => bcrypt('password123'),
            'role' => 'sppg',
            'is_active' => true,
            'phone_number' => '0812345678',
        ]);
        $this->sppgProfile = SppgProfile::create([
            'user_id' => $this->sppgUser->ssid,
            'kitchen_name' => 'SPPG Kagi Kitchen',
            'address' => 'Kagi Address',
            'district' => 'Kab. Tolikara',
            'province' => 'Prov. Papua',
            'contact_person_name' => 'Contact SPPG',
            'contact_phone' => '0812345678',
        ]);
        $this->sppgProfile->schools()->attach($this->school->id);
    }

    public function test_normal_review_does_not_trigger_critical_status()
    {
        $response = $this->actingAs($this->studentUser)->postJson('/api/siswa/reviews', [
            'content' => 'Makanannya enak sekali hari ini, terima kasih dapur.',
            'review_date' => now()->toDateString(),
        ]);

        $response->assertStatus(201);
        $reviewId = $response->json('id');

        $this->assertDatabaseHas('reviews', [
            'id' => $reviewId,
            'is_critical' => false,
        ]);

        $this->assertDatabaseMissing('critical_review_followups', [
            'review_id' => $reviewId,
        ]);

        $this->assertEquals(0, Notification::count());
    }

    public function test_critical_keywords_trigger_critical_status_and_notifications()
    {
        $response = $this->actingAs($this->studentUser)->postJson('/api/siswa/reviews', [
            'content' => 'Makanan hari ini rasanya basi dan kotor!',
            'review_date' => now()->toDateString(),
        ]);

        $response->assertStatus(201);
        $reviewId = $response->json('id');

        $this->assertDatabaseHas('reviews', [
            'id' => $reviewId,
            'is_critical' => true,
        ]);

        $this->assertDatabaseHas('critical_review_followups', [
            'review_id' => $reviewId,
            'sppg_id' => $this->sppgProfile->id,
            'followup_status' => 'belum_diproses',
        ]);

        // Should have created 1 notification in the unified schema
        $this->assertEquals(1, Notification::where('type', 'review_critical')->count());
        $notification = Notification::where('type', 'review_critical')->first();
        $this->assertEquals($this->sppgProfile->user_id, $notification->user_id);
        $this->assertEquals('Ulasan Kritis Terdeteksi', $notification->title);
        $this->assertFalse($notification->read);
        $this->assertEquals($reviewId, $notification->data['review_id']);

        // Since sppgUser phone number is set, but WhatsApp is disabled in testing, whatsapp_sent should be false
        $this->assertFalse($notification->whatsapp_sent);
    }

    public function test_sppg_can_list_and_update_followups()
    {
        // 1. Create a critical review
        $review = Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => now()->toDateString(),
            'content' => 'Makanannya basi dan bau busuk.',
            'is_critical' => true,
            'flag_status' => 'none',
        ]);

        $followup = CriticalReviewFollowup::create([
            'review_id' => $review->id,
            'sppg_id' => $this->sppgProfile->id,
            'followup_status' => 'belum_diproses',
        ]);

        // 2. SPPG list followups
        $response = $this->actingAs($this->sppgUser)->getJson('/api/sppg/followups');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($followup->id, $response->json('data.0.id'));

        // 3. SPPG update followup status to dalam_proses with note
        $response = $this->actingAs($this->sppgUser)->putJson("/api/sppg/followups/{$followup->id}", [
            'followup_status' => 'dalam_proses',
            'handling_note' => 'Sedang dicek ke dapur cabang Kagi.',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('dalam_proses', $response->json('followup_status'));
        $this->assertEquals('Sedang dicek ke dapur cabang Kagi.', $response->json('handling_note'));

        $this->assertDatabaseHas('critical_review_followups', [
            'id' => $followup->id,
            'followup_status' => 'dalam_proses',
            'handling_note' => 'Sedang dicek ke dapur cabang Kagi.',
            'updated_by' => $this->sppgUser->ssid,
        ]);

        $this->assertDatabaseHas('followup_histories', [
            'followup_id' => $followup->id,
            'previous_status' => 'belum_diproses',
            'new_status' => 'dalam_proses',
            'note' => 'Sedang dicek ke dapur cabang Kagi.',
            'changed_by' => $this->sppgUser->ssid,
        ]);
    }

    public function test_sppg_can_manage_notifications()
    {
        // 1. Create a notification
        $notification = Notification::create([
            'user_id' => $this->sppgUser->ssid,
            'type' => 'review_critical',
            'title' => 'Ulasan Kritis Terdeteksi',
            'body' => 'Ulasan kritis terdeteksi!',
            'read' => false,
        ]);

        // 2. Fetch notifications
        $response = $this->actingAs($this->sppgUser)->getJson('/api/notifications');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));

        // 3. Mark notification as read
        $response = $this->actingAs($this->sppgUser)->putJson("/api/notifications/{$notification->id}/read");
        $response->assertStatus(200);
        $this->assertTrue($response->json('read'));

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'read' => true,
        ]);
    }
}
