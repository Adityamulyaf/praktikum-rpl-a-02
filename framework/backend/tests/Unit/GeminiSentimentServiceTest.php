<?php

namespace Tests\Unit;

use App\Services\GeminiSentimentService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class GeminiSentimentServiceTest extends TestCase
{
    /**
     * Test sentiment analysis returns empty results immediately when reviews array is empty.
     */
    public function test_analyze_sentiment_returns_empty_results_when_no_reviews_provided(): void
    {
        // Arrange
        $service = new GeminiSentimentService();
        $reviews = [];

        // Act
        $result = $service->analyzeSentiment($reviews);

        // Assert
        $this->assertEquals(0, $result['positive_count']);
        $this->assertEquals(0, $result['neutral_count']);
        $this->assertEquals(0, $result['negative_count']);
        $this->assertEquals('Belum ada ulasan untuk tanggal ini.', $result['key_points']);
    }

    /**
     * Test fallback heuristic sentiment analysis when API key is missing.
     */
    public function test_analyze_sentiment_falls_back_to_heuristic_analysis_when_api_key_missing(): void
    {
        // Arrange
        Config::set('services.gemini.key', null);
        $service = new GeminiSentimentService();
        $reviews = [
            'Makanannya enak sekali dan mengenyangkan',
            'Porsinya terlalu sedikit dan dingin',
            'Hari ini menu makan siang adalah nasi goreng dengan telur'
        ];

        // Act
        $result = $service->analyzeSentiment($reviews);

        // Assert
        $this->assertEquals(1, $result['positive_count']);
        $this->assertEquals(1, $result['negative_count']);
        $this->assertEquals(1, $result['neutral_count']);
        $this->assertStringContainsString('Analisis alternatif (Mode Cadangan Non-AI)', $result['key_points']);
    }

    /**
     * Test fallback heuristic prioritizes negative classification for edge case review containing mixed sentiments.
     */
    public function test_fallback_heuristic_prioritizes_negative_classification_on_mixed_sentiment_review(): void
    {
        // Arrange
        Config::set('services.gemini.key', null);
        $service = new GeminiSentimentService();
        $reviews = [
            'Makanannya enak tapi porsinya sedikit'
        ];

        // Act
        $result = $service->analyzeSentiment($reviews);

        // Assert
        $this->assertEquals(0, $result['positive_count']);
        $this->assertEquals(1, $result['negative_count']);
        $this->assertEquals(0, $result['neutral_count']);
    }
}
