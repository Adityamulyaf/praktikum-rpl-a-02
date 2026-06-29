<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * List all flagged reviews for moderation.
     * GET /api/admin/reviews
     */
    public function index(Request $request)
    {
        $reviews = Review::where('flag_status', 'flagged')
            ->with([
                'user:ssid,name',
                'school:id,name,district',
                'sppg:id,kitchen_name'
            ])
            ->orderBy('review_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reviews);
    }

    /**
     * Resolve a flagged review.
     * PUT /api/admin/reviews/{review}/resolve
     */
    public function resolve(Request $request, Review $review)
    {
        $request->validate([
            'action' => 'required|in:approve,dismiss',
        ]);

        $action = $request->input('action');

        if ($action === 'approve') {
            $review->update([
                'flag_status' => 'deleted',
            ]);
            $message = 'Ulasan berhasil dihapus.';
        } else {
            $review->update([
                'flag_status' => 'none',
                'flag_reason' => null,
            ]);
            $message = 'Laporan diabaikan, ulasan dipulihkan.';
        }

        return response()->json([
            'message' => $message,
            'review' => $review->load([
                'user:ssid,name',
                'school:id,name,district',
                'sppg:id,kitchen_name'
            ]),
        ]);
    }
}
