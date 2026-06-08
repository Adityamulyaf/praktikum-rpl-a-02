<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'type', 'title', 'body', 'data', 'whatsapp_sent', 'whatsapp_sent_at', 'read', 'read_at'])]
class Notification extends Model
{
    protected $casts = [
        'data'             => 'array',
        'whatsapp_sent'    => 'boolean',
        'whatsapp_sent_at' => 'datetime',
        'read'             => 'boolean',
        'read_at'          => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'ssid');
    }

    /** Mark a notification as read */
    public function markAsRead(): void
    {
        if (!$this->read) {
            $this->update(['read' => true, 'read_at' => now()]);
        }
    }

    /** Scope: unread only */
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    /** Scope: by type */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
