<?php

namespace Tests\Unit;

use App\Services\GeminiValidationService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiValidationServiceTest extends TestCase
{
    /**
     * Test validateNutrition returns invalid status when Gemini API key is missing.
     */
    public function test_validate_nutrition_returns_invalid_status_when_api_key_is_missing(): void
    {
        // Arrange
        Config::set('services.gemini.key', null);
        $service = new GeminiValidationService();
        $menuData = [
            'menu_name' => 'Nasi Ayam',
            'components' => 'Nasi, Ayam Goreng, Sayur Sop',
            'calories' => 500,
            'protein' => 25,
            'carbs' => 60,
            'fat' => 15
        ];

        // Act
        $result = $service->validateNutrition($menuData);

        // Assert
        $this->assertFalse($result['is_valid']);
        $this->assertNull($result['warning_message']);
    }

    /**
     * Test validateNutrition parses and returns valid response when Gemini API succeeds with positive result.
     */
    public function test_validate_nutrition_succeeds_when_gemini_api_returns_valid_nutrition(): void
    {
        // Arrange
        Config::set('services.gemini.key', 'dummy-gemini-key');
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'is_valid' => true,
                                        'warning_message' => ''
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $service = new GeminiValidationService();
        $menuData = [
            'menu_name' => 'Nasi Ayam',
            'components' => 'Nasi, Ayam Goreng, Sayur Sop',
            'calories' => 500,
            'protein' => 25,
            'carbs' => 60,
            'fat' => 15
        ];

        // Act
        $result = $service->validateNutrition($menuData);

        // Assert
        $this->assertTrue($result['is_valid']);
        $this->assertNull($result['warning_message']);
    }

    /**
     * Test validateNutrition parses and returns invalid response with warning when Gemini API reports unmatched nutrition.
     */
    public function test_validate_nutrition_fails_when_gemini_api_reports_unmatched_nutrition(): void
    {
        // Arrange
        Config::set('services.gemini.key', 'dummy-gemini-key');
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'is_valid' => false,
                                        'warning_message' => 'Kalori terlalu rendah untuk porsi protein yang diklaim.'
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $service = new GeminiValidationService();
        $menuData = [
            'menu_name' => 'Menu Tidak Realistis',
            'components' => 'Nasi putih saja',
            'calories' => 500,
            'protein' => 80,
            'carbs' => 10,
            'fat' => 5
        ];

        // Act
        $result = $service->validateNutrition($menuData);

        // Assert
        $this->assertFalse($result['is_valid']);
        $this->assertEquals('Kalori terlalu rendah untuk porsi protein yang diklaim.', $result['warning_message']);
    }
}
