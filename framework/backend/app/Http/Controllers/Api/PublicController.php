<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function schools(Request $request)
    {
        $q = trim($request->get('q', ''));

        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $schools = School::select('id', 'name', 'district', 'province')
            ->with(['sppgProfiles:id,kitchen_name,address,district,province'])
            ->where(function ($query) use ($q) {
                $query->where('name', 'ilike', '%' . $q . '%')
                    ->orWhere('district', 'ilike', '%' . $q . '%')
                    ->orWhere('province', 'ilike', '%' . $q . '%');
            })
            ->orderBy('name')
            ->limit(20)
            ->get();

        return response()->json($schools);
    }

    public function verifyNisn(Request $request)
    {
        $request->validate([
            'nisn' => 'required|string|size:10',
        ]);

        $nisn = $request->get('nisn');

        $student = \App\Models\DapodikStudent::with('school')->where('nisn', $nisn)->first();

        if (!$student) {
            return response()->json([
                'message' => 'NISN tidak terdaftar dalam database penerima program MBG.'
            ], 404);
        }

        return response()->json([
            'nisn'        => $student->nisn,
            'name'        => $student->name,
            'school_id'   => $student->school_id,
            'school_name' => $student->school->name,
            'district'    => $student->school->district,
            'province'    => $student->school->province,
        ]);
    }
}
