<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send a WhatsApp message to a phone number.
     *
     * @param  string      $phone  Phone number with country code (e.g. 6281234567890)
     * @param  string      $message  Text message to send
     * @return array       ['success' => bool, 'response' => mixed]
     */
    public function sendMessage(string $phone, string $message): array
    {
        // If WhatsApp is globally disabled, log and return early
        if (!config('services.whatsapp.enabled')) {
            Log::info('WhatsApp disabled – skipping send', [
                'phone'   => $phone,
                'message' => $message,
            ]);
            return ['success' => false, 'response' => 'WhatsApp disabled'];
        }

        $provider = config('services.whatsapp.provider', 'fonnte');

        return match ($provider) {
            'fonnte' => $this->sendViaFonnte($phone, $message),
            'twilio' => $this->sendViaTwilio($phone, $message),
            default  => $this->sendViaFonnte($phone, $message),
        };
    }

    /**
     * Send via Fonnte (Indonesian WhatsApp API).
     */
    protected function sendViaFonnte(string $phone, string $message): array
    {
        $token = config('services.whatsapp.fonnte_token');

        if (!$token) {
            Log::warning('Fonnte token not configured – skipping WhatsApp send', ['phone' => $phone]);
            return ['success' => false, 'response' => 'Missing Fonnte token'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post(config('services.whatsapp.fonnte_api_url'), [
                'target'      => $phone,
                'message'     => $message,
                'countryCode' => '62',
            ]);

            $body = $response->json();

            if ($response->successful() && ($body['status'] ?? false) === true) {
                Log::info('WhatsApp sent via Fonnte', ['phone' => $phone]);
                return ['success' => true, 'response' => $body];
            }

            Log::error('Fonnte WhatsApp send failed', [
                'phone'    => $phone,
                'status'   => $response->status(),
                'response' => $body,
            ]);
            return ['success' => false, 'response' => $body];
        } catch (\Throwable $e) {
            Log::error('Fonnte WhatsApp exception', [
                'phone'    => $phone,
                'error'    => $e->getMessage(),
            ]);
            return ['success' => false, 'response' => $e->getMessage()];
        }
    }

    /**
     * Send via Twilio WhatsApp API.
     */
    protected function sendViaTwilio(string $phone, string $message): array
    {
        $sid    = config('services.whatsapp.twilio_sid');
        $token  = config('services.whatsapp.twilio_token');
        $from   = config('services.whatsapp.twilio_from');

        if (!$sid || !$token || !$from) {
            Log::warning('Twilio credentials not configured – skipping WhatsApp send', ['phone' => $phone]);
            return ['success' => false, 'response' => 'Missing Twilio credentials'];
        }

        try {
            $response = Http::withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'From' => "whatsapp:{$from}",
                    'To'   => "whatsapp:+{$phone}",
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                Log::info('WhatsApp sent via Twilio', ['phone' => $phone]);
                return ['success' => true, 'response' => $response->json()];
            }

            Log::error('Twilio WhatsApp send failed', [
                'phone'    => $phone,
                'status'   => $response->status(),
                'response' => $response->json(),
            ]);
            return ['success' => false, 'response' => $response->json()];
        } catch (\Throwable $e) {
            Log::error('Twilio WhatsApp exception', [
                'phone'    => $phone,
                'error'    => $e->getMessage(),
            ]);
            return ['success' => false, 'response' => $e->getMessage()];
        }
    }
}
