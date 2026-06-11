<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
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

        // Validate all schools are in the same kabupaten/kota as the SPPG
        $outOfDistrict = School::whereIn('id', $request->school_ids)
            ->where(function ($q) use ($sppg) {
                $q->where('district', 'not ilike', $sppg->district)
                  ->where('district', 'not ilike', 'Kab. ' . $sppg->district)
                  ->where('district', 'not ilike', 'Kota ' . $sppg->district)
                  ->where('district', 'not ilike', 'Kab. ' . $sppg->district . '%')
                  ->where('district', 'not ilike', 'Kota ' . $sppg->district . '%');
            })
            ->pluck('name');

        if ($outOfDistrict->isNotEmpty()) {
            return response()->json([
                'message' => "Sekolah berikut berada di luar wilayah SPPG ({$sppg->district}): {$outOfDistrict->implode(', ')}."
            ], 422);
        }

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

        // Validate school is in the same kabupaten/kota as the SPPG
        $school = School::find($request->school_id);
        if ($school) {
            $d = $sppg->district;
            $match = strcasecmp($school->district, $d) === 0
                || strcasecmp($school->district, 'Kab. ' . $d) === 0
                || strcasecmp($school->district, 'Kota ' . $d) === 0
                || stripos($school->district, 'Kab. ' . $d) === 0
                || stripos($school->district, 'Kota ' . $d) === 0;
            if (!$match) {
                return response()->json([
                    'message' => "Sekolah '{$school->name}' berada di luar wilayah SPPG ({$sppg->district})."
                ], 422);
            }
        }

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
