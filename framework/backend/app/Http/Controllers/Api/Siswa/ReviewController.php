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
            'review_date' => 'sometimes|date',
        ]);

        $student = $request->user()->studentProfile;
        if (!$student) {
            return response()->json(['message' => 'Profil siswa tidak ditemukan'], 404);
        }

        // Resolve which SPPG kitchen serves this student's school
        $sppg = SppgProfile::whereHas('schools', function ($q) use ($student) {
            $q->where('schools.id', $student->school_id);
        })->first();

        $review = Review::create([
            'user_id'     => $request->user()->ssid,
            'school_id'   => $student->school_id,
            'sppg_id'     => $sppg?->id,
            'review_date' => $request->get('review_date', Carbon::today()->toDateString()),
            'content'     => $request->content,
            'flag_status' => 'none',
        ]);

        return response()->json($review->load('school:id,name,district'), 201);
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
