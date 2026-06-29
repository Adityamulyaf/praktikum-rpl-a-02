<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // GET /guru/reviews - list reviews for the SPPG kitchen that serves the teacher's school
    public function index(Request $request)
    {
        $teacher = $request->user()->teacherProfile;
        if (!$teacher) {
            return response()->json(['message' => 'Profil guru tidak ditemukan'], 404);
        }

        $sppg = \App\Models\SppgProfile::whereHas('schools', function ($q) use ($teacher) {
            $q->where('schools.id', $teacher->school_id);
        })->first();

        if (!$sppg) {
            return response()->json(['message' => 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun.'], 422);
        }

        $reviews = Review::where('sppg_id', $sppg->id)
            ->where('flag_status', '!=', 'deleted')
            ->with(['user:ssid,name', 'school:id,name,district'])
            ->orderBy('review_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reviews);
    }

    // POST /guru/reviews/{review}/flag - flag/unflag a review
    public function flag(Request $request, Review $review)
    {
        $teacher = $request->user()->teacherProfile;
        if (!$teacher) {
            return response()->json(['message' => 'Profil guru tidak ditemukan'], 404);
        }

        $sppg = \App\Models\SppgProfile::whereHas('schools', function ($q) use ($teacher) {
            $q->where('schools.id', $teacher->school_id);
        })->first();

        if (!$sppg || $review->sppg_id !== $sppg->id) {
            return response()->json(['message' => 'Ulasan tidak berada dalam wewenang SPPG sekolah Anda.'], 403);
        }

        $request->validate([
            'flag_status' => 'sometimes|in:none,flagged',
            'flag_reason' => 'nullable|string|max:500',
        ]);

        $status = $request->get('flag_status', 'flagged');
        $reason = $request->get('flag_reason');

        $review->update([
            'flag_status' => $status,
            'flag_reason' => $status === 'flagged' ? $reason : null,
        ]);

        // BL-11: Notify Siswa when their review is moderated
        if ($status === 'flagged') {
            try {
                $notificationService = app(NotificationService::class);
                $notificationService->notify(
                    $review->user_id,
                    'review_moderated',
                    'Ulasan Anda Dimoderasi',
                    "Ulasan Anda pada tanggal {$review->review_date->format('Y-m-d')} telah ditandai oleh guru. Alasan: " . ($reason ?? 'Tidak disebutkan'),
                    [
                        'review_id'   => $review->id,
                        'flag_status' => $status,
                        'flag_reason' => $reason,
                    ]
                );
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send moderation notification to siswa', [
                    'error' => $e->getMessage(),
                ]);
            }

            try {
                $review->load('school');
                $notificationService = app(NotificationService::class);
                $notificationService->notifyRole(
                    'admin',
                    'review_flagged',
                    'Ulasan Ditandai oleh Guru',
                    "Ulasan siswa dari {$review->school->name} ditandai oleh guru {$request->user()->name}. Alasan: " . ($reason ?? 'Tidak disebutkan'),
                    [
                        'review_id'   => $review->id,
                        'flag_status' => $status,
                        'flag_reason' => $reason,
                    ]
                );
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send flagged review notification to admin', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'message' => $status === 'flagged' ? 'Ulasan berhasil ditandai.' : 'Tanda ulasan berhasil dihapus.',
            'review' => $review->load(['user:ssid,name', 'school:id,name,district']),
        ]);
    }
}
