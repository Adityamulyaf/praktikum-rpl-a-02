<?php

namespace App\Console\Commands;

use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class SendTestWhatsApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'whatsapp:test {phone : Target phone number with country code, e.g. 628123456789} {message : Message content}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test WhatsApp message using the configured WhatsApp service';

    /**
     * Execute the console command.
     */
    public function handle(WhatsAppService $whatsapp): int
    {
        $phone = $this->argument('phone');
        $message = $this->argument('message');

        $this->info("Configuration Status:");
        $this->line(" - Provider: " . config('services.whatsapp.provider'));
        $this->line(" - Enabled:  " . (config('services.whatsapp.enabled') ? 'Yes' : 'No'));
        $this->line(" - Token:    " . (config('services.whatsapp.fonnte_token') ? '[CONFIGURED]' : '[NOT SET]'));

        if (!config('services.whatsapp.enabled')) {
            $this->warn("\nWarning: WhatsApp is currently disabled. In order to test, temporarilly enable it in your .env (WHATSAPP_ENABLED=true).");
            return self::FAILURE;
        }

        $this->info("\nSending message to {$phone}...");

        $result = $whatsapp->sendMessage($phone, $message);

        if ($result['success']) {
            $this->info("Success! Message sent successfully.");
            $this->line(json_encode($result['response'], JSON_PRETTY_PRINT));
            return self::SUCCESS;
        } else {
            $this->error("Failed to send message.");
            $this->line("Response/Error: " . json_encode($result['response'], JSON_PRETTY_PRINT));
            return self::FAILURE;
        }
    }
}
