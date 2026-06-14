<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use App\Models\DistributionStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DistributionController extends Controller
{
    /**
     * Get distribution list for a given date (default today).
     * Auto-seeds missing records for all schools assigned to this SPPG.
     */
    public function index(Request $request)
    {
        $sppg = $request->user()->sppg();

        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $date = $request->get('date', Carbon::today()->toDateString());

        // Seed missing records for all assigned schools
        $schoolIds = $sppg->schools()->pluck('schools.id');
        foreach ($schoolIds as $schoolId) {
            DistributionStatus::firstOrCreate(
                ['sppg_id' => $sppg->id, 'school_id' => $schoolId, 'distributed_at' => $date],
                ['status' => 'belum_diantar']
            );
        }

        $records = DistributionStatus::where('sppg_id', $sppg->id)
            ->where('distributed_at', $date)
            ->with('school:id,name,district')
            ->get();

        return response()->json($records);
    }

    /**
     * Update status for a specific record.
     */
    public function update(Request $request, DistributionStatus $distribution)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            // Admin can edit any distribution
        } elseif ($user->role === 'sppg') {
            $sppg = $user->sppgProfile;
            if (!$sppg || $distribution->sppg_id !== $sppg->id) {
                return response()->json(['message' => 'Tidak diizinkan'], 403);
            }
        } else {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $request->validate([
            'status' => 'required|in:belum_diantar,siap_diantar,sudah_diantar,batal',
            'photo'  => 'nullable|string',
        ]);

        $updateData = [
            'status'            => $request->status,
            'status_updated_at' => now(),
        ];

        if ($request->has('photo')) {
            $updateData['photo'] = $request->photo;
        }

        $distribution->update($updateData);

        return response()->json($distribution->load('school:id,name,district'));
    }
}
