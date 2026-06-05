<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class PublicReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::where('flag_status', 'none')
            ->with(['user:ssid,name', 'school:id,name,district'])
            ->orderBy('review_date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->filled('sppg_id')) {
            $query->where('sppg_id', $request->sppg_id);
        }

        return response()->json($query->paginate(20));
    }
}
