<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * GET /notifications – list notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $query = Notification::where('user_id', $request->user()->ssid);

        // Optional filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Optional filter by read status
        if ($request->filled('read')) {
            $query->where('read', filter_var($request->read, FILTER_VALIDATE_BOOLEAN));
        }

        $notifications = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    /**
     * GET /notifications/unread-count – get unread count.
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->ssid)
            ->where('read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * PUT /notifications/{notification}/read – mark a single notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->ssid) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $notification->markAsRead();

        return response()->json($notification);
    }

    /**
     * POST /notifications/mark-all-read – mark all notifications as read.
     */
    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->ssid)
            ->where('read', false)
            ->update([
                'read'    => true,
                'read_at' => now(),
            ]);

        return response()->json(['message' => 'Semua notifikasi telah ditandai sebagai dibaca.']);
    }
}
