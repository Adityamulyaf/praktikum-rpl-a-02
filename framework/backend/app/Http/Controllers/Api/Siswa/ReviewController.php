<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\SppgProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReviewController extends Controller
{
    // GET /siswa/reviews — list own reviews paginated
    public function index(Request $request)
    {
        $reviews = Review::where('user_id', $request->user()->ssid)
            ->where('flag_status', '!=', 'deleted')
            ->with('school:id,name,district')
            ->orderBy('review_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reviews);
    }

    // POST /siswa/reviews
    public function store(Request $request)
    {
        $request->validate([
            'content'     => 'required|string|min:10|max:2000',
            'review_date' => 'sometimes|date|before_or_equal:today',
            'photo'       => 'nullable|string',
        ]);

        $student = $request->user()->studentProfile;
        if (!$student) {
            return response()->json(['message' => 'Profil siswa tidak ditemukan'], 404);
        }

        // Resolve which SPPG kitchen serves this student's school
        $sppg = SppgProfile::whereHas('schools', function ($q) use ($student) {
            $q->where('schools.id', $student->school_id);
        })->first();

        if (!$sppg) {
            return response()->json([
                'message' => 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun, sehingga Anda belum dapat mengirimkan ulasan.'
            ], 422);
        }

        $reviewDate = Carbon::parse($request->get('review_date', Carbon::today()->toDateString()))->toDateString();

        // Prevent duplicate reviews for the same date (excluding soft-deleted reviews)
        $exists = Review::where('user_id', $request->user()->ssid)
            ->where('review_date', $reviewDate)
            ->where('flag_status', '!=', 'deleted')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Anda sudah mengirimkan ulasan untuk tanggal ini.'
            ], 422);
        }

        $review = Review::create([
            'user_id'     => $request->user()->ssid,
            'school_id'   => $student->school_id,
            'sppg_id'     => $sppg?->id,
            'review_date' => $reviewDate,
            'content'     => $request->content,
            'photo'       => $request->photo,
            'flag_status' => 'none',
        ]);

        $keywords = ['basi', 'bau', 'busuk', 'tidak layak', 'kotor'];
        $contentLower = strtolower($review->content);
        $isCritical = false;
        foreach ($keywords as $kw) {
            if (str_contains($contentLower, $kw)) {
                $isCritical = true;
                break;
            }
        }

        if ($isCritical) {
            $review->update(['is_critical' => true]);

            $followup = \App\Models\CriticalReviewFollowup::create([
                'review_id' => $review->id,
                'sppg_id' => $review->sppg_id,
                'followup_status' => 'belum_diproses',
                'handling_note' => null,
            ]);

            $sppgProfile = $review->sppg;
            if ($sppgProfile && $sppgProfile->user_id) {
                // 1. In App notification
                \App\Models\Notification::create([
                    'recipient_id' => $sppgProfile->user_id,
                    'type' => 'review_critical',
                    'related_id' => $review->id,
                    'message' => 'Ulasan kritis terdeteksi dari siswa untuk tanggal ' . $review->review_date,
                    'channel' => 'in_app',
                ]);

                // 2. WhatsApp notification
                $waMessage = sprintf(
                    "[HaloMBG] Peringatan: Ulasan kritis diterima untuk dapur Anda pada tanggal %s.\nUlasan: \"%s\"\nSegera lakukan tindak lanjut di dashboard.",
                    $review->review_date,
                    $review->content
                );

                $waNotification = \App\Models\Notification::create([
                    'recipient_id' => $sppgProfile->user_id,
                    'type' => 'review_critical',
                    'related_id' => $review->id,
                    'message' => $waMessage,
                    'channel' => 'whatsapp',
                ]);

                $phone = $sppgProfile->contact_phone ?: ($sppgProfile->user ? $sppgProfile->user->phone_number : null);
                if ($phone) {
                    $waNotification->update(['sent_at' => now()]);
                    \App\Models\NotificationLog::create([
                        'notification_id' => $waNotification->id,
                        'status' => 'sent',
                        'attempted_at' => now(),
                    ]);
                } else {
                    \App\Models\NotificationLog::create([
                        'notification_id' => $waNotification->id,
                        'status' => 'failed',
                        'failure_reason' => 'Nomor WhatsApp penerima tidak tersedia',
                        'attempted_at' => now(),
                    ]);
                }
            }
        }

        return response()->json($review->load('school:id,name,district'), 201);
    }

    // GET /siswa/sppg-info — check if school is served by an SPPG
    public function sppgInfo(Request $request)
    {
        $student = $request->user()->studentProfile;
        if (!$student) {
            return response()->json(['message' => 'Profil siswa tidak ditemukan'], 404);
        }

        $sppg = SppgProfile::whereHas('schools', function ($q) use ($student) {
            $q->where('schools.id', $student->school_id);
        })->first();

        if (!$sppg) {
            return response()->json([
                'served' => false,
                'message' => 'Sekolah Anda belum terhubung dengan dapur SPPG mana pun.'
            ]);
        }

        return response()->json([
            'served' => true,
            'id' => $sppg->id,
            'kitchen_name' => $sppg->kitchen_name,
            'address' => $sppg->address,
            'contact_person' => $sppg->contact_person_name,
        ]);
    }

    // DELETE /siswa/reviews/{review} — soft delete own review
    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->ssid) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $review->update(['flag_status' => 'deleted']);

        return response()->json(['message' => 'Ulasan dihapus']);
    }
}
