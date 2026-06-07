<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SppgProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SppgSchoolController extends Controller
{
    // Assign (sync) daftar sekolah ke SPPG
    public function sync(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'school_ids'   => 'required|array',
            'school_ids.*' => 'integer|exists:schools,id',
        ]);

        // Check if any of these schools are already connected to another SPPG
        $alreadyConnected = DB::table('sppg_schools')
            ->join('schools', 'sppg_schools.school_id', '=', 'schools.id')
            ->join('sppg_profiles', 'sppg_schools.sppg_id', '=', 'sppg_profiles.id')
            ->whereIn('sppg_schools.school_id', $request->school_ids)
            ->where('sppg_schools.sppg_id', '!=', $sppg->id)
            ->select('schools.name as school_name', 'sppg_profiles.kitchen_name as sppg_name')
            ->get();

        if ($alreadyConnected->isNotEmpty()) {
            $details = $alreadyConnected->map(function ($item) {
                return "'{$item->school_name}' sudah terhubung ke SPPG '{$item->sppg_name}'";
            })->implode(', ');

            return response()->json([
                'message' => "Gagal menghubungkan sekolah: {$details}."
            ], 422);
        }

        $sppg->schools()->sync($request->school_ids);

        return response()->json($sppg->load('schools:id,name,district'));
    }

    // Tambah satu sekolah ke SPPG
    public function attach(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'school_id' => 'required|integer|exists:schools,id',
        ]);

        // Check if this school is already connected to another SPPG
        $alreadyConnected = DB::table('sppg_schools')
            ->join('schools', 'sppg_schools.school_id', '=', 'schools.id')
            ->join('sppg_profiles', 'sppg_schools.sppg_id', '=', 'sppg_profiles.id')
            ->where('sppg_schools.school_id', $request->school_id)
            ->where('sppg_schools.sppg_id', '!=', $sppg->id)
            ->select('schools.name as school_name', 'sppg_profiles.kitchen_name as sppg_name')
            ->first();

        if ($alreadyConnected) {
            return response()->json([
                'message' => "Sekolah '{$alreadyConnected->school_name}' sudah terhubung ke SPPG '{$alreadyConnected->sppg_name}'."
            ], 422);
        }

        $sppg->schools()->syncWithoutDetaching([$request->school_id]);

        return response()->json($sppg->load('schools:id,name,district'));
    }

    // Lepas satu sekolah dari SPPG
    public function detach(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'school_id' => 'required|integer|exists:schools,id',
        ]);

        $sppg->schools()->detach($request->school_id);

        return response()->json($sppg->load('schools:id,name,district'));
    }
}
