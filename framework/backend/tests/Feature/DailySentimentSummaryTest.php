<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\Review;
use App\Models\SppgProfile;
use App\Models\AiSentimentSummary;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class DailySentimentSummaryTest extends TestCase
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
            'is_active' => true,
        ]);
        $this->sppgProfile->schools()->attach($this->school->id);
    }

    public function test_console_command_generates_summary_using_gemini_api()
    {
        // Set fake API key so Gemini service doesn't skip
        Config::set('services.gemini.key', 'fake-api-key');

        $date = '2026-06-10';

        // Create 3 reviews for this kitchen on the given date
        Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => $date,
            'content' => 'Makanannya enak sekali hari ini, terima kasih dapur.',
            'flag_status' => 'none',
        ]);

        Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => $date,
            'content' => 'Porsinya kurang banyak tapi rasanya lumayan.',
            'flag_status' => 'none',
        ]);

        // A flagged review should NOT be analyzed
        Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => $date,
            'content' => 'Kata tidak pantas.',
            'flag_status' => 'flagged',
        ]);

        // Mock Gemini API Response
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'positive_count' => 1,
                                        'neutral_count' => 1,
                                        'negative_count' => 0,
                                        'key_points' => "• Siswa sangat menyukai masakan hari ini karena rasanya enak.\n• Terdapat saran untuk menambah porsi makanan.",
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // Run the console command
        $this->artisan("sppg:generate-sentiment --date={$date}")
            ->assertExitCode(0);

        // Assert that the record was created in the database
        $this->assertDatabaseHas('ai_sentiment_summaries', [
            'sppg_id' => $this->sppgProfile->id,
            'summary_date' => $date,
            'total_reviews' => 2, // only non-flagged reviews
            'positive_count' => 1,
            'neutral_count' => 1,
            'negative_count' => 0,
            'key_points' => "• Siswa sangat menyukai masakan hari ini karena rasanya enak.\n• Terdapat saran untuk menambah porsi makanan.",
        ]);
    }

    public function test_console_command_falls_back_to_heuristic_analysis_when_api_key_missing()
    {
        // Unset Gemini API key to force fallback
        Config::set('services.gemini.key', null);

        $date = '2026-06-10';

        // Create positive review
        Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => $date,
            'content' => 'Makanannya sangat lezat dan mantap!',
            'flag_status' => 'none',
        ]);

        // Create negative review (triggers keywords like "kurang" or "sedikit")
        Review::create([
            'user_id' => $this->studentUser->ssid,
            'school_id' => $this->school->id,
            'sppg_id' => $this->sppgProfile->id,
            'review_date' => $date,
            'content' => 'Makanannya sedikit dingin.',
            'flag_status' => 'none',
        ]);

        // Run the console command
        $this->artisan("sppg:generate-sentiment --date={$date}")
            ->assertExitCode(0);

        // Assert that the record was created with heuristic counts
        $this->assertDatabaseHas('ai_sentiment_summaries', [
            'sppg_id' => $this->sppgProfile->id,
            'summary_date' => $date,
            'total_reviews' => 2,
            'positive_count' => 1,
            'negative_count' => 1,
            'neutral_count' => 0,
        ]);

        $summary = AiSentimentSummary::where('sppg_id', $this->sppgProfile->id)->where('summary_date', $date)->first();
        $this->assertStringContainsString('Analisis alternatif', $summary->key_points);
    }

    public function test_public_sppg_profile_endpoint_returns_sentiment_summaries()
    {
        $date = '2026-06-10';

        // Create summary directly in db
        $summary = AiSentimentSummary::create([
            'sppg_id' => $this->sppgProfile->id,
            'summary_date' => $date,
            'total_reviews' => 5,
            'positive_count' => 3,
            'neutral_count' => 1,
            'negative_count' => 1,
            'key_points' => '• Rasa enak • Porsi pas',
        ]);

        // Hit public SPPG show endpoint
        $response = $this->getJson("/api/public/sppg/{$this->sppgProfile->id}");

        $response->assertStatus(200)
            ->assertJsonPath('sentiment_summaries.0.sppg_id', $this->sppgProfile->id)
            ->assertJsonPath('sentiment_summaries.0.summary_date', $date)
            ->assertJsonPath('sentiment_summaries.0.total_reviews', 5)
            ->assertJsonPath('sentiment_summaries.0.positive_count', 3)
            ->assertJsonPath('sentiment_summaries.0.key_points', '• Rasa enak • Porsi pas');
    }

    public function test_console_command_skips_and_deletes_summary_when_no_reviews()
    {
        $date = '2026-06-10';

        // 1. Create a summary for this date first (simulating previously existing summary)
        AiSentimentSummary::create([
            'sppg_id' => $this->sppgProfile->id,
            'summary_date' => $date,
            'total_reviews' => 2,
            'positive_count' => 1,
            'neutral_count' => 1,
            'negative_count' => 0,
            'key_points' => 'Old summary',
        ]);

        // 2. Run command with 0 reviews
        $this->artisan("sppg:generate-sentiment --date={$date}")
            ->assertExitCode(0);

        // 3. Assert the summary record is deleted
        $this->assertDatabaseMissing('ai_sentiment_summaries', [
            'sppg_id' => $this->sppgProfile->id,
            'summary_date' => $date,
        ]);
    }
}
