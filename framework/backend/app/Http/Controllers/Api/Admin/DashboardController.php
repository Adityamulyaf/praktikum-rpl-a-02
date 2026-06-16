<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SppgProfile;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\Review;
use App\Models\DistributionStatus;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $today = now('Asia/Jakarta')->toDateString();

        $totalSppg = SppgProfile::count();
        $totalSchools = School::count();
        $totalSiswa = StudentProfile::count();
        $totalGuru = TeacherProfile::count();
        $totalReviews = Review::count();
        
        $distributionToday = DistributionStatus::where('distributed_at', $today)->count();
        
        $distStatusCounts = DistributionStatus::where('distributed_at', $today)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return response()->json([
            'totals' => [
                'sppg' => $totalSppg,
                'schools' => $totalSchools,
                'siswa' => $totalSiswa,
                'guru' => $totalGuru,
                'reviews' => $totalReviews,
            ],
            'distribution_today' => [
                'total' => $distributionToday,
                'details' => [
                    'belum_diantar' => $distStatusCounts['belum_diantar'] ?? 0,
                    'siap_diantar' => $distStatusCounts['siap_diantar'] ?? 0,
                    'sudah_diantar' => $distStatusCounts['sudah_diantar'] ?? 0,
                    'batal' => $distStatusCounts['batal'] ?? 0,
                ]
            ]
        ]);
    }
}
