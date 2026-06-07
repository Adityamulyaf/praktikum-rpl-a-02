<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\SppgProfile;
use App\Models\DailyMenu;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_sppg_can_create_menu_with_ai_simulated_data(): void
    {
        // Find or create test SPPG user and profile
        $user = User::where('role', 'sppg')->first();
        if (!$user) {
            $user = User::factory()->create(['role' => 'sppg']);
        }
        
        $profile = $user->sppgProfile;
        if (!$profile) {
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
            $user->refresh();
        }

        Sanctum::actingAs($user);

        // Payload with simulated/scanned AI menu data (numbers for nutritional values)
        $payload = [
            'served_at'  => '2026-06-05',
            'menu_name'  => 'Nasi Putih, Fillet Ayam Panggang, Cah Wortel & Buncis, Susu Kotak UHT, Potongan Melon',
            'components' => 'Menu memenuhi standar kecukupan nutrisi program MBG dengan gizi makro lengkap dan serat seimbang.',
            'calories'   => 640,
            'protein'    => 25,
            'carbs'      => 82,
            'fat'        => 14,
            'photo'      => 'data:image/jpeg;base64,mockdataurl',
            'is_ai_validated' => true,
            'ai_warning' => null,
        ];

        $response = $this->postJson('/api/sppg/menu', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('daily_menus', [
            'sppg_id' => $profile->id,
            'served_at' => '2026-06-05',
            'menu_name' => 'Nasi Putih, Fillet Ayam Panggang, Cah Wortel & Buncis, Susu Kotak UHT, Potongan Melon',
            'calories' => 640,
            'photo' => 'data:image/jpeg;base64,mockdataurl',
            'is_ai_validated' => true,
            'ai_warning' => null,
        ]);
    }

    public function test_sppg_can_create_menu_with_ai_validation_warning(): void
    {
        $user = User::where('role', 'sppg')->first();
        if (!$user) {
            $user = User::factory()->create(['role' => 'sppg']);
        }
        
        $profile = $user->sppgProfile;
        if (!$profile) {
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
            $user->refresh();
        }

        Sanctum::actingAs($user);

        $payload = [
            'served_at'  => '2026-06-06',
            'menu_name'  => 'Nasi Putih, Fillet Ayam Panggang',
            'components' => 'Nasi dan Ayam',
            'calories'   => 1200,
            'protein'    => 25,
            'carbs'      => 82,
            'fat'        => 14,
            'photo'      => 'data:image/jpeg;base64,mockdataurl',
            'is_ai_validated' => false,
            'ai_warning' => 'Porsi yang terlihat di foto tampak kecil untuk klaim kalori sebesar 1200 kkal',
        ];

        $response = $this->postJson('/api/sppg/menu', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('daily_menus', [
            'sppg_id' => $profile->id,
            'served_at' => '2026-06-06',
            'menu_name' => 'Nasi Putih, Fillet Ayam Panggang',
            'calories' => 1200,
            'photo' => 'data:image/jpeg;base64,mockdataurl',
            'is_ai_validated' => false,
            'ai_warning' => 'Porsi yang terlihat di foto tampak kecil untuk klaim kalori sebesar 1200 kkal',
        ]);
    }

    public function test_sppg_cannot_create_duplicate_menu_on_same_date(): void
    {
        $user = User::factory()->create(['role' => 'sppg']);
        $profile = SppgProfile::create([
            'user_id' => $user->ssid,
            'kitchen_name' => 'Test Kitchen Duplicate',
            'address' => 'Test Address',
            'district' => 'Test District',
            'province' => 'Test Province',
            'contact_person_name' => 'Test Contact',
            'contact_phone' => '081234567890',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        // 1. Create first menu
        $payload1 = [
            'served_at'  => '2026-06-07',
            'menu_name'  => 'Nasi Putih',
            'calories'   => 400,
        ];
        $response1 = $this->postJson('/api/sppg/menu', $payload1);
        $response1->assertStatus(201);

        // 2. Try creating second menu on the same date
        $payload2 = [
            'served_at'  => '2026-06-07',
            'menu_name'  => 'Nasi Goreng',
            'calories'   => 500,
        ];
        $response2 = $this->postJson('/api/sppg/menu', $payload2);
        $response2->assertStatus(422)
            ->assertJson([
                'message' => 'Menu harian untuk tanggal ini sudah dibuat.'
            ]);
    }

    public function test_sppg_cannot_update_menu_to_conflicting_date(): void
    {
        $user = User::factory()->create(['role' => 'sppg']);
        $profile = SppgProfile::create([
            'user_id' => $user->ssid,
            'kitchen_name' => 'Test Kitchen Update',
            'address' => 'Test Address',
            'district' => 'Test District',
            'province' => 'Test Province',
            'contact_person_name' => 'Test Contact',
            'contact_phone' => '081234567890',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        // 1. Create first menu for 2026-06-07
        $menu1 = DailyMenu::create([
            'sppg_id'   => $profile->id,
            'served_at' => '2026-06-07',
            'menu_name' => 'Menu Day 1',
        ]);

        // 2. Create second menu for 2026-06-08
        $menu2 = DailyMenu::create([
            'sppg_id'   => $profile->id,
            'served_at' => '2026-06-08',
            'menu_name' => 'Menu Day 2',
        ]);

        // 3. Try updating second menu to 2026-06-07
        $response = $this->putJson("/api/sppg/menu/{$menu2->id}", [
            'served_at' => '2026-06-07',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Menu harian untuk tanggal ini sudah dibuat.'
            ]);
    }

    public function test_sppg_can_validate_nutrition_claims_via_ai_endpoint(): void
    {
        $user = User::factory()->create(['role' => 'sppg']);
        $profile = SppgProfile::create([
            'user_id' => $user->ssid,
            'kitchen_name' => 'Test Kitchen Validate',
            'address' => 'Test Address',
            'district' => 'Test District',
            'province' => 'Test Province',
            'contact_person_name' => 'Test Contact',
            'contact_phone' => '081234567890',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'menu_name'  => 'Nasi Putih, Fillet Ayam Panggang',
            'components' => 'Nasi dan Ayam',
            'calories'   => 1200,
            'protein'    => 25,
            'carbs'      => 82,
            'fat'        => 14,
            'photo'      => 'data:image/jpeg;base64,mockdataurl',
        ];

        $response = $this->postJson('/api/sppg/menu/validate-nutrition', $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'is_valid',
            'warning_message',
        ]);
    }
}
