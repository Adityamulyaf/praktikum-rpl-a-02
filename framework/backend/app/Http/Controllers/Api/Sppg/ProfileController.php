<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'siswa') {
            $profile = $user->studentProfile;
            $school = $profile ? $profile->school : null;
            $sppg = $school ? $school->sppgProfiles()->with([
                'schools',
                'dailyMenus' => function ($q) {
                    $q->orderBy('served_at', 'desc');
                },
                'sentimentSummaries' => function ($q) {
                    $q->orderBy('summary_date', 'desc');
                }
            ])->first() : null;
        } elseif ($user->role === 'guru') {
            $profile = $user->teacherProfile;
            $school = $profile ? $profile->school : null;
            $sppg = $school ? $school->sppgProfiles()->with([
                'schools',
                'dailyMenus' => function ($q) {
                    $q->orderBy('served_at', 'desc');
                },
                'sentimentSummaries' => function ($q) {
                    $q->orderBy('summary_date', 'desc');
                }
            ])->first() : null;
        } else {
            if ($user->role === 'admin' && $request->has('sppg_id')) {
                $sppg = \App\Models\SppgProfile::with([
                    'schools',
                    'dailyMenus' => function ($q) {
                        $q->orderBy('served_at', 'desc');
                    },
                    'sentimentSummaries' => function ($q) {
                        $q->orderBy('summary_date', 'desc');
                    }
                ])->find($request->sppg_id);
            } else {
                $sppg = $user->sppgProfile()->with([
                    'schools',
                    'dailyMenus' => function ($q) {
                        $q->orderBy('served_at', 'desc');
                    },
                    'sentimentSummaries' => function ($q) {
                        $q->orderBy('summary_date', 'desc');
                    }
                ])->first();
            }
        }

        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        return response()->json([
            'id'                  => $sppg->id,
            'kitchen_name'        => $sppg->kitchen_name,
            'is_active'           => $sppg->is_active,
            'address'             => $sppg->address,
            'district'            => $sppg->district,
            'province'            => $sppg->province,
            'contact_person_name' => $sppg->contact_person_name,
            'contact_phone'       => $sppg->contact_phone,
            'contact_email'       => $sppg->contact_email,
            'production_capacity' => $sppg->production_capacity,
            'description'         => $sppg->description,
            'schools'             => $sppg->schools,
            'daily_menus'         => $sppg->dailyMenus,
            'sentiment_summaries' => $sppg->sentimentSummaries,
        ]);
    }

    public function update(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'sppg'])) {
            return response()->json(['message' => 'Tidak diizinkan'], 403);
        }

        if ($request->user()->role === 'admin' && $request->has('sppg_id')) {
            $sppg = \App\Models\SppgProfile::find($request->sppg_id);
        } else {
            $sppg = $request->user()->sppgProfile;
        }

        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $request->validate([
            'kitchen_name'        => 'sometimes|string|max:255',
            'address'             => 'sometimes|string',
            'district'            => 'sometimes|string|max:100',
            'province'            => 'sometimes|string|max:100',
            'contact_person_name' => 'sometimes|string|max:255',
            'contact_phone'       => 'sometimes|string|max:20',
            'contact_email'       => 'nullable|email|max:255',
            'description'         => 'nullable|string',
            'production_capacity' => 'nullable|integer|min:1',
        ]);

        $sppg->update($request->only([
            'kitchen_name', 'address', 'district', 'province',
            'contact_person_name', 'contact_phone', 'contact_email',
            'description', 'production_capacity',
        ]));

        return response()->json([
            'id'                  => $sppg->id,
            'kitchen_name'        => $sppg->kitchen_name,
            'is_active'           => $sppg->is_active,
            'address'             => $sppg->address,
            'district'            => $sppg->district,
            'province'            => $sppg->province,
            'contact_person_name' => $sppg->contact_person_name,
            'contact_phone'       => $sppg->contact_phone,
            'contact_email'       => $sppg->contact_email,
            'production_capacity' => $sppg->production_capacity,
            'description'         => $sppg->description,
            'schools'             => $sppg->schools,
        ]);
    }

    public function reviews(Request $request)
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

        $reviews = $sppg->reviews()
            ->where('flag_status', '!=', 'deleted')
            ->with(['user:ssid,name', 'school:id,name,district'])
            ->orderBy('review_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reviews);
    }
}
