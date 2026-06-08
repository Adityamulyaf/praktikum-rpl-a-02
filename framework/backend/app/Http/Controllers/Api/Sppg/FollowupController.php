<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use App\Models\CriticalReviewFollowup;
use Illuminate\Http\Request;

class FollowupController extends Controller
{
    public function index(Request $request)
    {
        $sppg = $request->user()->sppgProfile;
        if (!$sppg) {
            return response()->json(['message' => 'Profil dapur SPPG tidak ditemukan.'], 404);
        }

        $status = $request->query('status');

        $followups = CriticalReviewFollowup::where('sppg_id', $sppg->id)
            ->with([
                'review.user:ssid,name',
                'review.school:id,name,district',
                'histories.changer:ssid,name'
            ])
            ->when($status, function ($query, $status) {
                return $query->where('followup_status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($followups);
    }

    public function show(Request $request, $id)
    {
        $sppg = $request->user()->sppgProfile;
        if (!$sppg) {
            return response()->json(['message' => 'Profil dapur SPPG tidak ditemukan.'], 404);
        }

        $followup = CriticalReviewFollowup::where('sppg_id', $sppg->id)
            ->with([
                'review.user:ssid,name',
                'review.school:id,name,district',
                'histories.changer:ssid,name'
            ])
            ->findOrFail($id);

        return response()->json($followup);
    }

    public function update(Request $request, $id)
    {
        $sppg = $request->user()->sppgProfile;
        if (!$sppg) {
            return response()->json(['message' => 'Profil dapur SPPG tidak ditemukan.'], 404);
        }

        $followup = CriticalReviewFollowup::where('sppg_id', $sppg->id)->findOrFail($id);

        $request->validate([
            'followup_status' => 'required|in:belum_diproses,dalam_proses,selesai',
            'handling_note'   => 'nullable|string|max:5000',
        ]);

        $previousStatus = $followup->followup_status;
        $newStatus = $request->followup_status;

        $followup->update([
            'followup_status' => $newStatus,
            'handling_note'   => $request->handling_note,
            'updated_by'      => $request->user()->ssid,
        ]);

        if ($previousStatus !== $newStatus) {
            \App\Models\FollowupHistory::create([
                'followup_id'     => $followup->id,
                'previous_status' => $previousStatus,
                'new_status'      => $newStatus,
                'note'            => $request->handling_note,
                'changed_by'      => $request->user()->ssid,
                'changed_at'      => now(),
            ]);
        }

        return response()->json($followup->load([
            'review.user:ssid,name',
            'review.school:id,name,district',
            'histories.changer:ssid,name'
        ]));
    }
}
