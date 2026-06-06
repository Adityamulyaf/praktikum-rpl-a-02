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
}
