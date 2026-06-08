<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected WhatsAppService $whatsapp;

    public function __construct(WhatsAppService $whatsapp)
    {
        $this->whatsapp = $whatsapp;
    }

    /**
     * Create an in-app notification and optionally send via WhatsApp.
     *
     * @param  string      $userId   Target user UUID (ssid)
     * @param  string      $type     Notification type key
     * @param  string      $title    Short title
     * @param  string      $body     Detail body text
     * @param  array|null  $data     Optional structured payload
     * @param  bool        $sendWhatsapp  Whether to also send via WhatsApp
     * @return Notification
     */
    public function notify(
        string $userId,
        string $type,
        string $title,
        string $body,
        ?array $data = null,
        bool $sendWhatsapp = true,
    ): Notification {
        $notification = Notification::create([
            'user_id' => $userId,
            'type'    => $type,
            'title'   => $title,
            'body'    => $body,
            'data'    => $data,
            'read'    => false,
        ]);

        if ($sendWhatsapp) {
            $this->sendWhatsAppNotification($notification);
        }

        return $notification;
    }

    /**
     * Notify multiple users at once.
     *
     * @param  array<string> $userIds
     */
    public function notifyMany(
        array $userIds,
        string $type,
        string $title,
        string $body,
        ?array $data = null,
        bool $sendWhatsapp = true,
    ): void {
        foreach ($userIds as $userId) {
            $this->notify($userId, $type, $title, $body, $data, $sendWhatsapp);
        }
    }

    /**
     * Notify all users of a given role.
     */
    public function notifyRole(
        string $role,
        string $type,
        string $title,
        string $body,
        ?array $data = null,
        bool $sendWhatsapp = true,
    ): void {
        $users = User::where('role', $role)->where('is_active', true)->get();

        foreach ($users as $user) {
            $this->notify($user->ssid, $type, $title, $body, $data, $sendWhatsapp);
        }
    }

    /**
     * Attempt to send a WhatsApp message for the given notification.
     */
    protected function sendWhatsAppNotification(Notification $notification): void
    {
        $user = $notification->user;

        if (!$user || !$user->phone_number) {
            Log::info('WhatsApp skipped – no phone number', [
                'notification_id' => $notification->id,
                'user_id'         => $notification->user_id,
            ]);

            $notification->update([
                'whatsapp_sent' => false,
            ]);
            return;
        }

        $result = $this->whatsapp->sendMessage(
            $user->phone_number,
            "*{$notification->title}*\n\n{$notification->body}"
        );

        $notification->update([
            'whatsapp_sent'    => $result['success'],
            'whatsapp_sent_at' => $result['success'] ? now() : null,
        ]);
    }
}
