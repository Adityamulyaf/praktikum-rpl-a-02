<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun anda tidak aktif'
            ], 403);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        if ($user->role === 'siswa') {
            $user->load('studentProfile.school.sppgProfiles');
        } elseif ($user->role === 'guru') {
            $user->load('teacherProfile.school.sppgProfiles');
        } elseif ($user->role === 'sppg') {
            $user->load('sppgProfile');
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,  
            'user'         => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'siswa') {
            $user->load('studentProfile.school.sppgProfiles');
        } elseif ($user->role === 'guru') {
            $user->load('teacherProfile.school.sppgProfiles');
        } elseif ($user->role === 'sppg') {
            $user->load('sppgProfile');
        }
        return response()->json($user);
    }
}