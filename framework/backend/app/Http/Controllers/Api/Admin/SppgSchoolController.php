<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SppgProfile;
use Illuminate\Http\Request;

class SppgSchoolController extends Controller
{
    // Assign (sync) daftar sekolah ke SPPG
    public function sync(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'school_ids'   => 'required|array',
            'school_ids.*' => 'integer|exists:schools,id',
        ]);

        $sppg->schools()->sync($request->school_ids);

        return response()->json($sppg->load('schools:id,name,district'));
    }

    // Tambah satu sekolah ke SPPG
    public function attach(Request $request, SppgProfile $sppg)
    {
        $request->validate([
            'school_id' => 'required|integer|exists:schools,id',
        ]);

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
