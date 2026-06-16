<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        if ($request->has('role')) {
            session(['google_register_role' => $request->query('role')]);
        } else {
            session()->forget('google_register_role');
        }

        if ($request->has('nisn')) {
            session(['google_register_nisn' => $request->query('nisn')]);
        } else {
            session()->forget('google_register_nisn');
        }

        if ($request->has('school_id')) {
            session(['google_register_school_id' => $request->query('school_id')]);
        } else {
            session()->forget('google_register_school_id');
        }

        if ($request->has('nip')) {
            session(['google_register_nip' => $request->query('nip')]);
        } else {
            session()->forget('google_register_nip');
        }

        if ($request->has('name')) {
            session(['google_register_name' => $request->query('name')]);
        } else {
            session()->forget('google_register_name');
        }

        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('Otentikasi Google gagal.'));
        }

        // Search user by google_id
        $user = User::where('google_id', $googleUser->id)->first();

        if (!$user) {
            // Check if there is already a user with this email
            $user = User::where('email', $googleUser->email)->first();
            if ($user) {
                // Link account
                $user->google_id = $googleUser->id;
                $user->save();
            }
        }

        if ($user) {
            // Check if active
            if (!$user->is_active) {
                return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?error=' . urlencode('Akun anda tidak aktif.'));
            }

            // Create Sanctum Token
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect back to frontend with token and role
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/login?token=' . $token . '&role=' . $user->role);
        }

        // User does not exist, check if target register details were saved in session
        $role = session('google_register_role');
        $nisn = session('google_register_nisn');
        $schoolId = session('google_register_school_id');
        $nip = session('google_register_nip');
        $name = session('google_register_name') ?: $googleUser->name;

        session()->forget([
            'google_register_role',
            'google_register_nisn',
            'google_register_school_id',
            'google_register_nip',
            'google_register_name'
        ]);

        $redirectParams = [
            'google_register' => 1,
            'email' => $googleUser->email,
            'name' => $name,
            'google_id' => $googleUser->id,
        ];
        if ($role) $redirectParams['role'] = $role;
        if ($nisn) $redirectParams['nisn'] = $nisn;
        if ($schoolId) $redirectParams['school_id'] = $schoolId;
        if ($nip) $redirectParams['nip'] = $nip;

        return redirect(
            env('FRONTEND_URL', 'http://localhost:5173') . '/login?' . http_build_query($redirectParams)
        );
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => $password
                ])->save();

                $user->rememberToken = Str::random(60);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

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