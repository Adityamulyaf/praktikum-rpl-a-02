<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $sppg = $request->user()->sppgProfile;
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
        $sppg = $request->user()->sppgProfile;
        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
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

        $menu = DailyMenu::create([
            'sppg_id'         => $sppg->id,
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
        $sppg = $request->user()->sppgProfile;
        if (!$sppg || $menu->sppg_id !== $sppg->id) {
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

        $menu->update($request->only([
            'served_at', 'menu_name', 'components', 'calories', 'protein', 'carbs', 'fat',
            'photo', 'is_ai_validated', 'ai_warning'
        ]));

        return response()->json($menu);
    }

    public function destroy(Request $request, DailyMenu $menu)
    {
        $sppg = $request->user()->sppgProfile;
        if (!$sppg || $menu->sppg_id !== $sppg->id) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu dihapus']);
    }
}
