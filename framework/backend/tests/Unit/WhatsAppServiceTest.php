<?php

namespace Tests\Unit;

use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WhatsAppServiceTest extends TestCase
{
    /**
     * Test that sendMessage returns early with disabled response when WhatsApp service is disabled.
     */
    public function test_send_message_returns_early_when_whatsapp_service_is_disabled(): void
    {
        // Arrange
        Config::set('services.whatsapp.enabled', false);
        $service = new WhatsAppService();
        $phone = '6281234567890';
        $message = 'Hello world';

        // Act
        $result = $service->sendMessage($phone, $message);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertEquals('WhatsApp disabled', $result['response']);
    }

    /**
     * Test that sendMessage fails with missing token message when Fonnte is used without configuring a token.
     */
    public function test_send_message_via_fonnte_fails_when_fonnte_token_is_missing(): void
    {
        // Arrange
        Config::set('services.whatsapp.enabled', true);
        Config::set('services.whatsapp.provider', 'fonnte');
        Config::set('services.whatsapp.fonnte_token', null);
        $service = new WhatsAppService();
        $phone = '6281234567890';
        $message = 'Hello via Fonnte';

        // Act
        $result = $service->sendMessage($phone, $message);

        // Assert
        $this->assertFalse($result['success']);
        $this->assertEquals('Missing Fonnte token', $result['response']);
    }

    /**
     * Test that sendMessage succeeds when Fonnte API returns a successful status.
     */
    public function test_send_message_via_fonnte_succeeds_when_api_returns_success_status(): void
    {
        // Arrange
        Config::set('services.whatsapp.enabled', true);
        Config::set('services.whatsapp.provider', 'fonnte');
        Config::set('services.whatsapp.fonnte_token', 'dummy-token');
        Config::set('services.whatsapp.fonnte_api_url', 'https://api.fonnte.com/send');

        Http::fake([
            'https://api.fonnte.com/send' => Http::response([
                'status' => true,
                'detail' => 'message sent'
            ], 200)
        ]);

        $service = new WhatsAppService();
        $phone = '6281234567890';
        $message = 'Hello Fonnte';

        // Act
        $result = $service->sendMessage($phone, $message);

        // Assert
        $this->assertTrue($result['success']);
        $this->assertEquals(true, $result['response']['status']);
        $this->assertEquals('message sent', $result['response']['detail']);
    }
}
