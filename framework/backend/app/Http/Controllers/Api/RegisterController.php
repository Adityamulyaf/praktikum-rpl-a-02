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
        $isGoogle = $request->has('google_id') && !empty($request->google_id);

        $rules = [
            'email'     => 'required|email|unique:users,email',
            'school_id' => 'required|exists:schools,id',
            'nisn'      => 'required|string|size:10',
            'google_id' => 'nullable|string',
        ];

        if ($isGoogle) {
            $rules['password'] = ['nullable', 'confirmed', Password::min(8)];
        } else {
            $rules['password'] = ['required', 'confirmed', Password::min(8)];
        }

        $request->validate($rules);

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
                'google_id' => $request->google_id,
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
        $isGoogle = $request->has('google_id') && !empty($request->google_id);

        $rules = [
            'email'     => 'required|email|unique:users,email',
            'school_id' => 'required|exists:schools,id',
            'nip'       => 'required|string|size:18',
            'google_id' => 'nullable|string',
        ];

        if ($isGoogle) {
            $rules['password'] = ['nullable', 'confirmed', Password::min(8)];
        } else {
            $rules['password'] = ['required', 'confirmed', Password::min(8)];
        }

        $request->validate($rules);

        // Verify NIP against Dapodik reference database
        $dapodikTeacher = \App\Models\DapodikTeacher::where('nip', $request->nip)->first();
        if (!$dapodikTeacher) {
            return response()->json([
                'message' => 'NIP tidak terdaftar dalam database guru.'
            ], 422);
        }

        if ($dapodikTeacher->school_id != $request->school_id) {
            return response()->json([
                'message' => 'Asal sekolah tidak cocok dengan data terdaftar NIP.'
            ], 422);
        }

        // Check if already registered
        if (TeacherProfile::where('nip', $request->nip)->exists()) {
            return response()->json([
                'message' => 'NIP ini sudah terdaftar. Silakan hubungi admin sekolah jika terjadi kesalahan.'
            ], 422);
        }

        $user = DB::transaction(function () use ($request, $dapodikTeacher) {
            $user = User::create([
                'name'      => $dapodikTeacher->name, // Use official name
                'email'     => $request->email,
                'password'  => $request->password,
                'role'      => 'guru',
                'is_active' => true,
                'google_id' => $request->google_id,
            ]);

            TeacherProfile::create([
                'user_id'   => $user->ssid,
                'school_id' => $dapodikTeacher->school_id,
                'nip'       => $dapodikTeacher->nip,
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
