<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentProfile;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function registerSiswa(Request $request)
    {
        $request->validate([
            'email'     => 'required|email|unique:users,email',
            'password'  => ['required', 'confirmed', Password::min(8)],
            'school_id' => 'required|exists:schools,id',
            'nisn'      => 'required|string|size:10',
        ]);

        // Verify NISN against Dapodik reference database
        $dapodikStudent = \App\Models\DapodikStudent::where('nisn', $request->nisn)->first();
        if (!$dapodikStudent) {
            return response()->json([
                'message' => 'NISN tidak terdaftar dalam database penerima program MBG.'
            ], 422);
        }

        if ($dapodikStudent->school_id != $request->school_id) {
            return response()->json([
                'message' => 'Asal sekolah tidak cocok dengan data terdaftar NISN.'
            ], 422);
        }

        // Check if already registered
        if (StudentProfile::where('nisn', $request->nisn)->exists()) {
            return response()->json([
                'message' => 'NISN ini sudah terdaftar. Silakan hubungi pihak sekolah jika terjadi kesalahan.'
            ], 422);
        }

        $user = DB::transaction(function () use ($request, $dapodikStudent) {
            $user = User::create([
                'name'      => $dapodikStudent->name, // Use official name
                'email'     => $request->email,
                'password'  => $request->password,
                'role'      => 'siswa',
                'is_active' => true,
            ]);

            StudentProfile::create([
                'user_id'   => $user->ssid,
                'school_id' => $dapodikStudent->school_id,
                'nisn'      => $dapodikStudent->nisn,
            ]);

            return $user;
        });

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user,
        ], 201);
    }

    public function registerGuru(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => ['required', 'confirmed', Password::min(8)],
            'school_id' => 'required|exists:schools,id',
            'nip'       => 'nullable|string|max:30',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password,
                'role'      => 'guru',
                'is_active' => true,
            ]);

            TeacherProfile::create([
                'user_id'   => $user->ssid,
                'school_id' => $request->school_id,
                'nip'       => $request->nip,
            ]);

            return $user;
        });

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => $user,
        ], 201);
    }
}
