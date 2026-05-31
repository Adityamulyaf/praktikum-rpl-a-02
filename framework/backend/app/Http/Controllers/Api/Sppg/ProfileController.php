<?php

namespace App\Http\Controllers\Api\Sppg;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $sppg = $request->user()
                    ->sppgProfile()
                    ->with('schools')
                    ->first();

        if (!$sppg) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        return response()->json([
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
}