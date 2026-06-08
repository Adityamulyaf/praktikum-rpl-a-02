<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('recipient_id', $request->user()->ssid)
            ->where('channel', 'in_app')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    public function read(Request $request, $id)
    {
        $notification = Notification::where('recipient_id', $request->user()->ssid)
            ->findOrFail($id);

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Notifikasi ditandai sebagai dibaca',
            'notification' => $notification
        ]);
    }
}
