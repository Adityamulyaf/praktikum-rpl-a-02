<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use Illuminate\Http\Request;
use App\Services\GeminiValidationService;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'siswa') {
            $profile = $user->studentProfile;
            $school = $profile ? $profile->school : null;
            $sppg = $school ? $school->sppgProfiles()->first() : null;
        } elseif ($user->role === 'guru') {
            $profile = $user->teacherProfile;
            $school = $profile ? $profile->school : null;
            $sppg = $school ? $school->sppgProfiles()->first() : null;
        } else {
            $sppg = $user->sppgProfile;
        }

        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $menus = DailyMenu::where('sppg_id', $sppg->id)
            ->orderBy('served_at', 'desc')
            ->paginate(20);

        return response()->json($menus);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'sppg'])) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $sppg = $user->sppgProfile;
        if ($user->role === 'admin') {
            $sppgId = $request->input('sppg_id');
            if (!$sppgId) {
                $firstSppg = \App\Models\SppgProfile::first();
                $sppgId = $firstSppg ? $firstSppg->id : null;
            }
        } else {
            if (!$sppg) {
                return response()->json(['message' => 'Profil tidak ditemukan'], 404);
            }
            $sppgId = $sppg->id;
        }

        $request->validate([
            'served_at'       => 'required|date',
            'menu_name'       => 'required|string|max:255',
            'components'      => 'nullable|string',
            'calories'        => 'nullable|integer|min:0',
            'protein'         => 'nullable|integer|min:0',
            'carbs'           => 'nullable|integer|min:0',
            'fat'             => 'nullable|integer|min:0',
            'photo'           => 'nullable|string',
            'is_ai_validated' => 'nullable|boolean',
            'ai_warning'      => 'nullable|string',
        ]);

        $exists = DailyMenu::where('sppg_id', $sppgId)
            ->where('served_at', $request->served_at)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Menu harian untuk tanggal ini sudah dibuat.'
            ], 422);
        }

        $menu = DailyMenu::create([
            'sppg_id'         => $sppgId,
            'served_at'       => $request->served_at,
            'menu_name'       => $request->menu_name,
            'components'      => $request->components,
            'calories'        => $request->calories,
            'protein'         => $request->protein,
            'carbs'           => $request->carbs,
            'fat'             => $request->fat,
            'photo'           => $request->photo,
            'is_ai_validated' => $request->boolean('is_ai_validated', false),
            'ai_warning'      => $request->ai_warning,
        ]);

        return response()->json($menu, 201);
    }

    public function update(Request $request, DailyMenu $menu)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            // Admin can edit any menu
        } elseif ($user->role === 'sppg') {
            $sppg = $user->sppgProfile;
            if (!$sppg || $menu->sppg_id !== $sppg->id) {
                return response()->json(['message' => 'Tidak diizinkan'], 403);
            }
        } else {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $request->validate([
            'served_at'       => 'sometimes|date',
            'menu_name'       => 'sometimes|string|max:255',
            'components'      => 'nullable|string',
            'calories'        => 'nullable|integer|min:0',
            'protein'         => 'nullable|integer|min:0',
            'carbs'           => 'nullable|integer|min:0',
            'fat'             => 'nullable|integer|min:0',
            'photo'           => 'nullable|string',
            'is_ai_validated' => 'nullable|boolean',
            'ai_warning'      => 'nullable|string',
        ]);

        if ($request->has('served_at')) {
            $exists = DailyMenu::where('sppg_id', $menu->sppg_id)
                ->where('served_at', $request->served_at)
                ->where('id', '!=', $menu->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Menu harian untuk tanggal ini sudah dibuat.'
                ], 422);
            }
        }

        $menu->update($request->only([
            'served_at', 'menu_name', 'components', 'calories', 'protein', 'carbs', 'fat',
            'photo', 'is_ai_validated', 'ai_warning'
        ]));

        return response()->json($menu);
    }

    public function destroy(Request $request, DailyMenu $menu)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            // Admin can delete any menu
        } elseif ($user->role === 'sppg') {
            $sppg = $user->sppgProfile;
            if (!$sppg || $menu->sppg_id !== $sppg->id) {
                return response()->json(['message' => 'Tidak diizinkan'], 403);
            }
        } else {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu dihapus']);
    }

    public function validateNutrition(Request $request, GeminiValidationService $service)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'sppg'])) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $request->validate([
            'menu_name'  => 'required|string|max:255',
            'components' => 'nullable|string',
            'calories'   => 'required|integer|min:0',
            'protein'    => 'required|integer|min:0',
            'carbs'      => 'required|integer|min:0',
            'fat'      => 'required|integer|min:0',
            'photo'      => 'nullable|string',
        ]);

        $result = $service->validateNutrition(
            $request->only(['menu_name', 'components', 'calories', 'protein', 'carbs', 'fat']),
            $request->input('photo')
        );

        return response()->json($result);
    }
}
