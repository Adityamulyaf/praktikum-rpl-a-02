<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $params = [];
        if ($request->has('role')) $params['role'] = $request->query('role');
        if ($request->has('nisn')) $params['nisn'] = $request->query('nisn');
        if ($request->has('school_id')) $params['school_id'] = $request->query('school_id');
        if ($request->has('nip')) $params['nip'] = $request->query('nip');
        if ($request->has('name')) $params['name'] = $request->query('name');

        $state = Crypt::encryptString(json_encode($params));

        return Socialite::driver('google')
            ->stateless()
            ->with(['state' => $state])
            ->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
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

        // User does not exist, decrypt target register details from state parameter
        $role = null;
        $nisn = null;
        $schoolId = null;
        $nip = null;
        $name = $googleUser->name;

        $stateString = $request->query('state');
        if ($stateString) {
            try {
                $params = json_decode(Crypt::decryptString($stateString), true);
                $role = $params['role'] ?? null;
                $nisn = $params['nisn'] ?? null;
                $schoolId = $params['school_id'] ?? null;
                $nip = $params['nip'] ?? null;
                $name = $params['name'] ?? $googleUser->name;
            } catch (\Exception $e) {
                // Ignore decryption errors or fallback
            }
        }

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