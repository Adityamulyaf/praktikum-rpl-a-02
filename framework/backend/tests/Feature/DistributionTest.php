<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\SppgProfile;
use App\Models\School;
use App\Models\DistributionStatus;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

class DistributionTest extends TestCase
{
    use RefreshDatabase;

    public function test_sppg_can_update_distribution_status_with_photo(): void
    {
        // 1. Create SPPG user & profile
        $user = User::factory()->create(['role' => 'sppg']);
        $profile = SppgProfile::create([
            'user_id' => $user->ssid,
            'kitchen_name' => 'Test Kitchen',
            'address' => 'Test Address',
            'district' => 'Test District',
            'province' => 'Test Province',
            'contact_person_name' => 'Test Contact',
            'contact_phone' => '081234567890',
            'is_active' => true,
        ]);

        // 2. Create school & associate
        $school = School::create([
            'name' => 'Test School',
            'district' => 'Test District',
            'province' => 'Test Province',
        ]);
        $profile->schools()->attach($school->id);

        // 3. Create initial distribution record
        $record = DistributionStatus::create([
            'sppg_id' => $profile->id,
            'school_id' => $school->id,
            'distributed_at' => Carbon::today()->toDateString(),
            'status' => 'belum_diantar',
        ]);

        Sanctum::actingAs($user);

        // 4. Update status to "sudah_diantar" with a base64 photo
        $payload = [
            'status' => 'sudah_diantar',
            'photo' => 'data:image/jpeg;base64,mockphoto'
        ];

        $response = $this->putJson("/api/sppg/distribution/{$record->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('distribution_statuses', [
            'id' => $record->id,
            'status' => 'sudah_diantar',
            'photo' => 'data:image/jpeg;base64,mockphoto',
        ]);
    }

    public function test_public_can_view_distribution_status(): void
    {
        $user = User::factory()->create(['role' => 'sppg']);
        $profile = SppgProfile::create([
            'user_id' => $user->ssid,
            'kitchen_name' => 'Test Kitchen',
            'address' => 'Test Address',
            'district' => 'Test District',
            'province' => 'Test Province',
            'contact_person_name' => 'Test Contact',
            'contact_phone' => '081234567890',
            'is_active' => true,
        ]);

        $school = School::create([
            'name' => 'Test School',
            'district' => 'Test District',
            'province' => 'Test Province',
        ]);

        $record = DistributionStatus::create([
            'sppg_id' => $profile->id,
            'school_id' => $school->id,
            'distributed_at' => Carbon::today()->toDateString(),
            'status' => 'sudah_diantar',
            'photo' => 'data:image/jpeg;base64,mockphoto',
        ]);

        $response = $this->getJson("/api/public/distribution?date=" . Carbon::today()->toDateString());

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'status' => 'sudah_diantar',
            'photo' => 'data:image/jpeg;base64,mockphoto',
        ]);
    }
}
